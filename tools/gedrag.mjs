// Gedragstests van de volledige site (eigen server op vrije poort, gedraagt zich als GitHub Pages onder /inzicht-bouw/).
// Gebruik (vanuit pixelperfect-photo-painter): node <pad>/tools/gedrag.mjs
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const puppeteer = createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json')('puppeteer-core');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const BASIS = '/inzicht-bouw/';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
let laatstePost = null;
const srv = http.createServer((q, r) => {
  if (q.method === 'POST' && q.url.startsWith('/test-endpoint')) {
    let body = ''; q.on('data', (d) => { body += d; }); q.on('end', () => { laatstePost = JSON.parse(body); r.writeHead(200, { 'content-type': 'application/json' }); r.end('{"ok":true}'); }); return;
  }
  let p = decodeURIComponent(q.url.split('?')[0]); if (!p.startsWith(BASIS)) { r.writeHead(404); r.end(); return; }
  p = p.slice(BASIS.length - 1); if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(ROOT, p), (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b); });
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const ORIGIN = `http://127.0.0.1:${srv.address().port}`; const BASE = ORIGIN + BASIS;
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
let pass = 0, fail = 0;
const t = (naam, ok, info = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${naam}${info ? '  ' + info : ''}`); };
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
const open = async (route, w = 1440, h = 900) => {
  const p = await browser.newPage();
  p.on('pageerror', (e) => t(`geen JS-fout op /${route}`, false, e.message));
  await p.setViewport({ width: w, height: h, isMobile: w < 600, hasTouch: w < 600 });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  return p;
};

/* 1. home desktop: tabs */
{
  const p = await open('');
  const zicht = () => p.evaluate(() => [...document.querySelectorAll('.paneel')].map((x) => !x.hidden));
  t('home: 6 dienstpanelen', (await zicht()).length === 6);
  t('home: start met paneel 1', JSON.stringify(await zicht()) === JSON.stringify([true, false, false, false, false, false]));
  await p.click('#tab-3');
  t('home: klik tab 3 toont paneel 3', JSON.stringify(await zicht()) === JSON.stringify([false, false, true, false, false, false]));
  await p.focus('#tab-3'); await p.keyboard.press('ArrowDown');
  t('home: pijltoets naar tab 4', (await p.$eval('#tab-4', (e) => e.getAttribute('aria-selected'))) === 'true');
  await p.keyboard.press('End');
  t('home: End naar tab 6', (await p.$eval('#tab-6', (e) => e.getAttribute('aria-selected'))) === 'true');
  // naar gsm en terug
  // zonder isMobile-wissel: puppeteer herlaadt de pagina bij een isMobile-wissel, een echte browser niet
  await p.setViewport({ width: 390, height: 844 }); await wacht(300);
  t('home gsm: alle panelen zichtbaar in de rail', JSON.stringify(await zicht()) === JSON.stringify([true, true, true, true, true, true]));
  t('home gsm: rail actief', await p.$eval('.podium__panelen', (e) => e.classList.contains('is-rail') && getComputedStyle(e).overflowX === 'auto'));
  await p.setViewport({ width: 1440, height: 900 }); await wacht(300);
  t('home terug desktop: alleen gekozen paneel', JSON.stringify(await zicht()) === JSON.stringify([false, false, false, false, false, true]));
  t('home terug desktop: rollen hersteld', await p.$$eval('.paneel', (ps) => ps.every((x) => x.getAttribute('role') === 'tabpanel')));
  // knop naar formulier
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.click('.hero__knoppen [data-naar-form]'); await wacht(500);
  const top = await p.$eval('#plaatsbezoek', (e) => Math.round(e.getBoundingClientRect().top));
  t('home: heroknop scrolt naar het formulier', top >= 0 && top < 200, `top ${top}`);
  t('home: focus in het formulier', await p.evaluate(() => !!document.activeElement.closest('#aanvraag-onder')));
  // uitklapmenu
  await p.evaluate(() => window.scrollTo(0, 1200)); await wacht(200);
  await p.click('.drop__knop'); await wacht(150);
  t('uitklapmenu opent met klik', await p.$eval('.drop__menu', (e) => getComputedStyle(e).visibility === 'visible'));
  t('uitklapmenu heeft 6 diensten', (await p.$$('.drop__menu a')).length === 6);
  await p.keyboard.press('Escape'); await wacht(150);
  t('uitklapmenu sluit met Escape', await p.$eval('.drop', (e) => !e.classList.contains('is-open')));
  await p.click('.drop__knop'); await p.mouse.click(700, 600); await wacht(150);
  t('uitklapmenu sluit bij klik ernaast', await p.$eval('.drop', (e) => !e.classList.contains('is-open')));
  // vragen
  const open1 = () => p.$$eval('#vragen .acc__item', (xs) => xs.map((x) => x.classList.contains('is-open') && !x.querySelector('.acc__antw').hidden));
  t('home: eerste vraag open', JSON.stringify(await open1()) === JSON.stringify([true, false, false, false, false]));
  await p.click('#hv-v2');
  t('home: klik vraag 3 → alleen 3 open', JSON.stringify(await open1()) === JSON.stringify([false, false, true, false, false]));
  await p.click('#hv-v2');
  t('home: nogmaals → alles dicht', JSON.stringify(await open1()) === JSON.stringify([false, false, false, false, false]));
  await p.close();
}

/* 2. home gsm: rail, menu, belknop */
{
  const p = await open('', 390, 844);
  const rail = await p.$eval('.podium__panelen', (e) => ({ rail: e.classList.contains('is-rail'), w: e.clientWidth, sw: e.scrollWidth }));
  t('gsm rail: breder dan scherm (swipebaar)', rail.rail && rail.sw > rail.w * 3, JSON.stringify(rail));
  t('gsm rail: vorige-knop uit aan het begin', await p.$eval('#diensten [data-vorige]', (b) => b.disabled));
  await p.evaluate(() => document.querySelector('#diensten').scrollIntoView());
  await p.click('#diensten [data-volgende]'); await wacht(400);
  const sl = await p.$eval('.podium__panelen', (e) => e.scrollLeft);
  t('gsm rail: volgende schuift één kaart', sl > 200, `scrollLeft ${sl}`);
  t('gsm rail: vorige-knop nu aan', await p.$eval('#diensten [data-vorige]', (b) => !b.disabled));
  t('gsm rail: voortgangsbalk beweegt', await p.$eval('#diensten .rail-balk__vul', (e) => e.style.transform !== 'translateX(0%)'));
  await p.evaluate(() => { const r = document.querySelector('.podium__panelen'); r.scrollLeft = r.scrollWidth; }); await wacht(300);
  t('gsm rail: volgende-knop uit aan het einde', await p.$eval('#diensten [data-volgende]', (b) => b.disabled));
  t('gsm tips: rail actief', await p.$eval('.tips__rij--rail', (e) => e.classList.contains('is-rail')));
  // menu
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.click('.burger'); await wacht(200);
  t('gsm menu opent', await p.$eval('#mobmenu', (e) => !e.hidden));
  t('gsm menu: body scrollt niet', await p.evaluate(() => document.body.classList.contains('menu-open')));
  await p.keyboard.press('Escape'); await wacht(100);
  t('gsm menu sluit met Escape', await p.$eval('#mobmenu', (e) => e.hidden));
  await p.click('.burger'); await p.click('#mobmenu a[href="vragen/"]').catch(() => {}); await wacht(300);
  // belknop
  const p2 = await open('over-ons/', 390, 844);
  await p2.evaluate(() => window.scrollTo(0, 1400)); await wacht(400);
  t('belknop zichtbaar midden op de pagina', await p2.$eval('.fab', (e) => getComputedStyle(e).display !== 'none' && !e.classList.contains('is-verborgen')));
  await p2.evaluate(() => document.querySelector('#plaatsbezoek').scrollIntoView()); await wacht(400);
  t('belknop weg bij het formulier', await p2.$eval('.fab', (e) => e.classList.contains('is-verborgen')));
  // aanraakdoelen + kleinste tekst op gsm
  for (const route of ['', 'diensten/', 'contact/', 'tips/aanbouw-vergunning/']) {
    const q = await open(route, 390, 844);
    const klein = await q.evaluate(() => [...document.querySelectorAll('a, button, input, select, textarea')].filter((e) => {
      const r = e.getBoundingClientRect(); if (!r.width || e.closest('[hidden], .mob, .skip, .sprong__lijst, .kruimel')) return false;
      const inTekst = e.tagName === 'A' && e.closest('p, li span, dd') && !e.classList.contains('knop');
      return !inTekst && r.height < 44;
    }).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}:${Math.round(e.getBoundingClientRect().height)}`));
    t(`aanraakdoelen >= 44px op /${route}`, klein.length === 0, klein.slice(0, 6).join(' | '));
    const minfont = await q.evaluate(() => { let m = 99, w = ''; document.querySelectorAll('body *').forEach((e) => { if (e.closest('svg, [hidden], .mob')) return; if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(e).fontSize); if (f < m) { m = f; w = e.className || e.tagName; } }); return m + ' ' + w; });
    t(`kleinste tekst >= 13px op /${route}`, parseFloat(minfont) >= 13, minfont);
    await q.close();
  }
  await p.close(); await p2.close();
}

/* 3. dienstenpagina: knop vult de dienst in, sprongbalk */
{
  const p = await open('diensten/');
  await p.click('#dakwerken [data-naar-form]'); await wacht(500);
  t('diensten: knop bij Dakwerken vult "Dakwerken" in', (await p.$eval('#aanvraag-onder-werk', (s) => s.value)) === 'Dakwerken');
  await p.evaluate(() => document.querySelector('#badkamer-en-wellness').scrollIntoView()); await wacht(400);
  t('diensten: sprongbalk markeert huidige dienst', (await p.$eval('.sprong__lijst a.is-actief', (a) => a.getAttribute('href')).catch(() => '')) === '#badkamer-en-wellness');
  await p.evaluate(() => document.querySelector('#plaatsbezoek').scrollIntoView()); await wacht(300);
  const sprongTop = await p.$eval('.sprong', (e) => e.getBoundingClientRect().bottom);
  t('diensten: sprongbalk niet meer zichtbaar boven het formulier', sprongTop <= 96, `onderkant ${Math.round(sprongTop)}`);
  await p.close();
}

/* 4. formulier: controle en verzending (endpoint-modus met testserver) */
{
  const p = await open('contact/', 390, 844);
  await p.click('#aanvraag-contact button[type=submit]'); await wacht(200);
  const fouten = await p.$$eval('#aanvraag-contact .veld__fout:not([hidden])', (xs) => xs.map((x) => x.id));
  t('formulier leeg: fouten bij naam, telefoon, werk', ['aanvraag-contact-naam-fout', 'aanvraag-contact-tel-fout', 'aanvraag-contact-werk-fout'].every((id) => fouten.includes(id)), fouten.join(','));
  t('formulier leeg: focus op naam', await p.evaluate(() => document.activeElement.id === 'aanvraag-contact-naam'));
  await p.type('#aanvraag-contact-naam', 'Test Persoon');
  t('fout verdwijnt bij typen', await p.$eval('#aanvraag-contact-naam-fout', (e) => e.hidden));
  await p.type('#aanvraag-contact-tel', '0470 12');
  await p.type('#aanvraag-contact-mail', 'fout@');
  await p.select('#aanvraag-contact-werk', 'Gevelrenovatie');
  await p.click('#aanvraag-contact button[type=submit]'); await wacht(200);
  t('te kort nummer geweigerd', await p.$eval('#aanvraag-contact-tel-fout', (e) => !e.hidden));
  t('fout e-mailadres geweigerd', await p.$eval('#aanvraag-contact-mail-fout', (e) => !e.hidden));
  await p.close();
  const q = await browser.newPage();
  await q.setViewport({ width: 1440, height: 900 });
  await q.evaluateOnNewDocument((u) => { document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') document.documentElement.setAttribute('data-form-endpoint', u); }); }, ORIGIN + '/test-endpoint');
  await q.goto(BASE + 'diensten/', { waitUntil: 'networkidle0' });
  await q.click('#gevelrenovatie [data-naar-form]'); await wacht(400);
  await q.type('#aanvraag-onder-naam', 'Test Persoon'); await q.type('#aanvraag-onder-tel', '0470 12 34 56'); await q.type('#aanvraag-onder-mail', 'test@voorbeeld.be');
  await q.type('#aanvraag-onder-gemeente', '1910 Kampenhout'); await q.type('#aanvraag-onder-project', 'Gevel van 80 m2');
  await q.click('#aanvraag-onder button[type=submit]'); await wacht(800);
  t('verzonden naar endpoint', !!laatstePost, laatstePost ? JSON.stringify(laatstePost).slice(0, 160) : 'niets ontvangen');
  t('payload bevat dienst uit de knop', laatstePost && laatstePost.werk === 'Gevelrenovatie');
  t('na verzenden bevestiging zichtbaar', await q.$eval('#aanvraag-onder [data-stap="klaar"]', (e) => !e.hidden));
  t('bevestiging zegt bedankt (endpoint-modus)', (await q.$eval('#aanvraag-onder [data-klaar-kop]', (e) => e.textContent)) === 'Bedankt voor uw aanvraag');
  await q.close();
}

/* 5. contrast van de belangrijkste tekst op elke pagina (achtergrondkleur van het element of een ouder) */
for (const route of ['', 'diensten/', 'over-ons/', 'vragen/', 'tips/', 'tips/aanbouw-vergunning/', 'contact/', 'privacy/']) {
  const p = await open(route);
  const fouten = await p.evaluate(() => {
    const L = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return [0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]), m[3] === undefined ? 1 : m[3]]; };
    const bg = (e) => { while (e) { const b = getComputedStyle(e).backgroundColor; const a = (b.match(/[\d.]+/g) || [])[3]; if (b !== 'rgba(0, 0, 0, 0)' && (a === undefined || Number(a) > 0.6)) return b; if (e.classList && (e.classList.contains('hero') || e.classList.contains('phero__beeld'))) return null; e = e.parentElement; } return 'rgb(255, 255, 255)'; };
    const uit = [];
    document.querySelectorAll('h1, h2, h3, p, li, a, button, label, dt, dd, span').forEach((e) => {
      // menu boven de herofoto: gemeten op echte pixels in tools/nav-contrast.mjs
      if (e.closest('[hidden], .mob, svg, .hero, .skip') || !e.offsetParent || (document.body.classList.contains('is-home') && e.closest('.nav') && !e.closest('.nav.is-gescrold'))) return;
      if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
      const cs = getComputedStyle(e); const b = bg(e); if (!b) return;
      const [lf, af] = L(cs.color); const [lb] = L(b);
      let lfx = lf; if (af < 1) { const m = cs.color.match(/[\d.]+/g).map(Number), n = b.match(/[\d.]+/g).map(Number); lfx = L(`rgb(${m.slice(0, 3).map((v, i) => Math.round(v * af + n[i] * (1 - af))).join(',')})`)[0]; }
      const r = (Math.max(lfx, lb) + 0.05) / (Math.min(lfx, lb) + 0.05);
      const groot = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
      if (r < (groot ? 3 : 4.5)) uit.push(`${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} ${r.toFixed(2)}:1 "${e.textContent.trim().slice(0, 30)}"`);
    });
    return [...new Set(uit)];
  });
  t(`contrast AA op /${route}`, fouten.length === 0, fouten.slice(0, 5).join(' | '));
  await p.close();
}

await browser.close(); srv.close();
console.log(`\n${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
