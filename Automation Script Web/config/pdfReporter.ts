import { randomUUID } from 'node:crypto';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import type { FullConfig, FullResult, Reporter, Suite } from '@playwright/test/reporter';

const statusLabels = {
  expected: 'Passed',
  unexpected: 'Failed',
  flaky: 'Flaky',
  skipped: 'Skipped',
  interrupted: 'Interrupted',
};

const runLabels = {
  passed: 'Passed',
  failed: 'Failed',
  timedout: 'Timed out',
  interrupted: 'Interrupted',
};

function escapeHtml(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function seconds(milliseconds: number) {
  return `${(milliseconds / 1000).toLocaleString('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`;
}

export default class PdfReporter implements Reporter {
  private suite?: Suite;

  onBegin(_config: FullConfig, suite: Suite) {
    this.suite = suite;
  }

  async onEnd(result: FullResult) {
    const tests = this.suite?.allTests() ?? [];
    if (!tests.some(test => test.results.length)) return;

    const counts = { expected: 0, unexpected: 0, flaky: 0, skipped: 0, interrupted: 0 };
    const rows = tests.map(test => {
      const lastResult = test.results.at(-1);
      const status = lastResult?.status === 'interrupted' ? 'interrupted' : test.outcome();
      counts[status]++;
      const browser = test.parent.project()?.name ?? 'Default';
      const duration = lastResult && status !== 'skipped' ? seconds(lastResult.duration) : '-';

      return `<tr><td>${escapeHtml(test.title)}</td><td>${escapeHtml(browser)}</td><td>${statusLabels[status]}</td><td>${duration}</td></tr>`;
    });

    const startedAt = result.startTime.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });
    const summary = Object.entries(statusLabels)
      .map(([status, label]) => `${label} ${counts[status as keyof typeof counts]}`)
      .join(' &middot; ');
    const outputFile = resolve(__dirname, '../output/pdf/cura-test-report.pdf');
    const temporaryFile = `${outputFile}.${randomUUID()}.tmp`;

    try {
      const browser = await chromium.launch();
      try {
        const page = await browser.newPage();
        await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8">
          <title>CURA Demo Test Report</title>
          <style>
            body { font: 13px/1.45 Arial, sans-serif; color: #182533; }
            h1 { margin: 0 0 6px; font-size: 24px; }
            p { margin: 0 0 14px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #d9e1e8; }
            th { background: #edf2f7; }
            tr { break-inside: avoid; }
            th:last-child, td:last-child { text-align: right; white-space: nowrap; }
          </style></head><body>
          <h1>CURA Demo Test Report</h1>
          <p>${startedAt} (UTC+7) &middot; ${seconds(result.duration)} total &middot; ${runLabels[result.status]}</p>
          <p><strong>Total ${tests.length}</strong> &middot; ${summary}</p>
          <table><thead><tr><th>Test case</th><th>Browser</th><th>Status</th><th>Duration</th></tr></thead>
          <tbody>${rows.join('')}</tbody></table>
          </body></html>`);
        const pdf = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' },
        });
        await mkdir(dirname(outputFile), { recursive: true });
        await writeFile(temporaryFile, pdf);
        await rename(temporaryFile, outputFile);
      } finally {
        await browser.close();
      }
      console.log(`PDF report: ${outputFile}`);
    } catch (error) {
      console.error('Could not generate the PDF report:', error);
      if (result.status === 'passed') return { status: 'failed' as const };
    } finally {
      await rm(temporaryFile, { force: true });
    }
  }
}
