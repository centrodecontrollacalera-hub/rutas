/* Centro de Control La Calera — aplicación principal */
(function () {
  'use strict';
  const G = window.Geo, CFG = window.CONFIG;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = G.esc;

  /* ---------- Categorías (OpenStreetMap) ---------- */
  const CATS = {
    policia:      {label:'Comisarías y Policía (PNP)', color:'#13315c', ico:'P', grupo:'em', q:['nwr["amenity"="police"]'], excl:/carretera|serenazgo/i},
    carretera:    {label:'Policía de Carreteras', color:'#1d4e89', ico:'C', grupo:'em', q:['nwr["amenity"="police"]["name"~"carretera",i]']},
    serenazgo:    {label:'Serenazgo / Seguridad ciudadana', color:'#4a6fa5', ico:'S', grupo:'em', q:['nwr["name"~"serenazgo|seguridad ciudadana",i]']},
    bomberos:     {label:'Compañías de bomberos', color:'#c1121f', ico:'B', grupo:'em', q:['nwr["amenity"="fire_station"]']},
    hospital:     {label:'Hospitales', color:'#d62839', ico:'H', grupo:'em', q:['nwr["amenity"="hospital"]']},
    clinica:      {label:'Clínicas y centros de salud', color:'#e5707e', ico:'+', grupo:'em', q:['nwr["amenity"="clinic"]','nwr["amenity"="doctors"]["name"~"centro de salud|puesto de salud|posta",i]']},
    grua:         {label:'Grúas y asistencia mecánica', color:'#7b2d8e', ico:'G', grupo:'em', q:['nwr["service:vehicle:towing"="yes"]','nwr["emergency"="tow"]']},
    cochera:      {label:'Cocheras y estacionamientos', color:'#5c6b7a', ico:'E', grupo:'in', q:['nwr["amenity"="parking"]["access"!="private"]']},
    restaurante:  {label:'Restaurantes', color:'#e07a1f', ico:'R', grupo:'in', q:['nwr["amenity"="restaurant"]']},
    grifo:        {label:'Grifos (combustible)', color:'#2a7f4f', ico:'F', grupo:'in', q:['nwr["amenity"="fuel"]']},
    taller:       {label:'Talleres mecánicos', color:'#8a5a2b', ico:'T', grupo:'in', q:['nwr["shop"="car_repair"]']},
    vulcanizadora:{label:'Vulcanizadoras', color:'#333b45', ico:'V', grupo:'in', q:['nwr["shop"="tyres"]']},
    peaje:        {label:'Peajes', color:'#b7791f', ico:'$', grupo:'in', q:['nwr["barrier"="toll_booth"]','nwr["highway"="toll_gantry"]']}
  };
  const EM_CATS = Object.keys(CATS).filter(k => CATS[k].grupo === 'em');
  const IN_CATS = Object.keys(CATS).filter(k => CATS[k].grupo === 'in').concat(['hospital', 'policia']);
  const DIR_LABEL = {policia:'Policía / Comisarías', bomberos:'Bomberos', ambulancia:'Ambulancias / SAMU', hospital:'Hospitales y salud', municipalidad:'Municipalidad', serenazgo:'Serenazgo', electricidad:'Fono Luz (electricidad)', otro:'Otros'};
  const KEYWORDS = {grifo:'grifo', grifos:'grifo', combustible:'grifo', gasolinera:'grifo', restaurante:'restaurante', restaurantes:'restaurante', comida:'restaurante',
    cochera:'cochera', cocheras:'cochera', estacionamiento:'cochera', playa:'cochera', taller:'taller', talleres:'taller', mecanico:'taller', mecánico:'taller',
    vulcanizadora:'vulcanizadora', vulcanizadoras:'vulcanizadora', llantas:'vulcanizadora', peaje:'peaje', peajes:'peaje',
    comisaria:'policia', comisaría:'policia', comisarias:'policia', comisarías:'policia', policia:'policia', policía:'policia',
    bomberos:'bomberos', bombero:'bomberos', hospital:'hospital', hospitales:'hospital', clinica:'clinica', clínica:'clinica', serenazgo:'serenazgo', grua:'grua', grúa:'grua', carreteras:'carretera'};

  /* ---------- Estado ---------- */
  const state = {
    places: window.SEDES.slice(), selected: null, origin: null, dest: null,
    routes: [], routeIdx: 0, routeInfo: null, spur: null, token: 0,
    ctx: {em: null, in: null},          // contexto de la última búsqueda por pestaña
    mode: {em: 'radio', in: 'radio'},
    radius: {em: CFG.RADIO_KM_DEFECTO, in: CFG.RADIO_KM_DEFECTO},
    enabled: {}, results: {}, itemsById: {}, sel: new Set(), dirAll: false, adjusting: null, customN: 0
  };
  ['policia', 'bomberos', 'hospital'].forEach(k => state.enabled[k] = true);
  ['cochera', 'restaurante', 'grifo', 'taller', 'vulcanizadora', 'peaje'].forEach(k => state.enabled[k] = true);

  try { const o = JSON.parse(localStorage.getItem('lc_coords') || '{}');
    state.places.forEach(p => { if (o[p.id]) { p.lat = o[p.id][0]; p.lng = o[p.id][1]; p.ajustada = true; } }); } catch (e) {}
  function saveCoords() { try { const o = {}; state.places.filter(p => p.ajustada && !p.custom).forEach(p => o[p.id] = [p.lat, p.lng]); localStorage.setItem('lc_coords', JSON.stringify(o)); } catch (e) {} }

  /* ---------- Utilidades de interfaz ---------- */
  function setStatus(msg, err) { const s = $('#status'); s.textContent = msg || ''; s.className = 'status' + (err ? ' err' : ''); }
  function mapMsg(msg) { const m = $('#mapMsg'); if (!msg) { m.hidden = true; return; } m.textContent = msg; m.hidden = false; clearTimeout(mapMsg.t); mapMsg.t = setTimeout(() => m.hidden = true, 7000); }
  function placeById(id) { return state.places.find(p => p.id === id); }
  function slugCity(p) { return p.id.startsWith('chincha') ? null : p.id; }
  async function fetchJSON(url, opts, ms) {
    const c = new AbortController(), t = setTimeout(() => c.abort(), ms || 30000);
    try { const r = await fetch(url, Object.assign({}, opts || {}, {signal: c.signal})); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json(); }
    finally { clearTimeout(t); }
  }
  function today() { return new Date().toLocaleDateString('es-PE', {timeZone:'America/Lima'}); }
  function nowStr() { return new Date().toLocaleString('es-PE', {timeZone:'America/Lima', dateStyle:'short', timeStyle:'short'}); }

  /* Reloj */
  function tick() { $('#clock').textContent = new Date().toLocaleString('es-PE', {timeZone:'America/Lima', weekday:'long', day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'}) + ' (hora de Perú)'; }
  tick(); setInterval(tick, 1000);

  /* ---------- Mapa ---------- */
  if (!window.L) { mapMsg('No se pudo cargar la librería del mapa (Leaflet). Revise la conexión a Internet.'); setStatus('Sin librería de mapas', true); return; }
  const map = L.map('map', {zoomControl: true, minZoom: 4}).setView(CFG.PAIS_CENTRO, CFG.PAIS_ZOOM);
  const bases = {}; let first = true;
  Object.keys(CFG.TILES).forEach(n => { const t = CFG.TILES[n];
    bases[n] = L.tileLayer(t.url, {attribution: t.attr, maxZoom: t.maxZoom, subdomains: t.subdomains || 'abc', crossOrigin: true});
    if (first) { bases[n].addTo(map); first = false; } });
  L.control.layers(bases, null, {position: 'topleft'}).addTo(map);
  L.control.scale({imperial: false}).addTo(map);
  const tollLayer = L.layerGroup().addTo(map), sedeLayer = L.layerGroup().addTo(map), routeLayer = L.layerGroup().addTo(map), spurLayer = L.layerGroup().addTo(map), areaLayer = L.layerGroup().addTo(map);
  const catLayers = {}; Object.keys(CATS).forEach(k => catLayers[k] = L.layerGroup().addTo(map));
  const sedeMarkers = {};
  function zoomClasses() { const z = map.getZoom(), c = map.getContainer(); c.classList.toggle('z-lt7', z < 7); c.classList.toggle('z-lt11', z < 11); }
  map.on('zoomend', zoomClasses); zoomClasses();
  map.on('click', () => $('#sidebar').classList.remove('open'));
  const st = document.createElement('style'); st.textContent = '.z-lt7 .lbl{display:none}.z-lt11 .lblz11{display:none}'; document.head.appendChild(st);

  function sedeIcon(p) {
    let cls = 'mk sede'; if (state.origin && p.id === state.origin.id) cls += ' o'; else if (state.dest && p.id === state.dest.id) cls += ' d';
    if (state.selected && p.id === state.selected.id) cls += ' sel';
    const txt = p.custom ? '★' : (p.id.startsWith('chincha') ? 'Ch' : p.nombre.charAt(0));
    return L.divIcon({className: '', html: '<div class="' + cls + '">' + txt + '</div>', iconSize: [26, 26], iconAnchor: [13, 13]});
  }
  function addSedeMarker(p) {
    const m = L.marker([p.lat, p.lng], {icon: sedeIcon(p), draggable: false, title: p.nombre}).addTo(sedeLayer);
    m.bindTooltip(esc(p.nombre), {permanent: true, direction: 'top', offset: [0, -14], className: 'lbl' + (p.id.startsWith('chincha') ? ' lblz11' : '')});
    m.on('click', () => selectPlace(p.id, {fly: false}));
    m.on('dragend', () => { const ll = m.getLatLng(); p.lat = +ll.lat.toFixed(6); p.lng = +ll.lng.toFixed(6); p.ajustada = true; saveCoords(); renderInfo(); renderLists(); });
    sedeMarkers[p.id] = m;
  }
  state.places.forEach(addSedeMarker);
  function refreshIcons() { state.places.forEach(p => sedeMarkers[p.id] && sedeMarkers[p.id].setIcon(sedeIcon(p))); }

  /* ---------- Selección de sede ---------- */
  function selectPlace(id, o) {
    o = o || {}; const p = placeById(id); if (!p) return;
    state.selected = p; refreshIcons(); syncSelects(); renderLists(); renderInfo();
    if (o.fly !== false) map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 12), {duration: .8});
    if (window.innerWidth <= 900) $('#sidebar').classList.remove('open');
  }
  function setOrigin(id) { state.origin = placeById(id); syncSelects(); refreshIcons(); renderLists(); renderInfo(); }
  function setDest(id) { state.dest = placeById(id); syncSelects(); refreshIcons(); renderLists(); renderInfo(); }

  function optionsHtml(ph) { return '<option value="">' + ph + '</option>' + state.places.map(p => '<option value="' + esc(p.id) + '">' + esc(p.nombre) + (p.custom ? '' : ' — ' + esc(p.distrito)) + '</option>').join(''); }
  function buildSelects() {
    $('#selOrigen').innerHTML = optionsHtml('— elegir origen —'); $('#selDestino').innerHTML = optionsHtml('— elegir destino —');
    $('#emCiudad').innerHTML = optionsHtml('— elegir sede —'); $('#inCiudad').innerHTML = optionsHtml('— elegir sede —');
    const ciudades = Array.from(new Set(state.places.filter(p => !p.custom).map(p => p.ciudad))).sort();
    $('#fCiudad').innerHTML = '<option value="">Todas las ciudades</option>' + ciudades.map(c => '<option>' + esc(c) + '</option>').join('');
    syncSelects();
  }
  function syncSelects() {
    $('#selOrigen').value = state.origin ? state.origin.id : ''; $('#selDestino').value = state.dest ? state.dest.id : '';
    const v = state.selected ? state.selected.id : ''; $('#emCiudad').value = v; $('#inCiudad').value = v;
  }
  $('#selOrigen').onchange = e => setOrigin(e.target.value); $('#selDestino').onchange = e => setDest(e.target.value);
  $('#emCiudad').onchange = $('#inCiudad').onchange = e => { if (e.target.value) selectPlace(e.target.value); };
  $('#btnSwap').onclick = () => { const o = state.origin; state.origin = state.dest; state.dest = o; syncSelects(); refreshIcons(); renderLists(); };
  $('#fCiudad').onchange = renderLists;

  /* ---------- Lista de sedes ---------- */
  function renderLists() {
    const c = $('#fCiudad').value;
    const items = state.places.filter(p => !c || p.ciudad === c);
    $('#listaSedes').innerHTML = items.map(p => {
      const cls = (state.selected && state.selected.id === p.id) ? 'sel' : '';
      const b = (state.origin && state.origin.id === p.id ? '<span class="badge o">ORIGEN</span>' : '') + (state.dest && state.dest.id === p.id ? '<span class="badge d">DESTINO</span>' : '') + (p.custom ? '' : (p.coordOk || p.ajustada ? '' : '<span class="badge warn">ubic. aprox.</span>'));
      return '<li class="' + cls + '"><div class="main" data-act="sede" data-id="' + esc(p.id) + '"><div class="nm">' + esc(p.nombre) + b + '</div><small>' + esc(p.direccion) + '</small><small>' + esc(p.distrito) + (p.departamento ? ', ' + esc(p.departamento) : '') + '</small></div></li>';
    }).join('') || '<li>Sin sedes para ese filtro.</li>';
    renderDirectory();
  }

  /* ---------- Ficha / panel de información ---------- */
  function renderInfo() {
    const p = state.selected, box = $('#infoBody');
    if (!p && !state.routeInfo && !state.spur) { $('#info').hidden = true; return; }
    let h = '';
    if (p) {
      const coord = p.lat.toFixed(5) + ', ' + p.lng.toFixed(5);
      const estado = p.custom ? 'Lugar buscado en OpenStreetMap' : (p.ajustada ? 'ajustada por el operador' : (p.coordOk ? 'confirmadas' : 'APROXIMADAS — pendiente de confirmar'));
      h += '<h2>' + esc(p.nombre) + '</h2><div class="hint">' + (p.custom ? 'Punto personalizado' : 'Sede La Calera') + '</div>' +
        '<dl class="kv"><dt>Dirección</dt><dd>' + esc(p.direccion || 'No disponible') + '</dd>' +
        '<dt>Ciudad</dt><dd>' + esc(p.ciudad || '—') + (p.distrito ? ' (' + esc(p.distrito) + ')' : '') + '</dd>' +
        '<dt>Departamento</dt><dd>' + esc(p.departamento || '—') + '</dd>' +
        '<dt>Coordenadas</dt><dd>' + coord + '<br><span class="badge ' + (p.coordOk || p.ajustada || p.custom ? '' : 'warn') + '">' + esc(estado) + '</span></dd></dl>';
      h += '<div class="btns"><button class="o" data-act="set-o" data-id="' + esc(p.id) + '">Establecer origen</button><button class="d" data-act="set-d" data-id="' + esc(p.id) + '">Establecer destino</button>' +
        '<button data-act="sede-em" data-id="' + esc(p.id) + '">Emergencias cercanas</button><button data-act="sede-in" data-id="' + esc(p.id) + '">Puntos de interés cercanos</button>' +
        (p.link ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">Abrir en Google Maps</a>' : '') +
        (p.custom ? '' : '<button data-act="adjust" data-id="' + esc(p.id) + '">' + (state.adjusting === p.id ? 'Terminar ajuste' : 'Ajustar ubicación') + '</button>') +
        (state.adjusting === p.id ? '<button data-act="copy" data-id="' + esc(p.id) + '">Copiar coordenadas</button>' : '') + '</div>';
      if (state.adjusting === p.id) h += '<div class="note warn">Arrastre el marcador a la posición exacta de la sede. El ajuste se guarda en este navegador; use «Copiar coordenadas» para fijarlo en js/data-sedes.js.</div>';
      const counts = Object.keys(CATS).filter(k => state.results[k] && state.results[k].items.length).map(k => CATS[k].label + ': ' + state.results[k].items.length);
      if (counts.length) h += '<h3>Puntos cercanos consultados</h3><div class="hint">' + counts.map(esc).join('<br>') + '</div>';
    }
    if (state.routeInfo) {
      const r = state.routes[state.routeIdx];
      h += '<h3>Ruta calculada</h3><div class="hint">' + esc(state.routeInfo.o.nombre) + ' a ' + esc(state.routeInfo.d.nombre) + '</div>' +
        '<div class="sumario"><div><b>' + G.fmtKm(r.distance / 1000) + '</b><span>distancia</span></div><div><b>' + G.fmtTime(r.duration) + '</b><span>tiempo aprox.</span></div></div>';
    }
    if (state.spur) h += '<h3>Ruta al punto seleccionado</h3><div class="hint">' + esc(state.spur.from.nombre) + ' a ' + esc(state.spur.item.nombre) + '</div>' +
      '<div class="sumario"><div><b>' + G.fmtKm(state.spur.distance / 1000) + '</b><span>distancia</span></div><div><b>' + G.fmtTime(state.spur.duration) + '</b><span>tiempo aprox.</span></div></div>';
    box.innerHTML = h; $('#info').hidden = false;
  }
  $('#infoClose').onclick = () => { $('#info').hidden = true; };

  /* ---------- Rutas ---------- */
  function corridorFor(o, d) {
    const R = window.RUTAS_REF, pre = window.RUTAS_REF_ORIGEN;
    if (o.id.startsWith(pre) && R[d.id]) return {key: d.id, vias: R[d.id].vias.slice(), desc: R[d.id].desc, img: 'assets/rutas/' + d.id + '.jpg'};
    if (d.id.startsWith(pre) && R[o.id]) return {key: o.id, vias: R[o.id].vias.slice().reverse(), desc: R[o.id].desc + ' (sentido inverso)', img: 'assets/rutas/' + o.id + '.jpg'};
    return null;
  }
  async function osrm(points, alternatives) {
    const cs = points.map(p => p[1].toFixed(6) + ',' + p[0].toFixed(6)).join(';');
    const url = CFG.OSRM_URL + '/route/v1/driving/' + cs + '?overview=full&geometries=geojson&steps=true&alternatives=' + (alternatives ? 'true' : 'false');
    const j = await fetchJSON(url, {}, 45000);
    if (j.code !== 'Ok') throw new Error(j.code === 'NoRoute' ? 'No existe ruta por carretera entre esos puntos' : (j.message || j.code));
    return j.routes;
  }
  function buildRoute(r, label, kind) {
    const coords = G.fromGeoJSON(r.geometry.coordinates), line = G.thin(coords, 2);
    return {label, kind, distance: r.distance, duration: r.duration, coords, line, roads: G.roadsFromRoute(r, 3),
      cities: G.citiesAlong(line, window.CIUDADES_REF, 10), tolls: null};
  }
  async function calcRoute() {
    const o = state.origin, d = state.dest;
    if (!o || !d) { setStatus('Seleccione un origen y un destino para calcular la ruta.', true); return; }
    if (o.id === d.id) { setStatus('El origen y el destino son la misma ubicación.', true); return; }
    activateTab('ruta'); const tk = ++state.token;
    $('#rutaResultado').innerHTML = '<div class="note">Calculando ruta por carretera…</div>'; setStatus('Calculando ruta…');
    const cor = $('#chkOperativa').checked ? corridorFor(o, d) : null;
    const A = [o.lat, o.lng], B = [d.lat, d.lng], routes = []; const errs = [];
    const jobs = [];
    if (cor && cor.vias.length) jobs.push(osrm([A].concat(cor.vias, [B]), false).then(rs => routes.push(buildRoute(rs[0], 'Corredor operativo del Excel', 'cor'))).catch(e => errs.push('corredor: ' + e.message)));
    jobs.push(osrm([A, B], true).then(rs => rs.forEach((r, i) => routes.push(buildRoute(r, i ? 'Alternativa ' + i : (cor && cor.vias.length ? 'Ruta directa (OSRM)' : 'Ruta recomendada'), i ? 'alt' : 'dir')))).catch(e => errs.push(e.message)));
    await Promise.all(jobs);
    if (tk !== state.token) return;
    if (!routes.length) { state.routes = []; state.routeInfo = null; routeLayer.clearLayers();
      $('#rutaResultado').innerHTML = '<div class="note err">No se pudo calcular la ruta: ' + esc(errs.join(' | ') || 'sin respuesta') + '. Verifique su conexión a Internet o el servicio OSRM configurado en js/config.js.</div>';
      setStatus('Falló el cálculo de ruta', true); return; }
    routes.sort((a, b) => (b.kind === 'cor') - (a.kind === 'cor'));
    // quita rutas "directas" casi idénticas a una anterior
    const uniq = []; routes.forEach(r => { if (!uniq.some(u => Math.abs(u.distance - r.distance) < 500 && Math.abs(u.duration - r.duration) < 120)) uniq.push(r); });
    tollLayer.clearLayers(); state.routes = uniq; state.routeIdx = 0; state.routeInfo = {o, d, cor, errs, fecha: nowStr()};
    drawRoutes(true); renderRouteResult(); renderInfo(); setStatus('Ruta calculada: ' + G.fmtKm(uniq[0].distance / 1000) + ' · ' + G.fmtTime(uniq[0].duration));
    loadTolls(tk);
  }
  function drawRoutes(fit) {
    routeLayer.clearLayers();
    state.routes.forEach((r, i) => {
      if (i === state.routeIdx) return;
      L.polyline(r.coords, {color: '#7a8797', weight: 5, opacity: .75, dashArray: '8 8'}).on('click', () => { state.routeIdx = i; drawRoutes(false); renderRouteResult(); renderInfo(); }).addTo(routeLayer);
    });
    const r = state.routes[state.routeIdx];
    if (r) { const pl = L.polyline(r.coords, {color: '#1d4e89', weight: 6, opacity: .9}).addTo(routeLayer); if (fit) map.fitBounds(pl.getBounds(), {padding: [50, 50]});
      (r.tolls || []).forEach(t => { /* peajes se dibujan con la capa de categoría */ }); }
  }
  function renderRouteResult() {
    const r = state.routes[state.routeIdx], inf = state.routeInfo; if (!r) return;
    let h = '<div class="sumario"><div><b>' + G.fmtKm(r.distance / 1000) + '</b><span>distancia estimada</span></div><div><b>' + G.fmtTime(r.duration) + '</b><span>tiempo aproximado</span></div></div>';
    h += '<div class="hint">Cálculo OSRM para vehículo liviano sobre datos de OpenStreetMap (' + esc(inf.fecha) + '). Buses y unidades de carga suelen demorar más; no incluye paradas ni tráfico.</div>';
    if (state.routes.length > 1) h += '<h3>Rutas disponibles</h3><div class="alts">' + state.routes.map((x, i) => '<button data-act="alt" data-i="' + i + '" class="' + (i === state.routeIdx ? 'on' : '') + '"><b>' + esc(x.label) + '</b><br><small>' + G.fmtKm(x.distance / 1000) + ' · ' + G.fmtTime(x.duration) + '</small></button>').join('') + '</div>';
    if (inf.cor && (r.kind === 'cor' || !inf.cor.vias.length)) h += '<div class="note"><b>' + (inf.cor.vias.length ? 'Corredor operativo' : 'Ruta de referencia del Excel') + ':</b> ' + esc(inf.cor.desc) + '. Basado en las capturas GPS del Excel.<br><img class="refimg" data-act="lightbox" data-src="' + esc(inf.cor.img) + '" src="' + esc(inf.cor.img) + '" alt="Ruta de referencia del Excel" loading="lazy"></div>';
    else if (inf.cor) h += '<div class="note warn">Esta alternativa NO sigue el corredor operativo habitual (' + esc(inf.cor.desc) + ').</div>';
    h += '<h3>Carreteras y vías principales</h3>' + (r.roads.length ? '<ol class="vias">' + r.roads.map(x => '<li>' + esc(x.label) + ' <small>(' + G.fmtKm(x.km) + ')</small></li>').join('') + '</ol>' : '<div class="hint">El mapa no registra nombres de vías para este recorrido.</div>');
    h += '<h3>Ciudades y puntos de referencia</h3>' + (r.cities.length ? '<div>' + r.cities.map(c => esc(c.nombre)).join(' → ') + '</div>' : '<div class="hint">Sin ciudades de referencia cercanas a la ruta.</div>');
    h += '<h3>Peajes en la ruta</h3><div id="peajesRuta" class="hint">' + (r.tolls == null ? 'Consultando OpenStreetMap…' : tollsHtml(r.tolls)) + '</div>';
    h += '<div class="btns" style="display:flex;gap:6px;margin-top:10px"><button class="wide danger" data-act="em-ruta">Emergencias en la ruta</button><button class="wide" data-act="in-ruta">Interés en la ruta</button></div>';
    $('#rutaResultado').innerHTML = h;
  }
  function tollsHtml(t) { if (t === 'error') return 'No se pudo consultar los peajes (falló OpenStreetMap).'; if (!t.length) return 'No hay peajes registrados en OpenStreetMap sobre esta ruta (podría estar incompleto).'; return '<ul class="vias">' + t.map(x => '<li>' + esc(x.nombre) + '</li>').join('') + '</ul>'; }
  async function loadTolls(tk) {
    const r = state.routes[state.routeIdx]; if (!r) return;
    try {
      const items = await queryCat('peaje', {line: G.thin(r.coords, 6), radiusM: 1500});
      items.forEach(it => it.distRuta = G.nearestOnLine([it.lat, it.lng], r.line).km);
      items.sort((a, b) => G.nearestOnLine([a.lat, a.lng], r.line).index - G.nearestOnLine([b.lat, b.lng], r.line).index);
      r.tolls = items.filter(i => i.distRuta <= 1.5);
      tollLayer.clearLayers();
      r.tolls.forEach(it => { state.itemsById[it.id] = it; const c = CATS.peaje;
        it._m = L.marker([it.lat, it.lng], {icon: L.divIcon({className: '', html: '<div class="mk poi" style="background:' + c.color + '">' + c.ico + '</div>', iconSize: [22, 22], iconAnchor: [11, 11]}), title: it.nombre}).bindPopup(() => popupHtml(it), {maxWidth: 280}).addTo(tollLayer); });
    } catch (e) { r.tolls = 'error'; }
    if (tk === state.token && state.routes[state.routeIdx] === r) { const el = $('#peajesRuta'); if (el) el.innerHTML = tollsHtml(r.tolls); }
  }

  async function routeToItem(id) {
    const it = state.itemsById[id], from = state.origin || state.selected;
    if (!it) return;
    if (!from) { setStatus('Seleccione una sede de origen para trazar la ruta hasta el punto.', true); return; }
    setStatus('Calculando ruta al punto…');
    try {
      const rs = await osrm([[from.lat, from.lng], [it.lat, it.lng]], false), r = rs[0], coords = G.fromGeoJSON(r.geometry.coordinates);
      spurLayer.clearLayers(); const pl = L.polyline(coords, {color: '#c1121f', weight: 5, dashArray: '2 8', lineCap: 'round'}).addTo(spurLayer);
      map.fitBounds(pl.getBounds(), {padding: [60, 60]});
      state.spur = {from, item: it, distance: r.distance, duration: r.duration};
      renderInfo(); setStatus('Ruta a ' + it.nombre + ': ' + G.fmtKm(r.distance / 1000) + ' · ' + G.fmtTime(r.duration));
    } catch (e) { setStatus('No se pudo calcular la ruta al punto: ' + e.message, true); }
  }

  /* ---------- Consultas OpenStreetMap (Overpass) ---------- */
  async function overpass(q) {
    let lastErr;
    for (const u of CFG.OVERPASS_URLS) {
      try { return await fetchJSON(u, {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'data=' + encodeURIComponent(q)}, 40000); }
      catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('Overpass no disponible');
  }
  function normItem(el, cat) {
    const t = el.tags || {}, lat = el.lat != null ? el.lat : el.center && el.center.lat, lng = el.lon != null ? el.lon : el.center && el.center.lon;
    if (lat == null) return null;
    const c = CATS[cat];
    if (c.excl && c.excl.test(t.name || '')) return null;
    const dir = t['addr:full'] || [t['addr:street'], t['addr:housenumber'], t['addr:suburb'] || t['addr:district'], t['addr:city']].filter(Boolean).join(' ');
    return {id: 'osm/' + el.type + '/' + el.id, cat, lat, lng, nombre: t.name || t.brand || t.operator || (c.label.replace(/s$/, '') + ' (sin nombre en OSM)'),
      direccion: dir || '', tels: G.parsePhones(t.phone || t['contact:phone'] || t['phone:mobile']), operador: t.operator || '', fecha: today(),
      osm: 'https://www.openstreetmap.org/' + el.type + '/' + el.id};
  }
  /** Consulta una categoría. opts: {center:[lat,lng], radiusM} o {line:[[lat,lng]...], radiusM}. */
  async function queryCat(cat, opts) {
    const c = CATS[cat], around = opts.line ? '(around:' + opts.radiusM + ',' + G.overpassLine(opts.line) + ')' : '(around:' + opts.radiusM + ',' + opts.center[0] + ',' + opts.center[1] + ')';
    const q = '[out:json][timeout:35];(' + c.q.map(f => f + around + ';').join('') + ');out center tags ' + (CFG.MAX_RESULTADOS * 2) + ';';
    const j = await overpass(q), seen = {}, out = [];
    (j.elements || []).forEach(el => { const it = normItem(el, cat); if (it && !seen[it.id]) { seen[it.id] = 1; out.push(it); } });
    return out;
  }

  function currentContext(tab) {
    const mode = state.mode[tab], km = state.radius[tab];
    if (mode === 'ruta') {
      const r = state.routes[state.routeIdx]; if (!r) return {error: 'Primero calcule una ruta en la pestaña «Ruta» para buscar a lo largo de ella.'};
      return {mode, km, line: G.thin(r.coords, 8), ref: state.routeInfo.o, key: 'ruta:' + state.routeIdx + ':' + r.distance + ':' + km, radiusM: Math.min(km, CFG.CORREDOR_KM * 3) * 1000};
    }
    const ref = state.selected || state.origin; if (!ref) return {error: 'Seleccione una sede (lista, mapa o buscador) como punto de referencia.'};
    return {mode, km, center: [ref.lat, ref.lng], ref, key: 'radio:' + ref.id + ':' + ref.lat + ':' + ref.lng + ':' + km, radiusM: km * 1000};
  }
  async function runSearch(tab, only) {
    const ctx = currentContext(tab); if (ctx.error) { setStatus(ctx.error, true); mapMsg(ctx.error); return; }
    const cats = (only ? [only] : (tab === 'em' ? EM_CATS : IN_CATS)).filter(k => state.enabled[k]);
    if (!cats.length) { setStatus('Active al menos una categoría.', true); return; }
    state.ctx[tab] = ctx; areaLayer.clearLayers();
    if (ctx.mode === 'radio') { L.circle(ctx.center, {radius: ctx.radiusM, color: '#c1121f', weight: 1, dashArray: '6 6', fillOpacity: .03}).addTo(areaLayer); if (!only) map.fitBounds(L.latLng(ctx.center).toBounds(ctx.radiusM * 2.2)); }
    for (const k of cats) {
      const slot = state.results[k];
      if (slot && slot.key === ctx.key && !slot.error) continue;
      setStatus('Consultando ' + CATS[k].label.toLowerCase() + '…'); state.results[k] = {key: ctx.key, items: [], loading: true}; renderResults();
      try {
        let items = await queryCat(k, ctx.mode === 'ruta' ? {line: ctx.line, radiusM: ctx.radiusM} : {center: ctx.center, radiusM: ctx.radiusM});
        const line = ctx.mode === 'ruta' ? G.thin(state.routes[state.routeIdx].coords, 2) : null;
        items.forEach(it => { it.dist = G.haversine([ctx.ref.lat, ctx.ref.lng], [it.lat, it.lng]); if (line) { const n = G.nearestOnLine([it.lat, it.lng], line); it.distRuta = n.km; it.pos = n.index; } });
        if (ctx.mode === 'radio') items = items.filter(i => i.dist <= ctx.km); else items = items.filter(i => i.distRuta <= CFG.CORREDOR_KM * 1.5);
        items.sort((a, b) => ctx.mode === 'ruta' ? a.pos - b.pos : a.dist - b.dist);
        const total = items.length; items = items.slice(0, CFG.MAX_RESULTADOS);
        items.forEach(it => state.itemsById[it.id] = it);
        state.results[k] = {key: ctx.key, items, total, fecha: nowStr(), ctx: ctx.mode, ref: ctx.ref.nombre, km: ctx.km};
      } catch (e) { state.results[k] = {key: ctx.key, items: [], error: e.message || 'error'}; }
      drawCat(k); renderResults();
    }
    setStatus('Consulta terminada · fuente: OpenStreetMap (' + today() + ')'); renderInfo();
  }

  function popupHtml(it) {
    const c = CATS[it.cat];
    return '<b>' + esc(it.nombre) + '</b><br><small>' + esc(c.label) + '</small><br>' + (it.direccion ? esc(it.direccion) : '<i>Dirección no registrada en OpenStreetMap</i>') + '<br>' +
      (it.tels.length ? it.tels.map(t => '<a href="' + G.telHref(t.n) + '">' + esc(t.n) + '</a>').join(' · ') : '<i>Teléfono no disponible</i>') +
      (it.dist != null ? '<br><b>' + G.fmtKm(it.dist) + '</b> en línea recta' : '') + (it.distRuta != null ? '<br><b>' + G.fmtKm(it.distRuta) + '</b> de la ruta' : '') +
      '<div style="margin-top:6px"><button data-act="item-route" data-id="' + esc(it.id) + '">Ver ruta</button> <button data-act="item-pdf" data-id="' + esc(it.id) + '">' + (state.sel.has(it.id) ? 'Quitar del PDF' : 'Añadir al PDF') + '</button></div>' +
      '<small>Fuente: OpenStreetMap · ' + esc(it.fecha) + '</small>';
  }
  function drawCat(k) {
    const lay = catLayers[k]; lay.clearLayers(); const slot = state.results[k], c = CATS[k];
    if (!slot || !slot.items.length || !state.enabled[k]) return;
    slot.items.forEach(it => {
      const m = L.marker([it.lat, it.lng], {icon: L.divIcon({className: '', html: '<div class="mk poi" style="background:' + c.color + '">' + c.ico + '</div>', iconSize: [22, 22], iconAnchor: [11, 11]}), title: it.nombre});
      m.bindPopup(() => popupHtml(it), {maxWidth: 280}); m.addTo(lay); it._m = m;
    });
  }

  /* ---------- Resultados y directorio ---------- */
  function itemHtml(it, dir) {
    const c = CATS[it.cat], checked = state.sel.has(it.id) ? 'checked' : '';
    return '<div class="item cat-line" style="--c:' + c.color + '"><div class="head"><input type="checkbox" data-sel="' + esc(it.id) + '" ' + checked + ' title="Incluir en el PDF"><div class="t" data-act="item-focus" data-id="' + esc(it.id) + '">' + esc(it.nombre) + '</div>' +
      '<div class="dist">' + (it.distRuta != null ? G.fmtKm(it.distRuta) + ' de la ruta' : G.fmtKm(it.dist)) + '</div></div>' +
      '<div class="meta">' + esc(c.label) + ' · ' + (it.direccion ? esc(it.direccion) : 'dirección no registrada') + '</div>' +
      '<div class="meta">' + (it.tels.length ? it.tels.map(t => '<span class="tel"><a href="' + G.telHref(t.n) + '">' + esc(t.n) + '</a></span>').join(' · ') : 'Teléfono no disponible en OSM') + '</div>' +
      '<div class="acts"><button data-act="item-route" data-id="' + esc(it.id) + '">Ver ruta</button>' + (it.tels.length ? '<a class="call" href="' + G.telHref(it.tels[0].n) + '">Llamar</a>' : '') + '<button data-act="item-focus" data-id="' + esc(it.id) + '">Ver en mapa</button></div></div>';
  }
  function renderResults() {
    [['em', EM_CATS, '#emResultados'], ['in', IN_CATS, '#inResultados']].forEach(([tab, cats, sel]) => {
      const box = $(sel); let h = '', any = false;
      cats.filter(k => state.enabled[k]).forEach(k => {
        const s = state.results[k]; if (!s) return; any = true;
        const c = CATS[k];
        if (s.loading) h += '<div class="note">Consultando ' + esc(c.label) + '…</div>';
        else if (s.error) h += '<div class="note err"><b>' + esc(c.label) + ':</b> falló la consulta a OpenStreetMap (' + esc(s.error) + '). Intente de nuevo.</div>';
        else if (!s.items.length) h += '<div class="note"><b>' + esc(c.label) + ':</b> sin registros en OpenStreetMap para esta zona. Esto no significa que no existan; la información de OSM puede estar incompleta.</div>';
        else h += '<h3 style="color:' + c.color + '">' + esc(c.label) + ' (' + s.items.length + (s.total > s.items.length ? ' de ' + s.total : '') + ')</h3>' + s.items.map(i => itemHtml(i)).join('');
      });
      box.innerHTML = any ? h : '<div class="hint">Elija una sede, active categorías y pulse «Buscar». Los resultados mostrarán su fuente y fecha de consulta.</div>';
    });
    updateSelCount();
  }
  function dirEntries(placeId) {
    const arr = (window.EMERGENCIAS[placeId] || []);
    return arr.map((e, i) => Object.assign({id: 'dir:' + placeId + ':' + i, ciudad: placeId}, e));
  }
  function dirRowHtml(e) {
    const tel = e.tel.length ? e.tel.map(t => '<span class="tel ' + (t.ok ? '' : 'bad') + '"><a href="' + G.telHref(t.n) + '">' + esc(t.n) + '</a>' + (t.ok ? '' : ' <span class="badge warn" title="Formato incompleto o dudoso: verificar antes de usar">verificar</span>') + '</span>').join('<br>') : '<span class="hint">sin teléfono</span>';
    return '<div class="dir-row"><label><input type="checkbox" data-sel="' + esc(e.id) + '" ' + (state.sel.has(e.id) ? 'checked' : '') + '> <span class="cat">' + esc(DIR_LABEL[e.cat] || e.cat) + '</span>' + esc(e.nombre) + '</label><div style="text-align:right">' + tel + '</div></div>';
  }
  function renderDirectory() {
    const M = window.EMERGENCIAS_META, N = window.EMERGENCIAS_NACIONAL;
    let h = '<div class="dir-city">Números nacionales</div>' + N.map((e, i) => dirRowHtml(Object.assign({id: 'dir:nacional:' + i}, e))).join('') +
      '<div class="hint">' + esc(window.EMERGENCIAS_NACIONAL_META.fuente) + '. ' + esc(window.EMERGENCIAS_NACIONAL_META.nota) + '</div>';
    const ids = state.dirAll ? state.places.filter(p => !p.custom && window.EMERGENCIAS[p.id]).map(p => p.id) : (state.selected && !state.selected.custom ? [state.selected.id] : []);
    if (!state.dirAll && !ids.length) h += '<div class="note">Seleccione una sede para ver sus teléfonos de emergencia' + (state.selected && state.selected.id.startsWith('chincha') ? ' (el Excel no trae teléfonos para Chincha)' : '') + '.</div>';
    ids.forEach(id => { const p = placeById(id), es = dirEntries(id);
      h += '<div class="dir-city">' + esc(p.ciudad) + '</div>' + (es.length ? es.map(dirRowHtml).join('') : '<div class="note warn">El Excel no incluye teléfonos de emergencia para ' + esc(p.ciudad) + '. Use la búsqueda en el mapa o los números nacionales.</div>'); });
    if (state.selected && !state.dirAll && state.selected.id === 'ayacucho') h += '<div class="note warn">El Excel no incluye teléfonos de emergencia para Ayacucho.</div>';
    h += '<div class="note">Fuente: ' + esc(M.fuente) + '. Fecha de actualización: <b>no indicada en la fuente</b>. ' + esc(M.nota) + '</div>' +
      '<button class="wide" data-act="dir-all">' + (state.dirAll ? 'Mostrar solo la sede seleccionada' : 'Mostrar directorio de todas las ciudades') + '</button>';
    $('#emDirectorio').innerHTML = h; updateSelCount();
  }
  function updateSelCount() { $('#selCount').textContent = state.sel.size; }

  /* ---------- Chips de categorías ---------- */
  function buildChips() {
    [['#emCats', EM_CATS, 'em'], ['#inCats', IN_CATS, 'in']].forEach(([sel, cats, tab]) => {
      $(sel).innerHTML = cats.map(k => '<label class="chip ' + (state.enabled[k] ? 'on' : '') + '"><input type="checkbox" data-cat="' + k + '" ' + (state.enabled[k] ? 'checked' : '') + '><span class="dot" style="background:' + CATS[k].color + '"></span>' + esc(CATS[k].label) + '</label>').join('');
    });
  }
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.cat) { const k = t.dataset.cat; state.enabled[k] = t.checked; $$('input[data-cat="' + k + '"]').forEach(x => { x.checked = t.checked; x.parentElement.classList.toggle('on', t.checked); });
      if (!t.checked) { catLayers[k].clearLayers(); renderResults(); }
      else { const tab = CATS[k].grupo === 'em' && $('#pane-emerg').classList.contains('active') ? 'em' : 'in'; if (state.ctx[tab]) runSearch(tab, k); else drawCat(k); } }
    if (t.dataset.sel) { t.checked ? state.sel.add(t.dataset.sel) : state.sel.delete(t.dataset.sel); updateSelCount(); }
  });
  [['em'], ['in']].forEach(([tab]) => {
    const seg = $('#' + tab + 'Modo'), rng = $('#' + tab + 'Radio');
    seg.onclick = e => { const b = e.target.closest('button'); if (!b) return; state.mode[tab] = b.dataset.m; $$('#' + tab + 'Modo button').forEach(x => x.classList.toggle('on', x === b)); };
    rng.max = CFG.RADIO_KM_MAX; rng.value = CFG.RADIO_KM_DEFECTO; $('#' + tab + 'RadioTxt').textContent = rng.value + ' km';
    rng.oninput = () => { state.radius[tab] = +rng.value; $('#' + tab + 'RadioTxt').textContent = rng.value + ' km'; };
  });
  $('#emBuscar').onclick = () => runSearch('em'); $('#inBuscar').onclick = () => runSearch('in');

  /* ---------- Pestañas y botones ---------- */
  function activateTab(n) { $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === n)); $$('.pane').forEach(p => p.classList.toggle('active', p.id === 'pane-' + (n === 'emerg' ? 'emerg' : n))); }
  $$('.tab').forEach(t => t.onclick = () => activateTab(t.dataset.tab));
  $('#btnPanel').onclick = () => $('#sidebar').classList.toggle('open');
  $('#btnRuta').onclick = () => { activateTab('ruta'); if (state.origin && state.dest) calcRoute(); else { setStatus('Elija un origen y un destino (pestaña Ruta o en la ficha de cada sede).', true); $('#sidebar').classList.add('open'); } };
  $('#btnCalcular').onclick = calcRoute;
  $('#btnEmerg').onclick = () => { activateTab('emerg'); $('#sidebar').classList.add('open'); runSearch('em'); };
  $('#btnInteres').onclick = () => { activateTab('interes'); $('#sidebar').classList.add('open'); runSearch('in'); };
  $('#btnLimpiar').onclick = clearAll;
  function clearAll() {
    state.selected = state.origin = state.dest = null; state.routes = []; state.routeInfo = null; state.spur = null; state.results = {}; state.ctx = {em: null, in: null}; state.sel.clear(); state.adjusting = null; state.token++;
    routeLayer.clearLayers(); tollLayer.clearLayers(); spurLayer.clearLayers(); areaLayer.clearLayers(); Object.keys(catLayers).forEach(k => catLayers[k].clearLayers());
    state.places.forEach(p => sedeMarkers[p.id] && sedeMarkers[p.id].dragging && sedeMarkers[p.id].dragging.disable());
    state.places.filter(p => p.custom).forEach(p => { sedeLayer.removeLayer(sedeMarkers[p.id]); delete sedeMarkers[p.id]; }); state.places = state.places.filter(p => !p.custom);
    $('#rutaResultado').innerHTML = ''; $('#info').hidden = true; $('#q').value = ''; $('#sugg').hidden = true; buildSelects(); refreshIcons(); renderLists(); renderResults(); setStatus('Selección limpiada.');
    map.flyTo(CFG.PAIS_CENTRO, CFG.PAIS_ZOOM);
  }

  /* ---------- Acciones por delegación ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return; const a = el.dataset.act, id = el.dataset.id;
    if (a === 'sede') selectPlace(id);
    else if (a === 'set-o') { setOrigin(id); setStatus('Origen: ' + placeById(id).nombre); }
    else if (a === 'set-d') { setDest(id); setStatus('Destino: ' + placeById(id).nombre); }
    else if (a === 'sede-em') { activateTab('emerg'); $('#sidebar').classList.add('open'); runSearch('em'); }
    else if (a === 'sede-in') { activateTab('interes'); $('#sidebar').classList.add('open'); runSearch('in'); }
    else if (a === 'adjust') { const m = sedeMarkers[id]; if (state.adjusting === id) { m.dragging.disable(); state.adjusting = null; } else { if (state.adjusting) sedeMarkers[state.adjusting].dragging.disable(); m.dragging.enable(); state.adjusting = id; } renderInfo(); }
    else if (a === 'copy') { const p = placeById(id), t = 'lat:' + p.lat + ', lng:' + p.lng + ', coordOk:true'; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => setStatus('Copiado: ' + t), () => window.prompt('Copie las coordenadas:', t)); }
    else if (a === 'alt') { state.routeIdx = +el.dataset.i; drawRoutes(false); renderRouteResult(); renderInfo(); loadTolls(state.token); }
    else if (a === 'item-route') routeToItem(id);
    else if (a === 'item-focus') { const it = state.itemsById[id]; if (it) { map.flyTo([it.lat, it.lng], 16); setTimeout(() => it._m && it._m.openPopup(), 900); if (window.innerWidth <= 900) $('#sidebar').classList.remove('open'); } }
    else if (a === 'item-pdf') { state.sel.has(id) ? state.sel.delete(id) : state.sel.add(id); renderResults(); map.closePopup(); setStatus(state.sel.has(id) ? 'Añadido al PDF' : 'Quitado del PDF'); }
    else if (a === 'em-ruta') { state.mode.em = 'ruta'; $$('#emModo button').forEach(x => x.classList.toggle('on', x.dataset.m === 'ruta')); activateTab('emerg'); runSearch('em'); }
    else if (a === 'in-ruta') { state.mode.in = 'ruta'; $$('#inModo button').forEach(x => x.classList.toggle('on', x.dataset.m === 'ruta')); activateTab('interes'); runSearch('in'); }
    else if (a === 'dir-all') { state.dirAll = !state.dirAll; renderDirectory(); }
    else if (a === 'lightbox') { const m = $('#lightbox') || Object.assign(document.createElement('div'), {id: 'lightbox', className: 'modal lightbox'}); m.innerHTML = '<img src="' + esc(el.dataset.src) + '" alt="Ruta de referencia">'; m.hidden = false; m.onclick = () => m.hidden = true; document.body.appendChild(m); }
  });

  /* ---------- Buscador ---------- */
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function suggest() {
    const q = norm($('#q').value.trim()), box = $('#sugg'); if (q.length < 2) { box.hidden = true; return; }
    let h = '';
    const sedes = state.places.filter(p => norm([p.nombre, p.ciudad, p.distrito, p.direccion, p.departamento].join(' ')).includes(q)).slice(0, 6);
    if (sedes.length) h += '<h4>Sedes La Calera</h4>' + sedes.map(p => '<button data-s="sede" data-id="' + esc(p.id) + '">' + esc(p.nombre) + '<br><small>' + esc(p.direccion) + '</small></button>').join('');
    const kw = Object.keys(KEYWORDS).filter(k => norm(k).startsWith(q) || q.startsWith(norm(k))).map(k => KEYWORDS[k]); const cats = Array.from(new Set(kw));
    if (cats.length) h += '<h4>Buscar cerca de la sede seleccionada</h4>' + cats.map(k => '<button data-s="cat" data-id="' + k + '">' + esc(CATS[k].label) + '<br><small>' + (state.selected ? 'cerca de ' + esc(state.selected.nombre) : 'seleccione una sede primero') + '</small></button>').join('');
    const dir = []; Object.keys(window.EMERGENCIAS).forEach(cid => dirEntries(cid).forEach(e => { if (norm(cid + ' ' + e.nombre + ' ' + (DIR_LABEL[e.cat] || '')).includes(q)) dir.push(e); }));
    if (dir.length) h += '<h4>Directorio de emergencias</h4>' + dir.slice(0, 6).map(e => '<button data-s="dir" data-id="' + esc(e.ciudad) + '">' + esc(e.nombre) + '<br><small>' + esc(DIR_LABEL[e.cat]) + ' · ' + esc(placeById(e.ciudad).ciudad) + ' · ' + esc(e.tel.map(t => t.n).join(' / ')) + '</small></button>').join('');
    const pois = Object.values(state.itemsById).filter(i => norm(i.nombre + ' ' + i.direccion).includes(q)).slice(0, 5);
    if (pois.length) h += '<h4>Puntos ya consultados</h4>' + pois.map(i => '<button data-s="poi" data-id="' + esc(i.id) + '">' + esc(i.nombre) + '<br><small>' + esc(CATS[i.cat].label) + '</small></button>').join('');
    h += '<h4>Otros lugares</h4><button data-s="geo">Buscar «' + esc($('#q').value.trim()) + '» en el mapa (ciudades y direcciones del Perú)</button>';
    box.innerHTML = h; box.hidden = false;
  }
  $('#q').addEventListener('input', suggest);
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') { const b = $('#sugg button[data-s]'); if (b && b.dataset.s !== 'geo' && !$('#sugg').hidden) b.click(); else geocode(); } if (e.key === 'Escape') $('#sugg').hidden = true; });
  $('#qGo').onclick = geocode;
  document.addEventListener('click', e => { if (!e.target.closest('.search')) $('#sugg').hidden = true; });
  $('#sugg').addEventListener('click', e => {
    const b = e.target.closest('button[data-s]'); if (!b) return; const s = b.dataset.s, id = b.dataset.id; $('#sugg').hidden = true;
    if (s === 'sede') selectPlace(id);
    else if (s === 'cat') { if (!state.selected) { setStatus('Seleccione primero una sede como punto de referencia.', true); return; } const tab = CATS[id].grupo === 'em' ? 'em' : 'in'; state.enabled[id] = true; buildChips(); activateTab(tab === 'em' ? 'emerg' : 'interes'); $('#sidebar').classList.add('open'); runSearch(tab, id); }
    else if (s === 'dir') { selectPlace(id); activateTab('emerg'); $('#sidebar').classList.add('open'); }
    else if (s === 'poi') { const it = state.itemsById[id]; map.flyTo([it.lat, it.lng], 16); setTimeout(() => it._m && it._m.openPopup(), 900); }
    else if (s === 'geo') geocode();
    else if (s === 'place') addCustom(JSON.parse(b.dataset.json));
  });
  async function geocode() {
    const q = $('#q').value.trim(); if (q.length < 3) { setStatus('Escriba al menos 3 letras.', true); return; }
    setStatus('Buscando «' + q + '»…');
    try {
      const j = await fetchJSON(CFG.NOMINATIM_URL + '/search?format=jsonv2&countrycodes=pe&limit=6&accept-language=es&q=' + encodeURIComponent(q), {}, 15000);
      const box = $('#sugg');
      if (!j.length) { box.innerHTML = '<h4>Sin resultados</h4><button disabled>No se encontró «' + esc(q) + '» en el Perú.</button>'; box.hidden = false; setStatus('Sin resultados para «' + q + '»', true); return; }
      box.innerHTML = '<h4>Lugares encontrados (OpenStreetMap)</h4>' + j.map(r => '<button data-s="place" data-json=\'' + esc(JSON.stringify({n: r.name || r.display_name.split(',')[0], d: r.display_name, lat: +r.lat, lng: +r.lon})) + '\'>' + esc(r.name || r.display_name.split(',')[0]) + '<br><small>' + esc(r.display_name) + '</small></button>').join('');
      box.hidden = false; setStatus(j.length + ' resultado(s)');
    } catch (e) { setStatus('No se pudo buscar el lugar (' + e.message + '). Revise su conexión a Internet.', true); }
  }
  function addCustom(r) {
    const p = {id: 'custom-' + (++state.customN), nombre: r.n, ciudad: '', distrito: '', departamento: '', direccion: r.d, lat: r.lat, lng: r.lng, coordOk: true, custom: true};
    state.places.push(p); addSedeMarker(p); buildSelects(); renderLists(); selectPlace(p.id);
  }

  /* ---------- Inicio ---------- */
  buildSelects(); buildChips(); renderLists(); renderResults();
  window.LC = {state, CATS, EM_CATS, IN_CATS, DIR_LABEL, map, dirEntries, placeById, nowStr, today, fetchJSON};
  setStatus('Listo. Seleccione una sede en el mapa o en la lista.');
  window.addEventListener('resize', () => map.invalidateSize());
})();
