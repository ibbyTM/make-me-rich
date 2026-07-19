import { describe, it, expect } from 'vitest';
import { detectBotChallenge } from '../src/classifier/detectors.js';

describe('detectBotChallenge', () => {
  it('flags HTTP 403 as blocked regardless of body', () => {
    const res = detectBotChallenge(403, '<html><body>Forbidden</body></html>');
    expect(res.found).toBe(true);
    expect(res.notes).toContain('403');
  });

  it('flags HTTP 429 as blocked', () => {
    expect(detectBotChallenge(429, '').found).toBe(true);
  });

  it('flags a 200-status Cloudflare JS-challenge interstitial', () => {
    const html = '<html><head><title>Just a moment...</title></head><body>Checking your browser before accessing example.com</body></html>';
    const res = detectBotChallenge(200, html);
    expect(res.found).toBe(true);
    expect(res.notes).toMatch(/bot-challenge/i);
  });

  it('flags a 200-status Akamai/Incapsula-style interstitial', () => {
    const html = '<html><body>Pardon Our Interruption</body></html>';
    expect(detectBotChallenge(200, html).found).toBe(true);
  });

  it('does not flag an ordinary content page', () => {
    const html = `<html><body>${'<div>Unit 3, retail premises to let, freehold</div>'.repeat(20)}</body></html>`;
    expect(detectBotChallenge(200, html).found).toBe(false);
  });
});
