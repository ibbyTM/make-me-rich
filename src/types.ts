/**
 * Domain types for the CAIS Source Onboarding Pipeline.
 *
 * These mirror the data-model additions in the build spec (§2). The enums are
 * the single source of truth shared between the pure classification logic, the
 * DB adapters, and the SQL migrations (kept in sync by hand — see
 * `supabase/migrations`).
 */

/** Spec §2.1 — how a source's page structure is classified. */
export type Classification =
  | 'embedded_json'
  | 'api_endpoint'
  | 'static_html'
  | 'js_rendered'
  | 'manual_entry_only'
  | 'needs_review'
  | 'unclassified';

/** Spec §2.1 / §5 — how a source (or a discovery-queue URL) was first found. */
export type DiscoveredVia =
  | 'manual'
  | 'excel_import'
  | 'search_discovery'
  | 'portal_integration';

/** Spec §2.1 — extends the existing active/paused with pending_review. */
export type SourceStatus = 'active' | 'paused' | 'pending_review';

/** Spec §2.2 — outcome of a classification run. */
export type AuditDecision = 'auto_approved' | 'queued_for_review';

/** Spec §2.3 — lifecycle of a discovered URL. */
export type DiscoveryStatus = 'pending' | 'classified' | 'rejected';

/** Suggested default scraper strategies per classification (spec §2.1 examples). */
export const DEFAULT_SCRAPER_STRATEGY: Record<Classification, string> = {
  embedded_json: 'direct-json-extract',
  api_endpoint: 'direct-json-extract',
  static_html: 'apify~cheerio-scraper',
  js_rendered: 'apify~playwright-scraper',
  manual_entry_only: 'manual',
  needs_review: 'manual',
  unclassified: 'manual',
};

/**
 * The evidence gathered about a site, independent of how it was gathered.
 * Keeping this a plain data object is what lets `classifySite` be a pure,
 * fully-testable function (fixtures in, decision out) with no network access.
 */
export interface SiteProbe {
  url: string;
  /** Plain HTTP GET, no JS execution (spec §3 step 1). */
  rawHtml: string;
  /** DOM after headless render (spec §3 step 2). */
  renderedDom: string;
  /** Network calls captured during the headless render (spec §3 step 2/5). */
  networkLog: NetworkEntry[];
  /** robots.txt body if fetched (spec §3 step 7). undefined = not fetched. */
  robotsTxt?: string;
  /** Best-effort terms-of-use text if fetched (spec §3 step 7). */
  tosText?: string;
}

export interface NetworkEntry {
  url: string;
  method: string;
  status: number;
  contentType: string;
  /**
   * A sample of the response body. For JSON responses this should already be
   * parsed; for anything else it may be a raw string or omitted.
   */
  responseBody?: unknown;
}

/** Output of a single classification run (spec §2.2 + §3). */
export interface ClassificationResult {
  url: string;
  classification: Classification;
  /** 0..1 (spec §2.1 classification_confidence). */
  confidence: number;
  scraperStrategy: string;
  /** True if robots.txt / ToS suggested a scraping restriction (spec §3 step 7). */
  tosFlag: boolean;
  /** Free-form evidence notes, stored on site_audits.detected_structure. */
  detectedStructure: string;
  /** auto_approved | queued_for_review (spec §2.2). */
  decision: AuditDecision;
  /** Resulting source status once the row is upserted (spec §3 step 10). */
  resultingStatus: SourceStatus;
  classifiedAt: string; // ISO timestamp
}

/** A row in the discovery queue (spec §2.3). */
export interface DiscoveryQueueItem {
  id: string;
  url: string;
  discoveredVia: DiscoveredVia;
  discoveredAt: string;
  status: DiscoveryStatus;
  sourceId: string | null;
}

/** Minimal shape of a Requirements Register entry used by the Stage-0 filter (§6). */
export interface Requirement {
  id: string;
  name: string;
  active: boolean;
  /** Geographies this requirement targets, lower-cased for matching. */
  geographies: string[];
  /** Minimum size in sq ft, if applicable. */
  minSize?: number;
  /** Inclusive budget range [min, max] in GBP, if applicable. */
  budgetRange?: [number, number];
  /** Extra keyword triggers beyond the global list. */
  keywords?: string[];
}

/** A scraped listing, before it reaches the Claude API scorer (spec §6). */
export interface Listing {
  sourceId: string;
  externalId: string;
  geography?: string;
  size?: number;
  price?: number;
  /** Any text fields (title, description) scanned for keyword hits. */
  text?: string;
}
