/* Exportación a PDF (A4) — Centro de Control La Calera. Usa jsPDF + autoTable y un mapa estático propio con teselas de OpenStreetMap. */
(function () {
  'use strict';
  const G = window.Geo, $ = s => document.querySelector(s);
  const LC = () => window.LC;
  let alcance = 'todo';

  const modal = $('#pdfModal');
  $('#btnPdf').onclick = () => { if (!LC()) return; $('#selCount').textContent = LC().state.sel.size; $('#pdfProgreso').textContent = ''; modal.hidden = false; };
  $('#pdfCancel').onclick = () => { modal.hidden = true; };
  $('#pdfAlcance').onclick = e => { const b = e.target.closest('button'); if (!b) return; alcance = b.dataset.a; document.querySelectorAll('#pdfAlcance button').forEach(x => x.classList.toggle('on', x === b)); };
  $('#pdfGenerar').onclick = async () => {
    const btn = $('#pdfGenerar'); btn.disabled = true;
    try { await generar(); $('#pdfProgreso').textContent = 'PDF generado.'; setTimeout(() => modal.hidden = true, 800); }
    catch (e) { console.error(e); $('#pdfProgreso').innerHTML = '<span style="color:#c1121f">No se pudo generar el PDF: ' + G.esc(e.message) + '</span>'; }
    btn.disabled = false;
  };
  const prog = t => { $('#pdfProgreso').textContent = t; };

  /* ---------- Mapa estático ---------- */
  function loadImg(src, ms) {
    return new Promise(res => { const im = new Image(); im.crossOrigin = 'anonymous'; const t = setTimeout(() => res(null), ms || 9000);
      im.onload = () => { clearTimeout(t); res(im); }; im.onerror = () => { clearTimeout(t); res(null); }; im.src = src; });
  }
  async function staticMap(fit, line, markers) {
    const W = 1200, H = 720; if (!fit.length) return null;
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    fit.forEach(p => { minLat = Math.min(minLat, p[0]); maxLat = Math.max(maxLat, p[0]); minLng = Math.min(minLng, p[1]); maxLng = Math.max(maxLng, p[1]); });
    if (maxLat - minLat < 0.01) { minLat -= 0.01; maxLat += 0.01; } if (maxLng - minLng < 0.01) { minLng -= 0.01; maxLng += 0.01; }
    let z = 14, a, b, tiles = 0;
    for (; z > 3; z--) {
      a = G.project(maxLat, minLng, z); b = G.project(minLat, maxLng, z);
      const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2, ox = cx - W / 2, oy = cy - H / 2;
      tiles = (Math.floor((ox + W) / 256) - Math.floor(ox / 256) + 1) * (Math.floor((oy + H) / 256) - Math.floor(oy / 256) + 1);
      if (b[0] - a[0] <= W - 140 && b[1] - a[1] <= H - 140 && tiles <= 48) break;
    }
    const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2, ox = cx - W / 2, oy = cy - H / 2, n = Math.pow(2, z);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    c.fillStyle = '#dfe6ee'; c.fillRect(0, 0, W, H);
    const jobs = [];
    for (let tx = Math.floor(ox / 256); tx <= Math.floor((ox + W) / 256); tx++) for (let ty = Math.floor(oy / 256); ty <= Math.floor((oy + H) / 256); ty++) {
      if (ty < 0 || ty >= n) continue; const wx = ((tx % n) + n) % n;
      jobs.push(loadImg('https://tile.openstreetmap.org/' + z + '/' + wx + '/' + ty + '.png').then(im => { if (im) c.drawImage(im, tx * 256 - ox, ty * 256 - oy); }));
    }
    await Promise.all(jobs);
    const P = p => { const q = G.project(p[0], p[1], z); return [q[0] - ox, q[1] - oy]; };
    if (line && line.length > 1) {
      const k = Math.max(1, Math.floor(line.length / 3000)); c.lineJoin = 'round'; c.lineCap = 'round';
      c.beginPath(); line.forEach((p, i) => { if (i % k && i !== line.length - 1) return; const q = P(p); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); });
      c.strokeStyle = '#fff'; c.lineWidth = 9; c.stroke(); c.strokeStyle = '#1d4e89'; c.lineWidth = 5; c.stroke();
    }
    c.font = 'bold 20px Arial'; c.textBaseline = 'middle';
    markers.forEach(m => { const q = P([m.lat, m.lng]); if (q[0] < -20 || q[1] < -20 || q[0] > W + 20 || q[1] > H + 20) return;
      c.beginPath(); c.arc(q[0], q[1], m.r || 8, 0, 7); c.fillStyle = m.color; c.fill(); c.lineWidth = 3; c.strokeStyle = '#fff'; c.stroke();
      if (m.txt) { c.fillStyle = '#fff'; c.font = 'bold 13px Arial'; c.textAlign = 'center'; c.fillText(m.txt, q[0], q[1] + 1); }
      if (m.label) { c.font = 'bold 19px Arial'; c.textAlign = 'left'; c.lineWidth = 5; c.strokeStyle = 'rgba(255,255,255,.95)'; c.strokeText(m.label, q[0] + (m.r || 8) + 5, q[1]); c.fillStyle = '#0b2545'; c.fillText(m.label, q[0] + (m.r || 8) + 5, q[1]); } });
    c.font = '15px Arial'; c.textAlign = 'right'; c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(W - 330, H - 26, 330, 26);
    c.fillStyle = '#333'; c.fillText('© Colaboradores de OpenStreetMap (ODbL)', W - 8, H - 13);
    try { return {data: cv.toDataURL('image/jpeg', 0.85), w: W, h: H}; } catch (e) { return null; }
  }
  async function logoData() { const im = await loadImg('assets/logo.png', 3000); if (!im) return null; try { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; c.getContext('2d').drawImage(im, 0, 0); return {d: c.toDataURL('image/png'), w: im.width, h: im.height}; } catch (e) { return null; } }

  /* ---------- Documento ---------- */
  async function generar() {
    if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('No se cargó la librería jsPDF (revise su conexión a Internet).');
    const L = LC(), s = L.state, jsPDF = window.jspdf.jsPDF, sel = alcance === 'sel';
    const wantMap = $('#pdfMapa').checked, wantRoute = $('#pdfRuta').checked, wantDir = $('#pdfDir').checked, wantServ = $('#pdfServ').checked;
    const route = s.routes[s.routeIdx], info = s.routeInfo, ref = s.selected || s.origin;

    // --- datos a incluir ---
    const nacional = (window.EMERGENCIAS_NACIONAL || []).map((e, i) => Object.assign({id: 'dir:nacional:' + i, ciudad: 'Nacional'}, e));
    let dir = [];
    if (wantDir) {
      if (sel) { const all = nacional.slice(); Object.keys(window.EMERGENCIAS).forEach(c => all.push.apply(all, L.dirEntries(c))); dir = all.filter(e => s.sel.has(e.id)); }
      else { const ids = new Set(); if (s.dirAll) Object.keys(window.EMERGENCIAS).forEach(c => ids.add(c)); [s.selected, s.origin, s.dest].forEach(p => p && window.EMERGENCIAS[p.id] && ids.add(p.id)); dir = nacional.concat(Array.from(ids).reduce((a, c) => a.concat(L.dirEntries(c)), [])); }
    }
    let items = [];
    if (wantServ) {
      const seen = {}; Object.keys(s.results).forEach(k => { if (s.enabled[k]) (s.results[k].items || []).forEach(i => { seen[i.id] = i; }); });
      if (route && route.tolls && route.tolls !== 'error') route.tolls.forEach(t => { seen[t.id] = t; });
      items = Object.values(seen).filter(i => !sel || s.sel.has(i.id));
      items.sort((a, b) => (a.cat > b.cat ? 1 : a.cat < b.cat ? -1 : (a.dist || 0) - (b.dist || 0)));
    }

    prog('Preparando mapa…');
    const doc = new jsPDF({unit: 'mm', format: 'a4'}), M = 12, PW = 210, CW = PW - 2 * M, NAVY = [11, 37, 69];
    const logo = await logoData(); const stamp = L.nowStr();

    // Encabezado
    doc.setFillColor.apply(doc, NAVY); doc.rect(0, 0, PW, 28, 'F');
    let tx = M; if (logo) { const lh = 15, lw = lh * logo.w / logo.h; doc.setFillColor(255, 255, 255); doc.roundedRect(M, 6.5, lw + 4, lh + 3, 1.5, 1.5, 'F'); doc.addImage(logo.d, 'PNG', M + 2, 8, lw, lh); tx = M + lw + 9; }
    doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text('CENTRO DE CONTROL LA CALERA', tx, 14);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text('Reporte operativo de sedes, rutas y servicios de emergencia', tx, 20);
    doc.text('Generado: ' + stamp + ' (hora de Perú)', PW - M, 14, {align: 'right'});
    doc.text('Alcance: ' + (sel ? 'solo lo seleccionado' : 'reporte completo'), PW - M, 20, {align: 'right'});
    doc.setTextColor(28, 36, 48);

    let y = 36;
    const title = (t) => { if (y > 262) { doc.addPage(); y = 18; } doc.setFont('helvetica', 'bold'); doc.setFontSize(11.5); doc.setTextColor.apply(doc, NAVY); doc.text(t, M, y); doc.setDrawColor(193, 18, 31); doc.setLineWidth(.6); doc.line(M, y + 1.6, M + 22, y + 1.6); doc.setTextColor(28, 36, 48); y += 7; };
    const para = (t, size, color) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(size || 9); if (color) doc.setTextColor.apply(doc, color); const ls = doc.splitTextToSize(t, CW); ls.forEach(l => { if (y > 280) { doc.addPage(); y = 18; } doc.text(l, M, y); y += (size || 9) * 0.45 + 1; }); doc.setTextColor(28, 36, 48); y += 1; };
    const table = (head, body, opts) => { doc.autoTable(Object.assign({startY: y, head: [head], body, theme: 'grid', margin: {left: M, right: M, top: 16, bottom: 16}, styles: {fontSize: 8, cellPadding: 1.6, overflow: 'linebreak', valign: 'top'}, headStyles: {fillColor: NAVY, textColor: 255}, alternateRowStyles: {fillColor: [245, 247, 250]}}, opts || {})); y = doc.lastAutoTable.finalY + 6; };
    const kv = (rows) => { doc.autoTable({startY: y, body: rows, theme: 'plain', margin: {left: M, right: M, top: 16, bottom: 16}, styles: {fontSize: 9, cellPadding: 1.2}, columnStyles: {0: {fontStyle: 'bold', cellWidth: 38, textColor: [91, 102, 117]}}}); y = doc.lastAutoTable.finalY + 5; };

    // Resumen de consulta
    title('Consulta realizada');
    const rows = [];
    if (info && wantRoute) rows.push(['Ruta', info.o.nombre + '  >  ' + info.d.nombre]);
    else if (ref) rows.push(['Sede consultada', ref.nombre]);
    if (!rows.length) rows.push(['Consulta', 'Sin sede ni ruta seleccionada (reporte general).']);
    kv(rows);

    // Mapa
    if (wantMap) {
      let fit = [], line = null; const mk = [];
      if (route && wantRoute) { line = route.coords; fit = route.line.slice(); }
      const placesShown = s.places.filter(p => !p.custom || p === s.selected || p === s.origin || p === s.dest);
      const focus = [s.selected, s.origin, s.dest].filter(Boolean);
      if (!fit.length) { if (focus.length) { focus.forEach(p => fit.push([p.lat, p.lng])); items.forEach(i => fit.push([i.lat, i.lng])); } else placesShown.forEach(p => fit.push([p.lat, p.lng])); }
      placesShown.forEach(p => { const isO = s.origin && p.id === s.origin.id, isD = s.dest && p.id === s.dest.id, isS = s.selected && p.id === s.selected.id;
        mk.push({lat: p.lat, lng: p.lng, color: isO ? '#2a7f4f' : isD ? '#c1121f' : isS ? '#c1121f' : '#13315c', r: (isO || isD || isS) ? 11 : 8, txt: isO ? 'O' : isD ? 'D' : '', label: p.nombre}); });
      items.forEach(i => mk.push({lat: i.lat, lng: i.lng, color: L.CATS[i.cat].color, r: 6}));
      const m = await staticMap(fit, line, mk);
      if (m) { const h = CW * m.h / m.w; if (y + h > 285) { doc.addPage(); y = 18; } doc.addImage(m.data, 'JPEG', M, y, CW, h); doc.setDrawColor(190); doc.rect(M, y, CW, h); y += h + 3;
        const leg = []; if (route) leg.push('Línea azul: ruta calculada'); leg.push('O = origen, D = destino'); const cats = Array.from(new Set(items.map(i => L.CATS[i.cat].label))); if (cats.length) leg.push('Puntos de colores: ' + cats.join(', '));
        para(leg.join('  ·  '), 7.5, [91, 102, 117]); }
      else para('No se pudo generar la imagen del mapa (sin acceso a las teselas de OpenStreetMap o restricción del navegador). El resto del reporte es válido.', 8.5, [193, 18, 31]);
    }

    // Ruta
    if (route && info && wantRoute) {
      title('Ruta consultada');
      kv([['Origen', info.o.nombre + ' — ' + (info.o.direccion || '') + ' (' + info.o.lat.toFixed(5) + ', ' + info.o.lng.toFixed(5) + ')'],
        ['Destino', info.d.nombre + ' — ' + (info.d.direccion || '') + ' (' + info.d.lat.toFixed(5) + ', ' + info.d.lng.toFixed(5) + ')'],
        ['Ruta mostrada', route.label], ['Distancia estimada', G.fmtKm(route.distance / 1000)], ['Tiempo aproximado', G.fmtTime(route.duration) + ' (vehículo liviano, sin paradas ni tráfico)'],
        ['Fuente y fecha', 'OSRM sobre datos de OpenStreetMap — calculado el ' + info.fecha]]);
      if (info.cor && (route.kind === 'cor' || !info.cor.vias.length)) para('Corredor operativo de referencia (Excel del Centro de Control): ' + info.cor.desc, 8.5);
      if (s.routes.length > 1) table(['Rutas disponibles', 'Distancia', 'Tiempo'], s.routes.map((r, i) => [r.label + (i === s.routeIdx ? '  (mostrada)' : ''), G.fmtKm(r.distance / 1000), G.fmtTime(r.duration)]));
      if (route.roads.length) table(['Carreteras y vías principales', 'Tramo aprox.'], route.roads.map(r => [r.label, G.fmtKm(r.km)]));
      if (route.cities.length) { title('Ciudades y puntos de referencia'); para(route.cities.map(c => c.nombre).join('  >  '), 9); }
      const tolls = route.tolls && route.tolls !== 'error' ? route.tolls : [];
      para('Peajes en la ruta (OpenStreetMap): ' + (route.tolls === 'error' ? 'consulta fallida.' : tolls.length ? tolls.map(t => t.nombre).join('; ') : 'ninguno registrado (el mapa puede estar incompleto).'), 8.5);
    }
    if (s.spur && wantRoute) { title('Ruta a punto seleccionado'); kv([['Desde', s.spur.from.nombre], ['Hasta', s.spur.item.nombre + (s.spur.item.direccion ? ' — ' + s.spur.item.direccion : '')], ['Distancia / tiempo', G.fmtKm(s.spur.distance / 1000) + ' · ' + G.fmtTime(s.spur.duration)]]); }

    // Ficha de sede
    if (ref && !sel) {
      title('Ficha de sede');
      kv([['Nombre', ref.nombre], ['Dirección', ref.direccion || 'No disponible'], ['Distrito / ciudad', [ref.distrito, ref.ciudad].filter(Boolean).join(' / ')], ['Departamento', ref.departamento || '—'],
        ['Coordenadas', ref.lat.toFixed(5) + ', ' + ref.lng.toFixed(5) + (ref.coordOk || ref.ajustada || ref.custom ? '' : '  (APROXIMADAS, pendiente de confirmar)')]]);
    }

    // Directorio
    if (wantDir) {
      title('Directorio de emergencias');
      if (!dir.length) para('No hay registros del directorio incluidos en este alcance.', 9);
      else table(['Ciudad', 'Categoría', 'Institución', 'Teléfono(s)', 'Fuente / actualización'], dir.map(e => {
        const c = e.ciudad === 'Nacional' ? 'Nacional' : (L.placeById(e.ciudad) || {ciudad: e.ciudad}).ciudad;
        const f = e.ciudad === 'Nacional' ? 'Números nacionales; verificar vigencia en gob.pe' : 'Excel del Centro de Control; sin fecha de verificación';
        return [c, L.DIR_LABEL[e.cat] || e.cat, e.nombre, e.tel.map(t => t.n + (t.ok ? '' : ' (verificar: formato dudoso)')).join('\n') || 'No disponible', f]; }),
        {columnStyles: {0: {cellWidth: 20}, 1: {cellWidth: 27}, 3: {cellWidth: 33}, 4: {cellWidth: 35}}});
      para('Los teléfonos del Excel no cuentan con fecha de verificación. Los marcados como "verificar" tienen un formato que no corresponde a un número peruano completo.', 7.5, [91, 102, 117]);
    }

    // Servicios y puntos de interés
    if (wantServ) {
      title('Servicios de emergencia y puntos de interés');
      if (!items.length) para('No hay puntos consultados en el mapa dentro de este alcance (use «Puntos de emergencia» o «Puntos de interés» y vuelva a exportar).', 9);
      else {
        table(['Categoría', 'Nombre', 'Dirección', 'Teléfono', 'Distancia'], items.map(i => [L.CATS[i.cat].label, i.nombre, i.direccion || 'No registrada en OSM', i.tels.map(t => t.n).join('\n') || 'No disponible', i.distRuta != null ? G.fmtKm(i.distRuta) + ' de la ruta' : (i.dist != null ? G.fmtKm(i.dist) + ' (línea recta)' : '—')]),
          {columnStyles: {0: {cellWidth: 30}, 3: {cellWidth: 28}, 4: {cellWidth: 26}}});
        const fechas = Array.from(new Set(items.map(i => i.fecha))).join(', ');
        para('Fuente: OpenStreetMap (colaboradores, licencia ODbL), consultado vía Overpass API el ' + fechas + '. Dirección y teléfono se muestran solo si existen en OSM; no se han completado ni inferido.', 7.5, [91, 102, 117]);
      }
    }

    // Fuentes y avisos
    title('Fuentes y avisos');
    const aprox = s.places.filter(p => !p.custom && !p.coordOk && !p.ajustada).map(p => p.nombre);
    const notes = ['Cartografía y rutas: OpenStreetMap contributors (ODbL); enrutamiento con OSRM.', 'Sedes y teléfonos del directorio: Excel del Centro de Control La Calera (sin fecha de verificación).',
      'Los tiempos de viaje son estimaciones para vehículo liviano y no incluyen tráfico, paradas, clima ni restricciones de tránsito.'];
    if (aprox.length) notes.push('Coordenadas aproximadas (pendientes de confirmar con el enlace de Google Maps del Excel): ' + aprox.join(', ') + '.');
    notes.forEach(n => para('- ' + n, 8.5));

    // Pie de página
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFontSize(7.5); doc.setTextColor(120); doc.setFont('helvetica', 'normal');
      if (i > 1) { doc.text('CENTRO DE CONTROL LA CALERA', M, 9); doc.setDrawColor(210); doc.line(M, 11, PW - M, 11); }
      doc.setDrawColor(210); doc.line(M, 288, PW - M, 288); doc.text('Centro de Control La Calera · Generado ' + stamp, M, 292); doc.text('Página ' + i + ' de ' + pages, PW - M, 292, {align: 'right'}); }
    const d = new Date(), pad = n => String(n).padStart(2, '0');
    doc.save('Centro-de-Control-La-Calera_' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()) + '.pdf');
  }
})();
