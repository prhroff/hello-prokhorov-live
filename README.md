# live.helloprokhorov.com — live demos of the cases

One static site, one folder per case: `live/<case>/` → `live.helloprokhorov.com/<case>/`.
Plain HTML/CSS/JS, no build step. Not part of helloprokhorov.com: `build-release.py`
never copies `live/`, and it is deployed from its own public repo.

```
live/
  _shared/demo.js    <pk-demo>: the "Live demo by Prokhorov®" pill and the "not in the demo" panel
  _shared/demo.css   cross-document view transitions between a demo's pages
  _starter/          copy this to start a demo
  <case>/            one demo per case
  index.html, 404.html   forward to helloprokhorov.com/work/
  robots.txt         the whole subdomain stays out of search (the case is what search finds)
  CNAME, .nojekyll   GitHub Pages: the domain, and serve folders that start with "_"
```

## What a demo is

- The **home page**, whole and responsive, with its motion, built from the Figma design.
- At most **one key inner page**: the one shown in the case's Key Pages part.
- Every other menu item links to the **case section** that shows that page, with
  `data-demo="<Page name>"` (and `data-demo-thumb="thumbs/<page>.avif"` when there is a picture).
  Without JS the link opens the case there; with JS the panel says the page isn't built and leads there.
- No CMS, no working forms: a form's button goes to `https://helloprokhorov.com/contact/`.
- Every page: `<meta name="robots" content="noindex, nofollow">`, a canonical link to the case,
  `<pk-demo case="https://helloprokhorov.com/work/<case>/">` and `../_shared/demo.js`.
- Self-initiated work never names a client or implies one (see the case copy guide).

## Add a demo

1. Copy `_starter/` to `<case>/` (the case's slug on helloprokhorov.com).
2. Replace the [bracketed] values; build the home page in place of the sample.
3. Preview: `python -m http.server 8080` in the project folder, then
   `http://localhost:8080/live/<case>/`.
4. Link it from the case: the "Visit Live Site" button → `https://live.helloprokhorov.com/<case>/`.

## Set up the subdomain (once, on Artem's go-ahead)

1. GitHub: a public repo `prhroff/hello-prokhorov-live` with the contents of `live/` at its root
   (Pages: deploy from branch `main`, folder `/`).
2. GoDaddy → helloprokhorov.com → DNS → Add record:
   `Type CNAME · Name live · Value prhroff.github.io · TTL 1 hour`.
   The records for helloprokhorov.com itself stay as they are.
3. GitHub → the repo → Settings → Pages → Custom domain `live.helloprokhorov.com` → Save;
   once the DNS check passes, tick **Enforce HTTPS** (the certificate can take up to an hour).
4. Recommended: GitHub → Settings (account) → Pages → **Verify** helloprokhorov.com, so no other
   GitHub account can claim a subdomain of it.
