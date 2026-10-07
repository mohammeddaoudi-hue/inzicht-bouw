// Keuring van alle pagina's: eigen server op een vrije poort, per pagina en breedte:
// titelcheck, horizontale overflow, consolefouten, mislukte verzoeken, kapotte beelden,
// interne links die geen 200 geven, en een schermafdruk.
// Gebruik (vanuit pixelperfect-photo-painter, daar staat puppeteer): node <pad>/tools/keur.mjs <uitvoermap> [1440,390]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const puppeteer = createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json')('puppeteer-core');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const OUT = process.argv[2] || '.'; const BREEDTES = (process.argv[3] || '1440,390').split(',').map(Number);
const ALLEEN = process.argv[4] ? process.argv[4].split(',') : null;
const ROUTES = ['', 'diensten/', 'over-ons/', 'vragen/', 'tips/', 'tips/badkamerrenovatie-waarde-woning/', 'tips/aanbouw-vergunning/', 'tips/renovatiepremies-dak-gevel/', 'contact/', 'privacy/', 'bestaat-niet/'].filter((r) => !ALLEEN || ALLEEN.includes(r));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
// gedraagt zich als GitHub Pages: map → index.html, onbekend → 404.html met status 404, site onder /inzicht-bouw/
const BASIS = '/inzicht-bouw/';
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0].split('#')[0]);
  if (!p.startsWith(BASIS)) { r.writeHead(404); r.end(); return; }
  p = p.slice(BASIS.length - 1);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  fs.readFile(f, (e, b) => {
    if (e) { fs.readFile(path.join(ROOT, '404.html'), (e2, b2) => { r.writeHead(404, { 'content-type': types['.html'] }); r.end(b2); }); return; }
    r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(b);
  });
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${srv.address().port}${BASIS}`;
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const linkStatus = new Map();
const checkLink = async (url) => {
  if (linkStatus.has(url)) return linkStatus.get(url);
  const s = await new Promise((res) => http.get(url, (r) => { r.resume(); res(r.statusCode); }).on('error', () => res(0)));
  linkStatus.set(url, s); return s;
};
let problemen = 0;
fs.mkdirSync(OUT, { recursive: true });
for (const route of ROUTES) {
  for (const w of BREEDTES) {
    const p = await browser.newPage();
    const fouten = [];
    p.on('console', (m) => { if (m.type() === 'error' && !(route === 'bestaat-niet/' && /404/.test(m.text()))) fouten.push('console: ' + m.text()); });
    p.on('pageerror', (e) => fouten.push('js: ' + e.message));
    p.on('requestfailed', (q) => { if (!q.url().startsWith('mailto:')) fouten.push('verzoek: ' + q.url()); });
    p.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('bestaat-niet/')) fouten.push(`status ${r.status()}: ${r.url()}`); });
    await p.setViewport({ width: w, height: w < 600 ? 844 : 900, isMobile: w < 600, hasTouch: w < 600 });
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    const titel = await p.title();
    if (!/INzicht/.test(titel)) fouten.push('titel klopt niet: ' + titel);
    await p.evaluate(async () => {
      document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; });
      await document.fonts.ready;
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
      window.scrollTo(0, 0);
      document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-zichtbaar'));
      await Promise.all([...document.images].map((i) => (i.complete && i.naturalWidth ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = () => r(); }))));
    });
    await new Promise((r) => setTimeout(r, 300));
    const info = await p.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const over = [...document.querySelectorAll('body *')].filter((e) => {
        const r = e.getBoundingClientRect();
        if (!r.width || e.closest('.mob, [hidden], .is-rail, .sprong__lijst, svg')) return false;
        return r.right > W + 1 || r.left < -1;
      }).slice(0, 6).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}`);
      const kapot = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      const links = [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin) && h.split('#')[0] !== location.href.split('#')[0]);
      const ankers = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.getElementById(h.slice(1)));
      const h1 = document.querySelectorAll('h1').length;
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); const dubbel = ids.filter((id, i) => ids.indexOf(id) !== i);
      const zonderAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length;
      const fontOk = document.fonts.check('600 16px "Plus Jakarta Sans"');
      return { scrollW: document.documentElement.scrollWidth, W, over, kapot, links: [...new Set(links)], ankers, h1, dubbel: [...new Set(dubbel)], zonderAlt, fontOk, h: document.body.scrollHeight };
    });
    if (info.scrollW > info.W) fouten.push(`overflow ${info.scrollW - info.W}px: ${info.over.join(', ')}`);
    if (info.kapot.length) fouten.push('kapotte beelden: ' + info.kapot.join(', '));
    if (info.ankers.length) fouten.push('ankers zonder doel: ' + info.ankers.join(', '));
    if (info.h1 !== 1) fouten.push(`aantal h1: ${info.h1}`);
    if (info.dubbel.length) fouten.push('dubbele id: ' + info.dubbel.join(', '));
    if (info.zonderAlt) fouten.push(`${info.zonderAlt} beelden zonder alt`);
    if (!info.fontOk) fouten.push('font niet geladen');
    if (w === BREEDTES[0]) {
      for (const l of info.links) { const u = l.split('#')[0]; const s = await checkLink(u); if (s !== 200) fouten.push(`link ${s}: ${u}`); }
    }
    const naam = (route || 'home').replace(/\//g, '_').replace(/_$/, '') || 'home';
    await p.screenshot({ path: path.join(OUT, `${naam}-${w}.png`), fullPage: true });
    console.log(`${fouten.length ? 'FOUT' : 'OK  '} ${String(w).padEnd(4)} /${route}  hoogte ${info.h}${fouten.length ? '\n      - ' + [...new Set(fouten)].join('\n      - ') : ''}`);
    problemen += fouten.length;
    await p.close();
  }
}
await browser.close(); srv.close();
console.log(`\n${problemen === 0 ? 'GROEN' : 'ROOD'}: ${problemen} probleem/problemen over ${ROUTES.length} pagina's x ${BREEDTES.length} breedtes`);
process.exit(problemen ? 1 : 0);
