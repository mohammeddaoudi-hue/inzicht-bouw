// Maakt een keuringsset schermafdrukken: elke pagina op meerdere breedtes, opgeknipt in stukken
// van één schermhoogte, plus interactietoestanden. Schrijft index.json met alle bestanden.
// Gebruik (vanuit pixelperfect-photo-painter): node <pad>/tools/shots.mjs <uitvoermap>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const rq = createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json');
const puppeteer = rq('puppeteer-core'); const sharp = rq('sharp');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['', 'diensten/', 'over-ons/', 'vragen/', 'tips/', 'tips/badkamerrenovatie-waarde-woning/', 'tips/aanbouw-vergunning/', 'tips/renovatiepremies-dak-gevel/', 'contact/', 'privacy/', 'bestaat-niet/'];
const BREEDTES = [[1440, 900], [1024, 768], [768, 1024], [390, 844]];
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const BASIS = '/inzicht-bouw/';
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0].split('#')[0]);
  if (!p.startsWith(BASIS)) { r.writeHead(404); r.end(); return; }
  p = p.slice(BASIS.length - 1); if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(ROOT, p), (e, b) => {
    if (e) { fs.readFile(path.join(ROOT, '404.html'), (e2, b2) => { r.writeHead(404, { 'content-type': types['.html'] }); r.end(b2); }); return; }
    r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b);
  });
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${srv.address().port}${BASIS}`;
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const index = { paginas: {}, toestanden: [] };
const klaarZetten = async (p) => {
  await p.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; });
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); }
    window.scrollTo(0, 0);
    document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-zichtbaar'));
    await Promise.all([...document.images].map((i) => (i.complete && i.naturalWidth ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = () => r(); }))));
  });
  await new Promise((r) => setTimeout(r, 250));
};
const naamVan = (route) => (route || 'home').replace(/\/$/, '').replace(/\//g, '__');
for (const route of ROUTES) {
  for (const [w, h] of BREEDTES) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h, isMobile: w < 600, hasTouch: w < 600, deviceScaleFactor: 1 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); // scrollen zonder animatie: elk beeld is af
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await klaarZetten(p);
    const buf = await p.screenshot({ fullPage: true });
    const meta = await sharp(buf).metadata();
    const stukken = [];
    for (let y = 0, i = 0; y < meta.height; y += h, i++) {
      const hh = Math.min(h, meta.height - y);
      const f = `${naamVan(route)}-${w}-${String(i).padStart(2, '0')}.png`;
      await sharp(buf).extract({ left: 0, top: y, width: meta.width, height: hh }).toFile(path.join(OUT, f));
      stukken.push(f);
    }
    (index.paginas[naamVan(route)] ??= {})[w] = stukken;
    await p.close();
  }
}
// interactietoestanden
const toestand = async (naam, route, [w, h], doe, uitleg) => {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h, isMobile: w < 600, hasTouch: w < 600 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await klaarZetten(p);
  await doe(p);
  await new Promise((r) => setTimeout(r, 700));
  const f = `toestand-${naam}.png`;
  await p.screenshot({ path: path.join(OUT, f) });
  index.toestanden.push({ bestand: f, route, breedte: w, uitleg });
  await p.close();
};
await toestand('mobiel-menu-open', '', [390, 844], (p) => p.click('.burger'), 'gsm: hamburger aangeklikt, menu vol scherm');
await toestand('home-gescrold-balk', '', [1440, 900], (p) => p.evaluate(() => window.scrollTo(0, 1300)), 'desktop home: balk na scrollen (wit, zwart logo)');
await toestand('uitklapmenu-diensten', 'over-ons/', [1440, 900], (p) => p.click('.drop__knop'), 'desktop: uitklapmenu Diensten open');
await toestand('home-tab-4', '', [1440, 900], async (p) => { await p.evaluate(() => document.querySelector('#diensten').scrollIntoView()); await p.click('#tab-4'); }, 'desktop home: dienst 04 gekozen in de tabs');
await toestand('home-rail-gsm', '', [390, 844], async (p) => { await p.evaluate(() => { const r = document.querySelector('.podium__panelen'); r.scrollIntoView({ block: 'center' }); r.scrollBy({ left: 700 }); }); }, 'gsm home: dienstenrail 2 kaarten verder geschoven');
await toestand('form-fouten-desktop', '', [1440, 900], async (p) => { await p.evaluate(() => document.querySelector('#plaatsbezoek').scrollIntoView()); await p.click('#aanvraag-onder button[type=submit]'); }, 'desktop: formulier leeg verzonden, foutmeldingen');
await toestand('form-fouten-gsm', 'contact/', [390, 844], async (p) => { await p.evaluate(() => document.querySelector('#aanvraag-contact').scrollIntoView()); await p.type('#aanvraag-contact-mail', 'fout@'); await p.click('#aanvraag-contact button[type=submit]'); }, 'gsm contact: fout e-mailadres en lege velden verzonden');
await toestand('form-klaar', 'diensten/', [1440, 900], async (p) => {
  await p.evaluate(() => document.querySelector('#plaatsbezoek').scrollIntoView());
  await p.type('#aanvraag-onder-naam', 'Test Persoon'); await p.type('#aanvraag-onder-tel', '0470 12 34 56'); await p.select('#aanvraag-onder-werk', 'Dakwerken');
  await p.click('#aanvraag-onder button[type=submit]');
}, 'desktop: ingevuld formulier verzonden (zonder koppeling: e-mail staat klaar)');
await toestand('sprong-gescrold', 'diensten/', [1440, 900], (p) => p.evaluate(() => document.querySelector('#gevelrenovatie').scrollIntoView()), 'desktop diensten: sprongbalk vast bovenaan bij dienst 04');
await toestand('fab-gsm', 'over-ons/', [390, 844], (p) => p.evaluate(() => window.scrollTo(0, 1400)), 'gsm: ronde belknop rechtsonder tijdens het scrollen');
await toestand('vraag-3-open', 'vragen/', [390, 844], (p) => p.click('#vp-v2'), 'gsm vragen: derde vraag open');
await browser.close(); srv.close();
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));
console.log('pagina-stukken:', Object.values(index.paginas).reduce((n, b) => n + Object.values(b).reduce((m, s) => m + s.length, 0), 0), '| toestanden:', index.toestanden.length);
