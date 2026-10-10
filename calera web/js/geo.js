/* Utilidades geográficas y de formato (sin dependencias; también se prueban con Node). */
(function (root) {
  const R = 6371.0088;
  const rad = d => d * Math.PI / 180;

  /** Distancia en línea recta (km) entre [lat,lng] y [lat,lng]. */
  function haversine(a, b) {
    const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
  }

  /** Reduce una polilínea [[lat,lng],...] dejando un punto cada ~stepKm (siempre conserva el último). */
  function thin(coords, stepKm) {
    if (!coords.length) return [];
    const out = [coords[0]];
    let acc = 0;
    for (let i = 1; i < coords.length; i++) {
      acc += haversine(coords[i - 1], coords[i]);
      if (acc >= stepKm) { out.push(coords[i]); acc = 0; }
    }
    const last = coords[coords.length - 1];
    if (out[out.length - 1] !== last) out.push(last);
    return out;
  }

  /** Distancia mínima (km) y posición del punto más cercano de una polilínea ya adelgazada. */
  function nearestOnLine(p, line) {
    let best = Infinity, idx = -1;
    for (let i = 0; i < line.length; i++) {
      const d = haversine(p, line[i]);
      if (d < best) { best = d; idx = i; }
    }
    return { km: best, index: idx };
  }

  /** Convierte la geometría GeoJSON de OSRM ([lng,lat]) a [lat,lng]. */
  function fromGeoJSON(coords) { return coords.map(c => [c[1], c[0]]); }

  /** Carreteras principales de una ruta OSRM: agrupa pasos consecutivos por referencia/nombre. */
  function roadsFromRoute(route, minKm) {
    minKm = minKm == null ? 3 : minKm;
    const seq = [];
    (route.legs || []).forEach(leg => (leg.steps || []).forEach(st => {
      const label = (st.ref || st.name || '').trim();
      if (!label) return;
      const last = seq[seq.length - 1];
      if (last && last.label === label) last.km += st.distance / 1000;
      else seq.push({ label, km: st.distance / 1000 });
    }));
    // fusiona etiquetas repetidas conservando el orden de la primera aparición
    const order = [], map = {};
    seq.forEach(s => {
      if (!map[s.label]) { map[s.label] = { label: s.label, km: 0 }; order.push(map[s.label]); }
      map[s.label].km += s.km;
    });
    return order.filter(r => r.km >= minKm);
  }

  /** Ciudades de referencia a menos de radiusKm de la ruta, en orden de recorrido. */
  function citiesAlong(line, cities, radiusKm) {
    const found = [];
    cities.forEach(c => {
      const n = nearestOnLine([c[1], c[2]], line);
      if (n.km <= radiusKm) found.push({ nombre: c[0], index: n.index, km: n.km });
    });
    found.sort((a, b) => a.index - b.index);
    return found;
  }

  function fmtKm(km) { return km >= 100 ? String(Math.round(km)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' km' : km.toFixed(1).replace('.', ',') + ' km'; }
  function fmtTime(sec) {
    const m = Math.round(sec / 60), h = Math.floor(m / 60), mm = m % 60;
    return h ? h + ' h ' + String(mm).padStart(2, '0') + ' min' : mm + ' min';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /** Enlace tel: para un número peruano (acepta "054 223 333", "(01) 641 9768", "116", "943 999 270"). */
  function telHref(n) {
    let d = String(n).replace(/\D/g, '');
    if (d.length <= 3) return 'tel:' + d;
    if (d.startsWith('0')) d = d.slice(1);
    return 'tel:+51' + d;
  }

  /** Teléfono OSM: puede traer varios separados por ';'. Devuelve [{n, ok}] sin inventar nada. */
  function parsePhones(raw) {
    if (!raw) return [];
    return String(raw).split(/;|,/).map(s => s.trim()).filter(s => /\d/.test(s)).map(s => ({ n: s, ok: true }));
  }

  /** Polilínea [[lat,lng]] -> texto "lat lon lat lon ..." para Overpass "around". */
  function overpassLine(line) { return line.map(p => p[0].toFixed(5) + ',' + p[1].toFixed(5)).join(','); }

  /** Sistema de proyección Web Mercator para el mapa del PDF. */
  function project(lat, lng, z) {
    const n = 256 * Math.pow(2, z);
    const x = (lng + 180) / 360 * n;
    const s = Math.sin(rad(lat));
    const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n;
    return [x, y];
  }

  root.Geo = { haversine, thin, nearestOnLine, fromGeoJSON, roadsFromRoute, citiesAlong, fmtKm, fmtTime, esc, telHref, parsePhones, overpassLine, project };
  if (typeof module !== 'undefined') module.exports = root.Geo;
})(typeof window !== 'undefined' ? window : globalThis);
