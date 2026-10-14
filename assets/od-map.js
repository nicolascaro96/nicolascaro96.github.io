// Interactive OD desire-lines demo.
// Synthetic data: singly-constrained gravity model on approximate
// corregimiento centroids of the Panama metropolitan area (illustrative only).
(function () {
  if (typeof L === "undefined") return;
  const $ = (s) => document.querySelector(s);

  // id, name, lat, lon, population (thousands), employment attractiveness
  const ZONES = [
    ["SFE", "San Felipe",        8.952, -79.535,   4, 15],
    ["CAL", "Calidonia",         8.965, -79.538,  20, 50],
    ["BVI", "Bella Vista",       8.982, -79.525,  30, 95],
    ["SFR", "San Francisco",     8.995, -79.505,  45, 85],
    ["ANC", "Ancón",             8.975, -79.558,  30, 60],
    ["BET", "Betania",           9.010, -79.525,  50, 45],
    ["PNU", "Pueblo Nuevo",      9.010, -79.505,  20, 25],
    ["PLF", "Parque Lefevre",    9.015, -79.485,  37, 15],
    ["RAB", "Río Abajo",         9.022, -79.495,  28, 15],
    ["JDI", "Juan Díaz",         9.040, -79.455, 100, 40],
    ["PED", "Pedregal",          9.065, -79.428,  50, 10],
    ["TOC", "Tocumen",           9.080, -79.380, 110, 35],
    ["24D", "24 de Diciembre",   9.098, -79.358, 100,  8],
    ["PAC", "Pacora",            9.082, -79.290,  60,  6],
    ["LCU", "Las Cumbres",       9.088, -79.530, 110, 10],
    ["CHI", "Chilibre",          9.152, -79.618,  60,  6],
    ["BPO", "Belisario Porras",  9.062, -79.500,  55, 12],
    ["ADI", "Amelia Denis",      9.045, -79.512,  40, 14],
    ["JDE", "José D. Espinar",   9.052, -79.468,  40, 25],
    ["RUF", "Rufina Alfaro",     9.075, -79.475,  50,  8],
    ["ARR", "Arraiján",          8.950, -79.655,  50, 10],
    ["VAL", "Vista Alegre",      8.928, -79.700,  60,  8],
    ["BUR", "Burunga",           8.932, -79.670,  60,  6],
    ["JDA", "J. D. Arosemena",   8.995, -79.640,  40,  6],
    ["VER", "Veracruz",          8.892, -79.630,  25, 18],
    ["BCO", "Barrio Colón",      8.880, -79.780,  50, 14],
    ["GUA", "Guadalupe",         8.868, -79.812,  45,  6],
  ].map(([id, name, lat, lon, pop, emp]) => ({ id, name, lat, lon, pop, emp }));

  const TRIP_RATE = 300;   // AM-peak trips per 1,000 residents
  const BETA = 0.15;       // distance decay (1/km)
  const INTRA_KM = 1.5;

  function km(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // singly-constrained gravity model: T_ij = O_i * E_j f(d_ij) / Σ_k E_k f(d_ik)
  const FLOWS = [];
  let interTotal = 0;
  ZONES.forEach((o) => {
    o.out = 0; o.in = 0;
  });
  ZONES.forEach((o) => {
    const prod = o.pop * TRIP_RATE;
    const w = ZONES.map((d) => d.emp * Math.exp(-BETA * (d === o ? INTRA_KM : km(o, d))));
    const sw = w.reduce((a, b) => a + b, 0);
    ZONES.forEach((d, j) => {
      if (d === o) return;
      const t = Math.round((prod * w[j]) / sw / 10) * 10;
      if (t <= 0) return;
      FLOWS.push({ o, d, t });
      o.out += t; d.in += t; interTotal += t;
    });
  });
  FLOWS.sort((a, b) => b.t - a.t);
  const maxFlow = FLOWS[0].t;

  // ---- state ----
  let topN = 60, selected = null, dir = "out";
  const lang = () => (document.documentElement.lang === "es" ? "es" : "en");
  const tr = (k) => UI.map[k][lang()];
  const fmt = (n) => n.toLocaleString(lang() === "es" ? "es-ES" : "en-US");
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // ---- map ----
  const map = L.map("od-leaflet", {
    scrollWheelZoom: false, preferCanvas: true,
  });
  map.fitBounds(L.latLngBounds(ZONES.map((z) => [z.lat, z.lon])), { padding: [8, 8] });

  // One light basemap for both themes; dark mode inverts it in CSS (.map-dark),
  // which avoids the uneven tile shading of Esri's own dark canvas.
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    maxZoom: 16, className: "basemap",
  }).addTo(map);
  function setTiles() {
    map.getContainer().classList.toggle("map-dark", isDark());
  }

  const lineLayer = L.layerGroup().addTo(map);
  const zoneLayer = L.layerGroup().addTo(map);

  // quadratic Bézier, bent to the right of the travel direction
  function curve(o, d) {
    const p0 = [o.lat, o.lon], p2 = [d.lat, d.lon];
    const mx = (p0[0] + p2[0]) / 2, my = (p0[1] + p2[1]) / 2;
    const dx = p2[0] - p0[0], dy = p2[1] - p0[1];
    const k = 0.18;
    const c = [mx - dy * k, my + dx * k];
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, u = 1 - t;
      pts.push([u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1]]);
    }
    return pts;
  }

  function visibleFlows() {
    let list = FLOWS;
    if (selected) list = FLOWS.filter((f) => (dir === "out" ? f.o : f.d) === selected);
    return list.slice(0, topN);
  }

  function draw() {
    const accent = css("--accent");
    const muted = css("--muted");
    lineLayer.clearLayers();
    zoneLayer.clearLayers();

    const flows = visibleFlows();
    // draw thin lines first so thick ones sit on top
    [...flows].reverse().forEach((f) => {
      const r = f.t / maxFlow;
      L.polyline(curve(f.o, f.d), {
        color: accent, weight: 0.8 + Math.sqrt(r) * 11, opacity: 0.25 + r * 0.6,
        lineCap: "round", interactive: true,
      })
        .bindTooltip(`<strong>${f.o.name} → ${f.d.name}</strong><br>${fmt(f.t)} ${tr("trips")}`, { sticky: true })
        .addTo(lineLayer);
    });

    const maxPop = Math.max(...ZONES.map((z) => z.pop));
    ZONES.forEach((z) => {
      const active = z === selected;
      L.circleMarker([z.lat, z.lon], {
        radius: 3 + Math.sqrt(z.pop / maxPop) * 9,
        color: active ? accent : muted, weight: active ? 3 : 1.2,
        fillColor: active ? accent : css("--surface"), fillOpacity: 0.95,
      })
        .bindTooltip(
          `<strong>${z.name}</strong><br>↑ ${fmt(z.out)} · ↓ ${fmt(z.in)} ${tr("trips")}`,
          { direction: "top", offset: [0, -6] }
        )
        .on("click", () => { selected = selected === z ? null : z; update(); })
        .addTo(zoneLayer);
    });

    // panel
    const shown = flows.reduce((a, f) => a + f.t, 0);
    const base = selected ? (dir === "out" ? selected.out : selected.in) : interTotal;
    $("#od-sel").textContent = selected ? `${tr(dir === "out" ? "from" : "to")} ${selected.name}` : tr("allZones");
    $("#od-k-shown").textContent = fmt(shown);
    $("#od-k-share").textContent = base ? `${((shown / base) * 100).toFixed(1)} %` : "–";
    $("#od-top").replaceChildren(
      ...flows.slice(0, 5).map((f) => {
        const li = document.createElement("li");
        const row = document.createElement("div");
        const a = document.createElement("span");
        a.textContent = `${f.o.name} → ${f.d.name}`;
        const b = document.createElement("span");
        b.className = "mono muted";
        b.textContent = fmt(f.t);
        row.append(a, b);
        li.append(row);
        return li;
      })
    );
  }

  function update() {
    $("#od-n-val").textContent = topN;
    $("#od-dir-out").classList.toggle("active", dir === "out");
    $("#od-dir-in").classList.toggle("active", dir === "in");
    draw();
  }

  $("#od-n").addEventListener("input", (e) => { topN = +e.target.value; update(); });
  $("#od-dir-out").onclick = () => { dir = "out"; update(); };
  $("#od-dir-in").onclick = () => { dir = "in"; update(); };
  $("#od-reset").onclick = () => { selected = null; update(); };

  document.addEventListener("langchange", update);
  document.addEventListener("themechange", () => { setTiles(); draw(); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { setTiles(); draw(); });

  setTiles();
  update();
})();
