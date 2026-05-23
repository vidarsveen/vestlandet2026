// =====================================================================
// data.js — All location data for Hardanger & Sogn travel app
// =====================================================================

const APP_CONFIG = {
  startDate: '2026-06-13',
  endDate: '2026-06-20',
  people: 2,
  tripDays: 8,
  mapCenter: [60.65, 7.0],
  mapZoom: 9,
  currency: 'NOK'
};

// =====================================================================
// BOOKING URL HELPERS
// =====================================================================

function lagBookingUrl(hotelNavn, sted, innsjekk, utsjekk) {
  const sokeord = encodeURIComponent(hotelNavn + ', ' + sted + ', Norway');
  return `https://www.booking.com/searchresults.html?ss=${sokeord}&checkin=${innsjekk}&checkout=${utsjekk}&group_adults=2&no_rooms=1&lang=nb&selected_currency=NOK`;
}

function datoForDag(dagNr) {
  // dagNr 0 = 13. juni, osv.
  const d = new Date('2026-06-13');
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
    bookingSearch: 'Brakanes Hotell Ulvik',
    startHotell: true
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
    bookingSearch: 'Ullensvang Hotel Lofthus Hardanger'
  },
  {
    id: 'hardanger-hotel',
    navn: 'Hardanger Hotel',
    sted: 'Kinsarvik',
    region: 'Hardanger',
    lat: 60.3745,
    lng: 6.7280,
    stjerner: 3,
    prisklasse: '🟡🟡',
    beskrivelse: 'Trivelig hotell i Kinsarvik ved munningen av Kinso-elven. Endepunkt for Dronningstien. God beliggenhet for utforsking av Hardanger.',
    fasiliteter: ['Restaurant', 'Bar', 'Parkering', 'Fjordnær', 'WiFi'],
    telefon: '+47 53 67 19 00',
    web: 'https://www.hardangerhotel.no',
    bookingSearch: 'Hardanger Hotel Kinsarvik'
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
    bookingSearch: 'Utne Hotel Hardanger'
  },
  {
    id: 'eidfjord',
    navn: 'Quality Hotel & Resort Eidfjord',
    sted: 'Eidfjord',
    region: 'Hardanger',
    lat: 60.4674,
    lng: 7.0700,
    stjerner: 4,
    prisklasse: '🟡🟡🟡',
    beskrivelse: 'Moderne resort i dramatiske Eidfjord omgitt av fjell og fosser. Nær Hardangervidda Nasjonalparksenter og Vøringsfossen.',
    fasiliteter: ['Restaurant', 'Bar', 'Spa', 'Pool', 'Parkering', 'WiFi'],
    telefon: '+47 53 66 52 64',
    web: 'https://www.nordicchoicehotels.no',
    bookingSearch: 'Quality Hotel Eidfjord Norway'
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
    bookingSearch: 'Fretheim Hotel Flåm Norway'
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
    bookingSearch: 'Flåmsbrygga Hotel Flåm'
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
    bookingSearch: 'Kviknes Hotel Balestrand Sognefjord'
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
    bookingSearch: 'Quality Hotel Sogndal Norway'
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
    bookingSearch: 'Lindstrøm Hotel Lærdal Norway'
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
    bookingUrl: 'https://www.dnt.no/hytte/?id=rembesdalseter',
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
    bookingUrl: 'https://www.dnt.no/hytter/betjente/finse-1222/',
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
    bookingUrl: 'https://www.dnt.no/hytter/betjente/osterboe/',
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
    startLat: 60.3517,
    startLng: 6.6572,
    utNoUrl: 'https://www.ut.no/tur/2.1952/',
    merInfo: 'Start ved Lofthus kirke. Sti merket med røde T-er. Ta med vann og mat. Enkelt å ta ferge/buss tilbake.',
    koordinater: [
      [60.3520, 6.6572],
      [60.3540, 6.6650],
      [60.3565, 6.6740],
      [60.3590, 6.6840],
      [60.3620, 6.6950],
      [60.3655, 6.7060],
      [60.3690, 6.7160],
      [60.3720, 6.7220],
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
    utNoUrl: 'https://www.ut.no/tur/2.1906/',
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
    startLat: 60.9233,
    startLng: 7.1417,
    utNoUrl: 'https://www.ut.no/tur/stegastein',
    merInfo: 'Parkeringsareal rett ved veien opp fra Aurland. Enkel tur for alle. Supert for solnedgang.',
    koordinater: [
      [60.9195, 7.1350],
      [60.9215, 7.1385],
      [60.9233, 7.1417]
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
    utNoUrl: 'https://www.ut.no/tur/voringsfossen',
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
    startLat: 60.0750,
    startLng: 6.5600,
    utNoUrl: 'https://www.ut.no/tur/buerdalen',
    merInfo: 'Parkering i Buarbygda, Odda. Ikke gå på selve breen uten guide.',
    koordinater: [
      [60.0680, 6.5465],
      [60.0710, 6.5530],
      [60.0740, 6.5580],
      [60.0770, 6.5620],
      [60.0800, 6.5670]
    ],
    farge: '#2d8c6f'
  },
  {
    id: 'tokagjelet',
    navn: 'Tokagjelet',
    undertittel: 'Dramatisk juv ved Kvandal',
    region: 'Hardanger',
    vanskelighetsgrad: 'Lett',
    varighet: '1,5 timer',
    distanse: '4 km',
    stigning: '150 m',
    beskrivelse: 'Gå gjennom det fascinerende Tokagjelet, et smalt juv med fosser og trapper hugget inn i fjellet. Unikt naturopplevelse!',
    startLat: 60.4000,
    startLng: 6.5500,
    utNoUrl: 'https://www.ut.no/tur/tokagjelet',
    merInfo: 'Start ved Kvandal fergeleie. Ikke egnet etter kraftig regnvær.',
    koordinater: [
      [60.3980, 6.5470],
      [60.3995, 6.5500],
      [60.4010, 6.5530],
      [60.4020, 6.5560]
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
    utNoUrl: 'https://www.ut.no/tur/hardangervidda-finse',
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
    utNoUrl: 'https://www.ut.no/tur/naeroy',
    merInfo: 'Parkering i Gudvangen. Ta gjerne fjordsafari med el-båt.',
    koordinater: [
      [60.8767, 6.8317],
      [60.8790, 6.8380],
      [60.8810, 6.8450]
    ],
    farge: '#2d8c6f'
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
    lat: 60.2550,
    lng: 6.1183,
    beskrivelse: 'Norges lengste hengebro (1380 m) over Hardangerfjorden. Gratis å kjøre over. Flott utsikt fra midten.',
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
    lat: 60.9233,
    lng: 7.1417,
    beskrivelse: 'Spektakulær utsiktsplattform 650 m over Aurlandsfjorden. Designet av Todd Saunders. Gratis å besøke.',
    region: 'Flåm & Aurland'
  },
  {
    id: 'borgund',
    navn: 'Borgund stavkirke',
    type: 'Historisk kirke',
    lat: 61.0383,
    lng: 7.8133,
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
// RESTAURANTER & STEDER (utvalg)
// =====================================================================

const RESTAURANTER = [
  {
    id: 'aegir',
    navn: 'Ægir Bryggeri & Pub',
    sted: 'Flåm',
    lat: 60.8635,
    lng: 7.1215,
    type: 'Bryggeri/Pub',
    beskrivelse: 'Ikonisk vikinginspiret bryggeri i Flåm. Hjemmebryggede øl, god mat og fantastisk atmosfære. Bestill bord på forhånd!',
    web: 'https://www.flamsbrygga.no/aegir'
  },
  {
    id: 'cider-hardanger',
    navn: 'Hardanger Saft og Siderfabrikk',
    sted: 'Ulvik',
    lat: 60.5700,
    lng: 6.9060,
    type: 'Mat & Drikke',
    beskrivelse: 'Smak på Hardangers berømte eple-sider og saft direkte fra produsenten. Gratis smaking. Must-visit i Ulvik!',
    web: 'https://www.hardanger-saft.no'
  }
];

// =====================================================================
// DAGPLAN — standard itinerær (redigerbart av bruker)
// =====================================================================

const STANDARD_PLAN = [
  {
    dag: 1,
    dato: '2026-06-13',
    dagNavn: 'Lørdag 13. juni',
    sted: 'Ulvik',
    tittel: 'Ankomst Hardanger',
    hotell: 'brakanes',
    aktiviteter: [],
    notater: 'Ankomst til Brakanes Hotell. Slapp av, utforsk Ulvik sentrum og smak på lokal eplesider. Aftenstur langs fjorden.',
    egne: []
  },
  {
    dag: 2,
    dato: '2026-06-14',
    dagNavn: 'Søndag 14. juni',
    sted: 'Lofthus / Kinsarvik',
    tittel: 'Dronningstien',
    hotell: 'ullensvang',
    aktiviteter: ['dronningstien'],
    notater: 'Driv til Lofthus og gå den legendariske Dronningstien til Kinsarvik (5 timer). Sjekk inn på Ullensvang Hotel om kvelden.',
    egne: []
  },
  {
    dag: 3,
    dato: '2026-06-15',
    dagNavn: 'Mandag 15. juni',
    sted: 'Eidfjord',
    tittel: 'Vøringsfossen & Hardangervidda',
    hotell: 'eidfjord',
    aktiviteter: ['voringsfossen'],
    notater: 'Kjør via Hardangerbrua til Eidfjord. Besøk Vøringsfossen og Hardangervidda Nasjonalparksenter. Overnatt i Eidfjord.',
    egne: []
  },
  {
    dag: 4,
    dato: '2026-06-16',
    dagNavn: 'Tirsdag 16. juni',
    sted: 'Flåm',
    tittel: 'Flåmsbana & Nærøyfjord',
    hotell: 'fretheim',
    aktiviteter: ['naeroy'],
    notater: 'Kjør via Gudvangen (Nærøyfjord). Ta Flåmsbana opp til Myrdal og ned igjen. Aftensbesøk på Ægir Bryggeri!',
    egne: []
  },
  {
    dag: 5,
    dato: '2026-06-17',
    dagNavn: 'Onsdag 17. juni',
    sted: 'Aurland / Balestrand',
    tittel: 'Stegastein & Sognefjord',
    hotell: 'kviknes',
    aktiviteter: ['stegastein'],
    notater: 'Morgentur til Stegastein utsiktspunkt. Kjør langs Sognefjorden til Balestrand og sjekk inn på historiske Kviknes Hotel.',
    egne: []
  },
  {
    dag: 6,
    dato: '2026-06-18',
    dagNavn: 'Torsdag 18. juni',
    sted: 'Lærdal',
    tittel: 'Borgund & Gamle Lærdal',
    hotell: 'laerdal',
    aktiviteter: [],
    notater: 'Kjør til Borgund stavkirke (ca. 1180 e.Kr.), deretter inn i vakre Gamle Lærdalsøyri. Overnatt på Lindstrøm Hotel.',
    egne: []
  },
  {
    dag: 7,
    dato: '2026-06-19',
    dagNavn: 'Fredag 19. juni',
    sted: 'Sogndal / hjemreise',
    tittel: 'Siste dag i fjordlandet',
    hotell: 'sogndal',
    aktiviteter: [],
    notater: 'Siste fjorddag! Besøk Sognefjord-senteret eller gjør en kort tur. Overnatt i Sogndal for tidlig avreise neste dag.',
    egne: []
  },
  {
    dag: 8,
    dato: '2026-06-20',
    dagNavn: 'Lørdag 20. juni',
    sted: 'Hjemreise',
    tittel: 'God tur! 🏔',
    hotell: null,
    aktiviteter: [],
    notater: 'Hjemreise fra Sogndal. Takk for en fantastisk fjordtur!',
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
      { navn: 'DNT Hytte-booking', url: 'https://www.dnt.no/hyttebooking/', beskrivelse: 'Book betjente DNT-hytter' },
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
