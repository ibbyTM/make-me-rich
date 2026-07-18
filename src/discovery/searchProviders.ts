/**
 * SearchProvider implementations for parameter-driven discovery.
 *
 * Why this exists (read before assuming this does live web search): this
 * sandbox has no search-API key configured anywhere (no .env, no
 * BING_SEARCH_API_KEY, nothing), and scraping a search engine's result page
 * was tried and rejected — DuckDuckGo, DuckDuckGo Lite and Mojeek all
 * returned bot-challenge pages (captcha / 403) rather than results when
 * probed live 2026-07-18. Scraping search engines would also be a worse ToS
 * citizen than everything else this project is careful about (robots.txt/ToS
 * checks, the review gate, geoPrescoped scoring) — so it wasn't built.
 *
 * Two providers, selected by `createSearchProvider()`:
 *   - BingSearchProvider — real, open-ended web search via the Bing Web
 *     Search API. Only used when BING_SEARCH_API_KEY is set. This is the
 *     production path once a key is configured; it has NOT been exercised
 *     live in this environment (no key available to test against).
 *   - DirectoryProvider — the default. Backed by data/agent-directory.json, a
 *     small curated list of real independent UK commercial agents tagged by
 *     city/region (the same 21 agents from the 2026-07-17 discovery batch).
 *     Matches a query against each entry's tags. This is NOT web search — a
 *     geography with no directory coverage returns zero results rather than
 *     guessing. Extending coverage is a data edit (data/agent-directory.json),
 *     not a code change.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { SearchProvider } from './discovery.js';

const here = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_DIRECTORY_PATH = resolve(here, '../../data/agent-directory.json');

interface DirectoryAgent {
  name: string;
  url: string;
  tags: string[];
}

export class DirectoryProvider implements SearchProvider {
  readonly kind = 'directory' as const;
  private agentsPromise: Promise<DirectoryAgent[]>;

  constructor(private readonly path: string = DEFAULT_DIRECTORY_PATH) {
    this.agentsPromise = readFile(this.path, 'utf8').then(
      (raw) => (JSON.parse(raw).agents as DirectoryAgent[]) ?? [],
    );
  }

  async search(query: string): Promise<string[]> {
    const agents = await this.agentsPromise;
    const q = query.toLowerCase();
    return agents.filter((a) => a.tags.some((tag) => q.includes(tag))).map((a) => a.url);
  }
}

export interface BingSearchOptions {
  apiKey: string;
  count?: number;
  endpoint?: string;
}

/** Real web search via the Bing Web Search API v7. Requires an API key. */
export class BingSearchProvider implements SearchProvider {
  readonly kind = 'bing' as const;

  constructor(private readonly opts: BingSearchOptions) {}

  async search(query: string): Promise<string[]> {
    const endpoint = this.opts.endpoint ?? 'https://api.bing.microsoft.com/v7.0/search';
    const url = `${endpoint}?q=${encodeURIComponent(query)}&count=${this.opts.count ?? 10}&mkt=en-GB`;
    const res = await fetch(url, {
      headers: { 'Ocp-Apim-Subscription-Key': this.opts.apiKey },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Bing search failed: HTTP ${res.status}`);
    const data = (await res.json()) as {
      webPages?: { value?: { url?: string }[] };
    };
    return (data.webPages?.value ?? []).map((r) => r.url).filter((u): u is string => Boolean(u));
  }
}

export interface CreateSearchProviderResult {
  provider: SearchProvider;
  /** Which backend is actually in use — surfaced to the UI/CLI so it's never silently assumed to be live web search. */
  kind: 'bing' | 'directory';
  note: string;
}

/** Picks Bing if configured, otherwise the curated directory. */
export function createSearchProvider(env: NodeJS.ProcessEnv = process.env): CreateSearchProviderResult {
  const apiKey = env.BING_SEARCH_API_KEY;
  if (apiKey) {
    return {
      provider: new BingSearchProvider({ apiKey }),
      kind: 'bing',
      note: 'Using Bing Web Search API (BING_SEARCH_API_KEY set).',
    };
  }
  return {
    provider: new DirectoryProvider(),
    kind: 'directory',
    note:
      'BING_SEARCH_API_KEY not set — using the curated agent directory (data/agent-directory.json) ' +
      'instead of live web search. Coverage is limited to the cities/regions already tagged there.',
  };
}
