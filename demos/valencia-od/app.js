(function () {
  const D = window.OD_DATA;
  const $ = (s) => document.querySelector(s);
  const NZ = D.zones.length, NC = 72, H = 24;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  // ---------- textos ----------
  const T = {
    es: {
      eyebrow: "MITMA · Estudio de Movilidad · mayo 2025",
      title: "Viajes entre distritos del área metropolitana de València",
      subtitle: "Líneas de deseo de un día promedio laboral (lunes a jueves) y no laboral (sábado y domingo), a partir de datos de telefonía móvil del Ministerio de Transportes. Haz clic en un distrito para ver sus flujos.",
      fDay: "Tipo de día", lab: "Laboral (L–J)", nolab: "No laboral (S–D)",
      fHours: "Franja horaria", allDay: "Todo el día", amPeak: "Punta mañana", pmPeak: "Punta tarde",
      fPurpose: "Motivo", fLines: "Líneas de deseo:",
      mot: ["Trabajo / estudio", "Otras frecuentes", "No frecuentes"],
      mapGen: "Viajes generados", mapAtr: "Viajes atraídos",
      hint: "Clic en un distrito para filtrar · clic de nuevo para quitar",
      chGen: "Viajes generados / día", chAtr: "Viajes atraídos / día",
      chFrom: (n) => `Viajes desde ${n} / día`, chTo: (n) => `Viajes hacia ${n} / día`,
      lineLegend: "Líneas de deseo (viajes / día)",
      kGenArea: "Viajes generados en el área", kInter: "Viajes entre distritos",
      kGenSel: "Viajes generados", kAtrSel: "Viajes atraídos",
      kOutSel: "Hacia otros distritos", kInSel: "Desde otros distritos",
      kShown: "Representados en las líneas",
      profArea: "Perfil horario · viajes generados en el área",
      profGen: (n) => `Perfil horario · generados en ${n}`, profAtr: (n) => `Perfil horario · atraídos a ${n}`,
      topTitle: "Principales pares origen → destino", thPair: "Origen → destino", thTrips: "Viajes/día",
      trips: "viajes/día", total: "Total", hour: "h",
      ptTitle: "Transporte público", ptTrips: "expediciones/día laborable",
      pt: { metro: "Metro", tram: "Tranvía", rail: "Cercanías", bus: "Bus interurbano" },
      ptSource: "Redes de transporte: GTFS de FGV Metrovalencia, Renfe Cercanías (núcleo València) y autobús interurbano de la Generalitat Valenciana (junio 2026); expediciones de un día laborable de referencia.",
      source: "Fuente: Ministerio de Transportes y Movilidad Sostenible — Estudio de movilidad con Big Data (datos abiertos, CC BY 4.0), descargados con pySpainMobility. Zonificación: distritos MITMA del ámbito de estudio (105 zonas).",
      method: "Día promedio = suma de los días del tipo / nº de días (laboral: 19–22 may 2025; no laboral: 24–25 may 2025). Motivo según la actividad de origen y destino: trabajo/estudio si alguno de los extremos lo es; si no, frecuente; el resto, no frecuente. Las líneas muestran pares entre distritos distintos con ≥ 50 viajes/día (98,5 % de los viajes interdistritales).",
    },
    en: {
      eyebrow: "MITMA · Spanish Mobility Study · May 2025",
      title: "Trips between districts in the València metropolitan area",
      subtitle: "Desire lines for an average weekday (Monday–Thursday) and weekend day (Saturday–Sunday), based on mobile-phone data from the Spanish Ministry of Transport. Click a district to see its flows.",
      fDay: "Day type", lab: "Weekday (Mon–Thu)", nolab: "Weekend (Sat–Sun)",
      fHours: "Time of day", allDay: "All day", amPeak: "AM peak", pmPeak: "PM peak",
      fPurpose: "Purpose", fLines: "Desire lines:",
      mot: ["Work / study", "Other frequent", "Non-frequent"],
      mapGen: "Trips generated", mapAtr: "Trips attracted",
      hint: "Click a district to filter · click again to clear",
      chGen: "Trips generated / day", chAtr: "Trips attracted / day",
      chFrom: (n) => `Trips from ${n} / day`, chTo: (n) => `Trips to ${n} / day`,
      lineLegend: "Desire lines (trips / day)",
      kGenArea: "Trips generated in the area", kInter: "Trips between districts",
      kGenSel: "Trips generated", kAtrSel: "Trips attracted",
      kOutSel: "To other districts", kInSel: "From other districts",
      kShown: "Shown as lines",
      profArea: "Hourly profile · trips generated in the area",
      profGen: (n) => `Hourly profile · generated in ${n}`, profAtr: (n) => `Hourly profile · attracted to ${n}`,
      topTitle: "Top origin → destination pairs", thPair: "Origin → destination", thTrips: "Trips/day",
      trips: "trips/day", total: "Total", hour: "h",
      ptTitle: "Public transport", ptTrips: "services/weekday",
      pt: { metro: "Metro", tram: "Tram", rail: "Commuter rail", bus: "Intercity bus" },
      ptSource: "Transit networks: GTFS feeds from FGV Metrovalencia, Renfe Cercanías (València) and Generalitat Valenciana intercity buses (June 2026); services counted on a reference weekday.",
      source: "Source: Spanish Ministry of Transport and Sustainable Mobility — Big Data mobility study (open data, CC BY 4.0), downloaded with pySpainMobility. Zoning: MITMA districts in the study area (105 zones).",
      method: "Average day = sum over days of that type / number of days (weekday: 19–22 May 2025; weekend: 24–25 May 2025). Purpose from origin and destination activity: work/study if either end is; otherwise frequent; the rest, non-frequent. Lines show pairs between different districts with ≥ 50 trips/day (98.5% of inter-district trips).",
    },
  };

  // ---------- estado ----------
  const S = {
    lang: store.get("lang") || ((navigator.language || "es").startsWith("es") ? "es" : "en"),
    tipo: "lab", from: 0, to: 23, mot: [true, true, true], n: 150, map: "gen", sel: null,
  };
  const t = (k) => T[S.lang][k];
  const nf = () => new Intl.NumberFormat(S.lang === "es" ? "es-ES" : "en-GB", { maximumFractionDigits: 0, useGrouping: "always" });
  const fmt = (v) => nf().format(Math.round(v));
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const isDark = () => {
    const th = document.documentElement.dataset.theme;
    return th ? th === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // ---------- agregación ----------
  function cells() {
    const c = [];
    for (let m = 0; m < 3; m++) if (S.mot[m]) for (let h = S.from; h <= S.to; h++) c.push(m * H + h);
    return c;
  }
  function sumRow(arr, row, cs) {
    let s = 0; const o = row * NC;
    for (const c of cs) s += arr[o + c];
    return s;
  }
  function compute() {
    const d = D[S.tipo], cs = cells();
    const flows = new Float64Array(D.pairs.length);
    for (let k = 0; k < D.pairs.length; k++) flows[k] = sumRow(d.cube, k, cs);
    const zout = new Float64Array(NZ), zin = new Float64Array(NZ);
    for (let i = 0; i < NZ; i++) { zout[i] = sumRow(d.zout, i, cs); zin[i] = sumRow(d.zin, i, cs); }
    return { flows, zout, zin };
  }

  // ---------- mapa ----------
  const map = L.map("map", { scrollWheelZoom: false, preferCanvas: false, zoomControl: true });
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap contributors · Datos: MITMA',
    maxZoom: 18, maxNativeZoom: 16, className: "basemap",
  }).addTo(map);
  const lineRenderer = L.canvas({ padding: 0.2 });
  const zoneLayer = L.geoJSON(D.geo, {
    style: () => ({ weight: 0.6, color: css("--surface"), fillOpacity: 0.7 }),
    onEachFeature: (f, lyr) => {
      lyr.on("click", () => { S.sel = S.sel === f.properties.i ? null : f.properties.i; update(); });
      lyr.on("mouseover", () => lyr.setStyle({ weight: 2, color: css("--ink") }));
      lyr.on("mouseout", () => styleZones());
    },
  }).addTo(map);
  map.fitBounds(zoneLayer.getBounds(), { padding: [10, 10] });
  const lineLayer = L.layerGroup().addTo(map);
  const selLayer = L.layerGroup().addTo(map);

  // rampa secuencial (azul): claro -> oscuro en modo claro; oscuro -> claro en modo oscuro
  const RAMP_L = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"];
  const RAMP_D = ["#0d366b", "#184f95", "#256abf", "#2a78d6", "#5598e7", "#86b6ef", "#cde2fb"];
  let zoneVals = new Float64Array(NZ), breaks = [];

  function quantileBreaks(vals) {
    const v = [...vals].filter((x) => x > 0).sort((a, b) => a - b);
    if (!v.length) return [];
    const k = RAMP_L.length, b = [];
    for (let i = 1; i < k; i++) b.push(v[Math.min(v.length - 1, Math.floor((i * v.length) / k))]);
    return [...new Set(b.map(nice))];
  }
  function nice(x) {
    if (x <= 0) return 0;
    const p = Math.pow(10, Math.floor(Math.log10(x)) - 1);
    return Math.round(x / p) * p;
  }
  const colorFor = (v) => {
    const ramp = isDark() ? RAMP_D : RAMP_L;
    if (!(v > 0)) return css("--grid");
    let i = 0; while (i < breaks.length && v >= breaks[i]) i++;
    return ramp[Math.min(i + (ramp.length - 1 - breaks.length), ramp.length - 1)];
  };

  function styleZones() {
    zoneLayer.eachLayer((lyr) => {
      const i = lyr.feature.properties.i, sel = i === S.sel;
      lyr.setStyle({
        fillColor: sel ? css("--ink") : colorFor(zoneVals[i]),
        fillOpacity: sel ? 0.85 : 0.6,
        color: css("--surface"), weight: 0.6,
      });
    });
  }

  function curve(a, b) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1], k = 0.16;
    const c = [mx - dy * k, my + dx * k], pts = [];
    for (let i = 0; i <= 20; i++) {
      const s = i / 20, u = 1 - s;
      pts.push([u * u * a[0] + 2 * u * s * c[0] + s * s * b[0], u * u * a[1] + 2 * u * s * c[1] + s * s * b[1]]);
    }
    return pts;
  }
  const widthFor = (v, max) => 0.4 + 9 * Math.sqrt(v / max);

  // ---------- transporte público (GTFS) ----------
  const P = window.PT_DATA;
  const PT_MODES = [
    { k: "metro", grp: "metro", w: 4 },
    { k: "tram", grp: "metro", w: 3 },
    { k: "rail", grp: "rail", w: 3.5 },
    { k: "bus", grp: "bus", color: "#b8327a", colorDark: "#e070ad" },
  ];
  const ptOn = new Set(["metro", "tram", "rail", "bus"]);   // todas las capas activas al abrir
  map.createPane("pt"); map.getPane("pt").style.zIndex = 450;
  map.createPane("ptStops"); map.getPane("ptStops").style.zIndex = 460;
  const ptRenderer = L.canvas({ pane: "pt", padding: 0.2 });
  const ptLayer = L.layerGroup().addTo(map);
  const ptControl = L.control({ position: "topright" });
  ptControl.onAdd = () => {
    const div = L.DomUtil.create("div", "ptbox");
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
  };
  if (P) ptControl.addTo(map);

  function buildPtBox() {
    if (!P) return;
    const box = ptControl.getContainer();
    box.innerHTML = `<p class="pttitle">${t("ptTitle")}</p>` + PT_MODES.map((m) => {
      const n = P[m.grp].lines.filter((l) => l.m === m.k).length;
      const sw = m.k === "bus" ? `<i class="ptsw" style="background:${isDark() ? m.colorDark : m.color}"></i>`
        : `<i class="ptsw multi ${m.k}"></i>`;
      return `<label><input type="checkbox" data-k="${m.k}" ${ptOn.has(m.k) ? "checked" : ""}>${sw}<span>${t("pt")[m.k]}</span><span class="muted mono">${n}</span></label>`;
    }).join("");
    box.querySelectorAll("input").forEach((cb) => {
      cb.onchange = () => { cb.checked ? ptOn.add(cb.dataset.k) : ptOn.delete(cb.dataset.k); drawPt(); };
    });
  }

  function drawPt() {
    ptLayer.clearLayers();
    if (!P) return;
    const halo = css("--surface"), ink = css("--ink");
    for (const m of PT_MODES) {
      if (!ptOn.has(m.k)) continue;
      const lines = P[m.grp].lines.filter((l) => l.m === m.k);
      const maxT = Math.max(1, ...lines.map((l) => l.t));
      for (const l of [...lines].sort((a, b) => a.t - b.t)) {
        const w = m.w || 0.8 + 2.6 * Math.sqrt(l.t / maxT);
        const color = l.c || (isDark() ? m.colorDark : m.color);
        const tip = `<strong>${t("pt")[m.k]} ${l.n}</strong>${l.ln && l.ln !== l.n ? `<br>${l.ln}` : ""}<br>${fmt(l.t)} ${t("ptTrips")}`;
        L.polyline(l.g, { renderer: ptRenderer, pane: "pt", color: halo, weight: w + 3, opacity: 0.9, interactive: false }).addTo(ptLayer);
        L.polyline(l.g, { renderer: ptRenderer, pane: "pt", color, weight: w, opacity: 0.95, lineCap: "round", lineJoin: "round" })
          .bindTooltip(tip, { sticky: true }).addTo(ptLayer);
      }
    }
    const stopGroups = new Set(PT_MODES.filter((m) => ptOn.has(m.k) && m.k !== "bus").map((m) => m.grp));
    for (const g of stopGroups) {
      for (const st of P[g].stops) {
        L.circleMarker(st.c, { pane: "ptStops", radius: g === "rail" ? 4 : 3, weight: 1.5, color: ink, fillColor: halo, fillOpacity: 1 })
          .bindTooltip(st.n).addTo(ptLayer);
      }
    }
  }

  // ---------- gráfica horaria (barras apiladas por motivo) ----------
  function drawProfile(series) {
    const svg = $("#prof"), W = svg.clientWidth || 360, Hh = 210;
    const m = { l: 44, r: 6, t: 8, b: 22 }, iw = W - m.l - m.r, ih = Hh - m.t - m.b;
    const tot = series[0].map((_, h) => series.reduce((s, r, k) => s + (S.mot[k] ? r[h] : 0), 0));
    const max = Math.max(1, ...tot), bw = iw / H, gap = 2;
    const step = niceStep(max / 4), ymax = Math.ceil(max / step) * step;
    const y = (v) => m.t + ih - (v / ymax) * ih;
    const ns = "http://www.w3.org/2000/svg";
    svg.setAttribute("viewBox", `0 0 ${W} ${Hh}`);
    svg.replaceChildren();
    const el = (n, a) => { const e = document.createElementNS(ns, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
    for (let v = 0; v <= ymax; v += step) {
      svg.append(el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), stroke: v ? css("--grid") : css("--axis"), "stroke-width": 1 }));
      const tx = el("text", { x: m.l - 6, y: y(v) + 3, "text-anchor": "end" }); tx.textContent = short(v); svg.append(tx);
    }
    for (let h = 0; h < H; h += 3) {
      const tx = el("text", { x: m.l + h * bw + bw / 2, y: Hh - 6, "text-anchor": "middle" }); tx.textContent = h; svg.append(tx);
    }
    const colors = [css("--m0"), css("--m1"), css("--m2")];
    for (let h = 0; h < H; h++) {
      const inRange = h >= S.from && h <= S.to;
      const g = el("g", { opacity: inRange ? 1 : 0.28 });
      let acc = 0; const visible = [0, 1, 2].filter((k) => S.mot[k] && series[k][h] > 0);
      visible.forEach((k, j) => {
        const v = series[k][h], y0 = y(acc), y1 = y(acc + v);
        const top = j === visible.length - 1;
        const hgt = Math.max(0, y0 - y1 - (j > 0 ? gap : 0));
        const x = m.l + h * bw + 1, w = Math.max(1, bw - 2);
        if (top && hgt > 4) {
          const r = Math.min(4, w / 2);
          g.append(el("path", { d: `M${x},${y0 - (j > 0 ? gap : 0)}V${y1 + r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 + r}V${y0 - (j > 0 ? gap : 0)}Z`, fill: colors[k] }));
        } else {
          g.append(el("rect", { x, y: y1, width: w, height: hgt, fill: colors[k] }));
        }
        acc += v;
      });
      const hit = el("rect", { x: m.l + h * bw, y: m.t, width: bw, height: ih, fill: "transparent" });
      hit.addEventListener("mousemove", (ev) => showTip(ev, h, series, tot[h]));
      hit.addEventListener("mouseleave", () => ($("#tip").hidden = true));
      g.append(hit);
      svg.append(g);
    }
  }
  function niceStep(x) {
    const p = Math.pow(10, Math.floor(Math.log10(x))), r = x / p;
    return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p;
  }
  function short(v) {
    if (v >= 1e6) return (v / 1e6).toLocaleString(S.lang, { maximumFractionDigits: 1 }) + "M";
    if (v >= 1e3) return Math.round(v / 1e3) + "k";
    return String(v);
  }
  function showTip(ev, h, series, total) {
    const tip = $("#tip"), box = $(".chartbox").getBoundingClientRect();
    const colors = [css("--m0"), css("--m1"), css("--m2")];
    tip.innerHTML = `<b>${String(h).padStart(2, "0")}:00–${String(h + 1).padStart(2, "0")}:00</b>` +
      [0, 1, 2].filter((k) => S.mot[k]).map((k) =>
        `<div><span><i style="background:${colors[k]}"></i>${t("mot")[k]}</span><span class="mono">${fmt(series[k][h])}</span></div>`).join("") +
      `<div style="margin-top:4px;border-top:1px solid var(--grid);padding-top:4px"><span>${t("total")}</span><span class="mono">${fmt(total)}</span></div>`;
    tip.hidden = false;
    let x = ev.clientX - box.left + 12;
    if (x + 180 > box.width) x = ev.clientX - box.left - 182;
    tip.style.left = x + "px"; tip.style.top = Math.max(0, ev.clientY - box.top - 40) + "px";
  }

  // ---------- render ----------
  function update() {
    const { flows, zout, zin } = compute();
    const name = (i) => D.zones[i].name;
    const sel = S.sel;
    const dirOut = S.map === "gen";

    // valores del coroplético
    if (sel === null) {
      zoneVals = dirOut ? zout : zin;
      $("#ch-title").textContent = dirOut ? t("chGen") : t("chAtr");
    } else {
      zoneVals = new Float64Array(NZ);
      D.pairs.forEach(([o, d], k) => {
        if (dirOut && o === sel) zoneVals[d] = flows[k];
        if (!dirOut && d === sel) zoneVals[o] = flows[k];
      });
      $("#ch-title").textContent = dirOut ? t("chFrom")(name(sel)) : t("chTo")(name(sel));
    }
    breaks = quantileBreaks(zoneVals);
    styleZones();
    drawChLegend();

    // líneas
    let idx = D.pairs.map((_, k) => k);
    if (sel !== null) idx = idx.filter((k) => (dirOut ? D.pairs[k][0] : D.pairs[k][1]) === sel);
    idx = idx.filter((k) => flows[k] > 0).sort((a, b) => flows[b] - flows[a]);
    const shown = idx.slice(0, S.n);
    const max = shown.length ? flows[shown[0]] : 1;
    lineLayer.clearLayers();
    const ink = css("--line-ink"), halo = css("--surface");
    [...shown].reverse().forEach((k) => {
      const [o, d] = D.pairs[k], v = flows[k], pts = curve(D.zones[o].c, D.zones[d].c);
      // halo del color de fondo para que la línea se lea sobre el coroplético
      L.polyline(pts, { renderer: lineRenderer, color: halo, weight: widthFor(v, max) + 2.5, opacity: 0.55, lineCap: "round", interactive: false })
        .addTo(lineLayer);
      L.polyline(pts, {
        renderer: lineRenderer, color: ink, weight: widthFor(v, max),
        opacity: 0.55 + 0.4 * (v / max), lineCap: "round",
      }).bindTooltip(`<strong>${name(o)} → ${name(d)}</strong><br>${fmt(v)} ${t("trips")}`, { sticky: true })
        .addTo(lineLayer);
    });
    drawLnLegend(max);

    selLayer.clearLayers();
    if (sel !== null) {
      L.circleMarker(D.zones[sel].c, { radius: 5, color: css("--surface"), weight: 2, fillColor: ink, fillOpacity: 1, interactive: false }).addTo(selLayer);
    }

    // KPIs
    const shownSum = shown.reduce((s, k) => s + flows[k], 0);
    let k1, k2, base;
    if (sel === null) {
      k1 = zout.reduce((a, b) => a + b, 0);
      k2 = idx.reduce((s, k) => s + flows[k], 0);
      base = k2;
      $("#k1-l").textContent = t("kGenArea"); $("#k2-l").textContent = t("kInter");
    } else {
      k1 = dirOut ? zout[sel] : zin[sel];
      k2 = idx.reduce((s, k) => s + flows[k], 0);
      base = k2;
      $("#k1-l").textContent = dirOut ? t("kGenSel") : t("kAtrSel");
      $("#k2-l").textContent = dirOut ? t("kOutSel") : t("kInSel");
    }
    $("#k1").textContent = fmt(k1);
    $("#k2").textContent = fmt(k2);
    $("#k3").textContent = base ? `${((shownSum / base) * 100).toLocaleString(S.lang, { maximumFractionDigits: 1 })} %` : "–";

    // perfil horario
    const d = D[S.tipo], series = [0, 1, 2].map(() => new Array(H).fill(0));
    const src = sel === null || dirOut ? d.zout : d.zin;
    const rows = sel === null ? [...Array(NZ).keys()] : [sel];
    for (const r of rows) for (let m = 0; m < 3; m++) for (let h = 0; h < H; h++) series[m][h] += src[r * NC + m * H + h];
    $("#prof-title").textContent = sel === null ? t("profArea") : dirOut ? t("profGen")(name(sel)) : t("profAtr")(name(sel));
    drawProfile(series);

    // tabla
    $("#top").replaceChildren(...shown.slice(0, 10).map((k, j) => {
      const [o, dd] = D.pairs[k], tr = document.createElement("tr");
      tr.innerHTML = `<td>${j + 1}</td><td>${name(o)} → ${name(dd)}</td><td class="num mono">${fmt(flows[k])}</td>`;
      tr.onclick = () => map.fitBounds(L.latLngBounds([D.zones[o].c, D.zones[dd].c]).pad(0.6));
      return tr;
    }));

    $("#sel-chip").hidden = sel === null;
    $("#hint").hidden = sel !== null;
    if (sel !== null) $("#sel-name").textContent = name(sel);
  }

  function drawChLegend() {
    const ramp = isDark() ? RAMP_D : RAMP_L, off = ramp.length - 1 - breaks.length;
    const box = $("#ch-legend"); box.replaceChildren();
    for (let i = 0; i <= breaks.length; i++) {
      const c = document.createElement("div");
      const sw = document.createElement("i"); sw.style.background = ramp[i + off];
      const lb = document.createElement("span");
      lb.textContent = i === 0 ? `< ${short(breaks[0] ?? 0)}` : `${short(breaks[i - 1])}+`;
      c.append(sw, lb); box.append(c);
    }
  }
  function drawLnLegend(max) {
    const svg = $("#ln-legend"), ns = "http://www.w3.org/2000/svg", ink = css("--line-ink");
    svg.replaceChildren();
    [max * 0.1, max * 0.4, max].forEach((v, i) => {
      const x = 8 + i * 76;
      const p = document.createElementNS(ns, "line");
      Object.entries({ x1: x, x2: x + 44, y1: 12, y2: 12, stroke: ink, "stroke-width": widthFor(v, max), "stroke-linecap": "round", opacity: 0.55 + 0.4 * (v / max) })
        .forEach(([k, val]) => p.setAttribute(k, val));
      const tx = document.createElementNS(ns, "text");
      tx.setAttribute("x", x); tx.setAttribute("y", 34); tx.textContent = fmt(nice(v));
      svg.append(p, tx);
    });
  }

  // ---------- controles ----------
  function setSeg(id, key) {
    document.querySelectorAll(`#${id} button`).forEach((b) => {
      b.onclick = () => { S[key] = b.dataset.v; syncControls(); update(); };
    });
  }
  setSeg("f-tipo", "tipo");
  setSeg("f-map", "map");

  const hf = $("#h-from"), ht = $("#h-to");
  for (let h = 0; h < H; h++) {
    hf.add(new Option(`${String(h).padStart(2, "0")}:00`, h));
    ht.add(new Option(`${String(h + 1).padStart(2, "0")}:00`, h));
  }
  hf.onchange = () => { S.from = +hf.value; if (S.from > S.to) S.to = S.from; syncControls(); update(); };
  ht.onchange = () => { S.to = +ht.value; if (S.to < S.from) S.from = S.to; syncControls(); update(); };
  document.querySelectorAll("#h-presets button").forEach((b) => {
    b.onclick = () => { [S.from, S.to] = b.dataset.r.split(",").map(Number); syncControls(); update(); };
  });

  function buildMot() {
    $("#f-mot").replaceChildren(...[0, 1, 2].map((k) => {
      const b = document.createElement("button");
      b.innerHTML = `<i class="sw" style="background:var(--m${k})"></i>${t("mot")[k]}`;
      b.className = S.mot[k] ? "" : "off";
      b.setAttribute("aria-pressed", S.mot[k]);
      b.onclick = () => {
        S.mot[k] = !S.mot[k];
        if (!S.mot.some(Boolean)) S.mot[k] = true;   // al menos un motivo activo
        buildMot(); update();
      };
      return b;
    }));
    $("#prof-legend").innerHTML = [0, 1, 2].filter((k) => S.mot[k])
      .map((k) => `<span><i style="background:var(--m${k})"></i>${t("mot")[k]}</span>`).join("");
  }

  $("#f-n").oninput = (e) => { S.n = +e.target.value; $("#n-val").textContent = S.n; update(); };
  $("#sel-clear").onclick = () => { S.sel = null; update(); };

  function syncControls() {
    document.querySelectorAll("#f-tipo button").forEach((b) => b.classList.toggle("on", b.dataset.v === S.tipo));
    document.querySelectorAll("#f-map button").forEach((b) => b.classList.toggle("on", b.dataset.v === S.map));
    hf.value = S.from; ht.value = S.to;
    document.querySelectorAll("#h-presets button").forEach((b) => b.classList.toggle("on", b.dataset.r === `${S.from},${S.to}`));
    $("#n-val").textContent = S.n;
  }

  function applyLang() {
    document.documentElement.lang = S.lang;
    document.querySelectorAll("[data-t]").forEach((n) => { const v = t(n.dataset.t); if (typeof v === "string") n.textContent = v; });
    $("#lang").textContent = S.lang === "es" ? "EN" : "ES";
    buildMot(); buildPtBox(); drawPt();
  }
  $("#lang").onclick = () => { S.lang = S.lang === "es" ? "en" : "es"; store.set("lang", S.lang); applyLang(); update(); };

  function applyTheme() { map.getContainer().classList.toggle("dark", isDark()); buildPtBox(); drawPt(); }
  const saved = store.get("theme"); if (saved) document.documentElement.dataset.theme = saved;
  $("#theme").onclick = () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next; store.set("theme", next);
    applyTheme(); update();
  };
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { applyTheme(); update(); });

  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(update, 150); });

  // enlaces directos: ?lang=en&theme=dark&tipo=nolab&sel=4625011&mapa=atr&h=7-9&tp=metro,tram,rail,bus
  const q = new URLSearchParams(location.search);
  if (q.get("lang") in T) S.lang = q.get("lang");
  if (["light", "dark"].includes(q.get("theme"))) document.documentElement.dataset.theme = q.get("theme");
  if (["lab", "nolab"].includes(q.get("tipo"))) S.tipo = q.get("tipo");
  if (["gen", "atr"].includes(q.get("mapa"))) S.map = q.get("mapa");
  const qi = D.zones.findIndex((z) => z.id === q.get("sel"));
  if (qi >= 0) S.sel = qi;
  if (q.has("tp")) ptOn.clear();   // ?tp=metro,rail limita las capas; ?tp= las apaga todas
  (q.get("tp") || "").split(",").forEach((k) => { if (PT_MODES.some((m) => m.k === k)) ptOn.add(k); });
  const qh = (q.get("h") || "").match(/^(\d{1,2})-(\d{1,2})$/);
  if (qh) { S.from = Math.min(23, +qh[1]); S.to = Math.max(S.from, Math.min(23, +qh[2])); }

  applyLang(); applyTheme(); syncControls(); update();
})();
