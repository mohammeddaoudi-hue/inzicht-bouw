/* Alle copy van de site op één plek.
   Bron: copy van Mohammed (7 okt 2026), woordelijk overgenomen.
   Twee blogs zijn op feiten gecorrigeerd (zie CORRECTIES onderaan); al de rest staat er letterlijk. */

const SITE = {
  naam: 'INzicht',
  volledig: 'INzicht bouw en renovatie',
  tel: { href: 'tel:+32468359093', toon: '0468 35 90 93' },
  mail: 'inzicht.bouw@gmail.com',
  adres: { straat: 'Tiendeschuurstraat 134', postcode: '1910', gemeente: 'Kampenhout', regel: 'Tiendeschuurstraat 134, 1910 Kampenhout' },
  // footer-notatie (Mohammed)
  uren: [['Ma - do', '8.30 - 16.30'], ['Vrijdag', '9.00 - 15.30'], ['Za - zo', 'Gesloten']],
  // notatie contactpagina (Mohammed)
  urenContact: [['Maandag t/m donderdag', '08:30 - 16:30'], ['Vrijdag', '09:00 - 15:30'], ['Zaterdag & Zondag', 'Gesloten']],
  // schema.org
  urenSchema: [
    { dagen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], open: '08:30', dicht: '16:30' },
    { dagen: ['Friday'], open: '09:00', dicht: '15:30' },
  ],
  copyright: '© 2026 INzicht bouw en renovatie',
  // publicatie-instellingen
  url: 'https://mohammeddaoudi-hue.github.io/inzicht-bouw',
  basis404: '/inzicht-bouw/',
  noindex: true,
};

const NAV = [
  { label: 'Diensten', pad: 'diensten/' },
  { label: 'Over ons', pad: 'over-ons/' },
  { label: 'Vragen', pad: 'vragen/' },
  { label: 'Tips', pad: 'tips/' },
  { label: 'Contact', pad: 'contact/' },
];
const FOOTER_MENU = [...NAV, { label: 'Privacybeleid', pad: 'privacy/' }];

const KNOP = { plaatsbezoek: 'Gratis plaatsbezoek' };

/* ── HOME ─────────────────────────────────────────────────────────────── */
const HOME = {
  titel: 'INzicht – bouw en renovatie',
  beschrijving: 'Wij nemen uw renovatie of nieuwbouw volledig aan, met het ontwerp en de coördinatie erbij. Gratis plaatsbezoek in de ruime regio rond Kampenhout.',
  hero: {
    kop: ['Bouw en renovatie', 'naar uw wens'],
    tekst: 'Wij nemen uw renovatie of nieuwbouw volledig aan, met het ontwerp en de coördinatie erbij. Geen stress over overlappende planningen met losse aannemers: wij regelen uw werf van A tot Z, met één vast aanspreekpunt.',
    knop1: 'Plan uw gratis plaatsbezoek',
    knop2: 'Bekijk de diensten',
  },
  werkwijze: {
    kop: 'Uw werf loopt volgens plan',
    punten: [
      { titel: 'Een concept binnen uw budget', tekst: 'We luisteren eerst naar uw wensen. Daarna werken we een concept uit dat binnen uw budget past. Wat we afspreken, voeren we uit voor die prijs. Geen onaangename verrassingen achteraf.', ic: 'plan' },
      { titel: 'Een projectleider vanaf de startvergadering', tekst: 'Vanaf de eerste bespreking krijgt u één vaste projectleider toegewezen. Hij regelt de planning, stuurt de vakmensen aan en coördineert externe partners. Voor alle vragen heeft u één direct aanspreekpunt.', ic: 'helm' },
      { titel: 'Elke week een werfverslag', tekst: 'Tot de laatste afwerking ontvangt u elke week een gedetailleerde vorderingsstaat van uw werf. Zo volgt u de voortgang op de voet, zonder dat u zelf dagelijks aanwezig hoeft te zijn.', ic: 'verslag' },
    ],
  },
  /* Inleiding: door Claude geschreven in de stijl van Mohammeds copy (7 okt 2026, op zijn vraag "eerst een sectie kort inleiding inzicht").
     Inhoud komt uit zijn over-ons-tekst; geen nieuwe beloftes. */
  intro: {
    kop: 'Bouwen met heldere afspraken',
    lead: 'INzicht bouw en renovatie is een bouwbedrijf uit Kampenhout. Het bedrijf is ontstaan vanuit een eenvoudige behoefte: duidelijke communicatie en betrouwbare afspraken met de bouwheer.',
    tekst: 'Daarom werkt u bij ons met eigen vakmensen en een vaste projectleider. Hij houdt uw werf in handen, en elke week krijgt u een werfverslag met de stand van de werken.',
    knop: 'Lees ons verhaal',
  },
  diensten: { kop: 'Wat wij bouwen en verbouwen', knop: 'Ontdek alle diensten in detail' },
  vragenKop: 'Veelgestelde vragen',
  tipsKop: 'Tips & Inzichten voor uw verbouwing',
  cta: {
    kop: 'Plan uw gratis plaatsbezoek',
    tekst: 'Vertel ons wat u wilt bouwen of verbouwen. We komen langs voor een vrijblijvende offerte in de ruime regio rond Kampenhout.',
    knop: 'Plaatsbezoek aanvragen',
  },
};

/* ── DIENSTEN ─────────────────────────────────────────────────────────── */
const DIENSTEN_PAGINA = {
  titel: 'Diensten · INzicht bouw en renovatie',
  beschrijving: 'Totaalrenovatie en nieuwbouw, ecologisch bouwen, dakwerken, gevelrenovatie, badkamers en interieurwerken. De zes pijlers van INzicht bouw en renovatie.',
  kop: ['Onze expertise', 'onder één dak'],
  intro: 'Bij INzicht werken we met gespecialiseerde afdelingen. Deze werken naadloos samen om uw totaalproject van de eerste steen tot de laatste lik verf vakkundig af te ronden. Dit zijn onze zes pijlers.',
};

/* naam = titel op de dienstenpagina; kort = titel + tekst uit "Diensten (Kort)" op de home;
   punten = de onderdelen uit die korte tekst, als lijst gezet (zelfde woorden). */
const DIENSTEN = [
  {
    slug: 'totaalrenovatie-en-nieuwbouw', nr: '01',
    naam: 'Totaalrenovatie en nieuwbouw',
    kortNaam: 'Totaalrenovatie en nieuwbouw',
    kortTekst: 'Volledige ontzorging. Van grondige totaalrenovatie en stevige uitbreiding tot een complete nieuwbouwwoning.',
    tekst: 'Een vlotte werf vereist een strakke coördinatie. Of u nu een bestaande woning volledig stript, een aanbouw plaatst voor extra leefruimte of een nieuwbouw zet: wij bewaken de overgang tussen elke bouwfase. Zo loopt het project geen vertraging op en klopt het eindresultaat met uw oorspronkelijke visie.',
    punten: ['Grondige totaalrenovatie', 'Stevige uitbreiding', 'Complete nieuwbouwwoning'],
    img: 'd-totaal', alt: 'Woning in renovatie, gestript tot de ruwbouw met stempels onder het plafond',
  },
  {
    slug: 'ecologisch-en-energetisch', nr: '02',
    naam: 'Ecologisch en energetisch bouwen',
    kortNaam: 'Ecologisch en energetisch',
    kortTekst: 'Warmtepompen en hoogwaardige, naadloze isolatie van uw dak, vloer en wand.',
    tekst: 'Klaar voor de energienormen van morgen. Wij optimaliseren de buitenschil van uw woning met hoogwaardige dak-, vloer- en wandisolatie. Daarnaast integreren we moderne technieken zoals warmtepompen, zodat uw woning niet alleen comfortabeler wordt, maar uw energiefactuur ook structureel daalt.',
    punten: ['Warmtepompen', 'Naadloze isolatie van dak, vloer en wand'],
    img: 'd-eco', alt: 'Warmtepomp naast een bakstenen woning in de tuin',
  },
  {
    slug: 'dakwerken', nr: '03',
    naam: 'Dakwerken',
    kortNaam: 'Dakwerken',
    kortTekst: 'Hellende daken met pannen en zinkwerk, platte daken, dakramen, dakkapellen en dakisolatie.',
    tekst: 'Een dak moet tientallen jaren onderhoudsvrij meegaan. Wij vernieuwen hellende daken (inclusief pannen en zinkwerk op maat) en plaatsen naadloze platte daken. We integreren dakramen of dakkapellen voor meer lichtinval en zorgen altijd voor isolatie die voldoet aan de laatste EPB-eisen.',
    punten: ['Hellende daken met pannen en zinkwerk', 'Platte daken', 'Dakramen en dakkapellen', 'Dakisolatie'],
    img: 'd-dak', alt: 'Dakwerker op een pannendak met stelling en valbeveiliging',
  },
  {
    slug: 'gevelrenovatie', nr: '04',
    naam: 'Gevelrenovatie',
    kortNaam: 'Gevelrenovatie',
    kortTekst: 'Crepi, steenstrips, gevelbekleding in hout of composiet, perfect gecombineerd met buitenisolatie.',
    tekst: 'Geef uw woning een strak, nieuw aanzicht én isoleer langs de buitenkant. Dat is de meest efficiënte manier van renoveren. Wij zijn gespecialiseerd in het aanbrengen van crepi, steenstrips en duurzame gevelbekleding (hout of composiet), steevast gecombineerd met de juiste buitenisolatie.',
    punten: ['Crepi en steenstrips', 'Gevelbekleding in hout of composiet', 'Gecombineerd met buitenisolatie'],
    img: 'd-gevel', alt: 'Bakstenen gevel met houten raamkader',
  },
  {
    slug: 'badkamer-en-wellness', nr: '05',
    naam: 'Badkamer en wellness',
    kortNaam: 'Badkamer en wellness',
    kortTekst: 'Volledige badkamerrenovatie, strakke inloopdouches, tegelwerk, sanitair en vloerverwarming.',
    tekst: 'Wij strippen uw oude badkamer en bouwen hem volledig opnieuw op. We vernieuwen het achterliggende leidingwerk en zorgen voor een feilloze afwerking. Van waterdichte inloopdouches en grootformaat tegelwerk tot de installatie van modern sanitair en comfortabele vloerverwarming.',
    punten: ['Volledige badkamerrenovatie', 'Strakke inloopdouches', 'Tegelwerk en sanitair', 'Vloerverwarming'],
    img: 'd-bad', alt: 'Gerenoveerde badkamer met grijze tegels, inloopdouche en ligbad',
  },
  {
    slug: 'interieurwerken', nr: '06',
    naam: 'Interieurwerken',
    kortNaam: 'Interieurwerken',
    kortTekst: 'Gyproc wanden en plafonds, maatwerk (kasten, binnendeuren), vloeren en de inrichting van uw kantoor of thuiswerkplek.',
    tekst: 'De afwerking bepaalt de sfeer van uw woning. Onze interieurafdeling plaatst strakke Gyproc wanden en verlaagde plafonds, en legt vloeren met uiterste precisie. Daarnaast verzorgen we maatwerk: van ingemaakte kasten en kamerhoge binnendeuren tot de complete inrichting van uw thuiskantoor.',
    punten: ['Gyproc wanden en plafonds', 'Maatwerk: kasten en binnendeuren', 'Vloeren', 'Inrichting van uw kantoor of thuiswerkplek'],
    img: 'd-interieur', alt: 'Ruimte in afwerking met gyprocplaten, verlaagd plafond en vloerverwarmingscollector',
  },
];

/* ── OVER ONS ─────────────────────────────────────────────────────────── */
const OVER = {
  titel: 'Over ons · INzicht bouw en renovatie',
  beschrijving: 'INzicht bouw en renovatie uit Kampenhout: heldere communicatie, betrouwbare afspraken en een strak gecoördineerde werf.',
  kop: ['Bouwen met', 'gezond verstand'],
  alineas: [
    'INzicht bouw en renovatie is ontstaan vanuit een simpele, maar cruciale behoefte in de bouwsector: heldere communicatie en betrouwbare afspraken.',
    'Bouwen of verbouwen is voor de meeste mensen een van de grootste investeringen in hun leven. Toch horen we te vaak verhalen over aannemers die niet komen opdagen, offertes die halverwege het project ontploffen, en bouwheer en vakman die langs elkaar heen praten.',
    'Vanuit onze uitvalsbasis in Kampenhout doen wij het anders. Wij geloven dat een strak gecoördineerde werf rust geeft. Door te werken met eigen, gespecialiseerde vakmensen en een vaste projectleider, halen we de ruis van de lijn. We luisteren, we ontwerpen, we begroten eerlijk, en we voeren uit wat we beloven. Nuchter, professioneel en altijd volgens plan.',
  ],
};

/* ── VRAGEN ───────────────────────────────────────────────────────────── */
const VRAGEN = {
  titel: 'Veelgestelde vragen · INzicht bouw en renovatie',
  beschrijving: 'Antwoorden op de vragen die we het vaakst krijgen: prijsafspraken, architect en vergunning, planning, opvolging van de werf en het gratis plaatsbezoek.',
  kop: 'Veelgestelde vragen',
  lijst: [
    { v: 'Werken jullie met een vaste prijs, of komen er achteraf kosten bij?', a: 'We maken vooraf heldere afspraken. U krijgt een gedetailleerde offerte en wat daarin staat, is de prijs die u betaalt. Wilt u tijdens de werken toch nog iets wijzigen? Dan bespreken we altijd eerst de impact op het budget voordat we uitvoeren. Geen verrassingsfacturen achteraf.' },
    { v: 'Moet ik zelf een architect of bouwvergunning regelen?', a: 'Dat mag, maar hoeft niet. Heeft u nog geen architect, dan brengen we u in contact met onze vaste partners. We begeleiden u ook bij het aanvragen van de nodige vergunningen of meldingen voor uw project.' },
    { v: 'Wanneer neem ik het best contact op voor een renovatie?', a: 'Een goed voorbereid project vraagt tijd. Voor totaalrenovaties of een uitbreiding neemt u best 3 tot 6 maanden voor de gewenste startdatum contact met ons op. Zo kunnen we het ontwerp, de materialen en de planning grondig voorbereiden.' },
    { v: 'Wie volgt mijn werf op?', a: 'U krijgt een vaste projectleider toegewezen. Hij is verantwoordelijk voor de planning, de werfvergaderingen en de aansturing van alle vakmensen op de werf. U hoeft dus niet zelf achter aannemers aan te bellen.' },
    { v: 'Is het eerste plaatsbezoek echt gratis?', a: 'Ja, ons eerste bezoek is altijd gratis en vrijblijvend. We komen ter plaatse om de situatie in te schatten en uw wensen te bespreken, zodat we een accuraat voorstel kunnen doen.' },
  ],
};

/* ── TIPS (BLOGS) ─────────────────────────────────────────────────────── */
const TIPS = {
  titel: 'Tips & Inzichten · INzicht bouw en renovatie',
  beschrijving: 'Praktische tips voor uw verbouwing: badkamerrenovatie en woningwaarde, vergunningen voor een aanbouw en de renovatiepremies voor dak en gevel.',
  kop: ['Tips & Inzichten', 'voor uw verbouwing'],
};

const BLOGS = [
  {
    slug: 'badkamerrenovatie-waarde-woning', label: 'Badkamer',
    titel: 'Hoe een badkamerrenovatie de waarde van uw woning verhoogt',
    intro: 'Kandidaat-kopers kijken bij een woningbezoek naar twee ruimtes met een extra kritische blik: de keuken en de badkamer. Een verouderde badkamer is voor veel kopers een struikelblok. Ze rekenen de kosten voor een renovatie direct af in hun bod, vaak ruimer dan wat de verbouwing werkelijk kost. Een strategische badkamerrenovatie betaalt zichzelf dan ook grotendeels terug in de verkoopprijs.',
    punten: [
      { b: 'De \'instapklare\' troef:', t: 'De huidige vastgoedmarkt hecht enorm veel belang aan instapklare woningen. Mensen hebben minder tijd en budget voor onverwachte renovaties na aankoop. Een moderne, afgewerkte badkamer neemt een grote zorg weg.' },
      { b: 'Tijdloos en onderhoudsvriendelijk:', t: 'Een knalrode tegel is smaakgevoelig. Kiest u voor lichte, neutrale kleuren, grote keramische tegels (minder voegen) en een strakke inloopdouche, dan spreekt u een breed publiek aan.' },
      { b: 'Technisch op orde:', t: 'Nieuw leidingwerk, een waterbesparende regendouche en een energiezuinige warmtepompboiler verbeteren de energetische score van uw woning. Vandaag een keihard verkoopargument.' },
    ],
    noot: '',
    img: 'd-bad-2', alt: 'Badkamer met ligbad, houten lamellen en grote spiegel',
  },
  {
    slug: 'aanbouw-vergunning', label: 'Vergunning',
    titel: 'Aanbouw of uitbreiding: wanneer is een vergunning verplicht?',
    intro: 'Een stuk aanbouwen voor een leefkeuken of thuiskantoor is een populaire manier om meer uit uw woning te halen. Maar mag u zomaar beginnen bouwen?',
    punten: [
      // GECORRIGEERD (zie CORRECTIES): de meldingsplicht voor aangebouwde bijgebouwen is sinds 1 maart 2026 afgeschaft
      { b: 'De meldingsplicht is afgeschaft:', t: 'Voor een aangebouwd bijgebouw gold vroeger vaak een meldingsplicht. Sinds 1 maart 2026 valt een aanbouw aan uw woning terug onder de vergunningsplicht. Alleen vrijstaande bijgebouwen blijven onder strikte voorwaarden vrijgesteld, tot samen maximaal 40 vierkante meter per perceel.' },
      { b: 'Wanneer is een omgevingsvergunning nodig?', t: 'Voor een aanbouw of uitbreiding aan uw woning heeft u sinds 1 maart 2026 in de regel een omgevingsvergunning nodig. Kijk de voorwaarden na op het Omgevingsloket of bij uw gemeente voor u plannen laat tekenen.' },
      { b: 'Heeft u een architect nodig?', t: 'Zodra we voor uw aanbouw een gat maken in een dragende buitenmuur, raakt dit aan de stabiliteit van de woning. Op dat moment eist de wetgever altijd de tussenkomst van een architect.' },
    ],
    noot: '',
    img: 'd-totaal', alt: 'Woning in verbouwing met stempels onder het plafond',
  },
  {
    slug: 'renovatiepremies-dak-gevel', label: 'Premies',
    titel: 'Welke renovatiepremies kunt u nog aanvragen voor dak of gevel?',
    intro: 'Een dak dat warmte binnenhoudt of een strak geïsoleerde gevel zijn de meest rendabele investeringen in uw woning. Om deze kosten te verzachten, kunt u in Vlaanderen rekenen op de Mijn VerbouwPremie.',
    punten: [
      { b: 'Dakwerken en dakisolatie:', t: 'De premie geldt niet enkel voor de isolatie, maar vaak ook voor werken eromheen: het afbreken van de oude bedekking, een nieuw onderdak, pannen, leien en soms zelfs de draagstructuur. Ook dakramen kunnen in aanmerking komen.' },
      { b: 'Buitenmuur en gevelrenovatie:', t: 'Plaatst u isolatie langs de buitenzijde, afgewerkt met crepi of steenstrips? Dan kunt u via Mijn VerbouwPremie een aanzienlijk deel recupereren.' },
      // GECORRIGEERD (vlaanderen.be, ruwe pagina's dak en buitenmuur gelezen op 7 okt 2026): categorie 1 en 2 krijgen sinds 1 maart 2026 niets meer; bedragen per categorie
      { b: 'Hoeveel krijgt u terug?', t: 'Dit hangt af van uw inkomenscategorie. Voor de hoogste inkomens (categorie 1 en 2) is er sinds 1 maart 2026 geen premie meer voor dak of buitenmuur. Voor middelste en lagere inkomens kan dit oplopen tot 35% (categorie 3) of 50% (categorie 4) van het factuurbedrag zonder btw. Het maximum is 4.025 of 5.750 euro voor het dak en 3.500 of 5.000 euro voor de buitenmuur.' },
    ],
    noot: 'Let op: werken moeten altijd uitgevoerd worden door een aannemer.',
    bron: [
      { label: 'Mijn VerbouwPremie voor dak', href: 'https://www.vlaanderen.be/premies-voor-renovatie/mijn-verbouwpremie/mijn-verbouwpremie-voor-dak' },
      { label: 'Mijn VerbouwPremie voor buitenmuur', href: 'https://www.vlaanderen.be/premies-voor-renovatie/mijn-verbouwpremie/mijn-verbouwpremie-voor-buitenmuur' },
    ],
    img: 'd-eco-2', alt: 'Zolder met nieuwe isolatie en dakramen',
  },
];

/* ── CONTACT ──────────────────────────────────────────────────────────── */
const CONTACT = {
  titel: 'Contact · INzicht bouw en renovatie',
  beschrijving: 'Bespreek uw project met INzicht bouw en renovatie. Bel 0468 35 90 93 of vul het formulier in voor een gratis plaatsbezoek.',
  kop: 'Bespreek uw project',
  tekst: 'Klaar om uw bouw- of renovatieplannen concreet te maken? Vul het formulier in of bel ons direct. We plannen op korte termijn een gratis plaatsbezoek in om uw werf te bekijken.',
  gegevensKop: 'Contactgegevens',
  urenKop: 'Openingsuren',
  knop: 'Verzenden',
};

/* Formulier (velden uit de contactpagina van Mohammed; ook in het venster) */
const FORM = {
  kop: 'Plan uw gratis plaatsbezoek',
  sub: 'We plannen op korte termijn een gratis plaatsbezoek in om uw werf te bekijken.',
  velden: {
    naam: 'Voornaam & Naam',
    mail: 'E-mailadres',
    tel: 'Telefoonnummer',
    straat: 'Straat & Huisnummer',
    gemeente: 'Postcode & Gemeente',
    werk: 'Om welk werk gaat het?',
    werkLeeg: 'Maak een keuze',
    werkCombi: 'Combinatie of weet ik nog niet',
    project: 'Beschrijf kort uw project',
    projectHint: 'Type werken, gewenste startdatum, etc.',
  },
  knop: 'Verzenden',
  privacy: 'We gebruiken uw gegevens enkel om uw aanvraag te behandelen. Lees ons',
  privacyLink: 'privacybeleid',
};

/* ── PRIVACY ──────────────────────────────────────────────────────────── */
const PRIVACY = {
  titel: 'Privacybeleid · INzicht bouw en renovatie',
  beschrijving: 'Hoe INzicht bouw en renovatie omgaat met uw persoonsgegevens.',
  kop: 'Privacybeleid INzicht bouw en renovatie',
  intro: 'INzicht bouw en renovatie hecht veel belang aan uw privacy. In deze verklaring leggen we uit welke persoonsgegevens we verzamelen, waarom we dit doen en hoe we hiermee omgaan in overeenstemming met de GDPR-wetgeving.',
  delen: [
    { kop: '1. Wie we zijn', p: ['INzicht bouw en renovatie is gevestigd te Tiendeschuurstraat 134, 1910 Kampenhout. Wij zijn de verantwoordelijke voor de verwerking van uw gegevens. Bij vragen kunt u ons bereiken via inzicht.bouw@gmail.com.'] },
    { kop: '2. Welke gegevens we verzamelen', p: ['Wij verzamelen enkel de gegevens die u vrijwillig aan ons verstrekt via het contactformulier, per e-mail of telefonisch. Dit omvat: uw voor- en achternaam, adresgegevens, telefoonnummer, e-mailadres en de projectomschrijving.'] },
    { kop: '3. Waarom we deze gegevens verzamelen', p: ['Wij verwerken uw persoonsgegevens uitsluitend voor de volgende doeleinden:'], lijst: ['Het inplannen van een plaatsbezoek en het opmaken van een correcte offerte.', 'De communicatie en administratieve afhandeling tijdens de uitvoering van uw bouwproject.', 'Wettelijke verplichtingen (zoals facturatie en boekhouding).'] },
    { kop: '4. Delen met derden', p: ['Uw gegevens worden nooit verkocht aan derden. Wij delen uw gegevens enkel met externe partners (zoals onderaannemers of een architect) indien dit strikt noodzakelijk is voor de uitvoering van uw project, en altijd in overleg met u.'] },
    { kop: '5. Bewaartermijn', p: ['Wij bewaren uw gegevens niet langer dan noodzakelijk is voor de doelen waarvoor ze zijn verzameld, of zolang de wet ons verplicht deze te bewaren (bijvoorbeeld de wettelijke termijn voor de tienjarige aansprakelijkheid in de bouw).'] },
    { kop: '6. Uw rechten', p: ['U heeft het recht om op elk moment inzage te vragen in uw persoonsgegevens. Daarnaast heeft u het recht om deze te laten corrigeren of te laten verwijderen uit ons systeem, mits dit niet in strijd is met onze wettelijke bewaarplichten. Neem hiervoor contact op via inzicht.bouw@gmail.com.'] },
  ],
};

/* Wat er van de aangeleverde copy is afgeweken, en waarom (gemeld aan Mohammed op 7 okt 2026). */
const CORRECTIES = [
  'Blog premies (7 okt, na keuring tegen de ruwe paginas van vlaanderen.be): de zinnen van Mohammed over dak en buitenmuur kloppen voor categorie 3 en 4 en staan er weer. Alleen "hoogste inkomens: vast bedrag per vierkante meter" was fout: categorie 1 en 2 krijgen sinds 1 maart 2026 niets meer. Bedragen: dak 35% max 4.025 / 50% max 5.750, buitenmuur 35% max 3.500 / 50% max 5.000. "erkende aannemer" werd "aannemer".',
  'Blog vergunning: meldingsplicht voor aangebouwde bijgebouwen is sinds 1 maart 2026 afgeschaft (wijziging Vrijstellingsbesluit); de cijfers 4 meter en 2 tot 3 meter zijn weg.',
];

module.exports = { SITE, NAV, FOOTER_MENU, KNOP, HOME, DIENSTEN_PAGINA, DIENSTEN, OVER, VRAGEN, TIPS, BLOGS, CONTACT, FORM, PRIVACY, CORRECTIES };
