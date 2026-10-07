// Contrast van de herokop en de hero-alinea op de home, gemeten per letterpixel op de echte foto.
// Methode: schermafdruk met en zonder tekst; letterpixels = waar die twee duidelijk verschillen;
// per letterpixel: tekstkleur (met doorzichtigheid gemengd) tegen de achtergrondpixel eronder.
// Eis: kop (grote tekst) >= 3:1, alinea >= 4,5:1, op elke gemeten letterpixel (1 % randpixels telt niet).
// Gebruik (vanuit pixelperfect-photo-painter): node <pad>/tools/hero-contrast.mjs
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const rq = createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json'); const puppeteer = rq('puppeteer-core'); const sharp = rq('sharp');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..'); const BASIS = '/inzicht-bouw/';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); p = p.slice(BASIS.length - 1); if (p.endsWith('/')) p += 'index.html'; fs.readFile(path.join(ROOT, p), (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b); }); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
let rood = 0;
const BREEDTES = [[1920, 1080, false], [1440, 900, false], [1280, 800, false], [1024, 768, false], [768, 1024, true], [390, 844, true]];
for (const [w, h, mob] of BREEDTES) {
  const p = await browser.newPage(); await p.setViewport({ width: w, height: h, isMobile: mob, hasTouch: mob });
  await p.goto(`http://127.0.0.1:${srv.address().port}${BASIS}`, { waitUntil: 'networkidle0' });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.evaluate(async () => { await document.fonts.ready; const i = document.querySelector('.hero__foto img'); if (i && !i.complete) await new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }); });
  const doelen = await p.evaluate(() => {
    const rect = (el) => { const r = el.getBoundingClientRect(); return { x: Math.max(0, Math.floor(r.x)), y: Math.max(0, Math.floor(r.y)), w: Math.ceil(r.width), h: Math.ceil(r.height) }; };
    const kleur = (el) => getComputedStyle(el).color.match(/[\d.]+/g).map(Number);
    const kop = document.querySelector('.hero__kop'); const kop2 = document.querySelector('.hero__kop2'); const tekst = document.querySelector('.hero__tekst');
    // regel 1 van de kop: de kop zonder de tweede regel
    const r1 = document.createRange(); r1.setStart(kop, 0); r1.setEndBefore(kop2); const b1 = r1.getBoundingClientRect();
    return [
      { naam: 'kop regel 1', eis: 3, kleur: kleur(kop), r: { x: Math.max(0, Math.floor(b1.x)), y: Math.max(0, Math.floor(b1.y)), w: Math.ceil(b1.width), h: Math.ceil(b1.height) } },
      { naam: 'kop regel 2', eis: 3, kleur: kleur(kop2), r: rect(kop2) },
      { naam: 'alinea', eis: 4.5, kleur: kleur(tekst), r: rect(tekst) },
    ];
  });
  const met = await p.screenshot();
  await p.addStyleTag({ content: '.hero__tekstblok { color: transparent !important; } .hero__tekstblok * { visibility: hidden !important; }' });
  const zonder = await p.screenshot();
  const uit = [];
  for (const d of doelen) {
    const box = { left: d.r.x, top: d.r.y, width: Math.max(1, Math.min(d.r.w, w - d.r.x)), height: Math.max(1, Math.min(d.r.h, h - d.r.y)) };
    if (d.r.y >= h) { uit.push(`${d.naam}: buiten beeld`); continue; }
    const A = await sharp(met).extract(box).raw().toBuffer({ resolveWithObject: true });
    const B = await sharp(zonder).extract(box).raw().toBuffer({ resolveWithObject: true });
    const [tr, tg, tb, ta = 1] = d.kleur; const n = A.info.channels; const ratios = [];
    for (let i = 0; i < A.data.length; i += n) {
      const verschil = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
      if (verschil < 90) continue; // geen letterpixel (of een zachte rand)
      const br = B.data[i], bg = B.data[i + 1], bb = B.data[i + 2];
      const lt = lum(tr * ta + br * (1 - ta), tg * ta + bg * (1 - ta), tb * ta + bb * (1 - ta)); const lb = lum(br, bg, bb);
      ratios.push((Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05));
    }
    ratios.sort((a, b) => a - b);
    if (ratios.length < 50) { uit.push(`${d.naam}: ONGELDIG (${ratios.length} letterpixels)`); rood++; continue; }
    const p1 = ratios[Math.floor(ratios.length * 0.01)]; const onder = ratios.filter((x) => x < d.eis).length / ratios.length;
    const fout = p1 < d.eis; if (fout) rood++;
    uit.push(`${d.naam}: ${p1.toFixed(2)}:1 (1e percentiel, ${ratios.length} px, ${(onder * 100).toFixed(1)}% onder ${d.eis})${fout ? ' FOUT' : ''}`);
  }
  console.log(`${w}px  ` + uit.join(' | '));
  await p.close();
}
await browser.close(); srv.close();
console.log(rood ? `ROOD: ${rood} meting(en) onder de eis` : 'GROEN: herokop >= 3:1 en hero-alinea >= 4,5:1 op elke breedte');
process.exit(rood ? 1 : 0);
