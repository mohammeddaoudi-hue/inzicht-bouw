// Contrast van de witte menutekst boven de herofoto, gemeten op de echte pixels (tekst verborgen, lichtste 10% telt).
// Gebruik (vanuit pixelperfect-photo-painter): node <pad>/tools/nav-contrast.mjs
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const rq = createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json'); const puppeteer = rq('puppeteer-core'); const sharp = rq('sharp');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..'); const BASIS = '/inzicht-bouw/';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); p = p.slice(BASIS.length - 1); if (p.endsWith('/')) p += 'index.html'; fs.readFile(path.join(ROOT, p), (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b); }); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const L = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
for (const [w, h, mob] of [[1440, 900, false], [1280, 800, false], [1024, 768, false], [768, 1024, true], [390, 844, true]]) {
  const p = await browser.newPage(); await p.setViewport({ width: w, height: h, isMobile: mob, hasTouch: mob });
  await p.goto(`http://127.0.0.1:${srv.address().port}${BASIS}`, { waitUntil: 'networkidle0' });
  await p.evaluate(async () => { await document.fonts.ready; const i = document.querySelector('.hero__foto img'); if (i && !i.complete) await new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }); });
  const doelen = await p.evaluate(() => [...document.querySelectorAll('.nav__links > a, .drop__link, .nav__tel, .nav__logo-wit, .burger')].filter((e) => e.getBoundingClientRect().width > 0).map((e) => { const r = e.getBoundingClientRect(); return { naam: (e.textContent || e.className).trim().slice(0, 18) || e.className, x: Math.max(0, r.x), y: Math.max(0, r.y), w: r.width, h: r.height }; }));
  await p.addStyleTag({ content: '.nav__in * { visibility: hidden !important; }' });
  const shot = await p.screenshot();
  const uit = []; let slecht = 0;
  for (const d of doelen) {
    const { data, info } = await sharp(shot).extract({ left: Math.round(d.x), top: Math.round(d.y), width: Math.max(1, Math.round(d.w)), height: Math.max(1, Math.round(d.h)) }).raw().toBuffer({ resolveWithObject: true });
    const lums = []; for (let i = 0; i < data.length; i += info.channels) lums.push(0.2126 * L(data[i]) + 0.7152 * L(data[i + 1]) + 0.0722 * L(data[i + 2]));
    lums.sort((a, b) => a - b); const p90 = lums[Math.floor(lums.length * 0.9)];
    const r = 1.05 / (p90 + 0.05); const tekst = !/logo|burger/.test(d.naam); if (r < (tekst ? 4.5 : 3)) slecht++;
    uit.push(`${d.naam}: ${r.toFixed(1)}:1${r < (tekst ? 4.5 : 3) ? ' FOUT' : ''}`);
  }
  console.log(`${w}px  ` + uit.join(' | ')); globalThis.__fout = (globalThis.__fout || 0) + slecht;
  await p.close();
}
await browser.close(); srv.close();
console.log(globalThis.__fout ? `ROOD: ${globalThis.__fout} te laag contrast` : 'GROEN: menu boven de herofoto overal >= 4,5:1 (tekst) en >= 3:1 (logo, knop)');
process.exit(globalThis.__fout ? 1 : 0);
