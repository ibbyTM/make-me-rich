/**
 * Zero-dependency server for the read-only dashboard.
 *
 *   npm run dashboard          # serves http://localhost:4173
 *   PORT=5000 npm run dashboard
 *
 * Serves static files from dashboard/ and provides local-only endpoints:
 *
 *   GET  /requirements   → list the Requirements Register (seed + custom)
 *   POST /requirements   {"name","geographies","keywords","minSize","budgetMin","budgetMax"}
 *                        → inserts a new row (dashboard "New search" panel).
 *                          geographies/keywords may be an array or a comma
 *                          string. Every report script reads this same table,
 *                          so the new requirement is scored on their next run —
 *                          no code change.
 *   POST /run             {"sources":["barnsdales","rightmove","discovered"]}
 *                        → runs the matching report scripts.
 *   POST /discover        {"requirementId":"..."}
 *                        → runs scripts/requirement-discovery.ts for that
 *                          requirement (search provider → classify → log,
 *                          same review-gate safety as every other discovery
 *                          path: nothing is auto-activated).
 *   GET  /run/status      → {"running":bool,"jobs":[...]} — covers BOTH /run
 *                          and /discover jobs (one shared queue, one poller).
 *
 * /run and /discover share one job queue so at most one child process ever
 * touches the persistent store at a time (PGlite is single-writer). 409 if a
 * job is already running. Only allowlisted report scripts run from /run —
 * nothing from the request body is executed as code. No auth (local use only).
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { spawn } from 'node:child_process';
import { createPersistentHarness } from '../src/db/pglite.js';
import { ensureSeeded, insertRequirement, listRequirements, splitCsv } from '../src/db/requirementsRepo.js';

const ROOT = join(process.cwd(), 'dashboard');
const PORT = Number(process.env.PORT ?? 4173);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

/** Allowlist: source key → report script + display label (used by /run). */
const RUNNABLE: Record<string, { label: string; script: string }> = {
  barnsdales: { label: 'Barnsdales', script: 'scripts/barnsdales-report.ts' },
  rightmove: { label: 'Rightmove Commercial', script: 'scripts/rightmove-commercial-report.ts' },
  discovered: { label: 'SMC Brownill Vickers', script: 'scripts/discovered-agents-report.ts' },
};

type JobKind = 'report' | 'discovery';
type JobStatus = 'queued' | 'running' | 'done' | 'failed';
interface Job {
  key: string;
  label: string;
  kind: JobKind;
  status: JobStatus;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
  /** Discovery jobs only: the parsed JSON summary printed by requirement-discovery.ts. */
  result?: unknown;
}

interface JobSpec {
  key: string;
  label: string;
  kind: JobKind;
  script: string;
  args?: string[];
}

let jobs: Job[] = [];
let batchRunning = false;

function runScript(script: string, args: string[] = []): Promise<{ code: number; stdout: string; errTail: string }> {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(cmd, ['tsx', script, ...args], { cwd: process.cwd(), env: process.env });
    let stdout = '';
    let errTail = '';
    child.stdout.on('data', (d: Buffer) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d: Buffer) => {
      errTail = (errTail + d.toString()).slice(-2000);
    });
    child.on('error', (e) => resolve({ code: -1, stdout, errTail: e.message }));
    child.on('close', (code) => resolve({ code: code ?? -1, stdout, errTail }));
  });
}

/** Runs a list of jobs SEQUENTIALLY — never more than one child process at a time. */
async function runJobs(specs: JobSpec[]): Promise<void> {
  batchRunning = true;
  jobs = specs.map((s) => ({
    key: s.key,
    label: s.label,
    kind: s.kind,
    status: 'queued',
    startedAt: null,
    finishedAt: null,
    error: null,
  }));
  for (let i = 0; i < specs.length; i++) {
    const job = jobs[i]!;
    const spec = specs[i]!;
    job.status = 'running';
    job.startedAt = new Date().toISOString();
    const { code, stdout, errTail } = await runScript(spec.script, spec.args);
    job.finishedAt = new Date().toISOString();
    if (code === 0) {
      job.status = 'done';
      if (spec.kind === 'discovery') {
        try {
          job.result = JSON.parse(stdout);
        } catch {
          job.result = { note: 'discovery finished but output was not valid JSON' };
        }
      }
    } else {
      job.status = 'failed';
      job.error = errTail.trim().split('\n').filter(Boolean).slice(-1)[0] ?? `exit code ${code}`;
    }
  }
  batchRunning = false;
}

function json(res: import('node:http').ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function readJsonBody(req: import('node:http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('invalid JSON'));
      }
    });
  });
}

function toNumber(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]!);

  if (req.method === 'GET' && urlPath === '/run/status') {
    json(res, 200, { running: batchRunning, jobs });
    return;
  }

  if (req.method === 'GET' && urlPath === '/requirements') {
    const h = await createPersistentHarness();
    await ensureSeeded(h);
    const requirements = await listRequirements(h);
    await h.close();
    json(res, 200, { requirements });
    return;
  }

  if (req.method === 'POST' && urlPath === '/requirements') {
    // PGlite is a single-writer embedded engine (no documented guarantee for
    // concurrent multi-process access to the same dataDir) — refuse a write
    // while a spawned report/discovery child process may also have the store
    // open, same invariant as /run and /discover.
    if (batchRunning) {
      json(res, 409, { error: 'a job is running — try again once it finishes' });
      return;
    }
    let body: Record<string, unknown>;
    try {
      body = (await readJsonBody(req)) as Record<string, unknown>;
    } catch {
      json(res, 400, { error: 'invalid JSON' });
      return;
    }
    const geographies = splitCsv(body.geographies as string | string[] | undefined);
    const keywords = splitCsv(body.keywords as string | string[] | undefined);
    const name =
      typeof body.name === 'string' && body.name.trim()
        ? body.name.trim()
        : `Custom search: ${geographies.join(', ') || 'unnamed'}`;
    const h = await createPersistentHarness();
    try {
      await ensureSeeded(h);
      const created = await insertRequirement(h, {
        name,
        geographies,
        keywords,
        minSize: toNumber(body.minSize),
        budgetMin: toNumber(body.budgetMin),
        budgetMax: toNumber(body.budgetMax),
      });
      json(res, 201, { requirement: created });
    } catch (e) {
      json(res, 400, { error: e instanceof Error ? e.message : String(e) });
    } finally {
      await h.close();
    }
    return;
  }

  if (req.method === 'POST' && urlPath === '/run') {
    if (batchRunning) {
      json(res, 409, { error: 'a job is already running' });
      return;
    }
    let body: { sources?: unknown };
    try {
      body = (await readJsonBody(req)) as { sources?: unknown };
    } catch {
      json(res, 400, { error: 'invalid JSON' });
      return;
    }
    const keys = (Array.isArray(body.sources) ? body.sources.map(String) : []).filter((k) => k in RUNNABLE);
    if (keys.length === 0) {
      json(res, 400, { error: 'no valid sources; expected any of ' + Object.keys(RUNNABLE).join(', ') });
      return;
    }
    void runJobs(
      keys.map((key) => ({ key, label: RUNNABLE[key]!.label, kind: 'report', script: RUNNABLE[key]!.script })),
    );
    json(res, 202, { started: keys });
    return;
  }

  if (req.method === 'POST' && urlPath === '/discover') {
    if (batchRunning) {
      json(res, 409, { error: 'a job is already running' });
      return;
    }
    let body: { requirementId?: unknown };
    try {
      body = (await readJsonBody(req)) as { requirementId?: unknown };
    } catch {
      json(res, 400, { error: 'invalid JSON' });
      return;
    }
    const requirementId = typeof body.requirementId === 'string' ? body.requirementId : '';
    if (!requirementId) {
      json(res, 400, { error: 'requirementId is required' });
      return;
    }
    void runJobs([
      {
        key: `discover:${requirementId}`,
        label: 'Discovery',
        kind: 'discovery',
        script: 'scripts/requirement-discovery.ts',
        args: ['--requirement', requirementId],
      },
    ]);
    json(res, 202, { started: requirementId });
    return;
  }

  // static files
  try {
    const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
    const filePath = normalize(join(ROOT, rel));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(filePath);
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`CAIS dashboard: http://localhost:${PORT}`);
});
