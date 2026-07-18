import { describe, it, expect, afterEach } from 'vitest';
import { createHarness, type Harness } from '../src/db/pglite.js';
import {
  ensureSeeded,
  insertRequirement,
  listRequirements,
  listActiveRequirements,
  getRequirement,
  splitCsv,
} from '../src/db/requirementsRepo.js';

let h: Harness | undefined;
afterEach(async () => {
  await h?.close();
  h = undefined;
});

describe('requirementsRepo', () => {
  it('ensureSeeded inserts the two seed requirements once, idempotently', async () => {
    h = await createHarness();
    await ensureSeeded(h);
    const first = await listRequirements(h);
    expect(first.map((r) => r.name).sort()).toEqual(['Citywide Investors', 'Educating Excellence']);

    await ensureSeeded(h); // second call must be a no-op
    const second = await listRequirements(h);
    expect(second).toHaveLength(2);
  }, 15000); // two full PGlite bootstraps in one test; default 5s timeout flakes under load

  it('inserts a custom requirement and it round-trips correctly', async () => {
    h = await createHarness();
    const created = await insertRequirement(h, {
      name: 'Custom: Bristol Retail',
      geographies: ['Bristol', ' Bath '],
      keywords: ['Retail', 'Industrial'],
      minSize: 1500,
      budgetMin: 200000,
      budgetMax: 900000,
    });
    expect(created.name).toBe('Custom: Bristol Retail');
    expect(created.geographies).toEqual(['bristol', 'bath']); // trimmed + lowercased
    expect(created.keywords).toEqual(['retail', 'industrial']);
    expect(created.minSize).toBe(1500);
    expect(created.budgetRange).toEqual([200000, 900000]);
    expect(created.active).toBe(true);

    const fetched = await getRequirement(h, created.id);
    expect(fetched).toMatchObject({ name: 'Custom: Bristol Retail' });
  });

  it('a new requirement appears in listActiveRequirements alongside the seeds', async () => {
    h = await createHarness();
    await ensureSeeded(h);
    await insertRequirement(h, { name: 'New One', geographies: ['leicester'] });
    const active = await listActiveRequirements(h);
    expect(active.map((r) => r.name).sort()).toEqual([
      'Citywide Investors',
      'Educating Excellence',
      'New One',
    ]);
  });

  it('rejects a requirement with no geography', async () => {
    h = await createHarness();
    await expect(insertRequirement(h, { name: 'No Geo', geographies: [] })).rejects.toThrow(
      /geography/,
    );
  });

  it('rejects a requirement with a blank name', async () => {
    h = await createHarness();
    await expect(insertRequirement(h, { name: '  ', geographies: ['leeds'] })).rejects.toThrow(
      /name/,
    );
  });

  it('splitCsv trims, lowercases and dedupes free-text input', () => {
    expect(splitCsv('Leeds, Hull ,, leeds')).toEqual(['leeds', 'hull']);
    expect(splitCsv(undefined)).toEqual([]);
    expect(splitCsv(['Retail', ' Office '])).toEqual(['retail', 'office']);
  });
});
