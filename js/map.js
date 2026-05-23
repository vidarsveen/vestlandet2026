// =====================================================================
// map.js — Leaflet kart-logikk
// =====================================================================

let map = null;
let layers = {
  hoteller: null,
  hytter: null,
  turer: null,
  severdigheter: null,
  camping: null
};

let activeFilters = new Set(['hoteller', 'hytter', 'turer', 'severdigheter']);
let reiseruteLag  = null;
let reiseruteAktiv = false;

// ---- Marker-farger ----
const COLORS = {
  hotell:      '#1a3a5c',
  hytte:       '#2d8c6f',
  tur:         '#e8a020',
  severdighet: '#8b4cbc',
  camping:     '#d45500'
};

// ---- Custom SVG-markør ----
function lagMarkørIkon(farge, emoji, størrelse = 32) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${størrelse}" height="${størrelse + 6}" viewBox="0 0 ${størrelse} ${størrelse + 6}">
      <circle cx="${størrelse/2}" cy="${størrelse/2}" r="${størrelse/2 - 1}" fill="${farge}" stroke="white" stroke-width="2"/>
      <text x="${størrelse/2}" y="${størrelse/2 + 1}" text-anchor="middle" dominant-baseline="middle" font-size="${størrelse * 0.45}">${emoji}</text>
      <polygon points="${størrelse/2 - 4},${størrelse - 1} ${størrelse/2 + 4},${størrelse - 1} ${størrelse/2},${størrelse + 5}" fill="${farge}"/>
    </svg>`.trim();

  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [størrelse, størrelse + 6],
    iconAnchor: [størrelse / 2, størrelse + 5],
    popupAnchor: [0, -(størrelse + 8)]
  });
}

// ---- Initialiser kart ----
function initMap() {
  if (map) return;

  map = L.map('map', {
    center: APP_CONFIG.mapCenter,
    zoom: APP_CONFIG.mapZoom,
    zoomControl: true,
    attributionControl: true
  });

  // OpenStreetMap tiles (gratis, ingen API-nøkkel)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  // Legg til alle lag
  leggTilHoteller();
  leggTilHytter();
  leggTilTurer();
  leggTilSeverdigheter();
  leggTilCamping();

  // Tilpass kart til alle markører
  const alleBounds = [];
  HOTELLER.forEach(h => alleBounds.push([h.lat, h.lng]));
  SEVERDIGHETER.forEach(s => alleBounds.push([s.lat, s.lng]));
  if (alleBounds.length > 0) {
    map.fitBounds(alleBounds, { padding: [30, 30] });
  }
}

// ---- Hoteller ----
function leggTilHoteller() {
  layers.hoteller = L.layerGroup();
  const ikon = lagMarkørIkon(COLORS.hotell, '🏨');

  HOTELLER.forEach(h => {
    const marker = L.marker([h.lat, h.lng], { icon: ikon });
    marker.bindPopup(lagHotellPopup(h), { maxWidth: 240 });
    layers.hoteller.addLayer(marker);
  });

  layers.hoteller.addTo(map);
}

function lagHotellPopup(h) {
  const idag = APP_CONFIG.startDate;
  const bookUrl = h.bookingSlug
    ? lagHotellBookingUrl(h.bookingSlug, idag, datoForDag(1))
    : lagBookingUrl(h.navn, h.sted, idag, datoForDag(1));
  const stjernerHtml = h.stjerner ? '⭐'.repeat(h.stjerner) : '';

  return `
    <div class="map-popup">
      <div class="map-popup-type">🏨 Hotell · ${h.region}</div>
      <div class="map-popup-name">${h.navn}</div>
      <div class="map-popup-desc">${h.beskrivelse.substring(0, 100)}${h.beskrivelse.length > 100 ? '…' : ''}</div>
      <div class="map-popup-meta">${stjernerHtml} · ${h.sted}</div>
      <div style="display:flex;gap:6px;margin-top:6px">
        <a class="btn btn-primary btn-sm" href="${bookUrl}" target="_blank" rel="noopener">
          📅 Book nå
        </a>
        <button class="btn btn-outline btn-sm" onclick="visStedModal('hotell','${h.id}')">
          ℹ Info
        </button>
      </div>
    </div>`;
}

// ---- DNT Hytter ----
function leggTilHytter() {
  layers.hytter = L.layerGroup();
  const ikon = lagMarkørIkon(COLORS.hytte, '⛺');

  HYTTER.forEach(h => {
    const marker = L.marker([h.lat, h.lng], { icon: ikon });
    marker.bindPopup(lagHyttePopup(h), { maxWidth: 240 });
    layers.hytter.addLayer(marker);
  });

  CAMPING.forEach(c => {
    const ikonC = lagMarkørIkon(COLORS.camping, '🏕️', 28);
    const marker = L.marker([c.lat, c.lng], { icon: ikonC });
    marker.bindPopup(`
      <div class="map-popup">
        <div class="map-popup-type">🏕 Camping</div>
        <div class="map-popup-name">${c.navn}</div>
        <div class="map-popup-desc">${c.beskrivelse}</div>
        <a class="btn btn-fjord btn-sm" href="${c.bookingUrl}" target="_blank" rel="noopener">Book plass</a>
      </div>`, { maxWidth: 220 });
    layers.hytter.addLayer(marker);
  });

  layers.hytter.addTo(map);
}

function lagHyttePopup(h) {
  return `
    <div class="map-popup">
      <div class="map-popup-type">🏔 ${h.type} · ${h.region}</div>
      <div class="map-popup-name">${h.navn}</div>
      <div class="map-popup-desc">${h.beskrivelse.substring(0, 100)}${h.beskrivelse.length > 100 ? '…' : ''}</div>
      <div class="map-popup-meta">
        🛏 ${h.senger} senger &nbsp;·&nbsp; ⬆ ${h.hoyde} moh
      </div>
      <div style="display:flex;gap:6px;margin-top:6px">
        <a class="btn btn-fjord btn-sm" href="${h.bookingUrl}" target="_blank" rel="noopener">
          📅 Book DNT
        </a>
        <a class="btn btn-outline btn-sm" href="${h.utNo}" target="_blank" rel="noopener">
          🗺 UT.no
        </a>
      </div>
    </div>`;
}

// ---- Turstier ----
function leggTilTurer() {
  layers.turer = L.layerGroup();

  TURER.forEach(tur => {
    // Polyline for turen
    const polyline = L.polyline(tur.koordinater, {
      color: tur.farge,
      weight: 4,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: tur.vanskelighetsgrad === 'Lett' ? null : null
    });

    polyline.bindPopup(lagTurPopup(tur), { maxWidth: 240 });
    layers.turer.addLayer(polyline);

    // Start-markør
    const startIkon = lagMarkørIkon(tur.farge, '🥾', 28);
    const startMarker = L.marker(tur.koordinater[0], { icon: startIkon });
    startMarker.bindPopup(lagTurPopup(tur), { maxWidth: 240 });
    layers.turer.addLayer(startMarker);
  });

  layers.turer.addTo(map);
}

function lagTurPopup(tur) {
  const vanskCss = tur.vanskelighetsgrad === 'Lett' ? 'tag-lett' :
                   tur.vanskelighetsgrad === 'Middels' ? 'tag-middels' : 'tag-krevende';
  return `
    <div class="map-popup">
      <div class="map-popup-type">🥾 Tur · ${tur.region}</div>
      <div class="map-popup-name">${tur.navn}</div>
      <div class="map-popup-desc">${tur.undertittel}</div>
      <div class="map-popup-meta">
        ⏱ ${tur.varighet} &nbsp;·&nbsp; 📏 ${tur.distanse} &nbsp;·&nbsp; ⬆ ${tur.stigning}
      </div>
      <span class="tag ${vanskCss}" style="margin-bottom:8px;display:inline-block">${tur.vanskelighetsgrad}</span>
      <div style="margin-top:4px">
        <a class="btn btn-gull btn-sm" href="${tur.utNoUrl}" target="_blank" rel="noopener">
          🗺 Se på UT.no
        </a>
      </div>
    </div>`;
}

// ---- Severdigheter ----
function leggTilSeverdigheter() {
  layers.severdigheter = L.layerGroup();
  const ikon = lagMarkørIkon(COLORS.severdighet, '📷', 28);

  SEVERDIGHETER.forEach(s => {
    const marker = L.marker([s.lat, s.lng], { icon: ikon });
    marker.bindPopup(`
      <div class="map-popup">
        <div class="map-popup-type">📷 ${s.type} · ${s.region}</div>
        <div class="map-popup-name">${s.navn}</div>
        <div class="map-popup-desc">${s.beskrivelse}</div>
        ${s.web ? `<a class="btn btn-outline btn-sm" href="${s.web}" target="_blank" rel="noopener">Les mer →</a>` : ''}
      </div>`, { maxWidth: 240 });
    layers.severdigheter.addLayer(marker);
  });

  layers.severdigheter.addTo(map);
}

// ---- Camping ----
function leggTilCamping() {
  layers.camping = L.layerGroup();
  // Camping er inkludert i hytter-laget
}

// ---- Filterkontroll ----
function toggleMapFilter(type) {
  if (activeFilters.has(type)) {
    activeFilters.delete(type);
    if (layers[type]) map.removeLayer(layers[type]);
  } else {
    activeFilters.add(type);
    if (layers[type]) layers[type].addTo(map);
  }

  // Oppdater chip-styling
  document.querySelectorAll('.filter-chip').forEach(chip => {
    const t = chip.dataset.filter;
    chip.classList.toggle('active', activeFilters.has(t));
  });
}

// ---- Flytt kart til lokasjon ----
function flyToLocation(lat, lng, zoom = 13) {
  if (!map) return;
  map.flyTo([lat, lng], zoom, { duration: 1.2 });
}

// ---- Resize fix ----
function oppdaterKart() {
  if (map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
}

// ---- Reiserute — viser planlagte stopp og linjer på kartet ----
function toggleReiserute() {
  reiseruteAktiv = !reiseruteAktiv;
  const chip = document.querySelector('.filter-chip[data-filter="reiserute"]');
  if (chip) chip.classList.toggle('active', reiseruteAktiv);

  if (reiseruteAktiv) {
    visReiserute();
  } else {
    skjulReiserute();
  }
}

function visReiserute() {
  skjulReiserute();
  if (!map || typeof currentPlan === 'undefined') return;

  reiseruteLag = L.layerGroup();

  // Samle alle bookte stopp i rekkefølge
  const stopp = currentPlan.map(dag => {
    const hotell = dag.hotell ? HOTELLER.find(h => h.id === dag.hotell) : null;
    const hyt    = dag.hotell ? HYTTER.find(h => h.id === dag.hotell)   : null;
    const lok    = hotell || hyt;
    return lok
      ? { dag: dag.dag, lat: lok.lat, lng: lok.lng, navn: lok.navn, dagNavn: dag.dagNavn }
      : null;
  }).filter(Boolean);

  if (stopp.length === 0) {
    visToast('Ingen overnattingssteder i planen ennå 📅');
    reiseruteAktiv = false;
    const chip = document.querySelector('.filter-chip[data-filter="reiserute"]');
    if (chip) chip.classList.remove('active');
    return;
  }

  // Tegn stiplede linjer mellom påfølgende bookte dager
  for (let i = 0; i < stopp.length - 1; i++) {
    const fra = stopp[i];
    const til = stopp[i + 1];
    // Bare tegn linje hvis dagene er etterfølgende i planen
    if (til.dag === fra.dag + 1) {
      L.polyline([[fra.lat, fra.lng], [til.lat, til.lng]], {
        color: '#e8a020',
        weight: 3,
        opacity: 0.9,
        dashArray: '10 7',
        lineCap: 'round'
      }).addTo(reiseruteLag);
    }
  }

  // Legg til nummererte stopp-markører
  stopp.forEach(s => {
    const ikonHtml = `<div class="reise-nr-markør">${s.dag}</div>`;
    const ikon = L.divIcon({
      className: '',
      html: ikonHtml,
      iconSize:   [30, 30],
      iconAnchor: [15, 15],
      popupAnchor:[0, -18]
    });
    L.marker([s.lat, s.lng], { icon: ikon, zIndexOffset: 1000 })
      .bindPopup(`
        <div class="map-popup">
          <div class="map-popup-type">📅 Dag ${s.dag}</div>
          <div class="map-popup-name">${s.navn}</div>
          <div class="map-popup-desc">${s.dagNavn}</div>
        </div>`, { maxWidth: 200 })
      .addTo(reiseruteLag);
  });

  reiseruteLag.addTo(map);

  // Zoom til ruten
  const bounds = stopp.map(s => [s.lat, s.lng]);
  if (bounds.length === 1) {
    map.setView(bounds[0], 12);
  } else {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

function skjulReiserute() {
  if (reiseruteLag) {
    map.removeLayer(reiseruteLag);
    reiseruteLag = null;
  }
}

// Kalles fra planner når plan endres, slik at reiseruten oppdateres
function oppdaterReiserute() {
  if (reiseruteAktiv) visReiserute();
}
