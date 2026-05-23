// Node.js testkjører for Hardanger & Sogn app data
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vm = require('vm'); // CommonJS
const fs = require('fs'); // CommonJS

// Wrap in function to expose const declarations via return object
const src = fs.readFileSync('./js/data.js', 'utf8');
const wrapped = `
${src}
// Export all constants
({
  APP_CONFIG, HOTELLER, HYTTER, CAMPING, TURER, SEVERDIGHETER,
  STANDARD_PLAN, LENKER, lagBookingUrl, lagHotellBookingUrl, datoForDag, RESTAURANTER
});
`;
const appData = vm.runInNewContext(wrapped, { Date, JSON, Array, Object, Math, encodeURIComponent });

const { APP_CONFIG, HOTELLER, HYTTER, TURER, SEVERDIGHETER, STANDARD_PLAN, LENKER, lagBookingUrl, lagHotellBookingUrl, datoForDag } = appData;

let pass = 0, fail = 0;

function t(name, fn) {
  try {
    const res = fn();
    console.log('  ✅ ' + name + ': ' + res);
    pass++;
  } catch(e) {
    console.log('  ❌ ' + name + ': ' + e.message);
    fail++;
  }
}

// === DATA INTEGRITET ===
console.log('\n=== DATA INTEGRITET ===');
t('HOTELLER count', function() {
  if (!Array.isArray(HOTELLER) || HOTELLER.length < 10) throw new Error('Fant ' + (HOTELLER ? HOTELLER.length : 'undefined'));
  return HOTELLER.length + ' hoteller';
});
t('HYTTER count', function() {
  if (!Array.isArray(HYTTER) || HYTTER.length < 4) throw new Error('Fant ' + (HYTTER ? HYTTER.length : 'undefined'));
  return HYTTER.length + ' hytter';
});
t('TURER count', function() {
  if (!Array.isArray(TURER) || TURER.length < 8) throw new Error('Fant ' + (TURER ? TURER.length : 'undefined'));
  return TURER.length + ' turer';
});
t('SEVERDIGHETER count', function() {
  if (!Array.isArray(SEVERDIGHETER) || SEVERDIGHETER.length < 5) throw new Error('Fant ' + (SEVERDIGHETER ? SEVERDIGHETER.length : 'undefined'));
  return SEVERDIGHETER.length + ' severdigheter';
});
t('STANDARD_PLAN 9 dager (inkl. bryllupsdag)', function() {
  if (!Array.isArray(STANDARD_PLAN) || STANDARD_PLAN.length !== 9) throw new Error('Fant ' + (STANDARD_PLAN ? STANDARD_PLAN.length : 'undefined') + ' dager, forventet 9');
  return STANDARD_PLAN.length + ' dager (12.–20. juni)';
});
t('Brakanes er starthotell (dag 1 og 2)', function() {
  var b = HOTELLER.find(function(h) { return h.id === 'brakanes'; });
  if (!b) throw new Error('Ikke funnet');
  if (!b.startHotell) throw new Error('startHotell-flagg mangler');
  if (STANDARD_PLAN[0].hotell !== 'brakanes') throw new Error('Dag 1 er ikke Brakanes');
  if (STANDARD_PLAN[1].hotell !== 'brakanes') throw new Error('Dag 2 er ikke Brakanes');
  if (STANDARD_PLAN[2].hotell !== null) throw new Error('Dag 3 skal vaere ledig (null), fant: ' + STANDARD_PLAN[2].hotell);
  return 'Dag 1+2 Brakanes, dag 3 ledig';
});
t('Dronningstien finnes', function() {
  var d = TURER.find(function(t) { return t.id === 'dronningstien'; });
  if (!d) throw new Error('Ikke funnet');
  if (d.koordinater.length < 3) throw new Error('For fa koordinater');
  return d.koordinater.length + ' koordinatpunkter';
});

// === GPS KOORDINATER ===
console.log('\n=== GPS KOORDINATER ===');
t('Hotell-koordinater gyldige', function() {
  var u = HOTELLER.filter(function(h) {
    return !h.lat || !h.lng || h.lat < 58 || h.lat > 64 || h.lng < 4 || h.lng > 10;
  });
  if (u.length) throw new Error('Ugyldige: ' + u.map(function(h) { return h.navn; }).join(', '));
  return HOTELLER.length + '/' + HOTELLER.length + ' gyldige';
});
t('Hytte-koordinater gyldige', function() {
  var u = HYTTER.filter(function(h) {
    return !h.lat || !h.lng || h.lat < 58 || h.lat > 64 || h.lng < 4 || h.lng > 10;
  });
  if (u.length) throw new Error('Ugyldige: ' + u.map(function(h) { return h.navn; }).join(', '));
  return HYTTER.length + '/' + HYTTER.length + ' gyldige';
});
t('Tur-polylinjer har koordinater', function() {
  var u = TURER.filter(function(t) { return !t.koordinater || t.koordinater.length < 2; });
  if (u.length) throw new Error('Mangler: ' + u.map(function(t) { return t.navn; }).join(', '));
  return TURER.length + '/' + TURER.length + ' har koordinater';
});
t('Koordinater i reiseomradet', function() {
  var alle = HOTELLER.concat(HYTTER);
  var ute = alle.filter(function(l) { return l.lat < 59.5 || l.lat > 62 || l.lng < 5.5 || l.lng > 9; });
  if (ute.length) throw new Error('Utenfor: ' + ute.map(function(l) { return l.navn; }).join(', '));
  return 'Alle i Hardanger/Sogn-region';
});

// === BOOKING-LENKER ===
console.log('\n=== BOOKING-LENKER ===');
t('lagHotellBookingUrl – direkte hotellside', function() {
  var url = lagHotellBookingUrl('brakanes-hotel', '2026-06-12', '2026-06-13');
  if (!url.includes('/hotel/no/brakanes-hotel')) throw new Error('Feil URL-format, fant: ' + url.substring(0, 60));
  if (!url.includes('2026-06-12')) throw new Error('Innsjekk mangler');
  if (!url.includes('group_adults=2')) throw new Error('2 voksne mangler');
  return 'Slug-URL korrekt: /hotel/no/brakanes-hotel';
});
t('Alle hoteller har bookingSlug', function() {
  var u = HOTELLER.filter(function(h) { return !h.bookingSlug; });
  if (u.length) throw new Error('Mangler slug: ' + u.map(function(h) { return h.navn; }).join(', '));
  return HOTELLER.length + '/' + HOTELLER.length + ' har bookingSlug';
});
t('lagBookingUrl (bakoverkompatibilitet)', function() {
  var url = lagBookingUrl('Brakanes Hotell', 'Ulvik', '2026-06-13', '2026-06-14');
  if (!url.includes('booking.com')) throw new Error('Ikke booking.com URL');
  if (!url.includes('2026-06-13')) throw new Error('Innsjekk mangler');
  if (!url.includes('group_adults=2')) throw new Error('2 voksne mangler');
  return 'URL korrekt formatert';
});
t('2 voksne (group_adults=2)', function() {
  var url = lagBookingUrl('Test', 'Sted', '2026-06-13', '2026-06-14');
  if (!url.includes('group_adults=2')) throw new Error('Mangler group_adults=2');
  return 'group_adults=2 satt';
});
t('DNT booking-URLs er HTTPS', function() {
  var u = HYTTER.filter(function(h) { return !h.bookingUrl || !h.bookingUrl.startsWith('https://'); });
  if (u.length) throw new Error('Ugyldige: ' + u.map(function(h) { return h.navn; }).join(', '));
  return HYTTER.length + '/' + HYTTER.length + ' har HTTPS';
});
t('UT.no-lenker i turer', function() {
  var u = TURER.filter(function(t) { return !t.utNoUrl || !t.utNoUrl.includes('ut.no'); });
  if (u.length) throw new Error('Mangler ut.no: ' + u.map(function(t) { return t.navn; }).join(', '));
  return TURER.length + '/' + TURER.length + ' turer har ut.no';
});
t('Turistforeningen i LENKER', function() {
  var alle = LENKER.reduce(function(acc, k) { return acc.concat(k.items.map(function(i) { return i.url; })); }, []).join(' ');
  if (!alle.includes('dnt.no') && !alle.includes('turistforeningen.no')) throw new Error('dnt.no mangler');
  if (!alle.includes('ut.no')) throw new Error('ut.no mangler');
  return 'dnt.no + ut.no begge inkludert';
});

// === DATOER ===
console.log('\n=== DATOER ===');
t('Startdato 2026-06-12 (bryllupsdag)', function() {
  if (APP_CONFIG.startDate !== '2026-06-12') throw new Error('Er: ' + APP_CONFIG.startDate);
  return APP_CONFIG.startDate;
});
t('Sluttdato 2026-06-20', function() {
  if (APP_CONFIG.endDate !== '2026-06-20') throw new Error('Er: ' + APP_CONFIG.endDate);
  return APP_CONFIG.endDate;
});
t('2 personer i config', function() {
  if (APP_CONFIG.people !== 2) throw new Error('Er: ' + APP_CONFIG.people);
  return '2 voksne';
});
t('datoForDag(0) = 2026-06-12', function() {
  var d = datoForDag(0);
  if (d !== '2026-06-12') throw new Error('Returnerte: ' + d);
  return d;
});
t('datoForDag(8) = 2026-06-20', function() {
  var d = datoForDag(8);
  if (d !== '2026-06-20') throw new Error('Returnerte: ' + d);
  return d;
});
t('Unike datoer i plan', function() {
  var datoer = STANDARD_PLAN.map(function(d) { return d.dato; }).filter(Boolean);
  var dobbelte = datoer.filter(function(d, i) { return datoer.indexOf(d) !== i; });
  if (dobbelte.length) throw new Error('Duplikater: ' + dobbelte.join(', '));
  return datoer.length + ' unike datoer';
});

// === TURER ===
console.log('\n=== TURER ===');
t('Vanskelighetsgrader gyldige', function() {
  var gyldige = ['Lett', 'Middels', 'Krevende'];
  var u = TURER.filter(function(t) { return !gyldige.includes(t.vanskelighetsgrad); });
  if (u.length) throw new Error('Ugyldige: ' + u.map(function(t) { return t.navn; }).join(', '));
  var lette = TURER.filter(function(t) { return t.vanskelighetsgrad === 'Lett'; }).length;
  var middels = TURER.filter(function(t) { return t.vanskelighetsgrad === 'Middels'; }).length;
  return 'Lett:' + lette + ' Middels:' + middels;
});
t('Alle obligatoriske tur-felt', function() {
  var u = TURER.filter(function(t) { return !t.navn || !t.varighet || !t.distanse || !t.stigning; });
  if (u.length) throw new Error('Mangler felt: ' + u.map(function(t) { return t.navn || 'ukjent'; }).join(', '));
  return TURER.length + '/' + TURER.length + ' komplette';
});

// === HTTPS SJEKK ===
console.log('\n=== SIKKERHET (HTTPS) ===');
t('Alle lenker er HTTPS', function() {
  var alle = LENKER.reduce(function(acc, k) {
    return acc.concat(k.items.map(function(i) { return i.url; }));
  }, []).concat(
    HOTELLER.filter(function(h) { return h.web; }).map(function(h) { return h.web; }),
    HYTTER.map(function(h) { return h.bookingUrl; }),
    HYTTER.map(function(h) { return h.utNo; }),
    TURER.map(function(t) { return t.utNoUrl; })
  );
  var http = alle.filter(function(url) { return url && url.startsWith('http://'); });
  if (http.length) throw new Error('HTTP-lenker: ' + http.join(', '));
  return alle.length + ' HTTPS-lenker OK';
});
t('Visit-sider inkludert', function() {
  var alle = LENKER.reduce(function(acc, k) {
    return acc.concat(k.items.map(function(i) { return i.url; }));
  }, []).join(' ');
  if (!alle.includes('hardangerfjord.com')) throw new Error('hardangerfjord.com mangler');
  if (!alle.includes('sognefjord.no')) throw new Error('sognefjord.no mangler');
  return 'hardangerfjord.com + sognefjord.no OK';
});

// === RESULTAT ===
var total = pass + fail;
var ikon = fail === 0 ? '🎉' : '⚠';
console.log('\n' + '='.repeat(44));
console.log(ikon + ' RESULTAT: ' + pass + ' bestatt, ' + fail + ' feilet av ' + total + ' tester');
console.log('Suksessrate: ' + Math.round(pass / total * 100) + '%');
console.log('='.repeat(44));

process.exit(fail > 0 ? 1 : 0);
