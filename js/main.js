// Basil Pasta Bar — site behavior + menu rendering from menu-data.js

function money(n) {
  return "$" + n.toFixed(2);
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

    const list = document.createElement("div");
    list.className = "menu-list";

    cat.items.forEach(item => {
      const row = document.createElement("div");
      row.className = "menu-item";
      row.innerHTML = `
        <div class="menu-item-head">
          <h4>${item.name} ${iconsFor(item)}</h4>
          <span class="menu-item-price">${money(item.price)}</span>
        </div>
        ${item.desc ? `<p class="menu-item-desc">${item.desc}</p>` : ""}
      `;
      list.appendChild(row);
    });

    panel.appendChild(list);
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

function renderBuildYourOwn() {
  const el = document.getElementById("byo-steps");
  if (!el) return;

  MENU_DATA.buildYourOwn.steps.forEach(step => {
    const stepEl = document.createElement("div");
    stepEl.className = "byo-step";
    stepEl.innerHTML = `
      <div class="byo-step-num">${step.step}</div>
      <div class="byo-step-body">
        <h4>${step.title}</h4>
        <p class="byo-options">${step.options.join(" &nbsp;·&nbsp; ")}</p>
        ${step.note ? `<p class="byo-note">${step.note}</p>` : ""}
      </div>
    `;
    el.appendChild(stepEl);
  });

  const priceEl = document.getElementById("byo-price");
  if (priceEl) {
    priceEl.innerHTML = `Starting at <strong>${money(MENU_DATA.buildYourOwn.startingPrice)}</strong><br><span class="byo-pricenote">${MENU_DATA.buildYourOwn.priceNote}</span>`;
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
    a.textContent = p.name;
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

document.addEventListener("DOMContentLoaded", () => {
  renderRestaurantInfo();
  renderMenu();
  renderBuildYourOwn();
  renderDelivery();
  setupNav();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
