// Gedragstests van de volledige site (eigen server op vrije poort, gedraagt zich als GitHub Pages onder /inzicht-bouw/).
// Gebruik (vanuit pixelperfect-photo-painter): node <pad>/tools/gedrag.mjs
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const puppeteer = createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json')('puppeteer-core');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const BASIS = '/inzicht-bouw/';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
let laatstePost = null; let aantalPosts = 0;
const srv = http.createServer((q, r) => {
  if (q.method === 'POST' && q.url.startsWith('/test-endpoint')) {
    // antwoord pas na 400 ms, zodat een tweede verzending tijdens het wachten getest kan worden
    let body = ''; q.on('data', (d) => { body += d; }); q.on('end', () => { aantalPosts++; laatstePost = JSON.parse(body); setTimeout(() => { r.writeHead(200, { 'content-type': 'application/json' }); r.end('{"ok":true}'); }, 400); }); return;
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
  t('home: tablist staat vóór de panelen en is verticaal', await p.evaluate(() => { const tl = document.querySelector('.tabs'); const pn = document.querySelector('.podium__panelen'); return !!(tl.compareDocumentPosition(pn) & Node.DOCUMENT_POSITION_FOLLOWING) && tl.getAttribute('aria-orientation') === 'vertical'; }));
  t('home: tabs staan op het scherm rechts van de panelen', await p.evaluate(() => document.querySelector('.tabs').getBoundingClientRect().left > document.querySelector('.podium__panelen').getBoundingClientRect().right));
  await p.hover('#tab-2'); await wacht(300);
  t('home: dienstnaam verschijnt bij muis op een tab', await p.$eval('#tab-2 .tab__naam', (e) => getComputedStyle(e).opacity === '1'));
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
  t('home gsm: panelen zijn groepen met een naam', await p.$$eval('.paneel', (ps) => ps.every((x) => x.getAttribute('role') === 'group' && !!x.getAttribute('aria-labelledby'))));
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
  await p.keyboard.press('Escape'); await wacht(350);
  t('uitklapmenu sluit met Escape (ook zichtbaar dicht, muis staat er nog op)', (await p.$eval('.drop__menu', (e) => getComputedStyle(e).visibility === 'hidden')) && (await p.evaluate(() => document.activeElement.classList.contains('drop__knop'))));
  await p.click('.drop__knop'); await p.mouse.click(700, 600); await wacht(350);
  t('uitklapmenu sluit bij klik ernaast', await p.$eval('.drop__menu', (e) => getComputedStyle(e).visibility === 'hidden'));
  await p.focus('.drop__link'); await wacht(350);
  t('uitklapmenu blijft dicht als alleen de link Diensten focus krijgt', (await p.$eval('.drop__menu', (e) => getComputedStyle(e).visibility === 'hidden')) && (await p.$eval('.drop__knop', (b) => b.getAttribute('aria-expanded'))) === 'false');
  await p.hover('.drop__link'); await wacht(350);
  t('uitklapmenu opent bij muis erover', await p.$eval('.drop__menu', (e) => getComputedStyle(e).visibility === 'visible'));
  await p.mouse.move(700, 700); await wacht(350);
  t('uitklapmenu sluit als de muis weggaat', await p.$eval('.drop__menu', (e) => getComputedStyle(e).visibility === 'hidden'));
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
  t('gsm rail: vorige-knop uit aan het begin', await p.$eval('#diensten [data-vorige]', (b) => b.getAttribute('aria-disabled') === 'true'));
  await p.evaluate(() => document.querySelector('#diensten').scrollIntoView());
  await p.click('#diensten [data-volgende]'); await wacht(400);
  const sl = await p.$eval('.podium__panelen', (e) => e.scrollLeft);
  t('gsm rail: volgende schuift één kaart', sl > 200, `scrollLeft ${sl}`);
  t('gsm rail: vorige-knop nu aan', await p.$eval('#diensten [data-vorige]', (b) => b.getAttribute('aria-disabled') === 'false'));
  t('gsm rail: voortgangsbalk beweegt', await p.$eval('#diensten .rail-balk__vul', (e) => e.style.transform !== 'translateX(0%)'));
  await p.evaluate(() => { const r = document.querySelector('.podium__panelen'); r.scrollLeft = r.scrollWidth; }); await wacht(300);
  t('gsm rail: volgende-knop uit aan het einde', await p.$eval('#diensten [data-volgende]', (b) => b.getAttribute('aria-disabled') === 'true'));
  await p.focus('#diensten [data-volgende]'); await p.keyboard.press('Enter'); await wacht(200);
  t('gsm rail: focus blijft op de knop aan het einde', await p.evaluate(() => document.activeElement.matches('#diensten [data-volgende]')));
  const kaartH = await p.$$eval('.podium__panelen .paneel__kern', (ks) => ks.map((k) => Math.round(k.getBoundingClientRect().bottom - k.closest('.paneel').getBoundingClientRect().top)));
  t('gsm rail: alle dienstkaarten even hoog', new Set(kaartH).size === 1, kaartH.join(','));
  t('home: volgorde hero, inleiding, diensten, werf, vragen, plaatsbezoek', (await p.$$eval('main > section', (ss) => ss.map((s) => s.id || s.className.split(' ')[0]).join(','))) === 'hero,over,diensten,waarom,vragen,plaatsbezoek');
  // menu
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.click('.burger'); await wacht(200);
  t('gsm menu opent', await p.$eval('#mobmenu', (e) => !e.hidden));
  t('gsm menu: body scrollt niet', await p.evaluate(() => document.body.classList.contains('menu-open')));
  t('gsm menu: pagina onder het menu is onbereikbaar (inert)', await p.evaluate(() => document.querySelector('main').inert === true && document.querySelector('.voet').inert === true));
  t('gsm menu: ronde belknop zit in de voet en is dus mee inert', await p.evaluate(() => !!document.querySelector('.fab').closest('.voet')));
  await p.keyboard.press('Escape'); await wacht(100);
  t('gsm menu sluit met Escape', await p.$eval('#mobmenu', (e) => e.hidden));
  t('gsm menu dicht: pagina weer bereikbaar', await p.evaluate(() => document.querySelector('main').inert === false));
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
  // eerst leeg verzenden (fout bij 'werk'), dan de knop bij Dakwerken: de fout moet weg zijn
  await p.evaluate(() => document.querySelector('#aanvraag-onder button[type=submit]').click()); await wacht(200);
  await p.click('#dakwerken [data-naar-form]'); await wacht(500);
  t('diensten: knop bij Dakwerken vult "Dakwerken" in', (await p.$eval('#aanvraag-onder-werk', (s) => s.value)) === 'Dakwerken');
  t('diensten: foutmelding bij "werk" verdwijnt na invullen via de knop', await p.$eval('#aanvraag-onder-werk-fout', (e) => e.hidden));
  await p.evaluate(() => document.querySelector('#badkamer-en-wellness').scrollIntoView()); await wacht(400);
  t('diensten: sprongbalk markeert huidige dienst', (await p.$eval('.sprong__lijst a.is-actief', (a) => a.getAttribute('href')).catch(() => '')) === '#badkamer-en-wellness');
  await p.evaluate(() => document.querySelector('#plaatsbezoek').scrollIntoView()); await wacht(300);
  const sprongTop = await p.$eval('.sprong', (e) => e.getBoundingClientRect().bottom);
  t('diensten: sprongbalk niet meer zichtbaar boven het formulier', sprongTop <= 96, `onderkant ${Math.round(sprongTop)}`);
  await p.close();
  for (const [w, h] of [[1440, 900], [1024, 768], [390, 844]]) {
    const q = await open('diensten/', w, h);
    await q.evaluate(() => document.querySelector('.sprong__lijst a[href="#gevelrenovatie"]').click()); await wacht(500);
    const m = await q.evaluate(() => ({ rij: Math.round(document.querySelector('#gevelrenovatie').getBoundingClientRect().top), balk: Math.round(document.querySelector('.sprong').getBoundingClientRect().bottom) }));
    t(`diensten @${w}: sprong naar een dienst landt onder de sprongbalk`, m.rij >= m.balk, JSON.stringify(m));
    const lijst = await q.$eval('.sprong__lijst', (l) => ({ sw: l.scrollWidth, cw: l.clientWidth }));
    if (w > 1000) t(`diensten @${w}: alle zes sprongknoppen passen in de balk`, lijst.sw <= lijst.cw, JSON.stringify(lijst));
    await q.close();
  }
}

/* 4. formulier: controle en verzending (endpoint-modus met testserver) */
{
  const p = await open('contact/', 390, 844);
  await p.click('#aanvraag-contact button[type=submit]'); await wacht(200);
  const fouten = await p.$$eval('#aanvraag-contact .veld__fout:not([hidden])', (xs) => xs.map((x) => x.id));
  t('formulier leeg: fouten bij naam, telefoon, werk', ['aanvraag-contact-naam-fout', 'aanvraag-contact-tel-fout', 'aanvraag-contact-werk-fout'].every((id) => fouten.includes(id)), fouten.join(','));
  t('formulier leeg: focus op naam', await p.evaluate(() => document.activeElement.id === 'aanvraag-contact-naam'));
  t('formulier leeg: melding bij de knop', await p.$eval('#aanvraag-contact .aanvraag__fout', (e) => !e.hidden && e.textContent.trim().length > 10));
  t('formulier leeg: eerste fout staat in beeld (gsm)', await p.$eval('#aanvraag-contact-naam', (e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }));
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
  await q.click('#gevelrenovatie [data-naar-form]');
  // typ meteen in een ander veld: de uitgestelde focus mag de cursor niet meer wegtrekken
  await q.click('#aanvraag-onder-tel'); await q.type('#aanvraag-onder-tel', '0470 12 34 56'); await wacht(900);
  t('uitgestelde focus trekt de cursor niet weg', (await q.$eval('#aanvraag-onder-tel', (e) => e.value)) === '0470 12 34 56' && (await q.evaluate(() => document.activeElement.id)) === 'aanvraag-onder-tel');
  await q.type('#aanvraag-onder-naam', 'Test Persoon'); await q.type('#aanvraag-onder-mail', 'test@voorbeeld.be');
  await q.type('#aanvraag-onder-project', 'Gevel van 80 m2'); await q.type('#aanvraag-onder-gemeente', '1910 Kampenhout');
  // twee keer Enter kort na elkaar: de tweede verzending tijdens het wachten mag geen tweede aanvraag geven
  await q.focus('#aanvraag-onder-gemeente'); await q.keyboard.press('Enter'); await wacht(60); await q.keyboard.press('Enter');
  for (let i = 0; i < 100 && !laatstePost; i++) await wacht(100);
  await q.waitForFunction(() => !document.querySelector('#aanvraag-onder [data-stap="klaar"]').hidden, { timeout: 10000 }).catch(() => {});
  await wacht(600);
  t('dubbele verzending geeft één aanvraag', aantalPosts === 1, `${aantalPosts} POST(s)`);
  t('endpoint-modus: geen uitwegregel en geen terugknop', (await q.$eval('#aanvraag-onder .aanvraag__uitweg', (e) => e.hidden)) && (await q.$eval('#aanvraag-onder [data-terug]', (e) => e.closest('[hidden]') !== null && e.offsetParent === null)));
  t('verzonden naar endpoint', !!laatstePost, laatstePost ? JSON.stringify(laatstePost).slice(0, 160) : 'niets ontvangen');
  t('payload bevat dienst uit de knop', laatstePost && laatstePost.werk === 'Gevelrenovatie');
  t('na verzenden bevestiging zichtbaar', await q.$eval('#aanvraag-onder [data-stap="klaar"]', (e) => !e.hidden));
  t('bevestiging zegt bedankt (endpoint-modus)', (await q.$eval('#aanvraag-onder [data-klaar-kop]', (e) => e.textContent)) === 'Bedankt voor uw aanvraag');
  await q.close();
  // e-mailmodus: na Verzenden kan de bezoeker terug naar zijn ingevulde aanvraag
  const m = await open('contact/');
  await m.type('#aanvraag-contact-naam', 'Test Persoon'); await m.type('#aanvraag-contact-tel', '0470 12 34 56'); await m.select('#aanvraag-contact-werk', 'Dakwerken');
  await m.click('#aanvraag-contact button[type=submit]'); await wacht(400);
  t('e-mailmodus: bevestiging met terugknop', await m.$eval('#aanvraag-contact [data-terug]', (e) => getComputedStyle(e).display !== 'none' && !e.closest('[hidden]')));
  await browser.defaultBrowserContext().overridePermissions(ORIGIN, ['clipboard-read', 'clipboard-write']); await m.bringToFront();
  await m.click('#aanvraag-contact [data-kopieer]'); await wacht(300);
  const gekopieerd = await m.evaluate(() => navigator.clipboard.readText()).catch((e) => 'FOUT ' + e.message);
  t('e-mailmodus: kopieerknop zet de volledige aanvraag klaar', /Aan: inzicht\.bouw@gmail\.com/.test(gekopieerd) && /Naam: Test Persoon/.test(gekopieerd) && /Werk: Dakwerken/.test(gekopieerd), gekopieerd.slice(0, 80).replace(/\n/g, ' | '));
  await m.click('#aanvraag-contact [data-terug]'); await wacht(300);
  t('e-mailmodus: terug naar de ingevulde aanvraag', await m.$eval('#aanvraag-contact-naam', (e) => e.value === 'Test Persoon' && e.offsetParent !== null));
  await m.close();
}

/* 4b. één belknop per schermformaat in het eerste scherm (vanaf 1001 px precies één: het nummer in de balk) */
for (const [w, h] of [[390, 844], [768, 1024], [1024, 768], [1440, 900]]) {
  for (const route of ['', 'diensten/', 'over-ons/', 'contact/', 'tips/']) {
    const p = await open(route, w, h); await wacht(500);
    const n = await p.evaluate(() => [...document.querySelectorAll('a[href^="tel:"]')].filter((a) => {
      if (a.closest('.mob, [hidden]') || !a.matches('.knop, .fab, .nav__tel')) return false;
      const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.5) return false;
      const r = a.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
    }).length);
    t(`belknoppen in het eerste scherm op /${route} @${w}: ${n}`, w > 1000 ? n === 1 : n <= 1);
    await p.close();
  }
}

/* 4c. foutpagina: geen canonical en geen og:url, wel noindex */
{
  const html404 = fs.readFileSync(path.join(ROOT, '404.html'), 'utf8');
  t('404: geen canonical en geen og:url, wel noindex', !/rel="canonical"/.test(html404) && !/og:url/.test(html404) && /noindex/.test(html404));
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
