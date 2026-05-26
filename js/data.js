// =====================================================================
// data.js — All location data for Hardanger & Sogn travel app
// =====================================================================

const APP_CONFIG = {
  startDate: '2026-06-12',
  endDate: '2026-06-20',
  people: 2,
  tripDays: 9,
  mapCenter: [60.65, 7.0],
  mapZoom: 9,
  currency: 'NOK'
};

// =====================================================================
// BOOKING URL HELPERS
// =====================================================================

// Direkte hotell-side URL (slug-basert — ingen søkeside som gir feil treff)
function lagHotellBookingUrl(slug, innsjekk, utsjekk) {
  return `https://www.booking.com/hotel/no/${slug}.html?checkin=${innsjekk}&checkout=${utsjekk}&group_adults=2&no_rooms=1&lang=nb&selected_currency=NOK`;
}

// Beholdes for bakoverkompatibilitet (brukes i tester)
function lagBookingUrl(hotelNavn, sted, innsjekk, utsjekk) {
  const sokeord = encodeURIComponent(hotelNavn + ', ' + sted + ', Norway');
  return `https://www.booking.com/searchresults.html?ss=${sokeord}&checkin=${innsjekk}&checkout=${utsjekk}&group_adults=2&no_rooms=1&lang=nb&selected_currency=NOK`;
}

function datoForDag(dagNr) {
  // dagNr 0 = 12. juni (ankomst/bryllupsdag), osv.
  const d = new Date('2026-06-12');
  d.setDate(d.getDate() + dagNr);
  return d.toISOString().split('T')[0];
}

// =====================================================================
// HOTELLER
// =====================================================================

const HOTELLER = [
  {
    id: 'brakanes',
    navn: 'Brakanes Hotell',
    sted: 'Ulvik',
    region: 'Hardanger',
    lat: 60.5705,
    lng: 6.9072,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Historisk fjordhotell i Ulvik med fantastisk utsikt over Hardangerfjorden og blomstrende epletrær. Idyllisk startpunkt for turen.',
    fasiliteter: ['Restaurant', 'Bar', 'Gratis parkering', 'Fjordutsikt', 'Terrasse', 'WiFi'],
    telefon: '+47 56 52 61 05',
    web: 'https://www.brakanes-hotel.no',
    wiki: 'https://no.wikipedia.org/wiki/Ulvik',
    bookingSearch: 'Brakanes Hotell Ulvik',
    bookingSlug: 'brakanes-hotel',
    startHotell: true,
    bryllup: true
  },
  {
    id: 'ullensvang',
    navn: 'Ullensvang Hotel',
    sted: 'Lofthus',
    region: 'Hardanger',
    lat: 60.3517,
    lng: 6.6572,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Legendarisk hotell i Lofthus, Edvard Grieg-forbindelsen. Perfekt utgangspunkt for Dronningstien. Fantastisk beliggenhet i frukthagene ved Sørfjorden.',
    fasiliteter: ['Restaurant', 'Spa', 'Pool', 'Tennisbane', 'Fjordutsikt', 'WiFi'],
    telefon: '+47 53 67 00 00',
    web: 'https://www.hotel-ullensvang.no',
    wiki: 'https://no.wikipedia.org/wiki/Hotel_Ullensvang',
    bookingSearch: 'Ullensvang Hotel Lofthus Hardanger',
    bookingSlug: 'ullensvang'
  },
  {
    id: 'hardanger-hotel',
    navn: 'Kinsarvik Fjordhotel',
    sted: 'Kinsarvik',
    region: 'Hardanger',
    lat: 60.3745,
    lng: 6.7280,
    stjerner: 3,
    prisklasse: '🟡🟡',
    beskrivelse: 'Trivelig fjordhotell i Kinsarvik ved munningen av Kinso-elven (BW Signature Collection). Endepunkt for Dronningstien. God beliggenhet for utforsking av Hardanger.',
    fasiliteter: ['Restaurant', 'Bar', 'Parkering', 'Fjordnær', 'WiFi'],
    telefon: '+47 53 67 19 00',
    web: 'https://www.bestwestern.no',
    wiki: 'https://no.wikipedia.org/wiki/Kinsarvik',
    bookingSearch: 'Kinsarvik Fjordhotel',
    bookingSlug: 'first-hotel-kinsarvik'
  },
  {
    id: 'utne',
    navn: 'Utne Hotel',
    sted: 'Utne',
    region: 'Hardanger',
    lat: 60.2797,
    lng: 6.5400,
    stjerner: 3,
    prisklasse: '🟡🟡',
    beskrivelse: 'Norges eldste hotell i drift siden 1722! Magisk atmosfære i det vesle Utne-samfunnet. Nasjonal kulturarv og fantastisk mat.',
    fasiliteter: ['Restaurant', 'Historisk atmosfære', 'Fjordnær', 'WiFi'],
    telefon: '+47 53 66 64 00',
    web: 'https://www.utnehotel.no',
    wiki: 'https://no.wikipedia.org/wiki/Utne_Hotel',
    bookingSearch: 'Utne Hotel Hardanger',
    bookingSlug: 'utne'
  },
  {
    id: 'eidfjord',
    navn: 'Quality Hotel Vøringfoss',
    sted: 'Eidfjord',
    region: 'Hardanger',
    lat: 60.4674,
    lng: 7.0700,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Moderne hotell i dramatiske Eidfjord omgitt av fjell og fosser (Nordic Choice Hotels). Nær Hardangervidda Nasjonalparksenter og Vøringsfossen.',
    fasiliteter: ['Restaurant', 'Bar', 'Spa', 'Pool', 'Parkering', 'WiFi'],
    telefon: '+47 53 66 52 64',
    web: 'https://www.nordicchoicehotels.no',
    wiki: 'https://no.wikipedia.org/wiki/Eidfjord',
    bookingSearch: 'Quality Hotel Voringfoss Eidfjord',
    bookingSlug: 'voringfoss-hotel'
  },
  {
    id: 'fretheim',
    navn: 'Fretheim Hotel',
    sted: 'Flåm',
    region: 'Flåm & Aurland',
    lat: 60.8630,
    lng: 7.1197,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Tradisjonsrikt hotell rett ved Flåmsbana-stasjonen og Aurlandsfjorden. Vakkert beliggende med fjell på alle kanter.',
    fasiliteter: ['Restaurant', 'Bar', 'Spa', 'Fjordnær', 'Sykkelparkering', 'WiFi'],
    telefon: '+47 57 63 63 00',
    web: 'https://www.fretheim-hotel.no',
    wiki: 'https://no.wikipedia.org/wiki/Fl%C3%A5m',
    bookingSearch: 'Fretheim Hotel Flåm Norway',
    bookingSlug: 'fretheim'
  },
  {
    id: 'flamsbrygga',
    navn: 'Flåmsbrygga Hotel',
    sted: 'Flåm',
    region: 'Flåm & Aurland',
    lat: 60.8640,
    lng: 7.1210,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Moderne boutique-hotell i hjertet av Flåm. Brygge-beliggenhet med direkteutsikt over Aurlandsfjorden. Nær Ægir Bryggeri.',
    fasiliteter: ['Restaurant', 'Bryggeri', 'Bar', 'Fjordnær', 'WiFi'],
    telefon: '+47 57 63 20 50',
    web: 'https://www.flamsbrygga.no',
    wiki: 'https://no.wikipedia.org/wiki/Fl%C3%A5m',
    bookingSearch: 'Flåmsbrygga Hotel Flåm',
    bookingSlug: 'flamsbrygga-hotell'
  },
  {
    id: 'kviknes',
    navn: 'Kviknes Hotel',
    sted: 'Balestrand',
    region: 'Balestrand & Sogndal',
    lat: 61.2008,
    lng: 6.5225,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Storslått dragestil-hotell fra 1877 ved Sognefjorden. Et av Norges vakreste og mest historiske hoteller. Kaiser Wilhelm overnatte her!',
    fasiliteter: ['Restaurant', 'Bar', 'Fjordutsikt', 'Historisk arkitektur', 'WiFi'],
    telefon: '+47 57 69 42 00',
    web: 'https://www.kviknes.no',
    wiki: 'https://no.wikipedia.org/wiki/Kviknes_Hotel',
    bookingSearch: 'Kviknes Hotel Balestrand Sognefjord',
    bookingSlug: 'kviknes'
  },
  {
    id: 'sogndal',
    navn: 'Quality Hotel Sogndal',
    sted: 'Sogndal',
    region: 'Balestrand & Sogndal',
    lat: 61.2290,
    lng: 7.0940,
    stjerner: 3,
    prisklasse: '🟡🟡',
    beskrivelse: 'Moderne hotell i Sogndal sentrum, nær Sognefjorden og Jostedalsbreen. Praktisk for utforsking av indre Sogn.',
    fasiliteter: ['Restaurant', 'Bar', 'Treningssenter', 'Parkering', 'WiFi'],
    telefon: '+47 57 62 77 00',
    web: 'https://www.nordicchoicehotels.no',
    wiki: 'https://no.wikipedia.org/wiki/Sogndal',
    bookingSearch: 'Quality Hotel Sogndal Norway',
    bookingSlug: 'quality-sogndal'
  },
  {
    id: 'laerdal',
    navn: 'Lindstrøm Hotel',
    sted: 'Lærdal',
    region: 'Lærdal & Borgund',
    lat: 61.0986,
    lng: 7.4786,
    stjerner: 3,
    prisklasse: '🟡🟡',
    beskrivelse: 'Koselig og historisk hotell i Gamle Lærdalsøyri, en av Norges best bevarte trehusbebyggelser. Rett ved Lærdalselva.',
    fasiliteter: ['Restaurant', 'Bar', 'Historisk beliggenhet', 'WiFi'],
    telefon: '+47 57 66 69 00',
    web: 'https://www.lindstromhotel.no',
    wiki: 'https://no.wikipedia.org/wiki/L%C3%A6rdal',
    bookingSearch: 'Lindstrøm Hotel Lærdal Norway',
    bookingSlug: 'lindstra-m'
  },
  {
    id: 'brimibue',
    navn: 'BrimiBue Hotel',
    sted: 'Lom',
    region: 'Lom / Jotunheimen',
    lat: 61.8400,
    lng: 8.5660,
    stjerner: 3,
    prisklasse: '🟡🟡',
    beskrivelse: 'Sjarmerende hotel i hjertet av Lom (Fossbergom), rett ved Sognefjellsvegen. Arne Brimi-tilknytning og fremragende norsk mat. Midt mellom Jotunheimen og Sognefjord – perfekt stopp på ruten.',
    fasiliteter: ['Restaurant', 'Bar', 'Parkering', 'Naturskjønn beliggenhet', 'WiFi'],
    telefon: '+47 468 54 262',
    web: 'https://brimibuehotel.no',
    wiki: 'https://no.wikipedia.org/wiki/Lom',
    bookingSearch: 'BrimiBue Hotel Lom',
    bookingSlug: 'brimibue'
  },
  {
    id: 'jaunsen',
    navn: 'Jaunsen Gjestgjevarstad',
    sted: 'Hardanger',
    region: 'Hardanger',
    lat: 60.5340,
    lng: 6.6200,
    stjerner: 3,
    prisklasse: '🟡🟡',
    beskrivelse: 'Tradisjonelt gjestgiveri i Hardanger med sjarm og lokal atmosfære. God base for å utforske fjordene og naturen i området.',
    fasiliteter: ['Restaurant', 'Parkering', 'WiFi'],
    telefon: '',
    web: '',
    wiki: 'https://no.wikipedia.org/wiki/Hardanger',
    bookingSearch: 'Jaunsen Gjestgjevarstad Hardanger',
    bookingSlug: 'jaunsen-gjestgjevarstad',
    bekreftet: true,
    innsjekk: '2026-06-14',
    utsjekk: '2026-06-16'
  },
  {
    id: 'skei',
    navn: 'Grand Hotel Skei',
    sted: 'Skei i Jølster',
    region: 'Jølster & Sunnfjord',
    lat: 61.4780,
    lng: 6.0860,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Moderne hotell ved Jølstervatnet i idylliske Jølster. Fantastisk natur med innsjø og fjell, nær Astrup Fearnley Museet og maleren Nikolai Astrup sitt heimsted.',
    fasiliteter: ['Restaurant', 'Bar', 'Spa', 'Parkering', 'Innsjønær', 'WiFi'],
    telefon: '+47 57 72 89 00',
    web: 'https://www.grandhotelskei.no',
    wiki: 'https://no.wikipedia.org/wiki/J%C3%B8lster',
    bookingSearch: 'Grand Hotel Skei Jølster Norway',
    bookingSlug: 'grand-hotel-skei',
    bekreftet: true,
    innsjekk: '2026-06-16',
    utsjekk: '2026-06-17'
  },
  {
    id: 'skjolden',
    navn: 'Skjolden Resort',
    sted: 'Skjolden',
    region: 'Luster & Skjolden',
    lat: 61.4900,
    lng: 7.5950,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Moderne resort innerst i Sognefjorden ved Skjolden. Enestående beliggenhet der Lustrafjorden møter fjellene. Perfekt utgangspunkt for Sognefjellsvegen og Jostedalsbreen.',
    fasiliteter: ['Restaurant', 'Bar', 'Spa', 'Fjordnær', 'Parkering', 'WiFi'],
    telefon: '',
    web: 'https://www.skjoldenresort.no',
    wiki: 'https://no.wikipedia.org/wiki/Skjolden',
    bookingSearch: 'Skjolden Resort Luster Sognefjord',
    bookingSlug: 'skjolden-resort',
    bekreftet: true,
    innsjekk: '2026-06-17',
    utsjekk: '2026-06-19'
  }
];

// =====================================================================
// DNT HYTTER & CAMPING
// =====================================================================

const HYTTER = [
  {
    id: 'rembesdalseter',
    navn: 'Rembesdalseter',
    type: 'DNT selvbetjent',
    sted: 'Hardangervidda vest',
    region: 'Hardanger',
    lat: 60.5167,
    lng: 7.3333,
    hoyde: 1080,
    senger: 50,
    beskrivelse: 'Selvbetjent DNT-hytte på Hardangervidda, flott utgangspunkt for viddeturene. Tilgjengelig med DNT-nøkkel.',
    bookingUrl: 'https://hyttebestilling.dnt.no/hytte/10758',
    utNo: 'https://www.ut.no/kart/#14/60.517/7.333',
    sesong: 'Februar–oktober'
  },
  {
    id: 'finse',
    navn: 'Finse 1222',
    type: 'DNT betjent',
    sted: 'Finse',
    region: 'Hardanger',
    lat: 60.5933,
    lng: 7.5067,
    hoyde: 1222,
    senger: 120,
    beskrivelse: 'Betjent DNT-hytte på Finse, Norges høyestliggende jernbanestasjon. Flott for tur til Hardangerjøkulen og Hardangervidda.',
    bookingUrl: 'https://hyttebestilling.dnt.no/hytte/10929',
    utNo: 'https://www.ut.no/kart/#13/60.593/7.507',
    sesong: 'Mars–oktober (betjent)'
  },
  {
    id: 'rauhelleren',
    navn: 'Rauhelleren',
    type: 'DNT selvbetjent',
    sted: 'Hardangervidda',
    region: 'Hardanger',
    lat: 60.4667,
    lng: 7.2500,
    hoyde: 1150,
    senger: 30,
    beskrivelse: 'Lita, sjarmerende selvbetjent DNT-hytte på Hardangervidda med fantastisk utsikt. Nær Vøringsfossen-området.',
    bookingUrl: 'https://www.dnt.no/hytter/?q=rauhelleren',
    utNo: 'https://www.ut.no/kart/#13/60.467/7.250',
    sesong: 'April–september'
  },
  {
    id: 'osterboe',
    navn: 'Østerbø',
    type: 'DNT betjent',
    sted: 'Aurlandsdalen',
    region: 'Flåm & Aurland',
    lat: 60.8883,
    lng: 7.1683,
    hoyde: 830,
    senger: 80,
    beskrivelse: 'Betjent DNT-hytte øverst i Aurlandsdalen. Startpunktet for den klassiske Aurlandsdalen-turen ned til Flåm.',
    bookingUrl: 'https://hyttebestilling.dnt.no/hytte/101272',
    utNo: 'https://www.ut.no/kart/#14/60.888/7.168',
    sesong: 'Juni–september'
  }
];

const CAMPING = [
  {
    id: 'ulvik-camping',
    navn: 'Ulvik Camping',
    sted: 'Ulvik',
    region: 'Hardanger',
    lat: 60.5720,
    lng: 6.9100,
    beskrivelse: 'Enkel campingplass ved fjorden i Ulvik.',
    bookingUrl: 'https://www.camping.no/hardanger',
    fasiliteter: ['Telt', 'Vogn', 'Toalett', 'Dusj']
  }
];

// =====================================================================
// TURFORSLAG (med forenklete koordinater for kartvisning)
// =====================================================================

const TURER = [
  {
    id: 'dronningstien',
    navn: 'Dronningstien',
    undertittel: 'Lofthus → Kinsarvik',
    region: 'Hardanger',
    vanskelighetsgrad: 'Middels',
    varighet: '5 timer',
    distanse: '12 km',
    stigning: '700 m',
    beskrivelse: 'Norges vakreste fjordsti! Historisk sti langs åssiden over Sørfjorden, med panoramautsikt over frukttrær og blå fjordvann. Dronning Sonja har gått stien – derav navnet.',
    startLat: 60.3460,
    startLng: 6.6110,
    utNoUrl: 'https://ut.no/turforslag/117080/hm-dronning-sonjas-panoramatur-dronningstien',
    merInfo: 'Start ved Opedal parkeringsplass sør for Lofthus. Sti merket med røde T-er opp åssiden. Ta med vann og mat. Enkelt å ta ferge/buss tilbake.',
    koordinater: [
      [60.3460, 6.6110],
      [60.3475, 6.6220],
      [60.3490, 6.6340],
      [60.3510, 6.6490],
      [60.3535, 6.6630],
      [60.3565, 6.6770],
      [60.3605, 6.6920],
      [60.3650, 6.7060],
      [60.3695, 6.7180],
      [60.3745, 6.7280]
    ],
    farge: '#e8a020',
    anbefalt: true
  },
  {
    id: 'aurlandsdalen',
    navn: 'Aurlandsdalen',
    undertittel: 'Østerbø → Vassbygdi',
    region: 'Flåm & Aurland',
    vanskelighetsgrad: 'Middels',
    varighet: '7 timer',
    distanse: '20 km',
    stigning: '-900 m',
    beskrivelse: 'En av Norges fineste dalturer! Fra fjell ned til fjord gjennom den dramatiske Aurlandsdalen. Fossefallshow og variert natur hele veien.',
    startLat: 60.8883,
    startLng: 7.1683,
    utNoUrl: 'https://ut.no/turforslag/1114917/aurlandsdalen-historisk-vandrerute',
    merInfo: 'Ta buss til Østerbø fra Aurland eller Flåm. Turen ender ved Vassbygdi. Kan overnatte på Østerbø eller Vassbygdi-hytte.',
    koordinater: [
      [60.8883, 7.1683],
      [60.8920, 7.1550],
      [60.8960, 7.1400],
      [60.9000, 7.1200],
      [60.9040, 7.1000],
      [60.9080, 7.0750],
      [60.9110, 7.0500],
      [60.9140, 7.0250],
      [60.9145, 7.0067]
    ],
    farge: '#e8a020'
  },
  {
    id: 'stegastein',
    navn: 'Stegastein',
    undertittel: 'Utsiktspunkt over Aurlandsfjorden',
    region: 'Flåm & Aurland',
    vanskelighetsgrad: 'Lett',
    varighet: '45 min',
    distanse: '2 km',
    stigning: '50 m',
    beskrivelse: 'Lett gåtur til det spektakulære Stegastein-utsiktspunktet, 650 m over Aurlandsfjorden. Ikonisk norsk arkitektur med glassutkikk.',
    startLat: 60.9070,
    startLng: 7.1950,
    utNoUrl: 'https://ut.no/turforslag/1112154683/stegastein',
    merInfo: 'Parkering rett ved fylkesvei 243 opp fra Aurland. Enkel tur for alle. Supert for solnedgang.',
    koordinater: [
      [60.9070, 7.1950],
      [60.9076, 7.2030],
      [60.9086, 7.2118]
    ],
    farge: '#2d8c6f'
  },
  {
    id: 'voringsfossen',
    navn: 'Vøringsfossen',
    undertittel: 'Hardangers mektigste foss',
    region: 'Hardanger',
    vanskelighetsgrad: 'Lett',
    varighet: '1,5 timer',
    distanse: '3 km',
    stigning: '100 m',
    beskrivelse: 'Vøringsfossen faller 182 meter ned i Måbødalen og er en av Norges mest besøkte naturattraksjoner. Nytt utsiktspunkt fra 2023.',
    startLat: 60.4153,
    startLng: 7.2003,
    utNoUrl: 'https://ut.no/turforslag/115809/tur-inn-til-botnen-av-vringsfossen',
    merInfo: 'Parkering ved Fossli Hotel. Gode merkede stier ned til fossen og langs kanten. Nytt utsiktstårn fra 2023.',
    koordinater: [
      [60.4130, 7.1950],
      [60.4145, 7.1975],
      [60.4153, 7.2003],
      [60.4165, 7.2030]
    ],
    farge: '#2d8c6f'
  },
  {
    id: 'buerdalen',
    navn: 'Buerdalen & Buarbreen',
    undertittel: 'Til isbredelva i Odda',
    region: 'Hardanger',
    vanskelighetsgrad: 'Lett',
    varighet: '2,5 timer',
    distanse: '6 km',
    stigning: '300 m',
    beskrivelse: 'Flott tur opp Buerdalen til Buarbreen, en utløper av Folgefonna. Turens eneste "krevende" bit er den siste biten mot breen.',
    startLat: 60.0550,
    startLng: 6.4900,
    utNoUrl: 'https://ut.no/turforslag/1114635/buarbreen-folgefonna-nasjonalpark',
    merInfo: 'Fra Odda sentrum: ta Rv13 sørover 2 km, følg skilting til Buer og kjør til parkering ved gårdene. Ikke gå på selve breen uten guide.',
    koordinater: [
      [60.0550, 6.4900],
      [60.0510, 6.4680],
      [60.0480, 6.4520],
      [60.0440, 6.4390],
      [60.0387, 6.4205]
    ],
    farge: '#2d8c6f'
  },
  {
    id: 'tokagjelet',
    navn: 'Tokagjelet',
    undertittel: 'Dramatisk juv ved Kvanndal',
    region: 'Hardanger',
    vanskelighetsgrad: 'Lett',
    varighet: '1,5 timer',
    distanse: '4 km',
    stigning: '150 m',
    beskrivelse: 'Gå gjennom det fascinerende Tokagjelet, et smalt juv med fosser og trapper hugget inn i fjellet. Unikt naturopplevelse!',
    startLat: 60.4130,
    startLng: 6.4720,
    utNoUrl: 'https://ut.no/turforslag/1111226/sundvordalen',
    merInfo: 'Start ved Kvanndal fergeleie. Ikke egnet etter kraftig regnvær.',
    koordinater: [
      [60.4130, 6.4720],
      [60.4160, 6.4760],
      [60.4195, 6.4800],
      [60.4220, 6.4835]
    ],
    farge: '#2d8c6f'
  },
  {
    id: 'hardangervidda-finse',
    navn: 'Hardangervidda fra Finse',
    undertittel: 'Platåtur på taket av Hardanger',
    region: 'Hardanger',
    vanskelighetsgrad: 'Middels',
    varighet: '4 timer',
    distanse: '10 km',
    stigning: '200 m',
    beskrivelse: 'Opplev Hardangervidda – Europas høyeste platå. Fra Finse stasjon ut på den mektige vidda med reinsdyr, snøfelt og endeløs vidde.',
    startLat: 60.5933,
    startLng: 7.5067,
    utNoUrl: 'https://ut.no/turforslag/1116108/hardangervidda-pa-langs-finse-skinnarbu',
    merInfo: 'Tog til Finse fra Bergen eller Oslo. Kle deg godt – det kan blåse hardt på vidda.',
    koordinater: [
      [60.5933, 7.5067],
      [60.5950, 7.5150],
      [60.5970, 7.5250],
      [60.5990, 7.5350],
      [60.6010, 7.5450]
    ],
    farge: '#e8a020'
  },
  {
    id: 'molden',
    navn: 'Molden',
    undertittel: 'Utsikt over Lustrafjorden – 1121 moh',
    region: 'Luster & Jostedalsbreen',
    vanskelighetsgrad: 'Middels',
    varighet: '4–5 timer',
    distanse: '8 km',
    stigning: '620 m',
    beskrivelse: 'En av Norges vakreste utsiktsturer! Klatre opp til Molden (1121 moh) med panoramautsikt over den innerste delen av Sognefjorden. Spektakulær 360°-utsikt over Lustrafjorden, Urnes og Jostedalsbreen.',
    startLat: 61.3363,
    startLng: 7.3057,
    utNoUrl: 'https://www.ut.no/kart/#13/61.360/7.305',
    merInfo: 'Start fra Mollandsmarki-parkering (ta av fra Rv55 ved skilt mot Mollandsmarki, kjør 2,4 km til parkering). Herfra følger du sti mot øst og nord opp ryggen til toppen. Godt fottøy nødvendig. Retur samme vei.',
    koordinater: [
      [61.3363, 7.3057],
      [61.3395, 7.3075],
      [61.3430, 7.3068],
      [61.3470, 7.3090],
      [61.3510, 7.3082],
      [61.3550, 7.3094],
      [61.3595, 7.3088],
      [61.3640, 7.3095],
      [61.3690, 7.3086],
      [61.3745, 7.3092],
      [61.3800, 7.3090],
      [61.3830, 7.3090]
    ],
    farge: '#e8a020',
    anbefalt: true
  },
  {
    id: 'naeroy',
    navn: 'Nærøydalen',
    undertittel: 'UNESCO-fjord, Gudvangen',
    region: 'Flåm & Aurland',
    vanskelighetsgrad: 'Lett',
    varighet: '1 time',
    distanse: '2 km',
    stigning: '50 m',
    beskrivelse: 'Gå langs kanten av det trange Nærøyfjorden (UNESCO), et av verdens vakreste fjordlandskap. Verdens trangeste fjord med bratte fjellvegger.',
    startLat: 60.8767,
    startLng: 6.8317,
    utNoUrl: 'https://ut.no/turforslag/1112155065/rimstigen',
    merInfo: 'Parkering i Gudvangen. Ta gjerne fjordsafari med el-båt.',
    koordinater: [
      [60.8767, 6.8317],
      [60.8790, 6.8380],
      [60.8810, 6.8450]
    ],
    farge: '#2d8c6f'
  },
  {
    id: 'oksen',
    navn: 'Oksen (1241 m)',
    undertittel: 'Topptur fra Tjoflot – Ulvik',
    region: 'Hardanger',
    vanskelighetsgrad: 'Krevende',
    varighet: '6–8 timer',
    distanse: '19 km t/r',
    stigning: '990 m',
    beskrivelse: 'Krevende topptur til Oksen (1241 moh) med spektakulær 360-graders utsikt over Hardangerfjorden, Osafjorden og fjellene rundt. En av Hardangers mest belønnende toppturer.',
    startLat: 60.4500,
    startLng: 6.6330,
    utNoUrl: 'https://ut.no/turforslag/1111229/oksen',
    merInfo: 'Fra nordsiden av Hardangerbrua: ta Fv 302 mot Djønno/Tjoflot, kjør ~17 km til veiens ende (Tjoflot, 5730 Ulvik). Parkering kr 50 (kontant). Solid fottøy og godt vær nødvendig.',
    koordinater: [
      [60.4500, 6.6330],
      [60.4510, 6.6470],
      [60.4525, 6.6580],
      [60.4545, 6.6680],
      [60.4570, 6.6755],
      [60.4599, 6.6830]
    ],
    farge: '#e8a020',
    anbefalt: true
  }
];

// =====================================================================
// SEVERDIGHETER
// =====================================================================

const SEVERDIGHETER = [
  {
    id: 'hardangerbrua',
    navn: 'Hardangerbrua',
    type: 'Hengebro',
    lat: 60.4743,
    lng: 6.8255,
    beskrivelse: 'Norges lengste hengebro (1380 m) over Eidfjorden. Gratis å kjøre over. Flott utsikt fra midten. Mellom Brimnes (nord) og Bruravik (sør).',
    region: 'Hardanger'
  },
  {
    id: 'voringsfossen-sev',
    navn: 'Vøringsfossen',
    type: 'Foss',
    lat: 60.4153,
    lng: 7.2003,
    beskrivelse: '182 meter høy foss i Måbødalen. En av Norges mest kjente fosser. Nytt utsiktsplatform fra 2023.',
    region: 'Hardanger'
  },
  {
    id: 'flamsbanana',
    navn: 'Flåmsbana',
    type: 'Jernbane',
    lat: 60.8630,
    lng: 7.1197,
    beskrivelse: 'En av verdens vakreste jernbanestrekninger! 20 km fra Flåm til Myrdal, 865 m høydeforskjell. Bestill på flåm.no.',
    web: 'https://www.flamsbana.no',
    region: 'Flåm & Aurland'
  },
  {
    id: 'stegastein-sev',
    navn: 'Stegastein',
    type: 'Utsiktspunkt',
    lat: 60.9086,
    lng: 7.2118,
    beskrivelse: 'Spektakulær utsiktsplattform 650 m over Aurlandsfjorden. Designet av Todd Saunders. Gratis å besøke.',
    region: 'Flåm & Aurland'
  },
  {
    id: 'borgund',
    navn: 'Borgund stavkirke',
    type: 'Historisk kirke',
    lat: 61.0472,
    lng: 7.8122,
    beskrivelse: 'En av Norges best bevarte stavkirker fra middelalderen (ca. 1180). Nasjonal turistattraksjon. Museum tilknyttet.',
    web: 'https://www.stavechurch.com',
    region: 'Lærdal & Borgund'
  },
  {
    id: 'naeroyfjord',
    navn: 'Nærøyfjorden',
    type: 'UNESCO-verdensarv',
    lat: 60.8767,
    lng: 6.8317,
    beskrivelse: 'Verdens trangeste fjord (250 m bred). UNESCO Verdensarv. El-båtsafari fra Gudvangen anbefales.',
    web: 'https://www.visitflam.com/naeroyfjord',
    region: 'Flåm & Aurland'
  },
  {
    id: 'laerdal-gml',
    navn: 'Gamle Lærdalsøyri',
    type: 'Kulturmiljø',
    lat: 61.0990,
    lng: 7.4790,
    beskrivelse: 'En av Norges best bevarte gamle trehusbebyggelser med 161 vernede hus. Koselig å vandre rundt i.',
    region: 'Lærdal & Borgund'
  },
  {
    id: 'hardangervidda-np',
    navn: 'Hardangervidda Nasjonalparksenter',
    type: 'Museum / Natursenter',
    lat: 60.4674,
    lng: 7.0720,
    beskrivelse: 'Spennende utstillinger om Hardangervidda, reinsdyr og natur. I Eidfjord sentrum. Flott for hele familien.',
    web: 'https://www.hardangervidda.com',
    region: 'Hardanger'
  }
];

// =====================================================================
// DAGPLAN — standard itinerær (redigerbart av bruker)
// =====================================================================

const STANDARD_PLAN = [
  {
    dag: 1,
    dato: '2026-06-12',
    dagNavn: 'Fredag 12. juni',
    sted: 'Ulvik',
    tittel: 'Ankomst Ulvik – Brakanes',
    hotell: 'brakanes',
    aktiviteter: [],
    notater: 'Ankomst Brakanes Hotell, Ulvik. Sjekk inn, slå seg til ro og utforsk hotellet og Ulvik sentrum. Bryllupet er i morgen – lørdag! 🌸 Smak på lokal eplesider, nyt fjordutsikten.',
    egne: []
  },
  {
    dag: 2,
    dato: '2026-06-13',
    dagNavn: 'Lørdag 13. juni',
    sted: 'Ulvik',
    tittel: '💒 Bryllup i Ulvik – Lørdag',
    hotell: 'brakanes',
    aktiviteter: [],
    notater: 'Bryllupsdag! Vi er gjester i et bryllup i Ulvik – Brakanes Hotell. Fest og feiring langs Hardangerfjorden. 🥂🎉 Andre og siste natt på Brakanes.',
    egne: []
  },
  {
    dag: 3,
    dato: '2026-06-14',
    dagNavn: 'Søndag 14. juni',
    sted: 'Hardanger',
    tittel: 'Dag 3 – Jaunsen Gjestgjevarstad',
    hotell: 'jaunsen',
    aktiviteter: [],
    notater: 'Innsjekk Jaunsen Gjestgjevarstad (bekreftet 14.–16. juni). ✅',
    egne: []
  },
  {
    dag: 4,
    dato: '2026-06-15',
    dagNavn: 'Mandag 15. juni',
    sted: 'Hardanger',
    tittel: 'Dag 4 – Jaunsen Gjestgjevarstad',
    hotell: 'jaunsen',
    aktiviteter: [],
    notater: 'Andre natt på Jaunsen Gjestgjevarstad.',
    egne: []
  },
  {
    dag: 5,
    dato: '2026-06-16',
    dagNavn: 'Tirsdag 16. juni',
    sted: 'Jølster',
    tittel: 'Dag 5 – Grand Hotel Skei',
    hotell: 'skei',
    aktiviteter: [],
    notater: 'Utsjekk Jaunsen, innsjekk Grand Hotel Skei, Skei i Jølster (bekreftet 16.–17. juni). ✅',
    egne: []
  },
  {
    dag: 6,
    dato: '2026-06-17',
    dagNavn: 'Onsdag 17. juni',
    sted: 'Skjolden',
    tittel: 'Dag 6 – Skjolden Resort',
    hotell: 'skjolden',
    aktiviteter: [],
    notater: 'Utsjekk Grand Hotel Skei, innsjekk Skjolden Resort (bekreftet 17.–19. juni). ✅',
    egne: []
  },
  {
    dag: 7,
    dato: '2026-06-18',
    dagNavn: 'Torsdag 18. juni',
    sted: 'Skjolden',
    tittel: 'Dag 7 – Skjolden Resort',
    hotell: 'skjolden',
    aktiviteter: [],
    notater: 'Andre natt på Skjolden Resort.',
    egne: []
  },
  {
    dag: 8,
    dato: '2026-06-19',
    dagNavn: 'Fredag 19. juni',
    sted: 'Sogn',
    tittel: 'Dag 8 – Ledig',
    hotell: null,
    aktiviteter: [],
    notater: 'Utsjekk Skjolden Resort.',
    egne: []
  },
  {
    dag: 9,
    dato: '2026-06-20',
    dagNavn: 'Lørdag 20. juni',
    sted: 'Hjemreise',
    tittel: 'Hjemreise 🏔',
    hotell: null,
    aktiviteter: [],
    notater: '',
    egne: []
  }
];

// =====================================================================
// LENKER
// =====================================================================

const LENKER = [
  {
    kategori: 'Turistforeningene',
    items: [
      { navn: 'DNT – Den Norske Turistforening', url: 'https://www.dnt.no', beskrivelse: 'Hytter, turer og DNT-medlemskap' },
      { navn: 'DNT hytteoversikt', url: 'https://www.dnt.no/hytter/', beskrivelse: 'Finn og book DNT-hytter' },
      { navn: 'UT.no – turplanlegger', url: 'https://www.ut.no', beskrivelse: 'Kart, turer og turlogg' }
    ]
  },
  {
    kategori: 'Regionale reiselivsider',
    items: [
      { navn: 'Visit Hardanger', url: 'https://www.hardangerfjord.com', beskrivelse: 'Offisiell reiselivsguide for Hardanger' },
      { navn: 'Visit Flåm', url: 'https://www.visitflam.com', beskrivelse: 'Flåm og Aurlandsfjorden' },
      { navn: 'Visit Sognefjord', url: 'https://www.sognefjord.no', beskrivelse: 'Sognefjorden og omegn' },
      { navn: 'Flåmsbana', url: 'https://www.flamsbana.no', beskrivelse: 'Billetter og info om Flåmsbana' }
    ]
  },
  {
    kategori: 'Praktisk',
    items: [
      { navn: 'Booking.com', url: 'https://www.booking.com/searchresults.html?dest_id=1862831&dest_type=country&checkin=2026-06-13&checkout=2026-06-20&group_adults=2', beskrivelse: 'Hotellbooking for hele turen' },
      { navn: 'Ruter & Ferger (Skyss)', url: 'https://www.skyss.no', beskrivelse: 'Kollektivtransport i Vestland' },
      { navn: 'Norgeskart', url: 'https://www.norgeskart.no', beskrivelse: 'Offisielle norske topografiske kart' },
      { navn: 'yr.no – Vær', url: 'https://www.yr.no/nb/v%C3%A6rvarsel/1-92416/Norge/Vestland/Ulvik/Ulvik', beskrivelse: 'Værvarsel for Hardanger' }
    ]
  }
];

// =====================================================================
// RESTAURANTER — Utvalgte spisesteder langs ruten
// =====================================================================
const RESTAURANTER = [
  {
    id: 'aegir-bryggeri',
    navn: 'Ægir Bryggeri & Pub',
    sted: 'Flåm',
    region: 'Flåm & Aurland',
    lat: 60.8626, lng: 7.1210,
    type: 'Bryggeri / Pub',
    priskategori: '🟡🟡',
    beskrivelse: 'Berømt håndverksbryggeri i vikingstil – ett av Norges mest besøkte spisesteder. Spektakulær longhouse-atmosfære med lokalt bryggede øl og solid mat.',
    url: 'https://www.aegirbrewing.com',
    emoji: '🍺'
  },
  {
    id: 'flamsbrygga-restaurant',
    navn: 'Flåmsbrygga Restaurant & Bar',
    sted: 'Flåm',
    region: 'Flåm & Aurland',
    lat: 60.8635, lng: 7.1222,
    type: 'Restaurant',
    priskategori: '🟡🟡🟡',
    beskrivelse: 'Moderne nordisk mat med panoramautsikt over Flåmsfjorden. Ferske råvarer fra lokale produsenter – perfekt etter Flåmsbana.',
    url: 'https://www.flamsbrygga.no',
    emoji: '🍽️'
  },
  {
    id: 'brakanes-restaurant',
    navn: 'Brakanes Hotell Restaurant',
    sted: 'Ulvik',
    region: 'Hardanger',
    lat: 60.5664, lng: 6.9147,
    type: 'Hotellrestaurant',
    priskategori: '🟡🟡🟡',
    beskrivelse: 'Klassisk hardangerrestaurant med vid fjordutsikt. Norsk tradisjonsmat og lokale råvarer fra Hardangerfjorden.',
    url: 'https://www.brakanes-hotel.no',
    emoji: '🍽️'
  },
  {
    id: 'ullensvang-restaurant',
    navn: 'Hotel Ullensvang Restaurant',
    sted: 'Lofthus',
    region: 'Hardanger',
    lat: 60.3666, lng: 6.7380,
    type: 'Hotellrestaurant',
    priskategori: '🟡🟡🟡',
    beskrivelse: 'Historisk restaurant med utsikt over Sørfjorden og Folgefonna-breen. Edvard Grieg var fast gjest. Ekte hardangertradisjon siden 1846.',
    url: 'https://www.hotel-ullensvang.no',
    emoji: '🍽️'
  },
  {
    id: 'kviknes-restaurant',
    navn: 'Kviknes Hotel Restaurant',
    sted: 'Balestrand',
    region: 'Balestrand & Sogndal',
    lat: 61.2000, lng: 6.5227,
    type: 'Hotellrestaurant',
    priskategori: '🟡🟡🟡',
    beskrivelse: 'Storstue i sveitserstil (1752) med Sognefjord-utsikt. Klassisk norsk husmannskost og buffet – en opplevelse i seg selv.',
    url: 'https://www.kviknes.no',
    emoji: '🍽️'
  },
  {
    id: 'walaker-restaurant',
    navn: 'Walaker Hotel Restaurant',
    sted: 'Solvorn',
    region: 'Luster & Jostedalsbreen',
    lat: 61.3370, lng: 7.2840,
    type: 'Hotellrestaurant',
    priskategori: '🟡🟡',
    beskrivelse: 'Norges eldste hotell i familiedrift (1640). Romantisk restaurant ved Lustrafjorden – nydelig utsikt og god husmannskost.',
    url: 'https://www.walaker.com',
    emoji: '🍽️'
  },
  {
    id: 'lindstrom-restaurant',
    navn: 'Lindstrøm Hotel Restaurant',
    sted: 'Lærdal',
    region: 'Lærdal & Borgund',
    lat: 61.0998, lng: 7.4793,
    type: 'Hotellrestaurant',
    priskategori: '🟡🟡',
    beskrivelse: 'Koselig restaurant midt i historiske Gamle Lærdalsøyri. Norske fjellspesialiteter og hjemmelaget mat i sjarmerende omgivelser.',
    url: 'https://lindstromhotel.no',
    emoji: '🍽️'
  },
  {
    id: 'hardanger-eplegard',
    navn: 'Hardanger Eplegård & Sider-smaking',
    sted: 'Ulvik-området',
    region: 'Hardanger',
    lat: 60.5720, lng: 6.9250,
    type: 'Gårdsopplevelse',
    priskategori: '🟡',
    beskrivelse: 'Smak ekte Hardanger-sider og eplemost rett fra grenen. Familiedrevne gårder rundt Ulvik tilbyr omvisning og smaking i frukthagene.',
    url: 'https://www.hardangerfjord.com/hardanger/mat-og-drikke',
    emoji: '🍎'
  }
];

// =====================================================================
// AKTIVITETER — Opplevelser og guidede turer langs ruten
// =====================================================================
const AKTIVITETER = [
  {
    id: 'flamsbana',
    navn: 'Flåmsbana',
    sted: 'Flåm → Myrdal',
    region: 'Flåm & Aurland',
    lat: 60.8628, lng: 7.1218,
    type: 'Tog / Opplevelse',
    varighet: '1 time (t/r 2 timer)',
    pris: 'Fra kr 450/person',
    beskrivelse: 'En av Norges vakreste jernbanestrekninger – 20 km og 900 høydemeter gjennom fosser, tunneler og dramatisk fjordlandskap.',
    url: 'https://www.flamsbana.no',
    emoji: '🚂'
  },
  {
    id: 'naeroy-cruise',
    navn: 'Nærøyfjord-cruise',
    sted: 'Gudvangen → Flåm',
    region: 'Flåm & Aurland',
    lat: 60.8776, lng: 6.8389,
    type: 'Båttur',
    varighet: '2 timer',
    pris: 'Fra kr 350/person',
    beskrivelse: 'UNESCO-vernede Nærøyfjorden fra vannflaten. Smal fjord med 1700 m høye fjellvegger – ett av Norges aller vakreste naturundere.',
    url: 'https://www.norwaysbest.com/no/aktiviteter/fjordcruise/',
    emoji: '⛵'
  },
  {
    id: 'hardangerfjord-cruise',
    navn: 'Hardangerfjord-cruise',
    sted: 'Eidfjord',
    region: 'Hardanger',
    lat: 60.4680, lng: 7.0720,
    type: 'Båttur',
    varighet: '2–4 timer',
    pris: 'Fra kr 450/person',
    beskrivelse: 'Seil på Hardangerfjorden med utsikt til Folgefonna-breen, fossene og frukthagene i blomst. Guidede turer fra Eidfjord.',
    url: 'https://www.hardangerfjord.com/eidfjord',
    emoji: '⛵'
  },
  {
    id: 'folgefonna-bre',
    navn: 'Folgefonna Breklatring',
    sted: 'Jondal',
    region: 'Hardanger',
    lat: 60.2850, lng: 6.5180,
    type: 'Guidet tur',
    varighet: '3–5 timer',
    pris: 'Fra kr 850/person',
    beskrivelse: 'Gå på Norges tredje største isbre med sertifisert guide. Alt utstyr inkludert. Kjør via Jondal for raskeste tilgang til breen.',
    url: 'https://www.folgefonnabre.no',
    emoji: '🧊'
  },
  {
    id: 'kayak-sognefjord',
    navn: 'Kajakkpadling Sognefjorden',
    sted: 'Balestrand',
    region: 'Balestrand & Sogndal',
    lat: 61.2008, lng: 6.5244,
    type: 'Aktivitet',
    varighet: '2–6 timer',
    pris: 'Fra kr 450/person',
    beskrivelse: 'Opplev verdensarvens fjord fra vannflaten. Guidede kajakkturer for alle nivåer – padl rolig langs fjellvegger og skjærgård.',
    url: 'https://www.sognefjord.no/aktiviteter/kajakkpadling',
    emoji: '🛶'
  },
  {
    id: 'hardanger-museum',
    navn: 'Hardanger Folkemuseum',
    sted: 'Utne',
    region: 'Hardanger',
    lat: 60.3758, lng: 6.6005,
    type: 'Museum',
    varighet: '2–3 timer',
    pris: 'Kr 150/person',
    beskrivelse: 'Regionmuseum for Hardanger og Voss. Felemaking, bunad, rosemaling og historiske hus langs fjorden – midt i Hardanger-kulturen.',
    url: 'https://www.hardangerfolkemuseum.no',
    emoji: '🏛️'
  },
  {
    id: 'rib-flam',
    navn: 'RIB-båttur fra Flåm',
    sted: 'Flåm',
    region: 'Flåm & Aurland',
    lat: 60.8628, lng: 7.1215,
    type: 'Aktivitet',
    varighet: '2 timer',
    pris: 'Fra kr 750/person',
    beskrivelse: 'Adrenalinfylt RIB-tur inn i det smale Nærøyfjorden. Se fjordveggene tett på i høy hastighet – en uforglemmelig opplevelse.',
    url: 'https://www.visitflam.com/aktiviteter',
    emoji: '🚤'
  },
  {
    id: 'jostedalsbreen-guide',
    navn: 'Jostedalsbreen Bretur',
    sted: 'Sogndal-området',
    region: 'Luster & Jostedalsbreen',
    lat: 61.6800, lng: 7.2000,
    type: 'Guidet tur',
    varighet: 'Heldagstur',
    pris: 'Fra kr 950/person',
    beskrivelse: 'Vandring på Europas største fastlandsbre med guide. Unikt naturøyeblikk – blått is, sprekker og vidstrakte bresider.',
    url: 'https://www.jostedalsbreen.no',
    emoji: '🏔️'
  }
];
