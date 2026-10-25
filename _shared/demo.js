/* Live demos (live.helloprokhorov.com/<case>/): the frame every demo shares.

   <pk-demo case="https://helloprokhorov.com/work/<case>/"></pk-demo>
     a quiet pill at the lower left: whose site this is, and the way back to the case.

   <a href="https://helloprokhorov.com/work/<case>/#<section>" data-demo="Services"
      data-demo-thumb="thumbs/services.avif">Services</a>
     a page the demo doesn't build. Without JS the link simply opens the case where that page
     is shown; with JS a panel says so first, with a picture of the page and the way to it.

   Everything lives in the element's shadow root, so the demo's styles and these never meet. */

const CSS = `
  :host { all: initial; }
  * { box-sizing: border-box; margin: 0; }
  .pill, dialog { font: 400 14px/1.35 "Inter", system-ui, -apple-system, "Segoe UI", sans-serif; letter-spacing: -0.01em; -webkit-font-smoothing: antialiased; }
  a { color: inherit; text-decoration: none; }

  .pill {
    position: fixed; left: 12px; bottom: 12px; z-index: 2147483000;
    display: flex; align-items: center; gap: 2px; padding: 4px;
    border-radius: 999px; background: rgb(18 18 18 / 0.86); color: #fff;
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 6px 24px rgb(0 0 0 / 0.18);
  }
  .pill__who { display: flex; align-items: center; gap: 8px; padding: 4px 10px 4px 8px; color: rgb(255 255 255 / 0.72); }
  .pill__dot { width: 6px; height: 6px; border-radius: 50%; background: #3ddc84; }
  .pill__back { padding: 4px 12px; border-radius: 999px; background: #fff; color: #121212; transition: background-color 0.3s; }
  .pill__back:hover { background: #e6e6e6; }

  dialog {
    width: min(440px, calc(100vw - 24px)); max-height: calc(100svh - 24px); margin: auto; padding: 0; border: 0; border-radius: 16px;
    background: #fff; color: #121212; box-shadow: 0 24px 80px rgb(0 0 0 / 0.28); overflow: auto;
  }
  dialog::backdrop { background: rgb(18 18 18 / 0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
  .shot { aspect-ratio: 16 / 10; background: #f2f2f2; }
  .shot img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; }
  .body { display: grid; gap: 12px; padding: 20px; }
  .k { color: #757575; }
  h2 { font-size: 26px; font-weight: 400; line-height: 1.1; letter-spacing: -0.04em; }
  p { color: #4d4d4d; }
  .acts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .btn { padding: 6px 14px; border: 1px solid #121212; border-radius: 999px; background: none; font: inherit; color: #121212; cursor: pointer; transition: background-color 0.3s; }
  .btn:hover { background: #f2f2f2; }
  .btn--fill { background: #121212; color: #fff; }
  .btn--fill:hover { background: #333; }
  :focus-visible { outline: 2px solid #121212; outline-offset: 2px; }
  .pill :focus-visible { outline-color: #fff; }

  @media (prefers-reduced-motion: no-preference) {
    dialog[open] { animation: up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    dialog[open]::backdrop { animation: fade 0.4s ease; }
  }
  @keyframes up { from { opacity: 0; translate: 0 24px; } }
  @keyframes fade { from { opacity: 0; } }
`;

class PkDemo extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const caseUrl = this.getAttribute('case') || 'https://helloprokhorov.com/work/';
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${CSS}</style>
      <nav class="pill" aria-label="Live demo">
        <span class="pill__who"><i class="pill__dot" aria-hidden="true"></i>Live demo by Prokhorov®</span>
        <a class="pill__back" href="${caseUrl}">Back to the case ↗</a>
      </nav>
      <dialog aria-labelledby="t">
        <div class="shot" hidden><img alt=""></div>
        <div class="body">
          <p class="k">(Not in the demo)</p>
          <h2 id="t"></h2>
          <p>This page isn’t built in the live demo. The case study shows it, with the decisions behind it.</p>
          <div class="acts">
            <a class="btn btn--fill" data-go>See it in the case →</a>
            <button class="btn" type="button" data-stay>Stay here</button>
          </div>
        </div>
      </dialog>`;
    this.dialog = root.querySelector('dialog');
    this.dialog.querySelector('[data-stay]').addEventListener('click', () => this.dialog.close());
    // a click on the backdrop (outside the panel) closes it, as Esc does
    this.dialog.addEventListener('click', (e) => { if (e.target === this.dialog) this.dialog.close(); });
  }

  open({ title, href, thumb }) {
    const d = this.dialog;
    d.querySelector('h2').textContent = title;
    d.querySelector('[data-go]').href = href;
    const shot = d.querySelector('.shot');
    shot.hidden = !thumb;
    if (thumb) shot.querySelector('img').src = thumb;
    d.showModal();
    d.querySelector('[data-go]').focus();
  }
}
customElements.define('pk-demo', PkDemo);

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-demo]');
  const demo = document.querySelector('pk-demo');
  if (!link || !demo || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  demo.open({ title: link.dataset.demo, href: link.href, thumb: link.dataset.demoThumb });
});
