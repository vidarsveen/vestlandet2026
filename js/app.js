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

function renderSteder(filter) {
  const container = document.getElementById('steder-liste');
  if (!container) return;
  container.innerHTML = '';

  if (filter === 'alle' || filter === 'hoteller') {
    HOTELLER.forEach(h => container.appendChild(lagHotellCard(h)));
  }
  if (filter === 'alle' || filter === 'hytter') {
    HYTTER.forEach(h => container.appendChild(lagHytteCard(h)));
  }
  if (filter === 'alle' || filter === 'turer') {
    TURER.forEach(t => container.appendChild(lagTurCard(t)));
  }
  if (filter === 'alle' || filter === 'severdigheter') {
    SEVERDIGHETER.forEach(s => container.appendChild(lagSeverdCard(s)));
  }
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

// ---- Modal (bottom sheet) ----
function visStedModal(type, id) {
  // Placeholder – kan utvides for full modal-visning
  console.log('Modal:', type, id);
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
window.toggleMapFilter = toggleMapFilter;
window.flyToLocation = flyToLocation;
window.visHotellPaKart = visHotellPaKart;
window.visStedModal = visStedModal;
window.lukkModal = lukkModal;
