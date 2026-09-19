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

const CHILI_SVG = `<svg viewBox="0 0 24 24" class="tag-icon-svg" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c5-3 12-3 16 1 1.5 1.5 1 5-2 8-3.5 3.5-9.5 4.5-12.5 1.5C2.5 16.5 1 12 4 9Z"/><path d="M14 4c1.2-.6 2.6-.6 3.4.2.9.9.8 2.6-.2 3.8"/></svg>`;

function iconsFor(item) {
  let html = "";
  if (item.spicy) html += `<span class="tag tag-spicy" title="Spicy">${CHILI_SVG}</span>`;
  if (item.veg) html += '<span class="tag tag-veg" title="Vegetarian">V</span>';
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

// Every build-your-own option mapped to an illustration in images/ingredients/ (SVG).
const INGREDIENT_ICON = {
  "Penne": "penne", "Whole Wheat Penne": "penne-ww", "Gluten Free Penne": "penne-gf",
  "Linguine": "linguine", "Ravioli": "ravioli", "Gnocchi": "gnocchi",
  "Farfalle": "farfalle", "Conchiglie": "conchiglie", "Spaghetti": "spaghetti",
  "Fusilli": "fusilli", "Fettuccine": "fettuccine",

  "Marinara": "marinara", "Alfredo": "alfredo", "Pesto": "pesto", "Rose": "rose",
  "Bolognese": "bolognese", "Curry Cream": "currycream", "Pesto Cream": "pestocream",
  "Carbonara": "carbonara", "White Wine & Olive Oil": "whitewineoliveoil",

  "Bacon": "bacon", "Chorizo Sausage": "chorizo", "Chicken": "chicken",
  "Shrimp": "shrimp", "Anchovies": "anchovies", "Smoked Salmon": "smokedsalmon",
  "Meatballs (3 pcs) +$1.95": "meatballs", "Double Meat +$1.95": "doublemeat",

  "Tomatoes": "tomatoes", "Carrots": "carrots", "Black Olives": "blackolives",
  "Corn": "corn", "Spinach": "spinach", "Zucchini": "zucchini", "Peas": "peas",
  "Red Peppers": "redpeppers", "Mushrooms": "mushrooms", "Red Onions": "redonions",
  "Asparagus": "asparagus", "Artichokes": "artichokes", "Garlic": "garlic",
  "Broccoli": "broccoli", "Capers": "capers",

  "Parmesan +$1.95": "parmesan", "Goat Cheese +$1.95": "goatcheese",
  "Mozzarella +$1.95": "mozzarella", "Double Cheese +$1.95": "doublecheese", "Basil": "basil", "Parsley": "parsley",
  "Oregano": "oregano"
};

function renderIngredientGrid(options) {
  return `<div class="pasta-icon-grid">${options.map(name => {
    const key = INGREDIENT_ICON[name];
    return `
      <div class="pasta-icon-card">
        <div class="pasta-icon-circle">
          ${key ? `<img src="images/ingredients/${key}.svg" alt="${name}" class="pasta-icon-photo">` : ""}
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

  MENU_DATA.buildYourOwn.steps.forEach((step) => {
    const stepEl = document.createElement("div");
    stepEl.className = "byo-step reveal byo-step-wide";
    stepEl.innerHTML = `
      <div class="byo-step-num">${step.step}</div>
      <div class="byo-step-body">
        <span class="byo-step-tag">Step ${step.step}</span>
        <h4>${step.title}</h4>
        ${renderIngredientGrid(step.options)}
        ${step.note ? `<p class="byo-note">${step.note}</p>` : ""}
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

function setupSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;

  let seen = false;
  try { seen = sessionStorage.getItem("basil_intro_seen") === "1"; } catch (e) {}

  if (seen) {
    splash.remove();
    return;
  }

  document.body.style.overflow = "hidden";
  window.setTimeout(() => {
    splash.classList.add("splash-hide");
    document.body.style.overflow = "";
    try { sessionStorage.setItem("basil_intro_seen", "1"); } catch (e) {}
    window.setTimeout(() => splash.remove(), 550);
  }, 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  setupSplash();
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
