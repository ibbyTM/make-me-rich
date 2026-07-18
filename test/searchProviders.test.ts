import { describe, it, expect } from 'vitest';
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  DirectoryProvider,
  createSearchProvider,
  DEFAULT_DIRECTORY_PATH,
} from '../src/discovery/searchProviders.js';

describe('DirectoryProvider', () => {
  it('matches the real directory against a known-covered city', async () => {
    const provider = new DirectoryProvider(DEFAULT_DIRECTORY_PATH);
    const hits = await provider.search('commercial property agent sheffield');
    expect(hits).toContain('https://smcbrownillvickers.com');
  });

  it('matches on region tags too, not just city names', async () => {
    const provider = new DirectoryProvider(DEFAULT_DIRECTORY_PATH);
    const hits = await provider.search('commercial property agent north east');
    expect(hits).toContain('https://www.naylorsgavinblack.co.uk');
  });

  it('returns empty (not fabricated) results for an uncovered geography', async () => {
    const provider = new DirectoryProvider(DEFAULT_DIRECTORY_PATH);
    const hits = await provider.search('commercial property agent nowheresville');
    expect(hits).toEqual([]);
  });

  it('matches against a custom directory file (extensible via data edit, not code)', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'cais-dir-'));
    const path = join(dir, 'custom.json');
    await writeFile(
      path,
      JSON.stringify({
        agents: [{ name: 'Test Agent', url: 'https://example.test', tags: ['testville'] }],
      }),
    );
    const provider = new DirectoryProvider(path);
    expect(await provider.search('office agent testville')).toEqual(['https://example.test']);
    expect(await provider.search('office agent elsewhere')).toEqual([]);
    await rm(dir, { recursive: true, force: true });
  });
});

describe('createSearchProvider', () => {
  it('defaults to the directory provider when no Bing key is set', () => {
    const { kind, note } = createSearchProvider({});
    expect(kind).toBe('directory');
    expect(note).toMatch(/BING_SEARCH_API_KEY not set/);
  });

  it('selects Bing when BING_SEARCH_API_KEY is present', () => {
    const { kind } = createSearchProvider({ BING_SEARCH_API_KEY: 'test-key' });
    expect(kind).toBe('bing');
  });
});
