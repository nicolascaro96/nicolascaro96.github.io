(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  let lang = store.get("lang") || ((navigator.language || "en").startsWith("es") ? "es" : "en");
  let activeTag = null;

  const t = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.en : v);
  const path = (obj, p) => p.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

  function renderStatic() {
    document.documentElement.lang = lang;
    $$("[data-bind]").forEach((n) => (n.textContent = t(SITE[n.dataset.bind])));
    $$("[data-i18n]").forEach((n) => {
      const key = n.dataset.i18n;
      n.textContent = t(path(UI, key) ?? SITE[key]);
    });
    $("#lang-toggle").textContent = lang === "en" ? "ES" : "EN";
    $("#cv-link").href = SITE.cvFile;
    const img = $("#photo");
    img.src = SITE.photo;
    img.alt = SITE.name;
    img.onerror = () => img.parentElement.classList.add("no-photo");
    $("#year").textContent = new Date().getFullYear();
  }

  function renderAbout() {
    const body = $("#about-body");
    body.replaceChildren(...t(SITE.about).map((p) => el("p", null, p)));
    $("#stats").replaceChildren(
      ...SITE.stats.map((s) => {
        const d = el("div", "stat");
        d.append(el("strong", null, s.value), el("span", null, t(s.label)));
        return d;
      })
    );
  }

  function renderExperience() {
    $("#experience-list").replaceChildren(
      ...SITE.experience.map((x) => {
        const li = el("li", "tl-item");
        const head = el("div", "tl-head");
        head.append(el("h3", null, t(x.title)), el("span", "mono muted", t(x.period)));
        const meta = el("p", "tl-meta", [x.company, x.location].filter(Boolean).join(" · "));
        const ul = el("ul", "bullets");
        t(x.bullets).forEach((b) => ul.append(el("li", null, b)));
        li.append(head, meta, ul);
        return li;
      })
    );
  }

  function renderProjects() {
    const tags = [...new Set(SITE.projects.flatMap((p) => p.tags))];
    const filters = $("#project-filters");
    const mk = (label, tag) => {
      const b = el("button", "chip" + (activeTag === tag ? " active" : ""), label);
      b.onclick = () => { activeTag = tag; renderProjects(); };
      return b;
    };
    filters.replaceChildren(mk(t(UI.all), null), ...tags.map((g) => mk(g, g)));

    const list = SITE.projects.filter((p) => !activeTag || p.tags.includes(activeTag));
    $("#project-grid").replaceChildren(
      ...list.map((p) => {
        const card = el(p.link ? "a" : "article", "card");
        if (p.link) { card.href = p.link; card.target = "_blank"; card.rel = "noopener"; }
        if (p.image) {
          const im = el("img", "card-img");
          im.src = p.image; im.alt = ""; im.loading = "lazy";
          card.append(im);
        }
        const body = el("div", "card-body");
        body.append(
          el("p", "mono muted small", [p.client, p.year].filter(Boolean).join(" · ")),
          el("h3", null, t(p.title)),
          el("p", null, t(p.description))
        );
        const tg = el("div", "tags");
        p.tags.forEach((x) => tg.append(el("span", "tag", x)));
        body.append(tg);
        card.append(body);
        return card;
      })
    );
  }

  function renderSkills() {
    $("#skills-grid").replaceChildren(
      ...SITE.skills.map((g) => {
        const box = el("div", "skill-group");
        box.append(el("h3", null, t(g.group)));
        const tg = el("div", "tags");
        g.items.forEach((i) => tg.append(el("span", "tag", i)));
        box.append(tg);
        return box;
      })
    );
  }

  function renderEducation() {
    $("#education-list").replaceChildren(
      ...SITE.education.map((e) => {
        const li = el("li");
        const left = el("div");
        left.append(el("strong", null, t(e.degree)), el("span", "muted", e.school));
        li.append(left, el("span", "mono muted", e.period));
        return li;
      })
    );
    $("#courses-list").replaceChildren(...SITE.courses.map((c) => el("li", null, t(c))));
    $("#languages-list").replaceChildren(
      ...SITE.languages.map((l) => {
        const li = el("li");
        li.append(el("strong", null, t(l.name)), el("span", "muted", t(l.level)));
        return li;
      })
    );
  }

  function renderContact() {
    $("#contact-list").replaceChildren(
      ...SITE.contact.map((c) => {
        const li = el("li");
        const a = el("a", null, c.value);
        a.href = c.href;
        if (!c.href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener"; }
        li.append(el("span", "mono muted", c.label), a);
        return li;
      })
    );
  }

  function render() {
    renderStatic(); renderAbout(); renderExperience();
    renderProjects(); renderSkills(); renderEducation(); renderContact();
  }

  // theme
  const savedTheme = store.get("theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  $("#theme-toggle").onclick = () => {
    const cur = document.documentElement.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("theme", next);
    document.dispatchEvent(new CustomEvent("themechange"));
  };

  $("#lang-toggle").onclick = () => {
    lang = lang === "en" ? "es" : "en";
    store.set("lang", lang);
    render();
    document.dispatchEvent(new CustomEvent("langchange"));
  };

  render();
})();
