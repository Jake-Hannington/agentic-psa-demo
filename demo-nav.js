// Floating "Demo scenes" menu, shared by the remi, tsia and agents prototypes.
// Self-contained: it injects its own styles and markup. All classes start with "dn-".
(function () {
  if (window.__demoNav) return;
  window.__demoNav = true;

  const SCENES = [
    { badge: '⌂', label: 'Start page', href: '/' },
    { badge: '1A', label: 'Create a project from a quote', href: '/tsia/' },
    { badge: '1B', label: 'Create a project from an SOW with Remi', href: '/remi/' },
    { badge: '2–6', label: 'Deliver, invoice and prove the profit', href: '/tsia/' },
    { badge: '7–8', label: 'Margin Watcher agent', href: '/agents/' },
  ];
  const EDGE = 20; // px from the bottom and right of the viewport
  const DRAWER_IDS = ['aiDrawer', 'taskDrawer'];
  const supportsPopover = typeof HTMLElement.prototype.showPopover === 'function';

  const CSS = `
.dn-root, .dn-root * { box-sizing: border-box; }
.dn-root { position: fixed; inset: auto; right: ${EDGE}px; bottom: ${EDGE}px; width: 44px; height: 44px;
  margin: 0; padding: 0; border: 0; background: transparent; overflow: visible; color: #1d1c39;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', sans-serif; transition: right 200ms ease; }
.dn-root.dn-no-popover { z-index: 2147483000; }
.dn-btn { all: unset; box-sizing: border-box; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%;
  background: #1d1c39; color: #fff; cursor: pointer; box-shadow: 0 6px 18px rgba(11, 14, 30, 0.22), 0 1px 3px rgba(11, 14, 30, 0.18);
  transition: transform 120ms ease, box-shadow 120ms ease; }
.dn-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(11, 14, 30, 0.28), 0 1px 3px rgba(11, 14, 30, 0.18); }
.dn-btn:focus-visible { outline: 2px solid #4461d7; outline-offset: 3px; }
.dn-btn svg { width: 18px; height: 18px; display: block; }
.dn-tip { position: absolute; right: 0; bottom: 54px; padding: 5px 9px; border-radius: 6px; background: #1d1c39; color: #fff;
  font-size: 12px; font-weight: 500; line-height: 16px; white-space: nowrap; pointer-events: none; opacity: 0; transform: translateY(4px);
  transition: opacity 120ms ease, transform 120ms ease; }
.dn-btn:hover + .dn-tip, .dn-btn:focus-visible + .dn-tip { opacity: 1; transform: none; }
.dn-root.dn-open .dn-tip { opacity: 0; }
.dn-menu { position: absolute; right: 0; bottom: 54px; width: 280px; padding: 6px; border-radius: 12px; background: #fff;
  box-shadow: 0 12px 32px rgba(11, 14, 30, 0.18), 0 0 0 1px rgba(11, 14, 30, 0.06); }
.dn-menu[hidden] { display: none; }
.dn-title { margin: 0; padding: 8px 10px 6px; font-size: 12px; font-weight: 600; line-height: 16px; letter-spacing: .02em; color: #646d7d; }
.dn-list { list-style: none; margin: 0; padding: 0; }
.dn-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; color: #1d1c39; text-decoration: none;
  font-size: 13px; line-height: 18px; }
.dn-row:hover { background: #f3f4f8; }
.dn-row:focus-visible { outline: 2px solid #4461d7; outline-offset: -2px; }
.dn-row.dn-current { background: #eef1fd; }
.dn-badge { flex: none; min-width: 32px; height: 22px; padding: 0 6px; display: grid; place-items: center; border-radius: 6px;
  background: #e8eaf2; color: #1d1c39; font-size: 11px; font-weight: 700; line-height: 1; }
.dn-current .dn-badge { background: #4461d7; color: #fff; }
.dn-text { display: flex; flex-direction: column; min-width: 0; }
.dn-label { font-weight: 500; }
.dn-here { font-size: 11px; line-height: 14px; font-weight: 600; color: #4461d7; }
.dn-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media print { .dn-root { display: none !important; } }
`;

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // The current folder: "" for the start page, else the first path segment ("tsia", "remi", "agents")
  const folderOf = (path) => path.split('/').filter(Boolean)[0] || '';
  const here = folderOf(location.pathname);

  const root = document.createElement('div');
  root.className = 'dn-root';
  if (supportsPopover) root.setAttribute('popover', 'manual');
  else root.classList.add('dn-no-popover');

  const rows = SCENES.map((scene) => {
    const isHere = folderOf(scene.href) === here;
    return `<li><a class="dn-row${isHere ? ' dn-current' : ''}" href="${scene.href}"${isHere ? ' aria-current="page"' : ''}>`
      + `<span class="dn-badge" aria-hidden="true">${scene.badge}</span>`
      + `<span class="dn-text"><span class="dn-label">${scene.badge === '⌂' ? '' : `<span class="dn-sr">${scene.badge} · </span>`}${scene.label}</span>`
      + `${isHere ? '<span class="dn-here">You’re here</span>' : ''}</span></a></li>`;
  }).join('');

  root.innerHTML = `
<button type="button" class="dn-btn" aria-label="Demo scenes" aria-expanded="false" aria-controls="dn-menu">
  <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><rect x="1.5" y="1.5" width="6" height="6" rx="1.5"/><rect x="10.5" y="1.5" width="6" height="6" rx="1.5"/><rect x="1.5" y="10.5" width="6" height="6" rx="1.5"/><rect x="10.5" y="10.5" width="6" height="6" rx="1.5"/></svg>
</button>
<span class="dn-tip" aria-hidden="true">Demo scenes</span>
<div class="dn-menu" id="dn-menu" role="region" aria-labelledby="dn-title" hidden>
  <p class="dn-title" id="dn-title">Demo scenes</p>
  <ul class="dn-list">${rows}</ul>
</div>`;
  const button = root.querySelector('.dn-btn');
  const menu = root.querySelector('.dn-menu');

  function setMenuOpen(isOpen, { returnFocus = false } = {}) {
    menu.hidden = !isOpen;
    root.classList.toggle('dn-open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) (menu.querySelector('.dn-current') || menu.querySelector('.dn-row')).focus();
    else if (returnFocus) button.focus();
  }
  const isMenuOpen = () => !menu.hidden;

  button.addEventListener('click', () => setMenuOpen(!isMenuOpen()));
  menu.addEventListener('click', (event) => { if (event.target.closest('.dn-row')) setMenuOpen(false); });
  document.addEventListener('pointerdown', (event) => {
    if (isMenuOpen() && !root.contains(event.target)) setMenuOpen(false);
  }, true);
  // Capture phase, so Esc closes the menu and not a prototype dialog underneath it
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isMenuOpen()) return;
    event.preventDefault();
    event.stopPropagation();
    setMenuOpen(false, { returnFocus: true });
  }, true);

  // Stay above the prototypes' modal dialogs. A popover shown after a dialog opens sits above it in the top layer,
  // but a modal dialog makes everything outside it inert, so the menu also moves into the topmost open modal dialog
  // (and back to <body> when it closes) to stay clickable.
  const openModals = []; // modal dialogs in the order they opened; the last one is on top
  function isModal(dialog) {
    try { return dialog.matches(':modal'); } catch { return false; } // :modal unsupported: treat as non-modal
  }
  function bringToFront() {
    for (let i = openModals.length - 1; i >= 0; i--) if (!openModals[i].open) openModals.splice(i, 1);
    const host = openModals.at(-1) || document.body;
    const hadFocus = root.contains(document.activeElement);
    if (supportsPopover && root.matches(':popover-open')) root.hidePopover();
    if (root.parentElement !== host) host.appendChild(root);
    if (supportsPopover) root.showPopover();
    if (hadFocus && isMenuOpen()) (menu.querySelector('.dn-current') || menu.querySelector('.dn-row')).focus();
  }
  new MutationObserver((mutations) => {
    let changed = false;
    for (const { target } of mutations) {
      if (target.tagName !== 'DIALOG') continue;
      changed = true;
      if (target.open && isModal(target) && !openModals.includes(target)) openModals.push(target);
    }
    if (changed) bringToFront();
  }).observe(document, { attributes: true, subtree: true, attributeFilter: ['open'] });

  // Move left of a right-hand drawer (TSIA and Agents) while one is on screen
  function placeBesideDrawers() {
    let right = EDGE;
    for (const id of DRAWER_IDS) {
      const drawer = document.getElementById(id);
      if (!drawer) continue;
      const rect = drawer.getBoundingClientRect();
      const css = getComputedStyle(drawer);
      const isShown = rect.width > 0 && rect.left < innerWidth - 1 && css.display !== 'none' && css.visibility !== 'hidden';
      if (isShown) right = Math.max(right, innerWidth - rect.left + EDGE);
    }
    const value = `${Math.round(right)}px`;
    if (root.style.right !== value) root.style.right = value;
  }

  function mount() {
    document.body.appendChild(root);
    if (supportsPopover) root.showPopover();
    placeBesideDrawers();
    setInterval(placeBesideDrawers, 300);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
