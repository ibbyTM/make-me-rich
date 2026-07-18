/**
 * Test-scoped re-export of the shared PGlite bootstrap (`src/db/pglite.ts`).
 * Tests always get an in-memory instance (no dataDir), matching the original
 * behaviour of this module before it was extracted for production reuse by the
 * dashboard server and report scripts.
 */
export { createHarness, type Harness, type CreateHarnessOptions } from '../../src/db/pglite.js';
