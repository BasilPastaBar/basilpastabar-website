// Basil Pasta Bar — site behavior + menu rendering from menu-data.js

function money(n) {
  return "$" + n.toFixed(2);
}

function priceLabel(item) {
  if (item.sizes) {
    return item.sizes.map(s => `${s.label} ${money(s.price)}`).join(" · ");
  }
  return money(item.price);
}

function iconsFor(item) {
  let html = "";
  if (item.spicy) html += '<span class="tag tag-spicy" title="Spicy">🌶️</span>';
  if (item.veg) html += '<span class="tag tag-veg" title="Vegetarian">🌿 V</span>';
  return html;
}

function renderMenu() {
  const tabsEl = document.getElementById("menu-tabs");
  const panelsEl = document.getElementById("menu-panels");
  if (!tabsEl || !panelsEl) return;

  const noteEl = document.getElementById("menu-note");
  if (noteEl) noteEl.textContent = MENU_DATA.note;

  MENU_DATA.categories.forEach((cat, i) => {
    const tab = document.createElement("button");
    tab.className = "menu-tab" + (i === 0 ? " active" : "");
    tab.textContent = cat.name;
    tab.setAttribute("data-target", cat.id);
    tab.addEventListener("click", () => switchTab(cat.id));
    tabsEl.appendChild(tab);

    const panel = document.createElement("div");
    panel.className = "menu-panel" + (i === 0 ? " active" : "");
    panel.id = "panel-" + cat.id;

    const withPhoto = cat.items.filter(item => item.image);
    const withoutPhoto = cat.items.filter(item => !item.image);

    if (withPhoto.length) {
      const grid = document.createElement("div");
      grid.className = "dish-grid dish-grid-menu";
      withPhoto.forEach(item => {
        const card = document.createElement("div");
        card.className = "dish-card reveal";
        card.innerHTML = `
          <div class="dish-card-img" style="background-image:url('${item.image}')"></div>
          <div class="dish-card-body">
            <h3>${item.name} ${iconsFor(item)}</h3>
            <span class="dish-card-price">${priceLabel(item)}</span>
          </div>
        `;
        card.title = item.desc || "";
        grid.appendChild(card);
      });
      panel.appendChild(grid);
    }

    if (withoutPhoto.length) {
      const list = document.createElement("div");
      list.className = "menu-list";
      withoutPhoto.forEach(item => {
        const row = document.createElement("div");
        row.className = "menu-item";
        row.innerHTML = `
          <div class="menu-item-head">
            <h4>${item.name} ${iconsFor(item)}</h4>
            <span class="menu-item-price">${priceLabel(item)}</span>
          </div>
          ${item.desc ? `<p class="menu-item-desc">${item.desc}</p>` : ""}
        `;
        list.appendChild(row);
      });
      panel.appendChild(list);
    }

    panelsEl.appendChild(panel);
  });

  function switchTab(id) {
    document.querySelectorAll(".menu-tab").forEach(t => {
      t.classList.toggle("active", t.getAttribute("data-target") === id);
    });
    document.querySelectorAll(".menu-panel").forEach(p => {
      p.classList.toggle("active", p.id === "panel-" + id);
    });
  }
}

const STEP_ICONS = ["🍝", "🥫", "🍗", "🥦", "🧀"];

const PASTA_ICON_SVGS = {
  penne: `<g fill="currentColor"><rect x="8" y="24" width="34" height="13" rx="6.5" transform="rotate(-28 25 30)"/><rect x="22" y="30" width="34" height="13" rx="6.5" transform="rotate(-28 39 36)"/></g>`,
  spaghetti: `<g stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M16 10 C 14 22, 18 34, 16 54"/><path d="M26 8 C 24 22, 28 36, 26 56"/><path d="M36 8 C 34 22, 38 36, 36 56"/><path d="M46 10 C 44 22, 48 34, 46 54"/></g>`,
  linguine: `<g stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round"><path d="M20 10 C 19 26, 21 38, 20 54"/><path d="M32 8 C 31 26, 33 38, 32 56"/><path d="M44 10 C 43 26, 45 38, 44 54"/></g>`,
  fettuccine: `<g stroke="currentColor" stroke-width="10" fill="none" stroke-linecap="round"><path d="M22 10 C 20 26, 24 38, 22 54"/><path d="M42 10 C 40 26, 44 38, 42 54"/></g>`,
  fusilli: `<g stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"><path d="M22 8 C 34 14, 10 20, 22 26 C 34 32, 10 38, 22 44 C 34 50, 10 56, 22 58"/><path d="M42 8 C 30 14, 54 20, 42 26 C 30 32, 54 38, 42 44 C 30 50, 54 56, 42 58"/></g>`,
  ravioli: `<g><rect x="12" y="12" width="40" height="40" rx="8" fill="currentColor" opacity="0.18"/><rect x="12" y="12" width="40" height="40" rx="8" fill="none" stroke="currentColor" stroke-width="3.5" stroke-dasharray="5 4"/><circle cx="32" cy="32" r="6" fill="currentColor"/></g>`,
  gnocchi: `<g><ellipse cx="22" cy="40" rx="13" ry="10" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="3"/><ellipse cx="36" cy="30" rx="13" ry="10" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="3"/><ellipse cx="44" cy="44" rx="13" ry="10" fill="currentColor" opacity="0.28" stroke="currentColor" stroke-width="3"/><path d="M38 42 l6 -6 M41 47 l6 -6 M44 51 l5 -5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></g>`,
  farfalle: `<g fill="currentColor"><path d="M10 16 L28 32 L10 48 Z" opacity="0.9"/><path d="M54 16 L36 32 L54 48 Z" opacity="0.9"/><rect x="26" y="25" width="12" height="14" rx="4"/></g>`,
  conchiglie: `<g><path d="M32 10 C 46 16, 52 34, 42 52 C 34 58, 24 58, 16 50 C 8 40, 14 20, 32 10 Z" fill="currentColor" opacity="0.22" stroke="currentColor" stroke-width="3"/><path d="M32 14 L30 52 M25 16 L20 48 M39 16 L44 48" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></g>`
};

const PASTA_NAME_TO_ICON = {
  "Penne": "penne",
  "Whole Wheat Penne": "penne",
  "Gluten Free Penne": "penne",
  "Linguine": "linguine",
  "Ravioli": "ravioli",
  "Gnocchi": "gnocchi",
  "Farfalle": "farfalle",
  "Conchiglie": "conchiglie",
  "Spaghetti": "spaghetti",
  "Fusilli": "fusilli",
  "Fettuccine": "fettuccine"
};

function renderPastaGrid(options) {
  return `<div class="pasta-icon-grid">${options.map(name => {
    const key = PASTA_NAME_TO_ICON[name];
    const svg = key ? PASTA_ICON_SVGS[key] : "";
    return `
      <div class="pasta-icon-card">
        <div class="pasta-icon-circle">
          <svg viewBox="0 0 64 64" class="pasta-icon">${svg}</svg>
        </div>
        <span class="pasta-icon-label">${name}</span>
      </div>
    `;
  }).join("")}</div>`;
}

function renderBuildYourOwn() {
  const el = document.getElementById("byo-steps");
  if (!el) return;

  const img = document.getElementById("byo-image");
  if (img && MENU_DATA.buildYourOwn.image) {
    img.style.backgroundImage = `url('${MENU_DATA.buildYourOwn.image}')`;
  }

  MENU_DATA.buildYourOwn.steps.forEach((step, i) => {
    const stepEl = document.createElement("div");
    stepEl.className = "byo-step reveal" + (step.visual ? " byo-step-wide" : "");
    stepEl.innerHTML = `
      <div class="byo-step-num">${STEP_ICONS[i] || step.step}</div>
      <div class="byo-step-body">
        <span class="byo-step-tag">Step ${step.step}</span>
        <h4>${step.title}</h4>
        ${step.visual ? renderPastaGrid(step.options) : `
        <div class="byo-options">
          ${step.options.map(o => `<span class="byo-chip">${o}</span>`).join("")}
        </div>`}
        ${step.note ? `<p class="byo-note">🌶️ ${step.note}</p>` : ""}
      </div>
    `;
    el.appendChild(stepEl);
  });

  const priceEl = document.getElementById("byo-price");
  if (priceEl) {
    priceEl.innerHTML = `
      <div class="byo-stamp">
        <span class="byo-stamp-label">Start at</span>
        <span class="byo-stamp-price">${money(MENU_DATA.buildYourOwn.startingPrice)}</span>
      </div>
      <p class="byo-pricenote">${MENU_DATA.buildYourOwn.priceNote}</p>
    `;
  }
}

function renderDelivery() {
  const el = document.getElementById("delivery-links");
  if (!el) return;
  MENU_DATA.deliveryPlatforms.forEach(p => {
    const a = document.createElement("a");
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "delivery-btn";
    a.innerHTML = `<img class="delivery-logo" src="${p.logo}" alt="${p.name}">`;
    el.appendChild(a);
  });
}

function renderRestaurantInfo() {
  const r = MENU_DATA.restaurant;

  document.querySelectorAll("[data-field='phone']").forEach(elm => {
    elm.textContent = r.phoneDisplay;
    if (elm.tagName === "A") elm.href = "tel:" + r.phone.replace(/[^0-9+]/g, "");
  });
  document.querySelectorAll("[data-field='address']").forEach(elm => elm.textContent = r.address);
  document.querySelectorAll("[data-field='established']").forEach(elm => elm.textContent = r.established);

  const hoursEl = document.getElementById("hours-list");
  if (hoursEl) {
    r.hours.forEach(h => {
      const row = document.createElement("div");
      row.className = "hours-row";
      row.innerHTML = `<span>${h.days}</span><span>${h.time}</span>`;
      hoursEl.appendChild(row);
    });
  }

  const fb = document.getElementById("social-facebook");
  const tw = document.getElementById("social-twitter");
  const ig = document.getElementById("social-instagram");
  if (fb) fb.href = r.social.facebook;
  if (tw) tw.href = r.social.twitter;
  if (ig) ig.href = r.social.instagram;
}

function setupNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    toggle.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
    });
  });
}

function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach(i => i.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  items.forEach(i => io.observe(i));
}

function setupHeaderShrink() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  renderRestaurantInfo();
  renderMenu();
  renderBuildYourOwn();
  renderDelivery();
  setupNav();
  setupHeaderShrink();
  setupScrollReveal();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
