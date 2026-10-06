// INzicht – gedrag: menu, tabs diensten, vragen, aanvraagvenster (zonder verzending), onthulling
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Nav: doorzichtig op de hero, wit zodra de hero bijna uit beeld is
  const nav = $('.nav');
  const hero = $('.hero');
  const schakel = () => nav.classList.toggle('is-gescrold', window.scrollY > 24);
  schakel();
  window.addEventListener('scroll', schakel, { passive: true });
  if ('IntersectionObserver' in window && hero) {
    // als de hero helemaal weg is, blijft de balk wit (ook bij ankersprongen)
    new IntersectionObserver(([e]) => { if (!e.isIntersecting) nav.classList.add('is-gescrold'); else schakel(); }, { threshold: 0 }).observe(hero);
  }

  // Mobiel menu
  const burger = $('.burger');
  const mob = $('#mobmenu');
  const zetMenu = (open) => {
    if (open) { mob.hidden = false; requestAnimationFrame(() => mob.classList.add('is-open')); }
    else { mob.classList.remove('is-open'); mob.hidden = true; }
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  };
  burger.addEventListener('click', () => zetMenu(mob.hidden));
  $$('a', mob).forEach((a) => a.addEventListener('click', () => zetMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 1000 && !mob.hidden) zetMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mob.hidden) zetMenu(false); });

  // Tabs diensten (01-04)
  const tabs = $$('.tab');
  const kies = (i, focus = false) => {
    tabs.forEach((t, j) => {
      const aan = i === j;
      t.classList.toggle('is-actief', aan);
      t.setAttribute('aria-selected', String(aan));
      t.tabIndex = aan ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !aan;
      p.classList.toggle('is-actief', aan);
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => kies(i));
    t.addEventListener('keydown', (e) => {
      const n = tabs.length;
      if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); kies((i + 1) % n, true); }
      if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); kies((i - 1 + n) % n, true); }
      if (e.key === 'Home') { e.preventDefault(); kies(0, true); }
      if (e.key === 'End') { e.preventDefault(); kies(n - 1, true); }
    });
  });
  // Dienstlinks in de voet openen de juiste tab
  $$('[data-tab]').forEach((a) => a.addEventListener('click', () => kies(Number(a.dataset.tab) - 1)));

  // Veelgestelde vragen: één open tegelijk
  const items = $$('.acc__item');
  items.forEach((item) => {
    const knop = $('.acc__vraag', item);
    knop.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach((it) => {
        it.classList.remove('is-open');
        $('.acc__vraag', it).setAttribute('aria-expanded', 'false');
        $('.acc__antw', it).hidden = true;
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        knop.setAttribute('aria-expanded', 'true');
        $('.acc__antw', item).hidden = false;
      }
    });
  });

  // Aanvraagvenster (demo: verstuurt niets)
  const dlg = $('#aanvraag');
  const form = $('.modal__form', dlg);
  const stap = (naam) => $$('.modal__stap', dlg).forEach((s) => { s.hidden = s.dataset.stap !== naam; });
  const open = () => {
    stap('form');
    form.reset();
    $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
    if (!mob.hidden) zetMenu(false);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    setTimeout(() => $('#f-naam').focus(), 30);
  };
  const sluit = () => { if (dlg.open) dlg.close(); };
  $$('[data-open-form]').forEach((b) => b.addEventListener('click', open));
  $$('[data-close-form]', dlg).forEach((b) => b.addEventListener('click', sluit));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) sluit(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach((el) => {
      const leeg = !el.value.trim();
      el.setAttribute('aria-invalid', String(leeg));
      if (leeg && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    stap('bedankt');
  });

  // Onthulling: alleen doorzichtigheid, via IntersectionObserver (geen scroll-listener)
  const onthul = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-zichtbaar'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    onthul.forEach((el) => io.observe(el));
  } else {
    onthul.forEach((el) => el.classList.add('is-zichtbaar'));
  }
})();
