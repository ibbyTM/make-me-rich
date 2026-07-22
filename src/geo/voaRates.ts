/**
 * VOA (Valuation Office Agency) business rates rating list parser (free, no
 * auth, bulk CSV download) — the free, commercial-specific alternative to
 * Land Registry Price Paid Data, which turned out to be residential-sales-
 * only (confirmed against gov.uk's own guidance, 2026-07-22) and therefore
 * useless as a comparable for the commercial listings in this dashboard.
 *
 * The VOA publishes a compiled rating list + "summary valuations" file for
 * every non-domestic (commercial) property in England & Wales:
 *   https://voaratinglists.blob.core.windows.net/html/rlidata.htm
 * Each "01" summary-valuation line carries, in one row: postcode, property
 * description, total floor area, and rateable value (VOA's estimate of
 * annual market rent — a real, professionally-assessed commercial figure,
 * just not a sale price). That's enough to build a "rateable value per sq
 * ft" local benchmark without needing to join a second file.
 *
 * Field layout is NOT fixed-width: the address portion (Number/Name, Street,
 * Locality, Town, County) has a variable number of populated sub-fields per
 * row, which shifts every subsequent column. Confirmed by manual inspection
 * of live rows (2026-07-22) — parsing by fixed index silently misaligns on
 * a meaningful fraction of rows. Instead: locate the postcode by regex (its
 * shape is unambiguous), then read every other field at a fixed *relative*
 * offset from the postcode's position, which is consistent across rows
 * regardless of how many address lines came before it.
 */

const UK_POSTCODE_FULL_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

/** Floor-area measurement bases that represent real area (sq m). "OTH" covers
 *  non-area units (e.g. car parking "per space") and must be excluded — an
 *  OTH rateable-value-per-sqm figure isn't a floor-area rate at all. */
const AREA_UNIT_CODES = new Set(['GIA', 'NIA', 'GEA', 'EFA']);

export interface VoaEntry {
  postcode: string;
  description: string;
  areaSqm: number;
  rateableValue: number;
  unit: string;
}

/**
 * Parse one "01" summary-valuation line. Returns null for "02" sub-record
 * lines, lines with no locatable postcode, or lines with non-numeric
 * area/rateable-value fields.
 */
export function parseVoaSummaryLine(line: string): VoaEntry | null {
  if (!line.startsWith('01*')) return null;
  const f = line.split('*');
  const pcIdx = f.findIndex((v) => UK_POSTCODE_FULL_RE.test(v.trim()));
  if (pcIdx === -1) return null;

  const postcode = f[pcIdx]!.trim();
  const description = f[pcIdx + 2] ?? '';
  const areaSqm = Number(f[pcIdx + 3]);
  const rateableValue = Number(f[pcIdx + 6]);
  const unit = (f[pcIdx + 14] ?? '').trim();

  if (!Number.isFinite(areaSqm) || !Number.isFinite(rateableValue) || areaSqm <= 0 || rateableValue <= 0) {
    return null;
  }

  return { postcode, description, areaSqm, rateableValue, unit };
}

const SQM_TO_SQFT = 10.7639;

/** Rateable value per sq ft, or null if the entry's unit isn't a real floor-area measure. */
export function ratePerSqft(entry: VoaEntry): number | null {
  if (!AREA_UNIT_CODES.has(entry.unit.toUpperCase())) return null;
  return entry.rateableValue / entry.areaSqm / SQM_TO_SQFT;
}

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}
