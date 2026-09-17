# Basil Pasta Bar — Website

A plain HTML/CSS/JS website (no framework, no build step, no hosting fees) that
replaces the Wix site at basilpastabar.com.

## Changing menu prices (or items)

Everything about the menu — every item, description, and price — lives in one
file: [`js/menu-data.js`](js/menu-data.js). The page reads that file and builds
the menu automatically.

To change a price, open `js/menu-data.js`, find the item, and edit the `price`
number. Save, commit, push — the live site updates automatically within a
minute or two (GitHub Pages redeploys on every push).

You never need to touch the HTML/CSS to change a price, add a dish, or remove
one. Just ask Claude to make the change in `js/menu-data.js` and push it.

## One thing to double check

On the old Wix site, "Classic Caesar" under Sides & Salads was missing a price
entirely — I've set it to $13.95 (same as Pasta Salad) as a placeholder. Let me
know the real price and I'll fix it.

## Running it locally

There's no build step — it's static files. To preview on your machine:

```bash
npx serve .
```

or simply open `index.html` directly in a browser (delivery links, phone
links, and the map still work; only the "fetch" of local files via `file://`
can occasionally be blocked by some browsers, so `npx serve .` is the safer
option).

## Deploying (GitHub Pages, free)

This repo is set up to deploy for free via GitHub Pages:

1. Push this repo to GitHub.
2. In the repo's **Settings → Pages**, set the source to the `main` branch,
   root folder.
3. GitHub Pages will publish it at `https://<your-username>.github.io/<repo>/`.
4. The `CNAME` file in this repo already points it at `basilpastabar.com` —
   once your GoDaddy DNS is updated (see below), GitHub Pages will serve the
   site directly at your real domain, with free HTTPS.

## Pointing your GoDaddy domain at it (no GoDaddy hosting fees)

GoDaddy stays as your domain registrar only — you stop paying Wix, and you
don't need GoDaddy's paid web hosting either. In GoDaddy's DNS management for
basilpastabar.com, set:

- Four **A** records for `@` pointing to GitHub Pages' IPs:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- One **CNAME** record for `www` pointing to `<your-username>.github.io`

Then in the GitHub repo's Settings → Pages, enable "Enforce HTTPS" once it
becomes available (can take a few hours after DNS propagates).

## Structure

```
index.html          One-page site: hero, menu, build-your-own, order online, location
css/style.css        All styling
js/menu-data.js       <-- Edit this file to change prices/menu items
js/main.js            Renders the menu/hours/social links from menu-data.js
images/               Logo + food photography (pulled from the original site)
```
