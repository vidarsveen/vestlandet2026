// =====================================================================
// app.js — Navigasjon, tabs, og app-initialisering
// =====================================================================

let mapInitialized = false;
let currentTab = 'kart';

// =====================================================================
// EGENDEFINERTE HOTELLER (søk via OpenStreetMap Nominatim)
// =====================================================================

const EGNE_HOTELLER_KEY = 'hardanger-egne-hoteller-v1';
let egneHoteller = [];

function lastEgneHoteller() {
  try {
    const lagret = localStorage.getItem(EGNE_HOTELLER_KEY);
    if (lagret) {
      egneHoteller = JSON.parse(lagret);
      // Legg til i global HOTELLER-liste slik at de vises overalt
      egneHoteller.forEach(h => {
        if (!HOTELLER.find(x => x.id === h.id)) HOTELLER.push(h);
      });
    }
  } catch(e) { console.warn('Kunne ikke laste egne hoteller', e); }
}

function lagreEgneHoteller() {
  localStorage.setItem(EGNE_HOTELLER_KEY, JSON.stringify(egneHoteller));
}

// ---- Start appen ----
document.addEventListener('DOMContentLoaded', function() {
  lastEgneHoteller();   // Last egendefinerte hoteller før resten initialiseres
  initNavigation();
  initSteder();
  initInfo();
  initPlanner();

  // Start på kart-tab
  bytteTab('kart');
});

// ---- Tab-navigasjon ----
function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      bytteTab(this.dataset.tab);
    });
  });
}

function bytteTab(tabNavn) {
  // Skjul alle paner
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  // Deaktiver alle nav-knapper
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Vis valgt pane
  const pane = document.getElementById(`${tabNavn}-pane`);
  if (pane) pane.classList.add('active');

  // Aktiver nav-knapp
  const navBtn = document.querySelector(`.nav-btn[data-tab="${tabNavn}"]`);
  if (navBtn) navBtn.classList.add('active');

  currentTab = tabNavn;

  // Init kart når det blir synlig
  if (tabNavn === 'kart') {
    if (!mapInitialized) {
      mapInitialized = true;
      setTimeout(() => {
        initMap();
        // Vis reiserute automatisk etter at kart er initialisert
        setTimeout(() => oppdaterReiserute(), 300);
      }, 50);
    } else {
      oppdaterKart();
      oppdaterReiserute();
    }
  }
}

// ---- Steder-tab ----
let aktiveStederFilter = 'alle';
let søkeTekst = '';

function initSteder() {
  renderSteder('alle');
}

function filterSteder(type) {
  aktiveStederFilter = type;
  document.querySelectorAll('.steder-filter-bar .filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === type);
  });
  renderSteder(type);
}

// ---- Søk ----
function oppdaterSøk(verdi) {
  søkeTekst = verdi.trim().toLowerCase();
  const clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = søkeTekst ? 'block' : 'none';
  renderSteder(aktiveStederFilter);
}

function tømmeSøk() {
  søkeTekst = '';
  const input = document.getElementById('steder-search');
  if (input) input.value = '';
  const clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.style.display = 'none';
  renderSteder(aktiveStederFilter);
}

function matcherSøk(item) {
  if (!søkeTekst) return true;
  const tekst = [
    item.navn        || '',
    item.sted        || '',
    item.beskrivelse || '',
    item.region      || '',
    item.undertittel || '',
    item.type        || '',
    item.merInfo     || '',
    item.vanskelighetsgrad || '',
    ...(item.fasiliteter   || [])
  ].join(' ').toLowerCase();
  // Støtter flere søkeord separert med mellomrom (AND-logikk)
  return søkeTekst.split(/\s+/).every(ord => tekst.includes(ord));
}

function oppdaterSøkAntall(antall, totalt) {
  const el = document.getElementById('søk-antall');
  if (!el) return;
  if (!søkeTekst) {
    el.textContent = '';
    return;
  }
  if (antall === 0) {
    el.innerHTML = `<span style="color:#c04040">Ingen treff på «${søkeTekst}»</span>`;
  } else {
    el.textContent = `${antall} av ${totalt} treff`;
  }
}

function renderSteder(filter) {
  const container = document.getElementById('steder-liste');
  if (!container) return;
  container.innerHTML = '';

  let alle = [];
  let totalt = 0;

  const visBtyper = {
    hoteller:      filter === 'alle' || filter === 'hoteller',
    hytter:        filter === 'alle' || filter === 'hytter',
    turer:         filter === 'alle' || filter === 'turer',
    severdigheter: filter === 'alle' || filter === 'severdigheter',
    restauranter:  filter === 'alle' || filter === 'restauranter',
    aktiviteter:   filter === 'alle' || filter === 'aktiviteter'
  };

  if (visBtyper.hoteller)      HOTELLER.forEach(h => { totalt++; if (matcherSøk(h)) alle.push({ type: 'hotell',      data: h }); });
  if (visBtyper.hytter)        HYTTER.forEach(h =>   { totalt++; if (matcherSøk(h)) alle.push({ type: 'hytte',       data: h }); });
  if (visBtyper.turer)         TURER.forEach(t =>    { totalt++; if (matcherSøk(t)) alle.push({ type: 'tur',         data: t }); });
  if (visBtyper.severdigheter) SEVERDIGHETER.forEach(s => { totalt++; if (matcherSøk(s)) alle.push({ type: 'severdighet', data: s }); });
  if (visBtyper.restauranter)  RESTAURANTER.forEach(r => { totalt++; if (matcherSøk(r)) alle.push({ type: 'restaurant',  data: r }); });
  if (visBtyper.aktiviteter)   AKTIVITETER.forEach(a => { totalt++; if (matcherSøk(a)) alle.push({ type: 'aktivitet',   data: a }); });

  oppdaterSøkAntall(alle.length, totalt);

  if (alle.length === 0) {
    container.innerHTML = `
      <div class="ingen-treff">
        <div class="ingen-ikon">🔍</div>
        <p>Ingen treff på <strong>«${søkeTekst}»</strong></p>
        <small>Prøv et annet søkeord, eller fjern filteret</small>
      </div>`;
    return;
  }

  alle.forEach(({ type, data }) => {
    if (type === 'hotell')       container.appendChild(lagHotellCard(data));
    else if (type === 'hytte')   container.appendChild(lagHytteCard(data));
    else if (type === 'tur')     container.appendChild(lagTurCard(data));
    else if (type === 'restaurant') container.appendChild(lagRestaurantCard(data));
    else if (type === 'aktivitet')  container.appendChild(lagAktivitetCard(data));
    else                         container.appendChild(lagSeverdCard(data));
  });
}

function lagHotellCard(h) {
  const idag = APP_CONFIG.startDate;
  const imorgen = datoForDag(1);
  const bookUrl = lagBookingUrl(h.navn, h.sted, idag, imorgen);
  const stjernerHtml = h.stjerner ? '⭐'.repeat(h.stjerner) : '';

  const div = document.createElement('div');
  div.className = 'sted-card';
  div.innerHTML = `
    <div class="sted-card-header">
      <div class="sted-icon-wrap sted-icon-hotell">🏨</div>
      <div class="sted-info">
        <div class="sted-navn">${h.navn}</div>
        <div class="sted-sub">${h.sted} · ${h.region} · ${stjernerHtml}</div>
      </div>
    </div>
    <div class="sted-card-body">
      <div class="sted-desc">${h.beskrivelse}</div>
      <div class="sted-meta">
        <span class="tag tag-navy">${h.region}</span>
        <span class="tag tag-sky">${h.prisklasse}</span>
        ${h.startHotell ? '<span class="tag tag-gull">🏁 Starthotell</span>' : ''}
      </div>
      ${h.fasiliteter ? `<div class="info-row" style="flex-wrap:wrap;gap:6px">
        ${h.fasiliteter.slice(0,5).map(f => `<span class="tag tag-sky">${f}</span>`).join('')}
      </div>` : ''}
      <div class="btn-group">
        <a class="btn btn-primary btn-sm" href="${bookUrl}" target="_blank" rel="noopener">📅 Book</a>
        ${h.web ? `<a class="btn btn-outline btn-sm" href="${h.web}" target="_blank" rel="noopener">🌐 Nettsted</a>` : ''}
        <button class="btn btn-fjord btn-sm" onclick="visHotellPaKart('${h.id}')">🗺 Kart</button>
      </div>
    </div>`;
  return div;
}

function lagHytteCard(h) {
  const div = document.createElement('div');
  div.className = 'sted-card';
  div.innerHTML = `
    <div class="sted-card-header">
      <div class="sted-icon-wrap sted-icon-hytte">⛺</div>
      <div class="sted-info">
        <div class="sted-navn">${h.navn}</div>
        <div class="sted-sub">${h.type} · ${h.sted}</div>
      </div>
    </div>
    <div class="sted-card-body">
      <div class="sted-desc">${h.beskrivelse}</div>
      <div class="sted-meta">
        <span class="tag tag-fjord">DNT</span>
        <span class="tag tag-sky">⬆ ${h.hoyde} moh</span>
        <span class="tag tag-sky">🛏 ${h.senger} senger</span>
        <span class="tag tag-sky">📅 ${h.sesong}</span>
      </div>
      <div class="btn-group">
        <a class="btn btn-fjord btn-sm" href="${h.bookingUrl}" target="_blank" rel="noopener">⛺ Book DNT</a>
        <a class="btn btn-outline btn-sm" href="${h.utNo}" target="_blank" rel="noopener">🗺 UT.no</a>
      </div>
    </div>`;
  return div;
}

function lagTurCard(tur) {
  const vanskCss = tur.vanskelighetsgrad === 'Lett' ? 'tag-lett' :
                   tur.vanskelighetsgrad === 'Middels' ? 'tag-middels' : 'tag-krevende';
  const div = document.createElement('div');
  div.className = 'sted-card';
  div.innerHTML = `
    <div class="sted-card-header">
      <div class="sted-icon-wrap sted-icon-tur">🥾</div>
      <div class="sted-info">
        <div class="sted-navn">${tur.navn}</div>
        <div class="sted-sub">${tur.undertittel}</div>
      </div>
    </div>
    <div class="sted-card-body">
      <div class="sted-desc">${tur.beskrivelse}</div>
      <div class="sted-meta">
        <span class="tag ${vanskCss}">${tur.vanskelighetsgrad}</span>
        <span class="tag tag-sky">⏱ ${tur.varighet}</span>
        <span class="tag tag-sky">📏 ${tur.distanse}</span>
        <span class="tag tag-sky">⬆ ${tur.stigning}</span>
        ${tur.anbefalt ? '<span class="tag tag-gull">⭐ Anbefalt</span>' : ''}
      </div>
      <div class="sted-desc" style="font-size:12px;color:var(--text-muted)">${tur.merInfo}</div>
      <div class="btn-group">
        <a class="btn btn-gull btn-sm" href="${tur.utNoUrl}" target="_blank" rel="noopener">🗺 Se på UT.no</a>
        <button class="btn btn-outline btn-sm" onclick="visIDagPaKart(${tur.startLat}, ${tur.startLng})">📍 Vis på kart</button>
      </div>
    </div>`;
  return div;
}

function lagSeverdCard(s) {
  const div = document.createElement('div');
  div.className = 'sted-card';
  div.innerHTML = `
    <div class="sted-card-header">
      <div class="sted-icon-wrap sted-icon-sev">📷</div>
      <div class="sted-info">
        <div class="sted-navn">${s.navn}</div>
        <div class="sted-sub">${s.type} · ${s.region}</div>
      </div>
    </div>
    <div class="sted-card-body">
      <div class="sted-desc">${s.beskrivelse}</div>
      <div class="btn-group">
        ${s.web ? `<a class="btn btn-outline btn-sm" href="${s.web}" target="_blank" rel="noopener">🌐 Les mer</a>` : ''}
        <button class="btn btn-fjord btn-sm" onclick="visIDagPaKart(${s.lat}, ${s.lng})">🗺 Vis på kart</button>
      </div>
    </div>`;
  return div;
}

// ---- Restaurant-kort ----
function lagRestaurantCard(r) {
  const div = document.createElement('div');
  div.className = 'sted-card';
  div.innerHTML = `
    <div class="sted-card-header">
      <div class="sted-icon-wrap" style="background:#c0392b;font-size:18px;display:flex;align-items:center;justify-content:center">${r.emoji || '🍽️'}</div>
      <div class="sted-info">
        <div class="sted-navn">${r.navn}</div>
        <div class="sted-sub">${r.sted} · ${r.region}</div>
      </div>
    </div>
    <div class="sted-card-body">
      <div class="sted-desc">${r.beskrivelse}</div>
      <div class="sted-meta">
        <span class="tag tag-red">${r.type}</span>
        <span class="tag" style="background:#fff8e8;color:#a0620a">${r.priskategori}</span>
      </div>
      <div class="btn-group">
        <a class="btn btn-outline btn-sm" href="${r.url}" target="_blank" rel="noopener">🌐 Nettside</a>
        <button class="btn btn-fjord btn-sm" onclick="event.stopPropagation();visIDagPaKart(${r.lat}, ${r.lng})">🗺 Vis på kart</button>
      </div>
    </div>`;
  return div;
}

// ---- Aktivitet-kort ----
function lagAktivitetCard(a) {
  const div = document.createElement('div');
  div.className = 'sted-card';
  div.innerHTML = `
    <div class="sted-card-header">
      <div class="sted-icon-wrap" style="background:#16a085;font-size:18px;display:flex;align-items:center;justify-content:center">${a.emoji || '🎯'}</div>
      <div class="sted-info">
        <div class="sted-navn">${a.navn}</div>
        <div class="sted-sub">${a.sted} · ${a.region}</div>
      </div>
    </div>
    <div class="sted-card-body">
      <div class="sted-desc">${a.beskrivelse}</div>
      <div class="sted-meta">
        <span class="tag" style="background:#e0f5f1;color:#16a085">${a.type}</span>
        <span class="tag tag-sky">⏱ ${a.varighet}</span>
        <span class="tag" style="background:#f0fde8;color:#3a7d1a">💰 ${a.pris}</span>
      </div>
      <div class="btn-group">
        <a class="btn btn-outline btn-sm" href="${a.url}" target="_blank" rel="noopener">🌐 Mer info</a>
        <button class="btn btn-fjord btn-sm" onclick="event.stopPropagation();visIDagPaKart(${a.lat}, ${a.lng})">🗺 Vis på kart</button>
      </div>
    </div>`;
  return div;
}

// ---- Hotell på kart ----
function visHotellPaKart(hotelId) {
  const h = HOTELLER.find(x => x.id === hotelId);
  if (!h) return;
  bytteTab('kart');
  setTimeout(() => flyToLocation(h.lat, h.lng, 14), 300);
}

// ---- Info-tab ----
function initInfo() {
  renderInfoLenker();
}

function renderInfoLenker() {
  const container = document.getElementById('info-lenker');
  if (!container) return;

  LENKER.forEach(kategori => {
    const seksjon = document.createElement('div');
    seksjon.className = 'info-section';
    seksjon.innerHTML = `<h3>${kategori.kategori}</h3>`;

    const kort = document.createElement('div');
    kort.className = 'link-card';

    kategori.items.forEach(lenke => {
      const ikonMap = {
        'DNT': '⛺', 'Turistforeningen': '🏔', 'UT.no': '🗺', 'booking': '🏨',
        'Hardanger': '🌊', 'Flåm': '🚂', 'Sognefjord': '⛵', 'Ruter': '🚌',
        'Norgeskart': '🗺', 'yr.no': '🌤', 'Visit': '📍', 'Lindstrøm': '🏨'
      };
      const ikon = Object.entries(ikonMap).find(([k]) => lenke.navn.includes(k))?.[1] || '🔗';

      const el = document.createElement('a');
      el.className = 'link-item';
      el.href = lenke.url;
      el.target = '_blank';
      el.rel = 'noopener';
      el.innerHTML = `
        <span class="link-icon">${ikon}</span>
        <span class="link-text">
          <span class="link-name">${lenke.navn}</span>
          <span class="link-desc">${lenke.beskrivelse}</span>
        </span>
        <span class="link-arrow">↗</span>`;
      kort.appendChild(el);
    });

    seksjon.appendChild(kort);
    container.appendChild(seksjon);
  });
}

// ---- Modal (bottom sheet) — åpner info om et hotell ----
function visStedModal(type, id) {
  if (type !== 'hotell') return;
  const h = HOTELLER.find(x => x.id === id);
  if (!h) return;

  const overlay = document.getElementById('modal-overlay');
  const title   = document.getElementById('modal-title');
  const sub     = document.getElementById('modal-subtitle');
  const body    = document.getElementById('modal-body');

  title.textContent = h.navn;
  sub.textContent   = h.sted + ' · ' + h.region + ' · ' + '⭐'.repeat(h.stjerner || 0);

  const stjernerHtml = h.stjerner ? '⭐'.repeat(h.stjerner) : '';
  const idag    = APP_CONFIG.startDate;
  const imorgen = datoForDag(1);
  const bookUrl = h.bookingSlug
    ? lagHotellBookingUrl(h.bookingSlug, idag, imorgen)
    : lagBookingUrl(h.navn, h.sted, idag, imorgen);

  body.innerHTML = `
    <p style="font-size:14px;line-height:1.6;color:#1a2433;margin-bottom:14px">${h.beskrivelse}</p>

    ${h.fasiliteter ? `
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#5a6b7c;margin-bottom:6px">Fasiliteter</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${h.fasiliteter.map(f => `<span style="background:#e8f4f8;color:#1a3a5c;font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px">${f}</span>`).join('')}
      </div>
    </div>` : ''}

    <div style="margin-bottom:14px;display:flex;flex-direction:column;gap:6px">
      ${h.telefon ? `<div style="font-size:13px;color:#5a6b7c">📞 <a href="tel:${h.telefon}" style="color:#2d8c6f">${h.telefon}</a></div>` : ''}
      <div style="font-size:13px;color:#5a6b7c">🏷 Prisklasse: ${h.prisklasse || '–'}</div>
      ${h.bryllup ? `<div style="font-size:13px;color:#c9a84c;font-weight:600">💒 Bryllupsgjester her lørdag 13. juni 2026</div>` : ''}
    </div>

    <div style="display:flex;flex-direction:column;gap:8px">
      <a class="btn btn-primary" href="${bookUrl}" target="_blank" rel="noopener" style="justify-content:center">
        📅 Book på Booking.com (2 voksne)
      </a>
      ${h.web ? `
      <a class="btn btn-fjord" href="${h.web}" target="_blank" rel="noopener" style="justify-content:center">
        🌐 Offisiell nettside
      </a>` : ''}
      ${h.wiki ? `
      <a class="btn btn-outline" href="${h.wiki}" target="_blank" rel="noopener" style="justify-content:center">
        📖 Wikipedia
      </a>` : ''}
      <button class="btn btn-outline" onclick="visHotellPaKart('${h.id}');lukkModal()" style="justify-content:center">
        🗺 Vis på kart
      </button>
    </div>`;

  overlay.classList.add('open');
}

function lukkModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
}

// ---- Legg hotell til plan (dag-velger fra kart) ----
function velgDagForHotell(hotelId) {
  const h = HOTELLER.find(x => x.id === hotelId);
  if (!h || typeof currentPlan === 'undefined') return;

  const overlay = document.getElementById('modal-overlay');
  const title   = document.getElementById('modal-title');
  const sub     = document.getElementById('modal-subtitle');
  const body    = document.getElementById('modal-body');

  title.textContent = '📅 Legg til i plan';
  sub.textContent   = h.navn + ' · ' + h.sted;

  const dagerHtml = currentPlan.map((dag, i) => {
    const erValgt = dag.hotell === hotelId;
    return `
      <button class="dag-velger-btn ${erValgt ? 'valgt' : ''}"
              onclick="oppdaterHotell(${i},'${hotelId}');lukkModal();visToast('${h.navn} lagt til dag ${dag.dag} ✓')">
        <span class="dag-velger-nr">${dag.dag}</span>
        <span class="dag-velger-info">
          <span class="dag-velger-dato">${dag.dagNavn}</span>
          <span class="dag-velger-sted">${dag.sted}${erValgt ? ' · ✓ Allerede valgt' : ''}</span>
        </span>
      </button>`;
  }).join('');

  body.innerHTML = `<div class="dag-velger-liste">${dagerHtml}</div>`;
  overlay.classList.add('open');
}

// ---- Legg tur til plan (dag-velger fra kart) ----
function velgDagForTur(turId) {
  const tur = TURER.find(t => t.id === turId);
  if (!tur || typeof currentPlan === 'undefined') return;

  const overlay = document.getElementById('modal-overlay');
  const title   = document.getElementById('modal-title');
  const sub     = document.getElementById('modal-subtitle');
  const body    = document.getElementById('modal-body');

  title.textContent = '🥾 Legg til i plan';
  sub.textContent   = tur.navn + ' · ' + tur.varighet + ' · ' + tur.distanse;

  const dagerHtml = currentPlan.map((dag, i) => {
    const erValgt = (dag.aktiviteter || []).includes(turId);
    const handling = erValgt ? 'Fjern fra' : 'Legg til';
    return `
      <button class="dag-velger-btn ${erValgt ? 'valgt' : ''}"
              onclick="toggleAktivitet(${i},'${turId}',null);lukkModal();visToast('${tur.navn} lagt til dag ${dag.dag} ✓')">
        <span class="dag-velger-nr">${dag.dag}</span>
        <span class="dag-velger-info">
          <span class="dag-velger-dato">${dag.dagNavn}</span>
          <span class="dag-velger-sted">${dag.sted}${erValgt ? ' · ✓ Allerede lagt til' : ''}</span>
        </span>
      </button>`;
  }).join('');

  body.innerHTML = `<div class="dag-velger-liste">${dagerHtml}</div>`;
  overlay.classList.add('open');
}

// ---- Toast-varsel ----
function visToast(melding, varighet = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = melding;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), varighet);
}

// ---- Kart-filterknapper ----
function initKartFilter() {
  document.querySelectorAll('#map-filter-bar .filter-chip').forEach(chip => {
    chip.classList.add('active');
  });
}

// =====================================================================
// LEGG TIL EGET HOTELL — søk via OpenStreetMap Nominatim
// =====================================================================

let _søkResultater = [];
let _søktHotellData = null;

function åpneLeggtilHotell() {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = '🏨 Legg til eget hotell';
  document.getElementById('modal-subtitle').textContent = 'Søk opp hotellet for å finne plassering på kartet';
  document.getElementById('modal-body').innerHTML = `
    <div class="eget-hotell-form">
      <div class="field-label">Hotellnavn *</div>
      <input type="text" id="eh-navn" class="field-input"
             placeholder="f.eks. Stalheim Hotel" oninput="oppdaterEhLagreBtn()">

      <div class="field-label">By / sted</div>
      <input type="text" id="eh-sted" class="field-input"
             placeholder="f.eks. Voss, Norge" oninput="oppdaterEhLagreBtn()">

      <button class="btn btn-fjord" style="width:100%;margin-top:8px" onclick="søkHotellKoordinater()">
        🔍 Finn på kart (OpenStreetMap)
      </button>

      <div id="eh-resultat" style="margin-top:10px"></div>

      <div class="field-label" style="margin-top:14px">Booking.com-lenke (valgfritt)</div>
      <input type="url" id="eh-bookingurl" class="field-input"
             placeholder="https://www.booking.com/hotel/no/hotell-navn.html">
      <p style="font-size:11px;color:#5a6b7c;margin-top:3px">
        Lim inn URL fra Booking.com — appen bytter inn riktige datoer og 2 voksne automatisk
      </p>

      <button class="btn btn-primary" style="width:100%;margin-top:16px"
              id="eh-lagre-btn" disabled onclick="lagreEgetHotell()">
        ✓ Legg til i appen
      </button>
    </div>`;
  _søktHotellData = null;
  overlay.classList.add('open');
}

function oppdaterEhLagreBtn() {
  const btn = document.getElementById('eh-lagre-btn');
  if (btn) btn.disabled = !_søktHotellData;
}

async function søkHotellKoordinater() {
  const navn = (document.getElementById('eh-navn').value || '').trim();
  const sted = (document.getElementById('eh-sted').value || '').trim();
  const resultatDiv = document.getElementById('eh-resultat');

  if (!navn) { visToast('Skriv inn hotellnavn først'); return; }

  resultatDiv.innerHTML = '<p style="color:#5a6b7c;font-size:13px">⏳ Søker…</p>';
  _søktHotellData = null;
  document.getElementById('eh-lagre-btn').disabled = true;

  try {
    const q = encodeURIComponent(navn + (sted ? ', ' + sted : '') + ', Norway');
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=4&accept-language=no`,
      { headers: { 'User-Agent': 'HardangerSogn-ReiseApp/1.0' } }
    );
    const data = await res.json();
    _søkResultater = data;

    if (!data.length) {
      resultatDiv.innerHTML = '<p style="color:#c0392b;font-size:13px">❌ Fant ingen steder. Prøv med mer spesifikt stedsnavn.</p>';
      return;
    }

    const listeHtml = data.slice(0, 4).map((r, i) => {
      const deler = r.display_name.split(',');
      const tittel = deler[0];
      const under  = deler.slice(1, 3).join(',').trim();
      return `
        <button class="dag-velger-btn" id="eh-res-${i}" onclick="velgGeoResultat(${i})" style="margin-bottom:4px">
          <span class="dag-velger-nr" style="font-size:16px;background:#2d8c6f">📍</span>
          <span class="dag-velger-info">
            <span class="dag-velger-dato">${tittel}</span>
            <span class="dag-velger-sted">${under}</span>
          </span>
        </button>`;
    }).join('');

    resultatDiv.innerHTML = '<div class="field-label">Velg riktig sted:</div>' + listeHtml;
  } catch(e) {
    resultatDiv.innerHTML = '<p style="color:#c0392b;font-size:13px">❌ Nettverksfeil. Sjekk internettforbindelsen.</p>';
  }
}

function velgGeoResultat(index) {
  const r = _søkResultater[index];
  _søktHotellData = {
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    displayNavn: r.display_name.split(',').slice(0, 2).join(',').trim()
  };

  // Highlight selected
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`eh-res-${i}`);
    if (btn) btn.classList.toggle('valgt', i === index);
  }

  // Show confirmation
  const bekreft = document.getElementById('eh-bekreft');
  if (bekreft) bekreft.remove();
  const p = document.createElement('p');
  p.id = 'eh-bekreft';
  p.style.cssText = 'font-size:12px;color:#2d8c6f;margin-top:6px;font-weight:600';
  p.textContent = `✓ Valgt: ${_søktHotellData.displayNavn} (${_søktHotellData.lat.toFixed(4)}°N, ${_søktHotellData.lng.toFixed(4)}°Ø)`;
  document.getElementById('eh-resultat').appendChild(p);

  document.getElementById('eh-lagre-btn').disabled = false;
}

function lagreEgetHotell() {
  if (!_søktHotellData) { visToast('Søk opp og velg et sted først'); return; }

  const navn       = (document.getElementById('eh-navn').value || '').trim();
  const stedInput  = (document.getElementById('eh-sted').value || '').trim();
  const bookingUrl = (document.getElementById('eh-bookingurl').value || '').trim();

  if (!navn) { visToast('Skriv inn hotellnavn'); return; }

  // Parse Booking.com slug fra URL
  let bookingSlug = null;
  if (bookingUrl.includes('booking.com/hotel/')) {
    const m = bookingUrl.match(/booking\.com\/hotel\/[a-z]{2}\/([^.?/#]+)/);
    if (m) bookingSlug = m[1];
  }

  const id = 'egendefinert-' + Date.now();
  const nyttHotell = {
    id,
    navn,
    sted:         stedInput || _søktHotellData.displayNavn.split(',')[0].trim(),
    region:       'Eget hotell',
    lat:          _søktHotellData.lat,
    lng:          _søktHotellData.lng,
    stjerner:     0,
    prisklasse:   '',
    beskrivelse:  'Egendefinert hotell. Rediger notater i dagsplanen.',
    fasiliteter:  [],
    bookingSlug,
    bookingUrl:   bookingUrl || null,
    egendefinert: true
  };

  egneHoteller.push(nyttHotell);
  lagreEgneHoteller();
  HOTELLER.push(nyttHotell);   // Legg til i global liste

  // Vis på kart
  if (typeof leggTilHotellMarkør === 'function') leggTilHotellMarkør(nyttHotell);

  // Oppdater Steder-tab
  renderSteder(aktiveStederFilter);

  lukkModal();
  visToast('🏨 ' + navn + ' lagt til!');
}

// =====================================================================
// TUR-SPILLER — Play-through dag-for-dag navigasjon på kartet
// =====================================================================

let spillerAktiv = false;
let spillerDagIndex = 0;

function startSpiller() {
  // Sørg for at vi er på kart-tab
  if (currentTab !== 'kart') bytteTab('kart');

  spillerAktiv = true;
  spillerDagIndex = 0;

  const spiller = document.getElementById('tur-spiller');
  if (spiller) spiller.classList.remove('hidden');

  document.addEventListener('keydown', spillerKeyHandler);
  setTimeout(oppdaterSpillerUI, 400); // vent til kart er synlig
}

function stoppSpiller() {
  spillerAktiv = false;
  const spiller = document.getElementById('tur-spiller');
  if (spiller) spiller.classList.add('hidden');
  document.removeEventListener('keydown', spillerKeyHandler);
}

function spillerKeyHandler(e) {
  if (!spillerAktiv) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    nesteSpillerDag();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    forrigeSpillerDag();
  } else if (e.key === 'Escape') {
    stoppSpiller();
  }
}

function nesteSpillerDag() {
  if (!Array.isArray(currentPlan)) return;
  if (spillerDagIndex < currentPlan.length - 1) {
    spillerDagIndex++;
    oppdaterSpillerUI();
  }
}

function forrigeSpillerDag() {
  if (spillerDagIndex > 0) {
    spillerDagIndex--;
    oppdaterSpillerUI();
  }
}

function oppdaterSpillerUI() {
  if (!Array.isArray(currentPlan) || spillerDagIndex >= currentPlan.length) return;
  const dag = currentPlan[spillerDagIndex];

  const hotell = dag.hotell ? HOTELLER.find(h => h.id === dag.hotell) : null;
  const hyt    = dag.hotell ? HYTTER.find(h => h.id === dag.hotell)   : null;
  const lok    = hotell || hyt;

  // Hjelpefunksjon for nullsjekk
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('spiller-dag-nr',  'Dag ' + dag.dag);
  set('spiller-dato',    dag.dagNavn);
  set('spiller-sted',    lok ? (lok.navn + ' · ' + lok.sted) : (dag.sted || dag.tittel));
  set('spiller-progress', (spillerDagIndex + 1) + ' / ' + currentPlan.length);

  const btnForrige = document.getElementById('spiller-forrige');
  const btnNeste   = document.getElementById('spiller-neste');
  if (btnForrige) btnForrige.disabled = spillerDagIndex === 0;
  if (btnNeste)   btnNeste.disabled   = spillerDagIndex === currentPlan.length - 1;

  // Aktivitets-piller
  const elAkt = document.getElementById('spiller-aktiviteter');
  if (elAkt) {
    const bryllupsdag = (dag.dag === 2) ? '<span class="akt-pill">💒 Bryllup</span>' : '';
    const aktPills = (dag.aktiviteter || []).map(id => {
      const tur = TURER.find(t => t.id === id);
      if (!tur) return '';
      const ikon = tur.vanskelighetsgrad === 'Lett' ? '🟢' :
                   tur.vanskelighetsgrad === 'Middels' ? '🟡' : '🔴';
      return `<span class="akt-pill">${ikon} ${tur.navn}</span>`;
    }).join('');
    elAkt.innerHTML = bryllupsdag + aktPills;
  }

  // Notat (2 linjer maks)
  const elNotat = document.getElementById('spiller-notat');
  if (elNotat) {
    elNotat.textContent = dag.notater || '';
    elNotat.style.display = dag.notater ? '' : 'none';
  }

  // Flytt kart til lokasjon
  setTimeout(() => {
    if (lok) {
      flyToLocation(lok.lat, lok.lng, 13);
    } else if (dag.aktiviteter && dag.aktiviteter.length > 0) {
      const tur = TURER.find(t => t.id === dag.aktiviteter[0]);
      if (tur) flyToLocation(tur.startLat, tur.startLng, 13);
    }
  }, 120);
}

// Eksporter til globalt scope for HTML onclick-hendelser
window.bytteTab = bytteTab;
window.toggleDagCard = toggleDagCard;
window.oppdaterHotell = oppdaterHotell;
window.toggleAktivitet = toggleAktivitet;
window.oppdaterNotater = oppdaterNotater;
window.visIDagPaKart = visIDagPaKart;
window.eksporterPlan = eksporterPlan;
window.nullstillPlan = nullstillPlan;
window.filterSteder = filterSteder;
window.oppdaterSøk  = oppdaterSøk;
window.tømmeSøk     = tømmeSøk;
window.toggleMapFilter = toggleMapFilter;
window.flyToLocation = flyToLocation;
window.visHotellPaKart = visHotellPaKart;
window.visStedModal = visStedModal;
window.lukkModal = lukkModal;
window.åpneLeggtilHotell = åpneLeggtilHotell;
window.søkHotellKoordinater = søkHotellKoordinater;
window.velgGeoResultat = velgGeoResultat;
window.lagreEgetHotell = lagreEgetHotell;
window.oppdaterEhLagreBtn = oppdaterEhLagreBtn;
window.velgDagForHotell = velgDagForHotell;
window.velgDagForTur = velgDagForTur;
window.startSpiller = startSpiller;
window.stoppSpiller = stoppSpiller;
window.nesteSpillerDag = nesteSpillerDag;
window.forrigeSpillerDag = forrigeSpillerDag;
