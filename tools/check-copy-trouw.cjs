// Controleert of elke zin uit Mohammeds copy (bouw/inhoud.cjs) woordelijk op de juiste gebouwde pagina staat.
// Positieve controle: een bewust verzonnen zin moet als "ontbreekt" gevonden worden.
const fs = require('fs'); const path = require('path');
const I = require('../bouw/inhoud.cjs');
const root = path.join(__dirname, '..');
const lees = (r) => fs.readFileSync(path.join(root, r, 'index.html'), 'utf8')
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/placeholder="([^"]*)"/g, '> $1 <')            // placeholdertekst telt mee
  .replace(/<\/?(a|strong|span|b|em)(\s[^>]*)?>/g, '')    // inline-tags zonder extra spatie
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/\s+/g, ' ');
const verwacht = [];
const voeg = (route, t) => verwacht.push([route, t]);
voeg('', I.HOME.hero.kop.join(' ')); voeg('', I.HOME.hero.tekst); voeg('', I.HOME.hero.knop1); voeg('', I.HOME.hero.knop2);
voeg('', I.HOME.werkwijze.kop); I.HOME.werkwijze.punten.forEach((p) => { voeg('', p.titel); voeg('', p.tekst); });
voeg('', I.HOME.diensten.kop); voeg('', I.HOME.diensten.knop); I.DIENSTEN.forEach((d) => { voeg('', d.kortNaam); voeg('', d.kortTekst); });
voeg('', I.HOME.cta.kop); voeg('', I.HOME.cta.tekst); voeg('', I.HOME.cta.knop); voeg('', I.HOME.vragenKop);
// dienstenpagina: zijn copy van 7 okt 2026 (hero, expertises, organisatie, FAQ, afsluitende oproep en formulier)
{
  const DP = I.DIENSTEN_PAGINA; const r = 'diensten/';
  [DP.knop, DP.expertisesKop, DP.organisatie.kop, DP.organisatie.tekst, DP.cta.kop, DP.cta.tekst, I.FORM_DIENSTEN.knop].forEach((x) => voeg(r, x));
  DP.organisatie.punten.forEach((p) => { voeg(r, p.titel); voeg(r, p.tekst); });
  DP.vragen.forEach((q) => { voeg(r, q.v); voeg(r, q.a); });
  Object.entries(I.FORM_DIENSTEN.velden).forEach(([k, w]) => { if (k === 'typeOpties') w.forEach((o) => voeg(r, o)); else voeg(r, w); });
}
I.VRAGEN.lijst.forEach((f) => { voeg('', f.v); voeg('', f.a); voeg('vragen/', f.v); voeg('vragen/', f.a); });
voeg('diensten/', I.DIENSTEN_PAGINA.kop.join(' ')); voeg('diensten/', I.DIENSTEN_PAGINA.intro);
I.DIENSTEN.forEach((d) => { voeg('diensten/', d.naam); voeg('diensten/', d.tekst); d.punten.forEach((p) => voeg('diensten/', p)); });
voeg('over-ons/', I.OVER.kop.join(' ')); voeg('over-ons/', I.OVER.sub); voeg('over-ons/', I.OVER.intro);
I.OVER.delen.forEach((d) => { voeg('over-ons/', d.kop); voeg('over-ons/', d.tekst); });
voeg('', I.OVER.sub); // dezelfde alinea staat als subheadline in de home-hero
voeg('', I.HOME.intro.lead); // zijn vorige hero-tekst, nu in de inleiding onder de hero
voeg('', I.HOME.intro.kop); // zijn titel als kop van de inleiding
voeg('vragen/', I.VRAGEN.kop); voeg('tips/', I.TIPS.kop.join(' '));
I.BLOGS.forEach((b) => { const r = `tips/${b.slug}/`; voeg(r, b.titel); voeg(r, b.intro); b.punten.forEach((p) => { voeg(r, p.b); voeg(r, p.t); }); if (b.noot) voeg(r, b.noot); voeg('tips/', b.titel); });
voeg('contact/', I.CONTACT.kop); voeg('contact/', I.CONTACT.tekst); voeg('contact/', I.CONTACT.gegevensKop); voeg('contact/', I.CONTACT.urenKop);
I.SITE.urenContact.forEach(([d, u]) => { voeg('contact/', d); voeg('contact/', u); });
Object.values(I.FORM.velden).forEach((v) => voeg('contact/', v)); voeg('contact/', I.FORM.knop);
voeg('privacy/', I.PRIVACY.kop); voeg('privacy/', I.PRIVACY.intro); I.PRIVACY.delen.forEach((d) => { voeg('privacy/', d.kop); d.p.forEach((p) => voeg('privacy/', p)); (d.lijst || []).forEach((l) => voeg('privacy/', l)); });
// voet op elke pagina
['', 'diensten/', 'contact/'].forEach((r) => { voeg(r, I.SITE.volledig); voeg(r, I.SITE.adres.regel); voeg(r, I.SITE.tel.toon); voeg(r, I.SITE.mail); voeg(r, I.SITE.copyright); I.SITE.uren.forEach(([d, u]) => { voeg(r, d); voeg(r, u); }); I.FOOTER_MENU.forEach((n) => voeg(r, n.label)); });
const cache = {}; const tekst = (r) => (cache[r] ??= lees(r));
const norm = (s) => s.replace(/\s+/g, ' ').trim();
// positieve controle
if (tekst('').includes('Deze zin staat nergens op de site.')) { console.error('ONGELDIGE METING'); process.exit(2); }
const mist = verwacht.filter(([r, t]) => !tekst(r).includes(norm(t)));
console.log(`gecontroleerd: ${verwacht.length} tekststukken op ${new Set(verwacht.map((v) => v[0])).size} pagina's; positieve controle vuurde`);
if (mist.length) { console.log(`ROOD ${mist.length} ontbreken:`); mist.forEach(([r, t]) => console.log(`  /${r}: "${t.slice(0, 90)}"`)); process.exit(1); }
// verwijderde copy mag op geen enkele pagina meer staan, ook niet in de gestructureerde gegevens (JSON-LD)
const WEG = [
  ['7 okt 2026, Mohammed: "bij faq de vraag over prijs mag er ook uit"', 'Werken jullie met een vaste prijs'],
  ['7 okt 2026, zijn nieuwe dienstencopy: term "De zes pijlers" volledig verwijderd', 'zes pijlers'],
  ['8 okt 2026, Mohammed: "Een bouwbedrijf uit Kampenhout is echt raar, ik heb toch gezegd wat op de voorgrond moet"', 'Een bouwbedrijf uit Kampenhout'],
];
const ALLE = ['', 'diensten/', 'over-ons/', 'vragen/', 'tips/', ...I.BLOGS.map((b) => `tips/${b.slug}/`), 'contact/', 'privacy/'];
const ruw = (r) => fs.readFileSync(path.join(root, r, 'index.html'), 'utf8');
// positieve controle: een vraag die er wel moet staan, wordt in de ruwe HTML gevonden
if (!ruw('vragen/').includes(I.VRAGEN.lijst[0].v)) { console.error('ONGELDIGE METING (verwijderde copy)'); process.exit(2); }
const terug = [];
for (const [waarom, zin] of WEG) for (const r of ALLE) if (ruw(r).toLowerCase().includes(zin.toLowerCase())) terug.push(`  /${r}: "${zin}" (${waarom})`);
if (terug.length) { console.log(`ROOD ${terug.length} verwijderde zin(nen) staan er nog:`); terug.forEach((x) => console.log(x)); process.exit(1); }
// subheadline van de hero: max 2 zinnen en 30 woorden (8 okt 2026, Mohammed: "er is veel te veel text in de subheadline")
for (const [waar, tekst] of [['home-hero', I.HOME.hero.tekst], ['Over ons-hero', I.OVER.sub]]) {
  const zinnen = tekst.split(/(?<=[.!?])\s+/).filter(Boolean).length; const woorden = tekst.split(/\s+/).length;
  if (zinnen > 2 || woorden > 30) { console.log(`ROOD subheadline ${waar} te lang: ${zinnen} zinnen, ${woorden} woorden (max 2 en 30)`); process.exit(1); }
}
// Negatieve en contrastconstructies (8 okt 2026, Mohammed: "GEEN NEGATIVITEIT, eruit halen, en overal die ai slop, geen dit wel dit,
// its not this its that, from this to this, ERUIT" + "het mag in mate, waar het nodig is" + "en geen em dashes").
// Elke zin in alle copy wordt getoetst; alleen de zinnen in TOEGESTAAN zijn bewuste uitzonderingen (geldfeit, privacyverplichting, formulierkeuze).
const SLOP = [
  ['geen/niet ... maar/wel', /\b(geen|niet|nooit)\b[^.?!]{0,90}\b(maar|wel)\b/i],
  ['niet enkel/alleen', /\bniet (enkel|alleen)\b/i],
  ['van ... tot ...', /\bvan\b[^.?!]{1,80}\btot\b/i],
  ['zonder dat', /\bzonder dat\b/i],
  ['"Geen X" als zin', /(^|[.!?]\s+)Geen\b/],
  ['of u nu / of het nu', /\b(of u nu|of het nu)\b/i],
  ['Het resultaat?', /\bHet resultaat\?/],
  ['gedachtestreepje', /[–—]/],
];
const TOEGESTAAN = new Set([
  'Voor de hoogste en middelste inkomens (categorie 1 en 2) is er sinds 1 maart 2026 geen premie meer voor dak of buitenmuur.',
  'Uw gegevens worden nooit verkocht aan derden.',
]);
const slop = [];
const doorloop = (pad, w) => {
  if (typeof w === 'string') {
    if (/\.(slug|img|href|ic|nr|pad|datum|formType)$|^CORRECTIES|^SITE\.(url|tel|mail)/.test(pad)) return;
    for (const zin of w.split(/(?<=[.!?])\s+/)) for (const [naam, re] of SLOP) if (re.test(zin) && !TOEGESTAAN.has(zin)) slop.push(`  ${pad}: [${naam}] "${zin.slice(0, 100)}"`);
    return;
  }
  if (Array.isArray(w)) return w.forEach((x, i) => doorloop(`${pad}[${i}]`, x));
  if (w && typeof w === 'object') Object.entries(w).forEach(([k, x]) => doorloop(pad ? `${pad}.${k}` : k, x));
};
for (const [k, v] of Object.entries(I)) doorloop(k, v);
// positieve controle: een geplante slopzin moet gevonden worden
{ const proef = []; for (const [, re] of SLOP) if (re.test('Geen loze beloftes, wel daadkracht.')) proef.push(1); if (!proef.length) { console.error('ONGELDIGE METING (slop)'); process.exit(2); } }
// gedachtestreepjes ook in de gebouwde HTML (eigen teksten in de sjablonen)
for (const r of ALLE) if (/[–—]/.test(ruw(r).replace(/<script[\s\S]*?<\/script>/g, ''))) slop.push(`  /${r}: gedachtestreepje in de HTML`);
if (slop.length) { console.log(`ROOD ${slop.length} negatieve of contrastconstructie(s):`); slop.forEach((x) => console.log(x)); process.exit(1); }
console.log('GROEN alle copy staat woordelijk op de juiste pagina');
