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
/* Alinea van Mohammed (7 okt 2026, avond). Zijn antwoord op de vraag waar ze hoort: "over ons, subheadline, en de eerste sectie onder hero".
   Daarom: subheadline in de hero van Over ons én tekst van de inleiding onder de hero op de home. Woordelijk. */
const TOTAALAANNEMER = 'Een succesvol bouwproject begint bij een sterke fundering en een ijzersterke organisatie. Als totaalaannemer nemen we de volledige regie van uw project in handen. Of u nu een particuliere bouwheer bent met exclusieve woonplannen, of een ontwikkelaar die op zoek is naar een betrouwbare uitvoerder: wij bundelen alle disciplines om uw visie efficiënt en volgens de strengste normen te bouwen. Geen versnipperde verantwoordelijkheden, maar één partner die het overzicht bewaart.';

const HOME = {
  titel: 'INzicht bouw en renovatie · Kampenhout',
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
  /* Inleiding onder de hero: kop en knop van Claude, tekst = zijn alinea TOTAALAANNEMER (7 okt 2026). */
  intro: {
    kop: 'Een bouwbedrijf uit Kampenhout',
    lead: TOTAALAANNEMER,
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
/* Volledige Over ons-pagina: copy van Mohammed (7 okt 2026, "3. Volledige 'Over ons' Pagina"), woordelijk.
   Alleen titel (paginatitel) en beschrijving (meta) zijn van Claude. */
const OVER = {
  titel: 'Over ons · INzicht bouw en renovatie',
  beschrijving: 'INzicht bouw en renovatie is totaalaannemer: één partner met de volledige regie over uw bouwproject.',
  kop: ['Dé totaalaannemer', 'voor hoogwaardige bouwprojecten'],
  sub: TOTAALAANNEMER,
  intro: 'Bouwen is vooruitkijken. Of het nu gaat om een complexe totaalrenovatie, een exclusieve nieuwbouw of een grootschalig ontwikkelingsproject: u investeert in de toekomst. Bij INzicht staan we garant voor een bouwproces dat even solide is als het eindresultaat. Geen loze beloftes, wel daadkracht en doordacht projectmanagement.',
  delen: [
    {
      kop: 'De kracht van totaalaanneming',
      tekst: 'Wij nemen de volledige verantwoordelijkheid voor uw project. Door alle bouwfases naadloos op elkaar af te stemmen – van de fundering en ruwbouw tot de meest verfijnde interieurafwerking – elimineren we de typische wachttijden en faalkosten van de klassieke bouw. Wij overzien het grotere plaatje én bewaken de kleinste details. Het resultaat? Een aanzienlijk vlotter traject en een afwerkingsgraad van het hoogste niveau.',
      img: 'd-totaal-2', alt: 'Afgewerkte, lichte leefruimte met een witte zetel en kleurrijke kussens',
    },
    {
      kop: 'Partner voor bouwheren, architecten en ontwikkelaars',
      tekst: 'Elk bouwproject vraagt een specifieke aanpak. Hebt u al een architect en een volledig uitgewerkt dossier? Dan treden wij op als de uitvoerende kracht die het ontwerp met de grootste precisie tot leven brengt. Hebt u enkel nog maar een visie of een bouwgrond? We denken proactief met u mee en adviseren u over de technische haalbaarheid en materiaalkeuzes, nog voor de eerste steen gelegd wordt.',
      img: 'werkwijze-hero', alt: 'Handen die een bouwplan tekenen op een houten tafel',
    },
    {
      kop: 'Absolute controle en transparantie',
      tekst: 'Een premium project vereist een waterdicht financieel en operationeel beheer. Wij werken uitsluitend met gedetailleerde meetstaten, reële inschattingen en een strakke centrale werfcoördinatie. U wordt continu op de hoogte gehouden van de voortgang, zonder dat u zich hoeft te verdiepen in de operationele details. Geen onverwachte verrassingen, maar een transparante samenwerking waarbij budget en timing strikt gerespecteerd worden.',
      img: 'meetstaat', alt: 'Bouwplannen op tafel met een rekenmachine en een potlood',
    },
  ],
};

/* ── VRAGEN ───────────────────────────────────────────────────────────── */
const VRAGEN = {
  titel: 'Veelgestelde vragen · INzicht bouw en renovatie',
  beschrijving: 'Antwoorden op de vragen die bouwheren ons het vaakst stellen over hun bouw- of renovatieproject.',
  kop: 'Veelgestelde vragen',
  lijst: [
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
    datum: '2026-10-07',
    img: 'd-bad-3', alt: 'Badkamer met beige tegels, een houten badmeubel met twee wastafels en een inloopdouche',
  },
  {
    slug: 'aanbouw-vergunning', label: 'Vergunning',
    titel: 'Aanbouw of uitbreiding: wanneer is een vergunning verplicht?',
    intro: 'Een stuk aanbouwen voor een leefkeuken of thuiskantoor is een populaire manier om meer uit uw woning te halen. Maar mag u zomaar beginnen bouwen?',
    punten: [
      // GECORRIGEERD (zie CORRECTIES): de meldingsplicht voor aangebouwde bijgebouwen is sinds 1 maart 2026 afgeschaft
      { b: 'De meldingsplicht is afgeschaft:', t: 'Voor een aangebouwd bijgebouw gold vroeger vaak een meldingsplicht. Alleen vrijstaande bijgebouwen blijven onder strikte voorwaarden vrijgesteld, tot samen maximaal 40 vierkante meter per woning.' },
      { b: 'Wanneer is een omgevingsvergunning nodig?', t: 'Voor een aanbouw of uitbreiding aan uw woning heeft u sinds 1 maart 2026 in de regel een omgevingsvergunning nodig. Kijk de voorwaarden na op het Omgevingsloket of bij uw gemeente voor u plannen laat tekenen.' },
      { b: 'Heeft u een architect nodig?', t: 'Zodra we voor uw aanbouw een gat maken in een dragende buitenmuur, raakt dit aan de stabiliteit van de woning. Op dat moment eist de wetgever altijd de tussenkomst van een architect.' },
    ],
    noot: '',
    // bronnen gelezen op 7 okt 2026 (ruwe HTML vlaanderen.be)
    bron: [
      { label: 'Een woning uitbreiden met een aanbouw', href: 'https://www.vlaanderen.be/omgevingsvergunning/stedenbouwkundige-handelingen/uitbreiden-en-aanbouwen' },
      { label: 'Vrijstaande bijgebouwen', href: 'https://www.vlaanderen.be/omgevingsvergunning/stedenbouwkundige-handelingen/vrijstaande-bijgebouwen' },
    ],
    datum: '2026-10-07',
    img: 'werkwijze-hero', alt: 'Handen die een bouwplan tekenen op een houten tafel',
  },
  {
    slug: 'renovatiepremies-dak-gevel', label: 'Premies',
    titel: 'Welke renovatiepremies kunt u nog aanvragen voor dak of gevel?',
    intro: 'Een dak dat warmte binnenhoudt of een strak geïsoleerde gevel zijn de meest rendabele investeringen in uw woning. Om deze kosten te verzachten, kunt u in Vlaanderen rekenen op de Mijn VerbouwPremie.',
    punten: [
      { b: 'Dakwerken en dakisolatie:', t: 'De premie geldt niet enkel voor de isolatie, maar vaak ook voor werken eromheen: het afbreken van de oude bedekking, een nieuw onderdak, pannen, leien en soms zelfs de draagstructuur. Ook dakramen kunnen in aanmerking komen.' },
      { b: 'Buitenmuur en gevelrenovatie:', t: 'Plaatst u isolatie langs de buitenzijde, afgewerkt met crepi of steenstrips? Dan kunt u via Mijn VerbouwPremie een aanzienlijk deel recupereren.' },
      // GECORRIGEERD (vlaanderen.be, ruwe pagina's dak en buitenmuur gelezen op 7 okt 2026): categorie 1 en 2 krijgen sinds 1 maart 2026 niets meer; bedragen per categorie
      { b: 'Hoeveel krijgt u terug?', t: 'Dit hangt af van uw inkomenscategorie. Voor de hoogste en middelste inkomens (categorie 1 en 2) is er sinds 1 maart 2026 geen premie meer voor dak of buitenmuur. Voor de laagste inkomens kan dit oplopen tot 35% (categorie 3) of 50% (categorie 4) van het factuurbedrag zonder btw. Het maximum is 4.025 of 5.750 euro voor het dak en 3.500 of 5.000 euro voor de buitenmuur.' },
    ],
    noot: 'Let op: werken moeten altijd uitgevoerd worden door een aannemer.',
    bron: [
      { label: 'Mijn VerbouwPremie voor dak', href: 'https://www.vlaanderen.be/premies-voor-renovatie/mijn-verbouwpremie/mijn-verbouwpremie-voor-dak' },
      { label: 'Mijn VerbouwPremie voor buitenmuur', href: 'https://www.vlaanderen.be/premies-voor-renovatie/mijn-verbouwpremie/mijn-verbouwpremie-voor-buitenmuur' },
    ],
    datum: '2026-10-07',
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
  'Blog premies (7 okt, na keuring tegen de ruwe paginas van vlaanderen.be): de zinnen van Mohammed over dak en buitenmuur kloppen voor categorie 3 en 4 en staan er weer. Alleen "hoogste inkomens: vast bedrag per vierkante meter" was fout: categorie 1 en 2 krijgen sinds 1 maart 2026 niets meer. Benaming volgens vlaanderen.be: categorie 1 = hoogste, categorie 2 = middelste, categorie 3 en 4 = laagste inkomens. Bedragen: dak 35% max 4.025 / 50% max 5.750, buitenmuur 35% max 3.500 / 50% max 5.000. "erkende aannemer" werd "aannemer".',
  'Blog vergunning: meldingsplicht voor aangebouwde bijgebouwen is sinds 1 maart 2026 afgeschaft (wijziging Vrijstellingsbesluit); de cijfers 4 meter en 2 tot 3 meter zijn weg.',
];

module.exports = { SITE, NAV, FOOTER_MENU, KNOP, HOME, DIENSTEN_PAGINA, DIENSTEN, OVER, VRAGEN, TIPS, BLOGS, CONTACT, FORM, PRIVACY, CORRECTIES };
