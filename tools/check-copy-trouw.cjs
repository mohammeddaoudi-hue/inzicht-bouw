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
voeg('', I.HOME.cta.kop); voeg('', I.HOME.cta.tekst); voeg('', I.HOME.cta.knop); voeg('diensten/', I.HOME.cta.knop); voeg('', I.HOME.vragenKop);
I.VRAGEN.lijst.forEach((f) => { voeg('', f.v); voeg('', f.a); voeg('vragen/', f.v); voeg('vragen/', f.a); });
voeg('diensten/', I.DIENSTEN_PAGINA.kop.join(' ')); voeg('diensten/', I.DIENSTEN_PAGINA.intro);
I.DIENSTEN.forEach((d) => { voeg('diensten/', d.naam); voeg('diensten/', d.tekst); d.punten.forEach((p) => voeg('diensten/', p)); });
voeg('over-ons/', I.OVER.kop.join(' ')); I.OVER.alineas.forEach((a) => voeg('over-ons/', a));
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
console.log('GROEN alle copy staat woordelijk op de juiste pagina');
