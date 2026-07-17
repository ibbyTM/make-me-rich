/**
 * Zero-dependency server for the read-only dashboard.
 *
 *   npm run dashboard          # serves http://localhost:4173
 *   PORT=5000 npm run dashboard
 *
 * Serves static files from dashboard/ and provides two local-only endpoints
 * for the run-from-dashboard feature:
 *
 *   POST /run          {"sources":["barnsdales","rightmove","discovered"]}
 *                      → queues the matching report scripts and runs them
 *                        SEQUENTIALLY (one child process at a time). 409 if a
 *                        batch is already running. Only allowlisted keys run —
 *                        nothing from the request is executed as code.
 *   GET  /run/status   → {"running":bool,"jobs":[{key,label,status,...}]}
 *
 * No auth (local use only), no writes anywhere except the report scripts'
 * own outputs (docs/ + dashboard/data/).
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = join(process.cwd(), 'dashboard');
const PORT = Number(process.env.PORT ?? 4173);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

/** Allowlist: source key → report script + display label. */
const RUNNABLE: Record<string, { label: string; script: string }> = {
  barnsdales: { label: 'Barnsdales', script: 'scripts/barnsdales-report.ts' },
  rightmove: { label: 'Rightmove Commercial', script: 'scripts/rightmove-commercial-report.ts' },
  discovered: { label: 'SMC Brownill Vickers', script: 'scripts/discovered-agents-report.ts' },
};

type JobStatus = 'queued' | 'running' | 'done' | 'failed';
interface Job {
  key: string;
  label: string;
  status: JobStatus;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
}

let jobs: Job[] = [];
let batchRunning = false;

function runScript(script: string): Promise<{ code: number; errTail: string }> {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(cmd, ['tsx', script], { cwd: process.cwd(), env: process.env });
    let errTail = '';
    child.stderr.on('data', (d: Buffer) => {
      errTail = (errTail + d.toString()).slice(-2000);
    });
    child.on('error', (e) => resolve({ code: -1, errTail: e.message }));
    child.on('close', (code) => resolve({ code: code ?? -1, errTail }));
  });
}

async function runBatch(keys: string[]): Promise<void> {
  batchRunning = true;
  jobs = keys.map((key) => ({
    key,
    label: RUNNABLE[key]!.label,
    status: 'queued',
    startedAt: null,
    finishedAt: null,
    error: null,
  }));
  for (const job of jobs) {
    job.status = 'running';
    job.startedAt = new Date().toISOString();
    const { code, errTail } = await runScript(RUNNABLE[job.key]!.script);
    job.finishedAt = new Date().toISOString();
    if (code === 0) {
      job.status = 'done';
    } else {
      job.status = 'failed';
      // last stderr line tends to carry the real error
      job.error = errTail.trim().split('\n').filter(Boolean).slice(-1)[0] ?? `exit code ${code}`;
    }
  }
  batchRunning = false;
}

function json(res: import('node:http').ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]!);

  if (req.method === 'GET' && urlPath === '/run/status') {
    json(res, 200, { running: batchRunning, jobs });
    return;
  }

  if (req.method === 'POST' && urlPath === '/run') {
    if (batchRunning) {
      json(res, 409, { error: 'a batch is already running' });
      return;
    }
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      let keys: string[];
      try {
        const parsed = JSON.parse(body || '{}') as { sources?: unknown };
        keys = Array.isArray(parsed.sources) ? parsed.sources.map(String) : [];
      } catch {
        json(res, 400, { error: 'invalid JSON' });
        return;
      }
      keys = keys.filter((k) => k in RUNNABLE);
      if (keys.length === 0) {
        json(res, 400, { error: 'no valid sources; expected any of ' + Object.keys(RUNNABLE).join(', ') });
        return;
      }
      void runBatch(keys); // fire and forget; progress via /run/status
      json(res, 202, { started: keys });
    });
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
