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

function renderFanFavorites() {
  const el = document.getElementById("signature-grid");
  if (!el) return;

  const featured = [];
  MENU_DATA.categories.forEach(cat => {
    cat.items.forEach(item => {
      if (item.featured && item.image) featured.push(item);
    });
  });

  featured.forEach(item => {
    const card = document.createElement("a");
    card.className = "dish-card reveal";
    card.href = "#menu";
    card.innerHTML = `
      <div class="dish-card-img" style="background-image:url('${item.image}')"></div>
      <div class="dish-card-body">
        <h3>${item.name} ${iconsFor(item)}</h3>
        <span class="dish-card-price">${priceLabel(item)}</span>
      </div>
    `;
    el.appendChild(card);
  });
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

function renderBuildYourOwn() {
  const el = document.getElementById("byo-steps");
  if (!el) return;

  const img = document.getElementById("byo-image");
  if (img && MENU_DATA.buildYourOwn.image) {
    img.style.backgroundImage = `url('${MENU_DATA.buildYourOwn.image}')`;
  }

  MENU_DATA.buildYourOwn.steps.forEach((step, i) => {
    const stepEl = document.createElement("div");
    stepEl.className = "byo-step reveal";
    stepEl.innerHTML = `
      <div class="byo-step-num">${STEP_ICONS[i] || step.step}</div>
      <div class="byo-step-body">
        <span class="byo-step-tag">Step ${step.step}</span>
        <h4>${step.title}</h4>
        <div class="byo-options">
          ${step.options.map(o => `<span class="byo-chip">${o}</span>`).join("")}
        </div>
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

const DELIVERY_META = {
  "Uber Eats": { icon: "🚗", cls: "delivery-ubereats" },
  "SkipTheDishes": { icon: "🛵", cls: "delivery-skip" },
  "DoorDash": { icon: "🚪", cls: "delivery-doordash" },
  "Food.ee (Teams & Groups)": { icon: "👥", cls: "delivery-foodee" }
};

function renderDelivery() {
  const el = document.getElementById("delivery-links");
  if (!el) return;
  MENU_DATA.deliveryPlatforms.forEach(p => {
    const meta = DELIVERY_META[p.name] || { icon: "🍝", cls: "" };
    const a = document.createElement("a");
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "delivery-btn " + meta.cls;
    a.innerHTML = `<span class="delivery-icon">${meta.icon}</span><span>${p.name}</span>`;
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
  renderFanFavorites();
  renderMenu();
  renderBuildYourOwn();
  renderDelivery();
  setupNav();
  setupHeaderShrink();
  setupScrollReveal();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
