// Lightbox: progressive enhancement over <a data-lightbox> links. No dependencies.
const dlg = document.querySelector<HTMLDialogElement>('dialog.lightbox');

if (dlg) {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];
  const img = dlg.querySelector('img')!;
  const text = (sel: string) => dlg.querySelector<HTMLElement>(sel)!;
  const [main, sub, counter] = [text('.main'), text('.sub'), text('.counter')];
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const pad = (n: number) => String(n).padStart(2, '0');

  let index = 0;
  let opener: HTMLElement | null = null;
  let token = 0;

  // Index of the photo named by the URL hash, or -1.
  const fromHash = () => {
    let id = '';
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {}
    return id ? links.findIndex((a) => a.dataset.id === id) : -1;
  };

  const preload = (i: number) => {
    const a = links[(i + links.length) % links.length];
    const im = new Image();
    im.sizes = '100vw';
    im.srcset = a.dataset.srcset ?? '';
    im.src = a.dataset.full ?? a.href;
  };

  const show = (i: number, fade = true) => {
    index = (i + links.length) % links.length;
    const a = links[index];
    const d = a.dataset;
    const mine = ++token;

    main.textContent = `№ ${d.frame} — ${d.title}`;
    sub.textContent = [d.chapter, d.place].filter(Boolean).join(' · ');
    counter.textContent = `${pad(index + 1)} / ${pad(links.length)}`;
    if (location.hash.slice(1) !== d.id) history.replaceState(null, '', `#${d.id}`);

    const swap = () => {
      if (mine !== token) return;
      img.alt = d.alt ?? '';
      img.srcset = d.srcset ?? '';
      img.src = d.full ?? a.href;
      img.decode().catch(() => {}).then(() => mine === token && img.classList.remove('out'));
    };
    img.classList.add('out');
    if (calm.matches || !fade) swap();
    else setTimeout(swap, 200);

    preload(index + 1);
    preload(index - 1);
  };

  const open = (i: number, from: HTMLElement | null) => {
    opener = from ?? links[i];
    const fresh = !dlg.open;
    if (fresh) dlg.showModal();
    show(i, !fresh);
  };

  const step = (n: number) => show(index + n);

  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-lightbox]');
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open(links.indexOf(a), a);
  });

  dlg.querySelector('.close')!.addEventListener('click', () => dlg.close());
  dlg.querySelector('.prev')!.addEventListener('click', () => step(-1));
  dlg.querySelector('.next')!.addEventListener('click', () => step(1));

  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // Swipe
  let x0 = 0;
  let y0 = 0;
  const stage = text('.stage');
  stage.addEventListener('pointerdown', (e) => {
    x0 = e.clientX;
    y0 = e.clientY;
  });
  stage.addEventListener('pointerup', (e) => {
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - y0)) step(dx < 0 ? 1 : -1);
  });

  // Esc and the close button both end up here.
  dlg.addEventListener('close', () => {
    token++;
    img.removeAttribute('src');
    img.removeAttribute('srcset');
    if (fromHash() >= 0) history.replaceState(null, '', location.pathname + location.search);
    opener?.focus();
    opener = null;
  });

  const sync = () => {
    const i = fromHash();
    if (i >= 0) {
      if (!dlg.open || i !== index) open(i, opener);
    } else if (dlg.open) dlg.close();
  };
  addEventListener('hashchange', sync);
  sync();
}
