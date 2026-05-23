// =====================================================================
// app.js — Navigasjon, tabs, og app-initialisering
// =====================================================================

let mapInitialized = false;
let currentTab = 'kart';

// ---- Start appen ----
document.addEventListener('DOMContentLoaded', function() {
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
      }, 50);
    } else {
      oppdaterKart();
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
    severdigheter: filter === 'alle' || filter === 'severdigheter'
  };

  if (visBtyper.hoteller)      HOTELLER.forEach(h => { totalt++; if (matcherSøk(h)) alle.push({ type: 'hotell',      data: h }); });
  if (visBtyper.hytter)        HYTTER.forEach(h =>   { totalt++; if (matcherSøk(h)) alle.push({ type: 'hytte',       data: h }); });
  if (visBtyper.turer)         TURER.forEach(t =>    { totalt++; if (matcherSøk(t)) alle.push({ type: 'tur',         data: t }); });
  if (visBtyper.severdigheter) SEVERDIGHETER.forEach(s => { totalt++; if (matcherSøk(s)) alle.push({ type: 'severdighet', data: s }); });

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
    if (type === 'hotell')      container.appendChild(lagHotellCard(data));
    else if (type === 'hytte')  container.appendChild(lagHytteCard(data));
    else if (type === 'tur')    container.appendChild(lagTurCard(data));
    else                        container.appendChild(lagSeverdCard(data));
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
      ${h.bryllup ? `<div style="font-size:13px;color:#c9a84c;font-weight:600">💒 Bryllupsgjester her 12. juni 2026</div>` : ''}
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
