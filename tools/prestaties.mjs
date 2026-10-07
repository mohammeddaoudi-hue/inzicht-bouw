// Meet per pagina op een gesimuleerde gsm (390 px, 4x tragere CPU, snelle 4G): LCP, CLS, overdracht en aantal verzoeken.
// Gebruik (vanuit pixelperfect-photo-painter): node <pad>/tools/prestaties.mjs
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const puppeteer = createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json')('puppeteer-core');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const ROUTES = ['', 'diensten/', 'over-ons/', 'vragen/', 'tips/', 'tips/aanbouw-vergunning/', 'contact/', 'privacy/'];
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const BASIS = '/inzicht-bouw/';
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (!p.startsWith(BASIS)) { r.writeHead(404); r.end(); return; }
  p = p.slice(BASIS.length - 1); if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(ROOT, p), (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b); });
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${srv.address().port}${BASIS}`;
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const rij = [];
for (const route of ['', ...ROUTES.slice(1)]) {
  for (const [w, h, mobiel] of [[390, 844, true], [1440, 900, false]]) {
    const p = await browser.newPage();
    const cdp = await p.createCDPSession();
    await cdp.send('Network.enable');
    if (mobiel) {
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (1.5 * 1024 * 1024) / 8 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }
    let bytes = 0, verzoeken = 0;
    cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; verzoeken++; });
    await p.setViewport({ width: w, height: h, isMobile: mobiel, hasTouch: mobiel });
    await p.evaluateOnNewDocument(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));
    const m = await p.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: Math.round(window.__cls * 1000) / 1000, fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0) }));
    rij.push({ pagina: '/' + route, breedte: w, ...m, kB: Math.round(bytes / 1024), verzoeken });
    await p.close();
  }
}
await browser.close(); srv.close();
console.table(rij);
const slecht = rij.filter((r) => r.lcp > 2500 || r.cls > 0.1);
console.log(slecht.length ? `ROOD: ${slecht.length} meting(en) boven LCP 2,5 s of CLS 0,1` : 'GROEN: alle pagina\'s LCP < 2,5 s en CLS < 0,1');
