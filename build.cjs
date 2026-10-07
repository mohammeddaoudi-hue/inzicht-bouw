/* Bouwt alle pagina's van de INzicht-site uit bouw/inhoud.cjs.
   Gebruik: node build.cjs
   Links zijn relatief (werkt op localhost, GitHub Pages in een submap en op een eigen domein);
   alleen 404.html gebruikt absolute paden, afgeleid van SITE.url (die pagina wordt op elk pad getoond). */
const fs = require('fs');
const path = require('path');
const I = require('./bouw/inhoud.cjs');
const { SITE, NAV, FOOTER_MENU, HOME, DIENSTEN_PAGINA, DIENSTEN, FORM_DIENSTEN, OVER, VRAGEN, TIPS, BLOGS, CONTACT, FORM, PRIVACY } = I;

const ROOT = __dirname;
const VERSIE = Date.now().toString(36);

/* ── hulpjes ──────────────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = esc;
/* relatief pad van pagina-map "van" ('' of 'tips/x/') naar "naar" ('' of 'contact/' of 'img/a.jpg') */
let BASIS_ABS = null; // gezet voor 404.html
const rel = (van, naar) => {
  if (BASIS_ABS) return BASIS_ABS + naar;
  const diepte = van.split('/').filter(Boolean).length;
  const op = '../'.repeat(diepte);
  const r = op + naar;
  return r === '' ? './' : r;
};
const kop2 = (delen, klasse) => `${esc(delen[0])} <span class="${klasse}">${esc(delen[1])}</span>`;
/* adres met postcode en gemeente samen op één regel */
const adresHtml = () => `${esc(SITE.adres.straat)}, <span class="nw">${esc(SITE.adres.postcode)} ${esc(SITE.adres.gemeente)}</span>`;
/* harde spatie in datum, bedrag, categorie en oppervlakte, zodat die niet over twee regels breken */
const MAANDEN = 'januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december';
const nb = (s) => esc(s)
  .replace(new RegExp(`(\\d{1,2}) (${MAANDEN}) (\\d{4})`, 'g'), '$1 $2 $3')
  .replace(/(\d) (euro)/g, '$1 $2')
  .replace(/(categorie) (\d)/g, '$1 $2')
  .replace(/(\d) (vierkante meter)/g, '$1 $2');

/* <picture> met webp + jpg, 800, 1200 en 1600 breed (4:3); sizes = echte weergavebreedte per plek */
function pic(van, naam, alt, { sizes = '(max-width: 1000px) 100vw, 50vw', eager = false, lui = true, klasse = '' } = {}) {
  const s = (ext) => [800, 1200, 1600].map((w) => `${rel(van, `img/${naam}-${w}.${ext}`)} ${w}w`).join(', ');
  return `<picture${klasse ? ` class="${klasse}"` : ''}>
        <source type="image/webp" srcset="${s('webp')}" sizes="${sizes}">
        <img src="${rel(van, `img/${naam}-800.jpg`)}" srcset="${s('jpg')}" sizes="${sizes}" width="1600" height="1200" alt="${attr(alt)}"${eager ? ' fetchpriority="high"' : lui ? ' loading="lazy"' : ''} decoding="async">
      </picture>`;
}

/* ── iconen ───────────────────────────────────────────────────────────── */
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <symbol id="i-chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-terug" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-vink" viewBox="0 0 24 24"><path d="m5 12.5 4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m3 6 9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
    <symbol id="i-klok" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
    <symbol id="i-tag" viewBox="0 0 24 24"><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/></symbol>
    <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 11v6M12 7.5v.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
    <symbol id="i-plan" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 27V6a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v21Z"/><path d="M5 13h9v9M14 5v4M19 13h8M19 13v6"/><path d="M9 27v-2M13 27v-2M17 27v-2M21 27v-2"/></g></symbol>
    <symbol id="i-helm" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/></g></symbol>
    <symbol id="i-verslag" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h11l6 6v17a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M19 4v6h6M11 16h10M11 20h10M11 24h6"/></g></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
  </defs>
</svg>`;
const ic = (id, w = 18) => `<svg width="${w}" height="${w}" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;
const knopIc = (id = 'chev') => `<span class="knop__ic">${ic(id, 16)}</span>`;

/* ── schema.org ───────────────────────────────────────────────────────── */
function schemaBedrijf() {
  return {
    '@context': 'https://schema.org', '@type': 'GeneralContractor', name: SITE.volledig,
    url: SITE.url + '/', image: SITE.url + '/img/og.jpg', logo: SITE.url + '/img/logo-ink.png',
    telephone: '+32468359093', email: SITE.mail,
    address: { '@type': 'PostalAddress', streetAddress: SITE.adres.straat, postalCode: SITE.adres.postcode, addressLocality: SITE.adres.gemeente, addressCountry: 'BE' },
    openingHoursSpecification: SITE.urenSchema.map((u) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: u.dagen, opens: u.open, closes: u.dicht })),
    areaServed: 'Kampenhout en omgeving',
  };
}
function schemaKruimel(kruimel) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: kruimel.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: k.label, item: SITE.url + '/' + k.pad })) };
}

/* ── kop van de pagina ────────────────────────────────────────────────── */
function head(p) {
  const canon = SITE.url + '/' + p.pad;
  const og = SITE.url + '/img/og.jpg';
  const schemas = [p.home ? schemaBedrijf() : null, p.kruimel ? schemaKruimel(p.kruimel) : null, p.faq ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.v, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null, p.artikel ? {
    '@context': 'https://schema.org', '@type': 'Article', headline: p.artikel.titel, inLanguage: 'nl-BE',
    image: SITE.url + '/img/' + p.artikel.img + '-1600.jpg', datePublished: p.artikel.datum, dateModified: p.artikel.datum,
    author: { '@type': 'Organization', name: SITE.volledig, url: SITE.url + '/' },
    publisher: { '@type': 'Organization', name: SITE.volledig, logo: { '@type': 'ImageObject', url: SITE.url + '/img/logo-ink.png' } },
    mainEntityOfPage: canon,
  } : null].filter(Boolean);
  const v = p.pad;
  return `<!doctype html>
<html lang="nl-BE" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.titel)}</title>
<meta name="description" content="${attr(p.beschrijving)}">
${SITE.noindex || p.fout ? '<meta name="robots" content="noindex, nofollow">\n' : ''}${p.fout ? '' : `<link rel="canonical" href="${attr(canon)}">`}
<meta name="theme-color" content="#0b0b0b">
<meta property="og:type" content="${p.artikel ? 'article' : 'website'}">
<meta property="og:locale" content="nl_BE">
<meta property="og:site_name" content="${attr(SITE.volledig)}">
<meta property="og:title" content="${attr(p.ogTitel || p.titel)}">
<meta property="og:description" content="${attr(p.beschrijving)}">
${p.fout ? '' : `<meta property="og:url" content="${attr(canon)}">`}
<meta property="og:image" content="${attr(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Logo van INzicht bouw en renovatie op een foto van een gerenoveerde woning">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${rel(v, 'img/favicon.png')}" type="image/png">
<link rel="apple-touch-icon" href="${rel(v, 'img/apple-touch-icon.png')}">
<link rel="preload" href="${rel(v, 'fonts/pjs-latin.woff2')}" as="font" type="font/woff2" crossorigin>
${p.preload || ''}<link rel="stylesheet" href="${rel(v, 'styles.css')}?v=${VERSIE}">
<script>document.documentElement.className='js';setTimeout(function(){if(!window.__inzicht)document.documentElement.classList.add('reveal-klaar')},1500)</script>
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>`;
}

/* ── balk bovenaan ────────────────────────────────────────────────────── */
function header(v, actief, anker = '#plaatsbezoek', home = false) {
  const link = (n) => {
    const huidig = actief === n.pad ? ' aria-current="page"' : '';
    if (n.pad === 'diensten/') {
      return `<div class="drop">
        <a href="${rel(v, n.pad)}" class="drop__link"${huidig}>${esc(n.label)}</a>
        <button class="drop__knop" type="button" aria-expanded="false" aria-controls="drop-diensten" aria-label="Diensten tonen">${ic('down', 16)}</button>
        <div class="drop__menu" id="drop-diensten">
          <ul>
            ${DIENSTEN.map((d) => `<li><a href="${rel(v, 'diensten/')}#${d.slug}"><span class="drop__nr">${d.nr}</span>${esc(d.kortNaam)}</a></li>`).join('\n            ')}
          </ul>
        </div>
      </div>`;
    }
    return `<a href="${rel(v, n.pad)}"${huidig}>${esc(n.label)}</a>`;
  };
  return `<a class="skip" href="#inhoud">Naar de inhoud</a>
<header class="nav" id="top">
  <div class="wrap nav__in">
    <a class="nav__logo" href="${rel(v, '')}" aria-label="${attr(SITE.volledig)}, naar de homepage">
      ${home ? `<img class="nav__logo-wit" src="${rel(v, 'img/logo-wit.png')}" width="227" height="140" alt="">\n      ` : ''}<img class="nav__logo-ink" src="${rel(v, 'img/logo-ink.png')}" width="227" height="140" alt="">
    </a>
    <nav class="nav__links" aria-label="Hoofdmenu">
      ${NAV.map(link).join('\n      ')}
    </nav>
    <div class="nav__acties">
      <a class="nav__tel" href="${SITE.tel.href}">${ic('phone')}${esc(SITE.tel.toon)}</a>
      <a class="knop knop--accent knop--klein" href="${anker}" data-naar-form>${esc(I.KNOP.plaatsbezoek)}${knopIc()}</a>
      <button class="burger" type="button" aria-label="Menu openen" aria-expanded="false" aria-controls="mobmenu"><span class="burger__lijn"></span><span class="burger__lijn"></span></button>
    </div>
  </div>
</header>
<div class="mob" id="mobmenu" hidden>
  <nav class="mob__links" aria-label="Mobiel menu">
    ${NAV.map((n) => `<a href="${rel(v, n.pad)}"${actief === n.pad ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n    ')}
  </nav>
  <div class="mob__cta">
    <a class="knop knop--accent knop--vol" href="${anker}" data-naar-form>${esc(I.KNOP.plaatsbezoek)}${knopIc()}</a>
    <a class="knop knop--rand-wit knop--vol" href="${SITE.tel.href}">${ic('phone')}${esc(SITE.tel.toon)}</a>
  </div>
</div>`;
}

/* ── voet ─────────────────────────────────────────────────────────────── */
function footer(v) {
  return `<footer class="voet">
  <div class="wrap">
    <div class="voet__grid">
      <div class="voet__kaart voet__merk">
        <img class="voet__logo" src="${rel(v, 'img/logo-ink.png')}" width="227" height="140" alt="${attr(SITE.volledig)}" loading="lazy">
        <p class="voet__naam">${esc(SITE.volledig)}</p>
        <ul class="voet__contact">
          <li>${ic('pin', 20)}<span>${adresHtml()}</span></li>
          <li>${ic('phone', 20)}<a href="${SITE.tel.href}">${esc(SITE.tel.toon)}</a></li>
          <li>${ic('mail', 20)}<a href="mailto:${SITE.mail}">${esc(SITE.mail)}</a></li>
        </ul>
      </div>
      <div class="voet__kaart voet__kolommen">
        <div>
          <h2 class="voet__kop">Menu</h2>
          <ul class="voet__lijst">
            ${FOOTER_MENU.map((n) => `<li><a href="${rel(v, n.pad)}">${esc(n.label)}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div>
          <h2 class="voet__kop">Diensten</h2>
          <ul class="voet__lijst">
            ${DIENSTEN.map((d) => `<li><a href="${rel(v, 'diensten/')}#${d.slug}">${esc(d.kortNaam)}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div>
          <h2 class="voet__kop">Openingsuren</h2>
          <dl class="voet__uren">
            ${SITE.uren.map(([d, u]) => `<div><dt>${esc(d)}</dt><dd>${esc(u)}</dd></div>`).join('\n            ')}
          </dl>
        </div>
      </div>
    </div>
    <div class="voet__onder">
      <p>${esc(SITE.copyright)}</p>
      <a href="${rel(v, 'privacy/')}">Privacybeleid</a>
    </div>
  </div>
  <a class="fab" href="${SITE.tel.href}" aria-label="Bel ${attr(SITE.tel.toon)}">${ic('phone', 24)}</a>
</footer>`;
}

/* ── formulier (onderaan elke pagina + contactpagina), vragen zoals op abgroep;
      variant 'diensten': velden uit zijn dienstencopy van 7 okt 2026 (e-mail en werfgemeente verplicht, type project vrij, upload) ── */
function formulier(v, id, { kop = true, kopId = '', sub = true, knop = FORM.knop, variant = 'standaard' } = {}) {
  const D = variant === 'diensten';
  const F = D ? FORM_DIENSTEN.velden : FORM.velden;
  const ster = '<span class="ster" aria-hidden="true">*</span>';
  const veld = (naam, label, type, auto, { verplicht = false, extra = '' } = {}) => `<div class="veld">
            <label for="${id}-${naam}">${esc(label)}${verplicht ? ster : ''}</label>
            <input id="${id}-${naam}" name="${naam}" type="${type}" autocomplete="${auto}"${verplicht ? ' aria-required="true"' : ''}${extra} aria-describedby="${id}-${naam}-fout">
            <p class="veld__fout" id="${id}-${naam}-fout" hidden></p>
          </div>`;
  const keuze = (label, leeg, opties, verplicht) => `<div class="veld">
            <label for="${id}-werk">${esc(label)}${verplicht ? ster : ''}</label>
            <select id="${id}-werk" name="werk"${verplicht ? ' aria-required="true"' : ''} aria-describedby="${id}-werk-fout">
              <option value="">${esc(leeg)}</option>
              ${opties.map((o) => `<option>${esc(o)}</option>`).join('')}
            </select>
            <p class="veld__fout" id="${id}-werk-fout" hidden></p>
          </div>`;
  const velden = D ? `${veld('naam', F.naam, 'text', 'name', { verplicht: true })}
          <div class="veld-rij">
            ${veld('tel', F.tel, 'tel', 'tel', { verplicht: true, extra: ' inputmode="tel"' })}
            ${veld('mail', F.mail, 'email', 'email', { verplicht: true, extra: ' inputmode="email"' })}
          </div>
          <div class="veld-rij">
            ${veld('gemeente', F.werf, 'text', 'address-level2', { verplicht: true })}
            ${keuze(F.type, F.typeLeeg, F.typeOpties, false)}
          </div>
          <div class="veld">
            <label for="${id}-project">${esc(F.plannen)}</label>
            <textarea id="${id}-project" name="project" rows="4" maxlength="1000"></textarea>
          </div>
          <div class="veld">
            <label for="${id}-bijlagen">${esc(F.upload)} <span class="veld__optioneel">(${esc(F.optioneel)})</span></label>
            <input id="${id}-bijlagen" name="bijlagen" type="file" accept="image/*,.pdf" multiple aria-describedby="${id}-bijlagen-fout">
            <p class="veld__fout" id="${id}-bijlagen-fout" hidden></p>
          </div>` : `${veld('naam', F.naam, 'text', 'name', { verplicht: true })}
          <div class="veld-rij">
            ${veld('tel', F.tel, 'tel', 'tel', { verplicht: true, extra: ' inputmode="tel"' })}
            ${veld('mail', F.mail, 'email', 'email', { extra: ' inputmode="email"' })}
          </div>
          ${keuze(F.werk, F.werkLeeg, [...DIENSTEN.map((d) => d.kortNaam), F.werkCombi], true)}
          <div class="veld-rij">
            ${veld('straat', F.straat, 'text', 'address-line1')}
            ${veld('gemeente', F.gemeente, 'text', 'address-level2')}
          </div>
          <div class="veld">
            <label for="${id}-project">${esc(F.project)}</label>
            <textarea id="${id}-project" name="project" rows="4" maxlength="1000" placeholder="${attr(F.projectHint)}"></textarea>
          </div>`;
  return `<form class="aanvraag" id="${id}" action="mailto:${SITE.mail}" method="post" enctype="text/plain" novalidate data-aanvraag>
        <div class="aanvraag__stap" data-stap="form">
          ${kop ? `<h2 class="aanvraag__kop"${kopId ? ` id="${kopId}"` : ''}>${esc(FORM.kop)}</h2>
          ${sub ? `<p class="aanvraag__sub">${esc(FORM.sub)}</p>` : ''}` : ''}
          <p class="aanvraag__verplicht">Velden met een sterretje zijn verplicht.</p>
          ${velden}
          <p class="aanvraag__fout" role="alert" hidden></p>
          <button class="knop knop--accent knop--vol" type="submit">${esc(knop)}${knopIc()}</button>
          <p class="aanvraag__klein">${esc(FORM.privacy)} <a href="${rel(v, 'privacy/')}">${esc(FORM.privacyLink)}</a>.</p>
        </div>
        <div class="aanvraag__stap aanvraag__klaar" data-stap="klaar" hidden tabindex="-1">
          <span class="aanvraag__vink" aria-hidden="true">${ic('vink', 26)}</span>
          <h2 class="aanvraag__kop" data-klaar-kop>Uw e-mail staat klaar</h2>
          <p class="aanvraag__sub" role="status" data-klaar-tekst>Uw e-mailprogramma opent met uw aanvraag. Verstuur die e-mail om uw aanvraag af te ronden.</p>
          <p class="aanvraag__uitweg">Opent er niets? Bel <a href="${SITE.tel.href}">${esc(SITE.tel.toon)}</a> of mail naar <a href="mailto:${SITE.mail}">${esc(SITE.mail)}</a>.</p>
          <div class="aanvraag__acties">
            <button class="knop knop--rand" type="button" data-kopieer>Kopieer uw aanvraag</button>
            <button class="knop knop--rand" type="button" data-terug>Terug naar uw aanvraag</button>
          </div>
        </div>
      </form>`;
}

/* ── plaatsbezoek onderaan elke pagina (abgroep-opbouw: tekst + gegevens links, formulier rechts) ── */
function plaats(v, variant = 'standaard') {
  const D = variant === 'diensten';
  return `<section class="plaats" id="plaatsbezoek" aria-labelledby="plaats-kop">
  <div class="wrap">
    <div class="plaats__blok" data-reveal>
      <div class="plaats__tekst">
        <h2 class="h2" id="plaats-kop">${esc(D ? DIENSTEN_PAGINA.cta.kop : HOME.cta.kop)}</h2>
        <p class="plaats__lede">${esc(D ? DIENSTEN_PAGINA.cta.tekst : HOME.cta.tekst)}</p>
        <ul class="plaats__info">
          <li><span class="plaats__info-ic">${ic('phone', 20)}</span><span><b>Telefoon</b><a href="${SITE.tel.href}">${esc(SITE.tel.toon)}</a></span></li>
          <li><span class="plaats__info-ic">${ic('pin', 20)}</span><span><b>Adres</b><span>${adresHtml()}</span></span></li>
          <li><span class="plaats__info-ic">${ic('klok', 20)}</span><span><b>Openingsuren</b><span>${SITE.uren.map(([d, u]) => `${esc(d)}: ${esc(u)}`).join('<br>')}</span></span></li>
        </ul>
        <img class="plaats__logo" src="${rel(v, 'img/logo-tegel.png')}" width="640" height="440" alt="" loading="lazy" decoding="async">
      </div>
      <div class="plaats__form kader">
        <div class="plaats__formkern">
          ${formulier(v, 'aanvraag-onder', { kop: false, knop: D ? FORM_DIENSTEN.knop : HOME.cta.knop, variant })}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function slot(v, pagina, js = true) {
  return `${footer(v)}
${js ? `<script src="${rel(v, 'site.js')}?v=${VERSIE}" defer></script>` : ''}
</body>
</html>
`;
}

/* ── gedeelde secties ─────────────────────────────────────────────────── */
function werkwijzeTegels(id, zacht = true, W = HOME.werkwijze) {
  return `<section class="waarom${zacht ? ' waarom--zacht' : ''}" aria-labelledby="${id}-kop">
  <div class="wrap">
    <h2 class="h2 h2--midden" id="${id}-kop" data-reveal>${esc(W.kop)}</h2>
    ${W.tekst ? `<p class="waarom__intro" data-reveal>${esc(W.tekst)}</p>` : ''}
    <ul class="tegels" data-reveal>
      ${W.punten.map((pt, i) => `<li class="tegel${i === 1 ? ' tegel--accent' : ''}">
        <span class="punt__ic">${ic(pt.ic, pt.ic === 'helm' ? 26 : 30)}</span>
        <h3 class="tegel__kop">${esc(pt.titel)}</h3>
        <p class="tegel__tekst">${esc(pt.tekst)}</p>
      </li>`).join('\n      ')}
    </ul>
  </div>
</section>`;
}

function railBediening(licht, label) {
  return `<div class="rail-bediening${licht ? ' rail-bediening--licht' : ''}" data-bediening>
      <button class="rail-knop" type="button" data-vorige aria-label="Vorige ${label}">${ic('terug', 20)}</button>
      <span class="rail-balk" aria-hidden="true"><span class="rail-balk__vul"></span></span>
      <button class="rail-knop" type="button" data-volgende aria-label="Volgende ${label}">${ic('chev', 20)}</button>
    </div>`;
}

function dienstenStrook(v) {
  return `<section class="strook" aria-labelledby="strook-kop">
  <div class="wrap">
    <h2 class="h2 h2--midden" id="strook-kop" data-reveal>${esc(HOME.diensten.kop)}</h2>
    <div class="strook__rail" data-reveal>
      <ul class="strook__rij" data-rail>
        ${DIENSTEN.map((d) => `<li class="strook__item">
          <a class="strook__kaart kader" href="${rel(v, 'diensten/')}#${d.slug}">
            <span class="strook__foto">${pic(v, d.img, d.alt, { sizes: '(max-width: 1000px) calc(78vw - 50px), 372px' })}</span>
            <span class="strook__body"><span class="strook__nr">${d.nr}</span><span class="strook__naam">${esc(d.kortNaam)}</span>${ic('chev', 20)}</span>
          </a>
        </li>`).join('\n        ')}
      </ul>
      ${railBediening(true, 'dienst')}
    </div>
  </div>
</section>`;
}

/* ── kruimelpad + paginakoppen ────────────────────────────────────────── */
function kruimel(v, delen) {
  return `<nav class="kruimel" aria-label="Kruimelpad"><ol><li><a href="${rel(v, '')}">Home</a></li>${delen.map((d, i) => i === delen.length - 1
    ? `<li><span aria-current="page">${esc(d.label)}</span></li>`
    : `<li><a href="${rel(v, d.pad)}">${esc(d.label)}</a></li>`).join('')}</ol></nav>`;
}

/* split-hero (abgroep-opbouw): tekst links, foto rechts */
function phero(v, { delen, kop, lede, beeld, alt, knoppen = true, knop = HOME.hero.knop1 }) {
  return `<section class="phero">
  <div class="phero__tekst">
    <div class="phero__in">
      ${kruimel(v, delen)}
      <h1 class="phero__kop">${kop2(kop, 'dim')}</h1>
      ${lede ? `<p class="phero__lede">${esc(lede)}</p>` : ''}
      ${knoppen ? `<div class="phero__knoppen">
        <a class="knop knop--accent" href="#plaatsbezoek" data-naar-form>${esc(knop)}${knopIc()}</a>
        <a class="knop knop--rand" href="${SITE.tel.href}">${ic('phone')}${esc(SITE.tel.toon)}</a>
      </div>` : ''}
    </div>
  </div>
  <div class="phero__beeld">
    ${pic(v, beeld, alt, { eager: true, sizes: '(max-width: 1000px) 100vw, 50vw' })}
  </div>
</section>`;
}

/* compacte kop zonder foto */
function kopband(v, { delen, kop, lede }) {
  return `<section class="kopband">
  <div class="wrap kopband__in">
    ${kruimel(v, delen)}
    <h1 class="kopband__kop">${Array.isArray(kop) ? kop2(kop, 'dim') : esc(kop)}</h1>
    ${lede ? `<p class="kopband__lede">${esc(lede)}</p>` : ''}
  </div>
</section>`;
}

function accordeon(lijst, prefix, eersteOpen = true, kop = 'h3') {
  return `<div class="acc" data-acc>
      ${lijst.map((f, i) => {
        const open = eersteOpen && i === 0;
        return `<div class="acc__item${open ? ' is-open' : ''}">
        <${kop}><button class="acc__vraag" type="button" aria-expanded="${open}" aria-controls="${prefix}-a${i}" id="${prefix}-v${i}">${esc(f.v)}<span class="acc__ic">${ic('down', 18)}</span></button></${kop}>
        <div class="acc__antw" id="${prefix}-a${i}" role="region" aria-labelledby="${prefix}-v${i}"${open ? '' : ' hidden'}><p>${esc(f.a)}</p></div>
      </div>`;
      }).join('\n      ')}
    </div>`;
}

function tipKaart(v, b, kopNiveau = 'h3', beeld = { sizes: '(max-width: 1000px) calc(100vw - 60px), 369px' }) {
  return `<article class="tip kader">
        <a class="tip__kern" href="${rel(v, `tips/${b.slug}/`)}">
          <div class="tip__foto">${pic(v, b.img, b.alt, { sizes: '(max-width: 1000px) calc(100vw - 60px), 369px', ...beeld })}</div>
          <div class="tip__body">
            <${kopNiveau} class="tip__kop">${esc(b.titel)}</${kopNiveau}>

            <span class="link">Lees meer${ic('chev')}</span>
          </div>
        </a>
      </article>`;
}

/* ── PAGINA'S ─────────────────────────────────────────────────────────── */
const PAGINAS = [];

/* HOME */
PAGINAS.push(() => {
  const v = '';
  const p = { pad: v, titel: HOME.titel, beschrijving: HOME.beschrijving, home: true,
    preload: `<link rel="preload" as="image" href="img/hero-vol.webp" type="image/webp" media="(min-width: 701px)">\n<link rel="preload" as="image" href="img/hero-vol-m.webp" type="image/webp" media="(max-width: 700px)">\n` };
  const W = HOME.werkwijze;
  return `${head(p)}
<body class="is-home">
${SPRITE}
${header(v, '', '#plaatsbezoek', true)}
<main id="inhoud">

<section class="hero">
  <picture class="hero__foto">
    <source media="(max-width: 700px)" srcset="img/hero-vol-m.webp" type="image/webp">
    <source media="(max-width: 700px)" srcset="img/hero-vol-m.jpg">
    <source srcset="img/hero-vol.webp" type="image/webp">
    <img src="img/hero-vol.jpg" width="1920" height="1280" alt="Lichte ruimte met witte wanden, zetels en papieren hanglampen" decoding="async" fetchpriority="high">
  </picture>
  <div class="hero__laag" aria-hidden="true"></div>
  <div class="wrap hero__in">
    <div class="hero__tekstblok">
      <h1 class="hero__kop">${kop2(HOME.hero.kop, 'hero__kop2')}</h1>
      <p class="hero__tekst">${esc(HOME.hero.tekst)}</p>
      <div class="hero__knoppen">
        <a class="knop knop--accent" href="#plaatsbezoek" data-naar-form>${esc(HOME.hero.knop1)}${knopIc()}</a>
        <a class="knop knop--rand-wit" href="diensten/">${esc(HOME.hero.knop2)}</a>
      </div>
    </div>
    <a class="hero__verder" href="#over" aria-label="Verder naar de inhoud">${ic('down', 22)}</a>
  </div>
</section>

<section class="intro" id="over" aria-labelledby="intro-kop">
  <div class="wrap intro__grid">
    <div class="intro__beeld kader" data-reveal>
      ${pic(v, 'over-werf', 'Ruwbouw van een woning in verbouwing, met een stelling, stempels en planken', { sizes: '(max-width: 1000px) calc(100vw - 60px), 548px' })}
    </div>
    <div class="intro__tekst" data-reveal>
      <h2 class="h2" id="intro-kop">${esc(HOME.intro.kop)}</h2>
      <p class="intro__lead">${esc(HOME.intro.lead)}</p>

      <a class="knop knop--rand" href="over-ons/">${esc(HOME.intro.knop)}</a>
    </div>
  </div>
</section>

<section class="diensten" id="diensten" aria-labelledby="diensten-kop">
  <div class="wrap">
    <h2 class="h2 h2--wit h2--midden" id="diensten-kop" data-reveal>${esc(HOME.diensten.kop)}</h2>
    <div class="podium" data-reveal>
      <div class="tabs" role="tablist" aria-label="Diensten" aria-orientation="vertical">
        ${DIENSTEN.map((d, i) => `<button class="tab${i === 0 ? ' is-actief' : ''}" id="tab-${i + 1}" role="tab" aria-selected="${i === 0}" aria-controls="paneel-${i + 1}"${i === 0 ? '' : ' tabindex="-1"'}><span class="tab__nr">${d.nr}</span><span class="tab__naam">${esc(d.kortNaam)}</span></button>`).join('\n        ')}
      </div>
      <div class="podium__panelen" data-rail>
        ${DIENSTEN.map((d, i) => `<div class="paneel${i === 0 ? ' is-actief' : ''}" id="paneel-${i + 1}" role="tabpanel" aria-labelledby="tab-${i + 1}"${i === 0 ? '' : ' hidden'}>
          <div class="paneel__foto kader kader--donker">
            ${pic(v, d.img, d.alt, { sizes: '(max-width: 1000px) calc(84vw - 52px), 688px' })}
          </div>
          <div class="paneel__kaart">
            <div class="paneel__kern">
              <p class="paneel__nr">${d.nr}</p>
              <h3 class="paneel__kop"><a href="diensten/#${d.slug}">${esc(d.kortNaam)}${ic('chev', 20)}</a></h3>
              <p class="paneel__tekst">${esc(d.kortTekst)}</p>
            </div>
          </div>
        </div>`).join('\n        ')}
      </div>
      <div class="rail-bediening" data-bediening>
        <button class="rail-knop" type="button" data-vorige aria-label="Vorige dienst">${ic('terug', 20)}</button>
        <span class="rail-balk" aria-hidden="true"><span class="rail-balk__vul"></span></span>
        <button class="rail-knop" type="button" data-volgende aria-label="Volgende dienst">${ic('chev', 20)}</button>
      </div>
    </div>
    <div class="diensten__meer" data-reveal>
      <a class="knop knop--accent" href="diensten/">${esc(HOME.diensten.knop)}${knopIc()}</a>
    </div>
  </div>
</section>

<section class="waarom waarom--zacht" id="waarom" aria-labelledby="waarom-kop">
  <div class="wrap waarom__grid">
    <div class="waarom__links" data-reveal>
      <h2 class="h2" id="waarom-kop">${esc(W.kop)}</h2>
      <ul class="punten">
        ${W.punten.map((pt, i) => `<li class="punt${i === 1 ? ' punt--accent' : ''}">
          <span class="punt__ic">${ic(pt.ic, pt.ic === 'helm' ? 26 : 30)}</span>
          <div>
            <h3 class="punt__kop">${esc(pt.titel)}</h3>
            <p class="punt__tekst">${esc(pt.tekst)}</p>
          </div>
        </li>`).join('\n        ')}
      </ul>
    </div>
    <div class="duo" data-reveal>
      <div class="duo__a kader">
        <picture>
          <source srcset="img/waarom-1.webp" type="image/webp">
          <img src="img/waarom-1.jpg" width="540" height="840" alt="Bouwplan met potlood en meetlat" loading="lazy" decoding="async">
        </picture>
      </div>
      <div class="duo__b kader">
        <picture>
          <source srcset="img/waarom-2.webp" type="image/webp">
          <img src="img/waarom-2.jpg" width="363" height="565" alt="Gele zetel en staanlamp in een afgewerkte kamer" loading="lazy" decoding="async">
        </picture>
      </div>
      <a class="stempel" href="#plaatsbezoek" data-naar-form aria-label="Gratis plaatsbezoek aanvragen">
        <svg class="stempel__ring" viewBox="0 0 160 160" aria-hidden="true">
          <defs><path id="cirkel" d="M80 80m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0"/></defs>
          <text><textPath href="#cirkel" textLength="364">Gratis plaatsbezoek · Gratis plaatsbezoek ·&#160;</textPath></text>
        </svg>
        ${ic('arrow', 32).replace('<svg ', '<svg class="stempel__pijl" ')}
      </a>
    </div>
  </div>
</section>




<section class="vragen vragen--wit" id="vragen" aria-labelledby="vragen-kop">
  <div class="wrap">
    <h2 class="h2 h2--midden" id="vragen-kop" data-reveal>${esc(HOME.vragenKop)}</h2>
    <div data-reveal>
    ${accordeon(VRAGEN.lijst, 'hv')}
    </div>
  </div>
</section>



${plaats(v)}

</main>
${slot(v)}`;
});

/* DIENSTEN */
PAGINAS.push(() => {
  const v = 'diensten/';
  const delen = [{ label: 'Diensten', pad: v }];
  const p = { pad: v, titel: DIENSTEN_PAGINA.titel, beschrijving: DIENSTEN_PAGINA.beschrijving, kruimel: [{ label: 'Home', pad: '' }, ...delen] };
  return `${head(p)}
<body class="sub">
${SPRITE}
${header(v, v)}
<main id="inhoud">
${phero(v, { delen, kop: DIENSTEN_PAGINA.kop, lede: DIENSTEN_PAGINA.intro, knop: DIENSTEN_PAGINA.knop, beeld: 'd-totaal-2', alt: 'Afgewerkte, lichte leefruimte met een witte zetel en kleurrijke kussens' })}

<div class="sprongvak">
<nav class="sprong" aria-label="Diensten op deze pagina">
  <div class="wrap">
    <ul class="sprong__lijst">
      ${DIENSTEN.map((d) => `<li><a href="#${d.slug}"><span>${d.nr}</span>${esc(d.kortNaam)}</a></li>`).join('\n      ')}
    </ul>
  </div>
</nav>

<section class="rijen" aria-labelledby="rijen-kop">
  <div class="wrap">
    <h2 class="h2 h2--midden rijen__kop" id="rijen-kop" data-reveal>${esc(DIENSTEN_PAGINA.expertisesKop)}</h2>
    ${DIENSTEN.map((d, i) => `<article class="rij${i % 2 ? ' rij--om' : ''}" id="${d.slug}" aria-labelledby="${d.slug}-kop" data-reveal>
      <div class="rij__beeld kader">
        ${pic(v, d.img, d.alt, { sizes: '(max-width: 1000px) calc(100vw - 60px), 548px' })}
      </div>
      <div class="rij__tekst">
        <p class="rij__nr">${d.nr}</p>
        <h3 class="rij__kop" id="${d.slug}-kop">${esc(d.naam)}</h3>
        <p class="rij__p">${esc(d.tekst)}</p>
        <ul class="vinkjes">
          ${d.punten.map((pt) => `<li><span class="vinkjes__ic">${ic('vink', 14)}</span>${esc(pt)}</li>`).join('\n          ')}
        </ul>
        <a class="knop knop--accent" href="#plaatsbezoek" data-naar-form data-dienst="${attr(d.formType)}">${esc(DIENSTEN_PAGINA.knop)}${knopIc()}</a>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>
</div>

${werkwijzeTegels('dw', true, DIENSTEN_PAGINA.organisatie)}

<section class="vragen vragen--wit" aria-labelledby="dv-kop">
  <div class="wrap">
    <h2 class="h2 h2--midden" id="dv-kop" data-reveal>${esc(VRAGEN.kop)}</h2>
    <div data-reveal>
    ${accordeon(DIENSTEN_PAGINA.vragen, 'dv')}
    </div>
  </div>
</section>

${plaats(v, 'diensten')}
</main>
${slot(v)}`;
});

/* OVER ONS */
PAGINAS.push(() => {
  const v = 'over-ons/';
  const delen = [{ label: 'Over ons', pad: v }];
  const p = { pad: v, titel: OVER.titel, beschrijving: OVER.beschrijving, kruimel: [{ label: 'Home', pad: '' }, ...delen] };
  return `${head(p)}
<body class="sub">
${SPRITE}
${header(v, v)}
<main id="inhoud">
${phero(v, { delen, kop: OVER.kop, lede: OVER.sub, beeld: 'over-werf', alt: 'Ruwbouw van een woning in verbouwing, met een stelling, stempels en planken' })}

<div class="ovintro">
  <div class="wrap wrap--smal">
    <p class="ovintro__tekst" data-reveal>${esc(OVER.intro)}</p>
  </div>
</div>

<div class="rijen rijen--over">
  <div class="wrap">
    ${OVER.delen.map((d, i) => `<section class="rij${i % 2 ? ' rij--om' : ''}" aria-labelledby="ov-${i + 1}-kop" data-reveal>
      <div class="rij__beeld kader">
        ${pic(v, d.img, d.alt, { sizes: '(max-width: 1000px) calc(100vw - 60px), 548px' })}
      </div>
      <div class="rij__tekst">
        <h2 class="rij__kop" id="ov-${i + 1}-kop">${esc(d.kop)}</h2>
        <p class="rij__p">${esc(d.tekst)}</p>
      </div>
    </section>`).join('\n    ')}
  </div>
</div>

${werkwijzeTegels('ow')}

${dienstenStrook(v)}

${plaats(v)}
</main>
${slot(v)}`;
});

/* VRAGEN */
PAGINAS.push(() => {
  const v = 'vragen/';
  const delen = [{ label: 'Vragen', pad: v }];
  const p = { pad: v, titel: VRAGEN.titel, beschrijving: VRAGEN.beschrijving, kruimel: [{ label: 'Home', pad: '' }, ...delen], faq: VRAGEN.lijst };
  return `${head(p)}
<body class="sub">
${SPRITE}
${header(v, v)}
<main id="inhoud">
${kopband(v, { delen, kop: VRAGEN.kop })}
<section class="vragen vragen--pagina" aria-label="Vragen en antwoorden">
  <div class="wrap">
    ${accordeon(VRAGEN.lijst, 'vp', true, 'h2')}
  </div>
</section>
${plaats(v)}
</main>
${slot(v)}`;
});

/* TIPS-overzicht */
PAGINAS.push(() => {
  const v = 'tips/';
  const delen = [{ label: 'Tips', pad: v }];
  const p = { pad: v, titel: TIPS.titel, beschrijving: TIPS.beschrijving, kruimel: [{ label: 'Home', pad: '' }, ...delen] };
  return `${head(p)}
<body class="sub">
${SPRITE}
${header(v, v)}
<main id="inhoud">
${kopband(v, { delen, kop: TIPS.kop })}
<section class="tips tips--pagina" aria-label="Alle tips">
  <div class="wrap">
    <div class="tips__rij">
      ${BLOGS.map((b, i) => tipKaart(v, b, 'h2', i === 0 ? { eager: true } : {})).join('\n      ')}
    </div>
  </div>
</section>
${plaats(v)}
</main>
${slot(v)}`;
});

/* BLOGS */
BLOGS.forEach((b) => PAGINAS.push(() => {
  const v = `tips/${b.slug}/`;
  const delen = [{ label: 'Tips', pad: 'tips/' }, { label: b.titel, pad: v }];
  const eerste = b.intro.split(/(?<=[.?!])\s/)[0];
  const p = { pad: v, titel: `${b.titel} · INzicht`, beschrijving: eerste.length > 60 ? eerste : b.intro.slice(0, 155), kruimel: [{ label: 'Home', pad: '' }, ...delen], artikel: b };
  const anderen = BLOGS.filter((x) => x !== b);
  return `${head(p)}
<body class="sub">
${SPRITE}
${header(v, 'tips/')}
<main id="inhoud">
<article class="artikel">
  <header class="artikel__kop">
    <div class="wrap wrap--smal">
      ${kruimel(v, delen)}
      <h1 class="artikel__titel">${esc(b.titel)}</h1>
      <p class="artikel__meta"><span>${ic('tag', 16)}${esc(b.label)}</span><span>${ic('user', 16)}INzicht bouw en renovatie</span></p>
    </div>
  </header>
  <div class="wrap wrap--midden">
    <div class="artikel__beeld kader">
      ${pic(v, b.img, b.alt, { eager: true, sizes: '(max-width: 1000px) calc(100vw - 60px), 988px' })}
    </div>
  </div>
  <div class="wrap wrap--smal artikel__body">
    <p class="artikel__intro">${nb(b.intro)}</p>
    <ul class="artikel__lijst">
      ${b.punten.map((pt) => `<li><strong>${esc(pt.b)}</strong> ${nb(pt.t)}</li>`).join('\n      ')}
    </ul>
    ${b.noot ? `<p class="artikel__noot">${ic('info', 20)}<span>${nb(b.noot)}</span></p>` : ''}
    ${b.bron ? `<p class="artikel__bron">Bron: ${[].concat(b.bron).map((x) => `<a href="${attr(x.href)}" rel="noopener" target="_blank">${esc(x.label)}</a>`).join(' en ')}, op vlaanderen.be.</p>` : ''}
    <a class="link artikel__terug" href="${rel(v, 'tips/')}">${ic('terug')}Alle tips</a>
  </div>
</article>
<section class="tips tips--meer" aria-labelledby="meer-kop">
  <div class="wrap">
    <h2 class="h2 h2--midden" id="meer-kop">Meer tips</h2>
    <div class="tips__rij tips__rij--twee">
      ${anderen.map((x) => tipKaart(v, x, 'h3', { sizes: '(max-width: 1000px) calc(100vw - 60px), 384px' })).join('\n      ')}
    </div>
  </div>
</section>
${plaats(v)}
</main>
${slot(v)}`;
}));

/* CONTACT */
PAGINAS.push(() => {
  const v = 'contact/';
  const delen = [{ label: 'Contact', pad: v }];
  const p = { pad: v, titel: CONTACT.titel, beschrijving: CONTACT.beschrijving, kruimel: [{ label: 'Home', pad: '' }, ...delen], home: true };
  const kaart = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.adres.regel)}`;
  return `${head(p)}
<body class="sub">
${SPRITE}
${header(v, v, '#aanvraag-contact')}
<main id="inhoud">
${kopband(v, { delen, kop: CONTACT.kop, lede: CONTACT.tekst })}
<section class="contact" aria-label="Contactformulier en gegevens">
  <div class="wrap contact__grid">
    <div class="contact__gegevens">
      <h2 class="contact__kop">${esc(CONTACT.gegevensKop)}</h2>
      <p class="contact__naam">${esc(SITE.volledig)}</p>
      <ul class="contact__lijst">
        <li>${ic('pin', 22)}<span>${adresHtml()}<br><a class="contact__route" href="${attr(kaart)}" target="_blank" rel="noopener">Route in Google Maps${ic('arrow', 14)}</a></span></li>
        <li>${ic('phone', 22)}<a href="${SITE.tel.href}">${esc(SITE.tel.toon)}</a></li>
        <li>${ic('mail', 22)}<a href="mailto:${SITE.mail}">${esc(SITE.mail)}</a></li>
      </ul>
      <h2 class="contact__kop contact__kop--uren">${esc(CONTACT.urenKop)}</h2>
      <dl class="contact__uren">
        ${SITE.urenContact.map(([d, u]) => `<div><dt>${esc(d)}</dt><dd>${esc(u)}</dd></div>`).join('\n        ')}
      </dl>
      <a class="knop knop--accent knop--vol contact__bel" href="${SITE.tel.href}">${ic('phone')}${esc(SITE.tel.toon)}</a>
    </div>
    <div class="contact__form kader">
      <div class="contact__formkern">
        ${formulier(v, 'aanvraag-contact', { kop: true, sub: false })}
      </div>
    </div>
  </div>
</section>
<section class="vragen" aria-labelledby="cv-kop">
  <div class="wrap">
    <h2 class="h2 h2--midden" id="cv-kop" data-reveal>${esc(VRAGEN.kop)}</h2>
    <div data-reveal>
    ${accordeon(VRAGEN.lijst, 'cv', false)}
    </div>
  </div>
</section>
</main>
${slot(v)}`;
});

/* PRIVACY */
PAGINAS.push(() => {
  const v = 'privacy/';
  const delen = [{ label: 'Privacybeleid', pad: v }];
  const p = { pad: v, titel: PRIVACY.titel, beschrijving: PRIVACY.beschrijving, kruimel: [{ label: 'Home', pad: '' }, ...delen] };
  return `${head(p)}
<body class="sub">
${SPRITE}
${header(v, '', rel(v, 'contact/'))}
<main id="inhoud">
${kopband(v, { delen, kop: PRIVACY.kop })}
<section class="juridisch">
  <div class="wrap wrap--smal prose">
    <p class="prose__intro">${esc(PRIVACY.intro)}</p>
    ${PRIVACY.delen.map((d) => `<h2>${esc(d.kop)}</h2>
    ${d.p.map((x) => `<p>${esc(x).replace(esc(SITE.mail), `<a href="mailto:${SITE.mail}">${esc(SITE.mail)}</a>`)}</p>`).join('\n    ')}
    ${d.lijst ? `<ul>${d.lijst.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`).join('\n    ')}
  </div>
</section>
</main>
${slot(v)}`;
});

/* 404 */
function pagina404() {
  BASIS_ABS = new URL(SITE.url + '/').pathname;
  const v = '';
  const p = { pad: '404.html', fout: true, titel: 'Pagina niet gevonden · INzicht bouw en renovatie', beschrijving: 'Deze pagina bestaat niet.' };
  const html = `${head(p)}
<body class="sub">
${SPRITE}
${header(v, '', rel(v, 'contact/'))}
<main id="inhoud">
<section class="kopband kopband--404">
  <div class="wrap kopband__in">
    <h1 class="kopband__kop">Pagina niet gevonden</h1>
    <p class="kopband__lede">Het adres klopt niet of de pagina is verhuisd.</p>
    <div class="phero__knoppen kopband__knoppen">
      <a class="knop knop--accent" href="${rel(v, '')}">Naar de homepage${knopIc()}</a>
      <a class="knop knop--rand" href="${rel(v, 'diensten/')}">${esc(HOME.hero.knop2)}</a>
    </div>
  </div>
</section>
</main>
${slot(v)}`;
  BASIS_ABS = null;
  return html;
}

/* ── wegschrijven ─────────────────────────────────────────────────────── */
const ROUTES = ['', 'diensten/', 'over-ons/', 'vragen/', 'tips/', ...BLOGS.map((b) => `tips/${b.slug}/`), 'contact/', 'privacy/'];
let n = 0;
PAGINAS.forEach((maak, i) => {
  const route = ROUTES[i];
  const doel = path.join(ROOT, route, 'index.html');
  fs.mkdirSync(path.dirname(doel), { recursive: true });
  fs.writeFileSync(doel, maak());
  n++;
});
fs.writeFileSync(path.join(ROOT, '404.html'), pagina404());
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${SITE.url}/${r}</loc></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');
console.log(`${n} pagina's + 404 + sitemap + robots gebouwd (versie ${VERSIE})`);
module.exports = { ROUTES };
