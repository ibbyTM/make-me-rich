/**
 * CLI for the source onboarding pipeline.
 *
 *   npm run onboard -- classify <url> [--via manual] [--dry-run]
 *   npm run onboard -- import <file>  [--dry-run]   # newline/CSV list of URLs
 *   npm run onboard -- drain          [--dry-run]
 *
 * --dry-run uses the in-memory repositories (no Supabase needed) and prints the
 * decision, which is handy for shakeout (spec §7 Day B: "review every result
 * manually").
 */

import { readFile } from 'node:fs/promises';
import { config } from './config.js';
import { MemoryRepositories } from './db/memory.js';
import { createSupabaseRepositories } from './db/supabase.js';
import type { Repositories } from './db/ports.js';
import { onboardUrl } from './pipeline/onboard.js';
import { bulkEnqueue, drainQueue } from './discovery/discovery.js';
import type { DiscoveredVia } from './types.js';

function getFlag(args: string[], name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : undefined;
}
function hasFlag(args: string[], name: string): boolean {
  return args.includes(`--${name}`);
}

function makeRepos(dryRun: boolean): Repositories {
  if (dryRun) return new MemoryRepositories();
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (or pass --dry-run).',
    );
  }
  return createSupabaseRepositories(config.supabaseUrl, config.supabaseServiceRoleKey);
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  if (!command || !['classify', 'import', 'drain'].includes(command)) {
    console.log(
      'Commands:\n' +
        '  classify <url> [--via manual|excel_import|search_discovery|portal_integration] [--dry-run]\n' +
        '  import <file> [--dry-run]\n' +
        '  drain [--dry-run]',
    );
    return;
  }

  const dryRun = hasFlag(args, 'dry-run');
  const repos = makeRepos(dryRun);
  const deps = { repos, approvalThreshold: config.approvalThreshold };

  switch (command) {
    case 'classify': {
      const url = args[0];
      if (!url || url.startsWith('--')) throw new Error('usage: classify <url>');
      const via = (getFlag(args, 'via') ?? 'manual') as DiscoveredVia;
      const out = await onboardUrl(url, via, deps);
      print(out.classification, out.status);
      break;
    }
    case 'import': {
      const file = args[0];
      if (!file || file.startsWith('--')) throw new Error('usage: import <file>');
      const urls = (await readFile(file, 'utf8'))
        .split(/\r?\n/)
        .map((l) => l.split(',')[0]?.trim() ?? '')
        .filter((l) => l && !l.startsWith('#'));
      const queued = await bulkEnqueue(repos, urls);
      console.log(`Enqueued ${queued.length} URL(s). Draining...`);
      const drain = await drainQueue(deps);
      console.log(JSON.stringify(drain, null, 2));
      break;
    }
    case 'drain': {
      const drain = await drainQueue(deps);
      console.log(JSON.stringify(drain, null, 2));
      break;
    }
    default:
      console.log(
        'Commands:\n' +
          '  classify <url> [--via manual|excel_import|search_discovery|portal_integration] [--dry-run]\n' +
          '  import <file> [--dry-run]\n' +
          '  drain [--dry-run]',
      );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function print(result: any, status: string): void {
  console.log(
    JSON.stringify(
      {
        url: result.url,
        classification: result.classification,
        confidence: result.confidence,
        scraperStrategy: result.scraperStrategy,
        tosFlag: result.tosFlag,
        decision: result.decision,
        status,
        detectedStructure: result.detectedStructure,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
