#!/usr/bin/env node
/*
  Basil Pasta Bar — SEO build script (no dependencies).

  Run after ANY change to js/menu-data.js:   node build.js

  It regenerates, straight from menu-data.js:
    - /menu/, /build-your-own-pasta/, /order-online/ (crawlable static pages)
    - the SEO <head> block, JSON-LD structured data, FAQ and hours inside index.html
    - sitemap.xml, robots.txt, 404.html, site.webmanifest
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const SITE = 'https://basilpastabar.com';
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };

// ---------- load data ----------
const DATA = vm.runInNewContext(read('js/menu-data.js').replace(/^const MENU_DATA/m, 'var MENU_DATA') + ';MENU_DATA');
const ICONS = vm.runInNewContext('(' + read('js/main.js').match(/const INGREDIENT_ICON = (\{[\s\S]*?\n\});/)[1] + ')');
const R = DATA.restaurant;
const GEO = { lat: 49.2767875, lng: -123.1258792 };
const POSTAL = 'V6B 2G5';
const PHONE_E164 = '+16045683106';
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (n) => '$' + n.toFixed(2);
const priceText = (item) => item.sizes ? item.sizes.map((s) => `${s.label} ${money(s.price)}`).join(' · ') : money(item.price);
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const stripPrice = (s) => s.replace(/\s*\+\$[\d.]+/, '').replace(/\s*\(3 pcs\)/, '');

const allItems = DATA.categories.flatMap((c) => c.items.map((i) => ({ ...i, cat: c })));
const pastaPrices = DATA.categories.filter((c) => c.id === 'house-specials' || c.id === 'vegetarian').flatMap((c) => c.items).map((i) => i.price).filter(Boolean);
const minPasta = Math.min(...pastaPrices), maxPasta = Math.max(...pastaPrices);
const BYO = DATA.buildYourOwn;

const HOURS_TEXT = R.hours.map((h) => `${h.days} ${h.time}`).join('; ');
const HOURS_SPEC = [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '11:30', closes: '23:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '11:30', closes: '02:00' }
];

// ---------- structured data ----------
const restaurantRef = { '@id': SITE + '/#restaurant' };
const restaurantLd = () => ({
  '@type': 'Restaurant',
  '@id': SITE + '/#restaurant',
  name: 'Basil Pasta Bar',
  alternateName: ['Basil Pasta Bar Vancouver', 'Basil Pasta Bar Davie Street'],
  url: SITE + '/',
  description: "Basil Pasta Bar is Vancouver's first build-your-own pasta restaurant, serving fresh pasta to order on Davie Street since 2010 — dine-in, takeout and delivery.",
  slogan: 'tasty meets affordable.',
  foundingDate: '2010',
  logo: SITE + '/images/logo-full.png',
  image: [SITE + '/images/og-image.jpg', SITE + '/images/storefront.jpg', SITE + '/images/dishes/puttanesca.jpg', SITE + '/images/dishes/build-your-own.jpg'],
  telephone: PHONE_E164,
  priceRange: '$$',
  currenciesAccepted: 'CAD',
  servesCuisine: ['Italian', 'Pasta', 'Vegetarian'],
  address: { '@type': 'PostalAddress', streetAddress: '636 Davie Street', addressLocality: 'Vancouver', addressRegion: 'BC', postalCode: POSTAL, addressCountry: 'CA' },
  geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng },
  hasMap: 'https://www.google.com/maps/search/?api=1&query=636+Davie+Street+Vancouver+BC',
  areaServed: [{ '@type': 'City', name: 'Vancouver' }, { '@type': 'Place', name: 'Yaletown' }, { '@type': 'Place', name: 'Downtown Vancouver' }, { '@type': 'Place', name: 'West End, Vancouver' }],
  openingHoursSpecification: HOURS_SPEC,
  menu: SITE + '/menu/',
  sameAs: [R.social.facebook, R.social.twitter, R.social.instagram, ...DATA.deliveryPlatforms.map((p) => p.url)],
  potentialAction: { '@type': 'OrderAction', target: { '@type': 'EntryPoint', urlTemplate: SITE + '/order-online/', actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'] }, deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet', 'http://purl.org/goodrelations/v1#DeliveryModePickUp'] }
});

const menuLd = () => ({
  '@type': 'Menu',
  '@id': SITE + '/menu/#menu',
  name: 'Basil Pasta Bar Menu',
  url: SITE + '/menu/',
  inLanguage: 'en-CA',
  hasMenuSection: DATA.categories.map((c) => ({
    '@type': 'MenuSection',
    name: c.name,
    hasMenuItem: c.items.map((i) => {
      const offers = i.sizes
        ? i.sizes.map((s) => ({ '@type': 'Offer', name: s.label, price: s.price.toFixed(2), priceCurrency: 'CAD' }))
        : [{ '@type': 'Offer', price: i.price.toFixed(2), priceCurrency: 'CAD' }];
      const mi = { '@type': 'MenuItem', name: i.name, offers: offers.length === 1 ? offers[0] : offers };
      if (i.desc) mi.description = i.desc;
      if (i.image) mi.image = SITE + '/' + i.image;
      if (i.veg) mi.suitableForDiet = 'https://schema.org/VegetarianDiet';
      return mi;
    })
  }))
});

const crumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: SITE + it[1] }))
});

// ---------- FAQ (home) ----------
const FAQS = [
  ['Where is Basil Pasta Bar in Vancouver?', `Basil Pasta Bar is at 636 Davie Street, Vancouver, BC ${POSTAL}, near Davie and Seymour on the edge of Yaletown and downtown Vancouver.`],
  ['What are Basil Pasta Bar’s hours?', `We’re open Sunday to Thursday 11:30 AM – 11:00 PM and Friday and Saturday 11:30 AM – 2:00 AM. Delivery through the apps runs daily from 11:30 AM to 10:00 PM.`],
  ['Can I build my own pasta?', `Yes. Pick your pasta, sauce, protein, veggies and garnish — there’s no limit on toppings. Build-your-own pasta starts at ${money(BYO.startingPrice)} (${BYO.priceNote.replace(/^\+\s*/, '')}).`],
  ['Do you have vegetarian or gluten-free pasta in Vancouver?', 'Yes. Vegetarian pastas are marked on the menu, and you can build a fully vegetarian plate from our veggies, sauces and cheeses. Gluten-free penne is available for build-your-own pasta. Like it spicy? Just ask.'],
  ['Do you offer pasta delivery and takeout?', 'Yes. Order pasta for delivery through Uber Eats, SkipTheDishes or DoorDash, or call 1 (604) 568-3106 and pick it up at 636 Davie Street. Prices are for dine-in and takeout; delivery prices are slightly higher.'],
  ['How much is pasta at Basil Pasta Bar?', `Our house special and vegetarian pastas range from ${money(minPasta)} to ${money(maxPasta)}, and build-your-own pasta starts at ${money(BYO.startingPrice)}. See the full menu with current prices on our menu page.`]
];
const faqLd = () => ({ '@type': 'FAQPage', mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const faqHtml = () => `<section class="faq-section" id="faq">
  <div class="container narrow">
    <span class="section-label">Good to Know</span>
    <h2 class="section-title">Pasta in Vancouver: Your Questions</h2>
    <div class="faq">
${FAQS.map(([q, a]) => `      <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
    </div>
  </div>
</section>`;

const hoursHtml = () => R.hours.map((h) => `<div class="hours-row"><span>${esc(h.days)}</span><span>${esc(h.time)}</span></div>`).join('');

// ---------- <head> ----------
const head = ({ title, desc, path: p, ld }) => `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${p}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="theme-color" content="#142b20">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Basil Pasta Bar">
<meta property="og:locale" content="en_CA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${p}">
<meta property="og:image" content="${SITE}/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Basil Pasta Bar — build-your-own pasta on Davie Street, Vancouver">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/images/og-image.jpg">
<meta name="geo.region" content="CA-BC">
<meta name="geo.placename" content="Vancouver">
<meta name="geo.position" content="${GEO.lat};${GEO.lng}">
<meta name="ICBM" content="${GEO.lat}, ${GEO.lng}">
<link rel="icon" href="/images/favicon.png" type="image/png">
<link rel="icon" href="/images/favicon-48.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${jsonLd({ '@context': 'https://schema.org', '@graph': ld })}`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Caveat:wght@600;700&family=Baloo+Da+2:wght@500;600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

// ---------- shared page chrome ----------
const NAV = `<a href="/">Home</a>
      <a href="/menu/">Menu</a>
      <a href="/build-your-own-pasta/">Build Your Own</a>
      <a href="/order-online/">Delivery &amp; Takeout</a>
      <a href="/#location">Location &amp; Hours</a>
      <a href="/order-online/" class="btn-order">Order Online</a>`;
const header = () => `<header class="site-header" id="site-header">
  <div class="nav-wrap">
    <a href="/" class="brand"><img src="/images/logo-full.png" alt="Basil Pasta Bar — pasta restaurant in Vancouver" width="900" height="355"></a>
    <nav class="nav-links" id="nav-links" aria-label="Main">
      ${NAV}
    </nav>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
  </div>
</header>`;
const footerNav = `<nav class="footer-nav" aria-label="Footer">
      <a href="/">Home</a> <a href="/menu/">Menu &amp; Prices</a> <a href="/build-your-own-pasta/">Build Your Own Pasta</a> <a href="/order-online/">Pasta Delivery &amp; Takeout</a> <a href="/#location">Location &amp; Hours</a>
    </nav>`;
const footer = () => `<footer class="site-footer">
  <div class="container">
    <img src="/images/logo-full.png" alt="Basil Pasta Bar" class="footer-logo" width="900" height="355" loading="lazy">
    ${footerNav}
    <address class="footer-address">Basil Pasta Bar · 636 Davie Street, Vancouver, BC ${POSTAL} · <a href="tel:${PHONE_E164}">${esc(R.phoneDisplay)}</a></address>
    <div class="footer-social">
      <a href="${R.social.facebook}" target="_blank" rel="noopener" aria-label="Basil Pasta Bar on Facebook">f</a>
      <a href="${R.social.twitter}" target="_blank" rel="noopener" aria-label="Basil Pasta Bar on X (Twitter)">𝕏</a>
      <a href="${R.social.instagram}" target="_blank" rel="noopener" aria-label="Basil Pasta Bar on Instagram">◎</a>
    </div>
    <div class="footer-fine">&copy; ${new Date().getFullYear()} Basil Pasta Bar. All rights reserved.</div>
  </div>
</footer>`;

const page = ({ title, desc, path: p, ld, body, bodyClass = '' }) => `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${head({ title, desc, path: p, ld })}
${FONTS}
<link rel="stylesheet" href="/css/style.css">
</head>
<body class="${bodyClass}">
${header()}
<main>
${body}
</main>
${footer()}
<script src="/js/menu-data.js"></script>
<script src="/js/main.js"></script>
</body>
</html>
`;

const hero = ({ crumbs, h1, lead, cta }) => `<section class="page-hero">
  <div class="container">
    <p class="crumbs">${crumbs}</p>
    <h1>${h1}</h1>
    <p class="lead">${lead}</p>
    ${cta || ''}
  </div>
</section>`;
const ctaBand = (h, p, href, label) => `<section class="cta-band">
  <div class="container">
    <h2>${h}</h2>
    <p>${p}</p>
    <a href="${href}" class="btn btn-primary">${label}</a>
  </div>
</section>`;
const platformButtons = () => `<div class="delivery-links">
${DATA.deliveryPlatforms.map((p) => `      <a class="delivery-btn" href="${p.url}" target="_blank" rel="noopener" aria-label="Order Basil Pasta Bar on ${esc(p.name)}"><img class="delivery-logo" src="/${p.logo}" alt="${esc(p.name)}" height="26"></a>`).join('\n')}
    </div>`;
const hoursBlock = () => `<div class="hours-block">${hoursHtml()}</div>`;

// ---------- /menu/ ----------
function menuPage() {
  const cats = DATA.categories.map((c) => {
    const cards = c.items.map((i) => {
      const tags = [i.spicy ? '<span class="menu-tag">Spicy</span>' : '', i.veg ? '<span class="menu-tag menu-tag-veg">Vegetarian</span>' : ''].join('');
      const img = i.image ? `<img src="/${i.image}" alt="${esc(i.name)} at Basil Pasta Bar in Vancouver" width="1000" height="731" loading="lazy">` : '';
      return `        <li class="menu-card${i.image ? '' : ' menu-card-plain'}">
          ${img}
          <div>
            <h3>${esc(i.name)} ${tags}</h3>
            <span class="price">${esc(priceText(i))}</span>
            ${i.desc ? `<p>${esc(i.desc)}</p>` : ''}
          </div>
        </li>`;
    }).join('\n');
    return `    <section class="menu-cat" id="${c.id}">
      <h2>${esc(c.name)}</h2>
      <ul class="menu-cards">
${cards}
      </ul>
    </section>`;
  }).join('\n');
  const body = `${hero({
    crumbs: '<a href="/">Home</a> › Menu',
    h1: 'Basil Pasta Bar Menu &amp; Prices',
    lead: `Fresh pasta made to order at 636 Davie Street, Vancouver. ${esc(DATA.note)}`,
    cta: '<a href="/order-online/" class="btn btn-primary">Order Delivery / Takeout</a>'
  })}
<div class="menu-page">
${cats}
    <section class="menu-cat" id="build-your-own">
      <h2>Build Your Own Pasta</h2>
      <p class="menu-byo">Choose your pasta, sauce, protein, veggies and garnish — no limit on toppings. Starts at <strong>${money(BYO.startingPrice)}</strong> ${esc(BYO.priceNote)}. <a href="/build-your-own-pasta/">See how build-your-own pasta works →</a></p>
    </section>
</div>
${ctaBand('Hungry?', 'Order pasta for delivery or takeout, or come see us on Davie Street.', '/order-online/', 'Order Pasta Online')}`;
  return page({
    title: 'Menu & Prices | Basil Pasta Bar – Pasta Restaurant Vancouver',
    desc: `See the full Basil Pasta Bar menu: house special pastas, vegetarian dishes, salads, desserts and build-your-own pasta from ${money(BYO.startingPrice)}. 636 Davie St, Vancouver.`,
    path: '/menu/',
    ld: [{ ...restaurantRef, '@type': 'Restaurant', name: 'Basil Pasta Bar', url: SITE + '/', hasMenu: menuLd() }, crumbLd([['Home', '/'], ['Menu', '/menu/']])],
    body
  });
}

// ---------- /build-your-own-pasta/ ----------
function byoPage() {
  const steps = BYO.steps.map((s) => {
    const chips = s.options.map((o) => {
      const key = ICONS[o];
      const icon = key ? `<img src="/images/ingredients/${key}.svg" alt="" width="34" height="34" loading="lazy">` : '';
      return `<li class="chip">${icon}<span>${esc(o)}</span></li>`;
    }).join('');
    return `    <section class="byo-page-step">
      <h2>Step ${s.step}: ${esc(s.title)}</h2>
      <ul class="chip-grid">${chips}</ul>
      ${s.note ? `<p class="step-note">${esc(s.note)}</p>` : ''}
    </section>`;
  }).join('\n');
  const picks = DATA.categories[0].items.slice(0, 4).map((i) => esc(i.name)).join(', ');
  const body = `${hero({
    crumbs: '<a href="/">Home</a> › Build Your Own Pasta',
    h1: 'Build Your Own Pasta in Vancouver',
    lead: 'Basil Pasta Bar has let Vancouver design its own pasta since 2010. Choose your pasta, sauce, protein, veggies and garnish — there’s no limit on toppings — and we toss it fresh to order at 636 Davie Street.',
    cta: '<a href="/order-online/" class="btn btn-primary">Order Delivery / Takeout</a>'
  })}
<div class="prose">
  <div class="price-callout"><span>Starting at</span><strong>${money(BYO.startingPrice)}</strong><small>${esc(BYO.priceNote)}</small></div>
  <h2>How build-your-own pasta works</h2>
  <p>It takes five quick choices. Pick one pasta and one sauce, then add as much protein, veggies and garnish as you like. Our cooks sauté it all together to order, so every plate comes out hot and exactly how you asked for it.</p>
${steps}
  <h2>Vegetarian, spicy and gluten-free pasta</h2>
  <p>Skip the meat and load up on veggies for a fully vegetarian plate, choose gluten-free penne, or just say the word and we’ll turn up the heat — most sauces can be made spicy on request.</p>
  <h2>Not sure where to start?</h2>
  <p>Try one of our house specials such as ${picks}. See every dish, description and price on the <a href="/menu/">full menu</a>.</p>
</div>
${ctaBand('Ready to build yours?', 'Come in to 636 Davie Street or order pasta for delivery and takeout.', '/order-online/', 'Order Pasta Online')}`;
  return page({
    title: 'Build Your Own Pasta in Vancouver | Basil Pasta Bar',
    desc: `Design your own pasta at Basil Pasta Bar in Vancouver: pick pasta, sauce, protein, veggies and garnish with no limit on toppings. From ${money(BYO.startingPrice)}.`,
    path: '/build-your-own-pasta/',
    ld: [{ ...restaurantRef, '@type': 'Restaurant', name: 'Basil Pasta Bar', url: SITE + '/' }, crumbLd([['Home', '/'], ['Build Your Own Pasta', '/build-your-own-pasta/']])],
    body
  });
}

// ---------- /order-online/ ----------
function orderPage() {
  const body = `${hero({
    crumbs: '<a href="/">Home</a> › Delivery &amp; Takeout',
    h1: 'Pasta Delivery &amp; Takeout in Downtown Vancouver',
    lead: 'Craving pasta at home or the office? Basil Pasta Bar delivers daily from 11:30 AM to 10:00 PM through Uber Eats, SkipTheDishes and DoorDash — or call ahead and pick it up at 636 Davie Street.'
  })}
<div class="prose">
  <h2>Order pasta delivery</h2>
  <p>Choose your favourite app and order our house specials or build your own pasta. Prices on the apps are slightly higher than our dine-in and takeout prices.</p>
  ${platformButtons()}
  <h2>Takeout &amp; pickup</h2>
  <p>Call <a href="tel:${PHONE_E164}">${esc(R.phoneDisplay)}</a> or stop by <strong>636 Davie Street</strong>, near Davie and Seymour, and pick up your pasta fresh from the kitchen. Takeout uses our regular <a href="/menu/">menu prices</a>.</p>
  <h2>Delivery area</h2>
  <p>Each app sets its own delivery zone, so enter your address in the app to see if we deliver to you. We’re on the edge of Yaletown and downtown Vancouver, close to the West End.</p>
  <h2>Late-night pasta</h2>
  <p>Dine in or grab takeout late: we stay open until 11:00 PM Sunday to Thursday and 2:00 AM on Friday and Saturday.</p>
  <h2>Hours</h2>
  ${hoursBlock()}
  <p class="step-note">Delivery through the apps runs daily 11:30 AM – 10:00 PM.</p>
</div>
${ctaBand('Not sure what to order?', 'Browse every pasta, salad and dessert with prices.', '/menu/', 'See the Full Menu')}`;
  return page({
    title: 'Pasta Delivery & Takeout Vancouver | Basil Pasta Bar',
    desc: 'Order pasta delivery or takeout from Basil Pasta Bar in downtown Vancouver via Uber Eats, SkipTheDishes or DoorDash. Open late on Davie Street.',
    path: '/order-online/',
    ld: [{ ...restaurantRef, '@type': 'Restaurant', name: 'Basil Pasta Bar', url: SITE + '/' }, crumbLd([['Home', '/'], ['Delivery & Takeout', '/order-online/']])],
    body
  });
}

// ---------- 404 ----------
const notFound = () => `<!DOCTYPE html>
<html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found | Basil Pasta Bar</title><meta name="robots" content="noindex,follow">
<link rel="icon" href="/images/favicon.png"><link rel="stylesheet" href="/css/style.css"></head>
<body>${header()}<main><section class="page-hero"><div class="container"><h1>Page not found</h1><p class="lead">Sorry, we couldn’t find that page. Let’s get you to some pasta.</p><a class="btn btn-primary" href="/">Back to the homepage</a> <a class="btn btn-secondary" href="/menu/">See the menu</a></div></section></main>${footer()}<script src="/js/menu-data.js"></script><script src="/js/main.js"></script></body></html>
`;

// ---------- home page (in-place marker injection) ----------
function updateHome() {
  let html = read('index.html');
  const swap = (name, content) => {
    const re = new RegExp(`(<!--${name}:START-->)[\\s\\S]*?(<!--${name}:END-->)`);
    if (!re.test(html)) throw new Error('marker missing in index.html: ' + name);
    html = html.replace(re, (m, a, b) => a + "\n" + content + "\n" + b);
  };
  swap('SEO', head({
    title: 'Pasta Vancouver | Basil Pasta Bar – Build-Your-Own Pasta',
    desc: 'Craving pasta in Vancouver? Basil Pasta Bar on Davie St has served build-your-own pasta since 2010. Vegetarian options, late hours, takeout & delivery.',
    path: '/',
    ld: [
      { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'Basil Pasta Bar', inLanguage: 'en-CA', publisher: restaurantRef },
      restaurantLd(),
      faqLd()
    ]
  }));
  swap('FAQ', faqHtml());
  swap('HOURS', hoursHtml());
  write('index.html', html);
}

// ---------- run ----------
updateHome();
write('menu/index.html', menuPage());
write('build-your-own-pasta/index.html', byoPage());
write('order-online/index.html', orderPage());
write('404.html', notFound());
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [['/', '1.0', 'weekly'], ['/menu/', '0.9', 'weekly'], ['/build-your-own-pasta/', '0.8', 'monthly'], ['/order-online/', '0.8', 'monthly']]
    .map(([u, pr, cf]) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`).join('\n') + `\n</urlset>\n`);
write('site.webmanifest', JSON.stringify({ name: 'Basil Pasta Bar', short_name: 'Basil Pasta', description: 'Build-your-own pasta in Vancouver, BC', start_url: '/', display: 'standalone', background_color: '#142b20', theme_color: '#142b20', icons: [{ src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2) + '\n');
console.log('Built: index.html (SEO/FAQ/hours), menu, build-your-own-pasta, order-online, 404, sitemap, robots, manifest.');
