// =====================================================================
// planner.js — Dagplanlegger med localStorage
// =====================================================================

const STORAGE_KEY = 'hardanger-sogn-plan-v3';
let currentPlan = [];
let visReiseModus = false;

// ---- Init planlegger ----
function initPlanner() {
  currentPlan = lastPlan();
  renderPlan();
}

// ---- LocalStorage ----
function lagrePlan() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPlan));
  } catch(e) {
    console.warn('Kunne ikke lagre plan:', e);
  }
}

function lastPlan() {
  try {
    const lagret = localStorage.getItem(STORAGE_KEY);
    if (lagret) {
      const data = JSON.parse(lagret);
      // Valider at data er gyldig
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch(e) {
    console.warn('Ugyldig lagret plan, bruker standard:', e);
  }
  // Returner dyp kopi av standard-plan
  return JSON.parse(JSON.stringify(STANDARD_PLAN));
}

function nullstillPlan() {
  if (!confirm('Er du sikker? Dette vil nullstille hele planen din tilbake til forslag.')) return;
  currentPlan = JSON.parse(JSON.stringify(STANDARD_PLAN));
  lagrePlan();
  renderPlan();
  visToast('Plan nullstilt til forslag 🔄');
}

// ---- Toggle mellom rediger og vis-reise ----
function toggleVisReise() {
  visReiseModus = !visReiseModus;
  renderPlan();
}

// ---- Oppdater toggle-knappenes active-state ----
function oppdaterToggleKnapper() {
  const redigerBtn = document.getElementById('toggle-rediger');
  const reiseBtn   = document.getElementById('toggle-reise');
  if (!redigerBtn || !reiseBtn) return;
  redigerBtn.classList.toggle('active', !visReiseModus);
  reiseBtn.classList.toggle('active',   visReiseModus);
}

// ---- Render hele planen ----
function renderPlan() {
  const container = document.getElementById('plan-liste');
  if (!container) return;
  container.innerHTML = '';

  if (visReiseModus) {
    container.appendChild(lagReiseoversikt());
  } else {
    currentPlan.forEach((dag, index) => {
      const card = lagDagCard(dag, index);
      container.appendChild(card);
    });
  }
  oppdaterToggleKnapper();
}

// ---- Lag visuell reisetidslinje ----
function lagReiseoversikt() {
  const wrapper = document.createElement('div');
  wrapper.className = 'reise-tidslinje';

  currentPlan.forEach((dag, i) => {
    const hotell = dag.hotell ? HOTELLER.find(h => h.id === dag.hotell) : null;
    const hyt    = dag.hotell ? HYTTER.find(h => h.id === dag.hotell) : null;
    const erBooket = !!(hotell || hyt);
    const stedNavn = hotell ? hotell.navn : (hyt ? hyt.navn + ' (DNT)' : null);

    // Aktivitetspills
    const aktPills = (dag.aktiviteter || []).map(id => {
      const tur = TURER.find(t => t.id === id);
      if (!tur) return '';
      const ikon = tur.vanskelighetsgrad === 'Lett' ? '🟢' : tur.vanskelighetsgrad === 'Middels' ? '🟡' : '🔴';
      return `<span class="akt-pill">${ikon} ${tur.navn}</span>`;
    }).join('');

    // Bryllups-pill for dag 1
    const ekstraPills = (dag.dag === 1) ? '<span class="akt-pill">💒 Bryllup</span>' : '';

    const stopp = document.createElement('div');
    stopp.className = `reise-stopp ${erBooket ? 'booked' : 'ledig'}`;
    stopp.id = `stopp-${i}`;
    stopp.innerHTML = `
      <div class="stopp-sirkel">${dag.dag}</div>
      <div class="stopp-innhold">
        <div class="stopp-dato">${dag.dagNavn}</div>
        <div class="stopp-sted">${dag.sted}${stedNavn ? ' · 🏨 ' + stedNavn : ''}</div>
        ${(aktPills || ekstraPills) ? `<div class="stopp-aktiviteter">${ekstraPills}${aktPills}</div>` : ''}
      </div>`;

    // Klikk → bytter til redigeringsmodus og scroller til kortet
    stopp.style.cursor = 'pointer';
    stopp.addEventListener('click', () => {
      visReiseModus = false;
      renderPlan();
      setTimeout(() => {
        const card = document.getElementById(`dag-card-${i}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          card.classList.add('expanded');
        }
      }, 80);
    });

    wrapper.appendChild(stopp);

    // Kobling til neste dag (ikke etter siste)
    if (i < currentPlan.length - 1) {
      const nesteDag  = currentPlan[i + 1];
      const nesteBoket = !!(HOTELLER.find(h => h.id === nesteDag.hotell) || HYTTER.find(h => h.id === nesteDag.hotell));
      const kobling = document.createElement('div');
      kobling.className = `reise-kobling ${(erBooket && nesteBoket) ? 'solid' : 'dashed'}`;
      wrapper.appendChild(kobling);
    }
  });

  return wrapper;
}

// ---- Lag et dagkort ----
function lagDagCard(dag, index) {
  const div = document.createElement('div');
  div.className = 'dag-card';
  div.id = `dag-card-${index}`;

  // Finn hotell-info
  const hotell = dag.hotell ? HOTELLER.find(h => h.id === dag.hotell) : null;
  const hotellNavn = hotell ? hotell.navn : (dag.hotell ? dag.hotell : 'Ikke valgt');

  // Ikon basert på dag
  const dagIkoner = ['🛬', '🥾', '🏔', '🚂', '⛵', '🏰', '🌅', '🏠'];
  const ikon = dagIkoner[index] || '📍';

  div.innerHTML = `
    <div class="dag-card-header" onclick="toggleDagCard(${index})">
      <div class="dag-nummer">${dag.dag}</div>
      <div class="dag-info">
        <div class="dag-dato">${dag.dagNavn}</div>
        <div class="dag-tittel">${dag.tittel}</div>
        <div class="dag-sted">📍 ${dag.sted} ${hotell ? '· 🏨 ' + hotell.navn : (dag.hotell ? '' : '')}</div>
      </div>
      <div class="dag-expand-icon">⌄</div>
    </div>
    <div class="dag-card-body" id="dag-body-${index}">
      ${lagDagCardBody(dag, index)}
    </div>`;

  return div;
}

// ---- Dag-kortets innhold ----
function lagDagCardBody(dag, index) {
  const hotell = dag.hotell ? HOTELLER.find(h => h.id === dag.hotell) : null;
  const hytteAlternativer = [...HOTELLER, ...HYTTER];

  // Overnatting-dropdown
  let overnattingOptions = '<option value="">— Ingen overnatting (reisedag) —</option>';
  overnattingOptions += '<optgroup label="Hoteller">';
  HOTELLER.forEach(h => {
    overnattingOptions += `<option value="${h.id}" ${dag.hotell === h.id ? 'selected' : ''}>${h.navn} – ${h.sted}</option>`;
  });
  overnattingOptions += '</optgroup><optgroup label="DNT Hytter">';
  HYTTER.forEach(h => {
    overnattingOptions += `<option value="${h.id}" ${dag.hotell === h.id ? 'selected' : ''}>${h.navn} (DNT) – ${h.sted}</option>`;
  });
  overnattingOptions += '</optgroup>';

  // Aktiviteter
  const aktChips = TURER.map(tur => {
    const valgt = dag.aktiviteter && dag.aktiviteter.includes(tur.id);
    const vanskTag = tur.vanskelighetsgrad === 'Lett' ? '🟢' : tur.vanskelighetsgrad === 'Middels' ? '🟡' : '🔴';
    return `<div class="akt-chip ${valgt ? 'selected' : ''}"
                 onclick="toggleAktivitet(${index}, '${tur.id}', this)"
                 title="${tur.varighet} · ${tur.distanse}">
              ${vanskTag} ${tur.navn}
             </div>`;
  }).join('');

  // Booking-knapp for overnatting
  let bookingHtml = '';
  if (hotell) {
    const innsjekk = dag.dato;
    const utDato = new Date(dag.dato);
    utDato.setDate(utDato.getDate() + 1);
    const utsjekk = utDato.toISOString().split('T')[0];
    const bookUrl = hotell.bookingSlug
      ? lagHotellBookingUrl(hotell.bookingSlug, innsjekk, utsjekk)
      : lagBookingUrl(hotell.navn, hotell.sted, innsjekk, utsjekk);
    bookingHtml = `
      <a class="btn btn-primary btn-sm" href="${bookUrl}" target="_blank" rel="noopener">
        📅 Book ${hotell.navn}
      </a>`;
  } else if (dag.hotell) {
    const hyt = HYTTER.find(h => h.id === dag.hotell);
    if (hyt) {
      bookingHtml = `
        <a class="btn btn-fjord btn-sm" href="${hyt.bookingUrl}" target="_blank" rel="noopener">
          ⛺ Book DNT-hytte
        </a>
        <a class="btn btn-outline btn-sm" href="${hyt.utNo}" target="_blank" rel="noopener">
          🗺 UT.no
        </a>`;
    }
  }

  // Vis kart-knapp
  const mapBtn = dag.hotell && hotell
    ? `<button class="btn btn-outline btn-sm" onclick="visIDagPaKart(${hotell.lat}, ${hotell.lng})">🗺 Vis på kart</button>`
    : '';

  return `
    <div class="field-label">Overnatting</div>
    <select class="field-select" onchange="oppdaterHotell(${index}, this.value)">
      ${overnattingOptions}
    </select>

    <div class="field-label">Aktiviteter / Turer</div>
    <div class="aktivitet-chips">
      ${aktChips}
    </div>

    <div class="field-label">Notater for dagen</div>
    <textarea class="field-textarea"
              placeholder="Legg til notater, restauranter, tips…"
              onchange="oppdaterNotater(${index}, this.value)"
    >${dag.notater || ''}</textarea>

    <div class="dag-booking-row">
      ${bookingHtml}
      ${mapBtn}
    </div>`;
}

// ---- Toggle dag-ekspansjon ----
function toggleDagCard(index) {
  const card = document.getElementById(`dag-card-${index}`);
  if (!card) return;
  card.classList.toggle('expanded');
}

// ---- Oppdater hotell for en dag ----
function oppdaterHotell(index, hotelId) {
  currentPlan[index].hotell = hotelId || null;
  lagrePlan();

  // Re-render kroppen for å vise booking-knapper
  const body = document.getElementById(`dag-body-${index}`);
  if (body) {
    body.innerHTML = lagDagCardBody(currentPlan[index], index);
  }

  // Oppdater sted i header
  const card = document.getElementById(`dag-card-${index}`);
  if (card) {
    const hotell = hotelId ? HOTELLER.find(h => h.id === hotelId) : null;
    const stedEl = card.querySelector('.dag-sted');
    if (stedEl) {
      stedEl.textContent = `📍 ${currentPlan[index].sted}${hotell ? ' · 🏨 ' + hotell.navn : ''}`;
    }
  }

  visToast('Overnatting oppdatert ✓');
}

// ---- Toggle aktivitet ----
function toggleAktivitet(dagIndex, turId, element) {
  const dag = currentPlan[dagIndex];
  if (!dag.aktiviteter) dag.aktiviteter = [];

  const idx = dag.aktiviteter.indexOf(turId);
  if (idx > -1) {
    dag.aktiviteter.splice(idx, 1);
    element.classList.remove('selected');
  } else {
    dag.aktiviteter.push(turId);
    element.classList.add('selected');
  }
  lagrePlan();
}

// ---- Oppdater notater ----
function oppdaterNotater(dagIndex, tekst) {
  currentPlan[dagIndex].notater = tekst;
  lagrePlan();
}

// ---- Vis dag på kart ----
function visIDagPaKart(lat, lng) {
  bytteTab('kart');
  setTimeout(() => {
    flyToLocation(lat, lng, 14);
  }, 300);
}

// ---- Eksporter plan ----
function eksporterPlan() {
  const tekst = currentPlan.map(dag => {
    const hotell = dag.hotell ? HOTELLER.find(h => h.id === dag.hotell) : null;
    const hyt = dag.hotell ? HYTTER.find(h => h.id === dag.hotell) : null;
    const overnatting = hotell ? hotell.navn : (hyt ? hyt.navn + ' (DNT)' : 'Ikke valgt');
    const aktiviteter = (dag.aktiviteter || []).map(id => {
      const tur = TURER.find(t => t.id === id);
      return tur ? tur.navn : id;
    }).join(', ') || 'Ingen planlagte turer';

    return [
      `=== ${dag.dagNavn} ===`,
      `Tittel: ${dag.tittel}`,
      `Sted: ${dag.sted}`,
      `Overnatting: ${overnatting}`,
      `Aktiviteter: ${aktiviteter}`,
      dag.notater ? `Notater: ${dag.notater}` : '',
      ''
    ].filter(Boolean).join('\n');
  }).join('\n');

  const fullTekst = `🏔 Hardanger & Sogn Reise – 13.–20. juni 2026\n2 personer · Starter Brakanes Hotell, Ulvik\n\n${tekst}`;

  // Prøv Web Share API
  if (navigator.share) {
    navigator.share({
      title: 'Hardanger & Sogn Reise 2026',
      text: fullTekst
    }).catch(() => kopierTilKlippetavle(fullTekst));
  } else {
    kopierTilKlippetavle(fullTekst);
  }
}

function kopierTilKlippetavle(tekst) {
  navigator.clipboard.writeText(tekst).then(() => {
    visToast('Plan kopiert til utklippstavlen 📋');
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = tekst;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    visToast('Plan kopiert! 📋');
  });
}

// ---- Legg til egendefinert aktivitet ----
function leggTilEgenAktivitet(dagIndex) {
  const input = document.getElementById(`egenakt-${dagIndex}`);
  if (!input || !input.value.trim()) return;
  const tekst = input.value.trim();
  if (!currentPlan[dagIndex].egne) currentPlan[dagIndex].egne = [];
  currentPlan[dagIndex].egne.push(tekst);
  input.value = '';
  lagrePlan();
  visToast('Aktivitet lagt til ✓');
  // Re-render body
  const body = document.getElementById(`dag-body-${dagIndex}`);
  if (body) body.innerHTML = lagDagCardBody(currentPlan[dagIndex], dagIndex);
}
