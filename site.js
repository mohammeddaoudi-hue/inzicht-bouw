// INzicht – gedrag van de site: menu, uitklapmenu, diensten-tabs en schuifrails op gsm,
// vragen, sprongmenu, formulieren (met controle) en onthulling bij het scrollen.
(() => {
  window.__inzicht = true;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const gsm = window.matchMedia('(max-width: 1000px)');
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollGedrag = () => (rustig.matches ? 'auto' : 'smooth');

  /* ── balk: doorzichtig op de home-hero, wit na het scrollen ── */
  const nav = $('.nav');
  const isHome = document.body.classList.contains('is-home');
  if (nav && isHome) {
    const schakel = () => nav.classList.toggle('is-gescrold', window.scrollY > 24);
    schakel();
    window.addEventListener('scroll', schakel, { passive: true });
  }

  /* ── mobiel menu ── */
  const burger = $('.burger');
  const mob = $('#mobmenu');
  const zetMenu = (open) => {
    if (!burger || !mob) return;
    if (open) { mob.hidden = false; requestAnimationFrame(() => mob.classList.add('is-open')); }
    else { mob.classList.remove('is-open'); mob.hidden = true; }
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  };
  if (burger && mob) {
    burger.addEventListener('click', () => zetMenu(mob.hidden));
    $$('a', mob).forEach((a) => a.addEventListener('click', () => zetMenu(false)));
    gsm.addEventListener('change', (e) => { if (!e.matches) zetMenu(false); });
  }

  /* ── uitklapmenu Diensten ── */
  $$('.drop').forEach((drop) => {
    const knop = $('.drop__knop', drop);
    const zet = (open) => { drop.classList.toggle('is-open', open); knop.setAttribute('aria-expanded', String(open)); };
    knop.addEventListener('click', (e) => { e.stopPropagation(); zet(!drop.classList.contains('is-open')); });
    drop.addEventListener('mouseleave', () => zet(false));
    document.addEventListener('click', (e) => { if (!drop.contains(e.target)) zet(false); });
    drop.addEventListener('keydown', (e) => { if (e.key === 'Escape') { zet(false); knop.focus(); } });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mob && !mob.hidden) { zetMenu(false); burger.focus(); } });

  /* ── schuifrails (gsm) ── */
  function maakRail(rail) {
    const bediening = rail.parentElement.querySelector(':scope > [data-bediening]');
    const vorige = bediening && $('[data-vorige]', bediening);
    const volgende = bediening && $('[data-volgende]', bediening);
    const vul = bediening && $('.rail-balk__vul', bediening);
    const kaarten = () => [...rail.children].filter((k) => !k.matches('[data-bediening]'));
    const stap = () => { const k = kaarten()[0]; return k ? k.getBoundingClientRect().width + 14 : rail.clientWidth; };
    const update = () => {
      if (!rail.classList.contains('is-rail') || !vul) return;
      const max = rail.scrollWidth - rail.clientWidth;
      const deel = rail.clientWidth / rail.scrollWidth;
      vul.style.width = `${Math.max(12, deel * 100)}%`;
      vul.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * ((1 / deel) - 1) * 100 : 0}%)`;
      vorige.disabled = rail.scrollLeft <= 2;
      volgende.disabled = rail.scrollLeft >= max - 2;
    };
    if (vorige) vorige.addEventListener('click', () => rail.scrollBy({ left: -stap(), behavior: scrollGedrag() }));
    if (volgende) volgende.addEventListener('click', () => rail.scrollBy({ left: stap(), behavior: scrollGedrag() }));
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return {
      aan() { rail.classList.add('is-rail'); if (bediening) bediening.classList.add('is-aan'); rail.scrollLeft = 0; update(); },
      uit() { rail.classList.remove('is-rail'); if (bediening) bediening.classList.remove('is-aan'); },
    };
  }

  /* ── diensten op de home: tabs op desktop, schuifrail op gsm ── */
  const podium = $('.podium');
  const tabs = $$('.tab');
  const panelen = $$('.paneel');
  let actief = 0;
  const kies = (i, focus = false) => {
    actief = i;
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

  const rails = $$('[data-rail]').map((el) => ({ el, rail: maakRail(el) }));
  const zetModus = () => {
    rails.forEach(({ el, rail }) => {
      if (gsm.matches) {
        rail.aan();
        if (el.classList.contains('podium__panelen')) {
          podium.classList.add('is-rail-modus');
          panelen.forEach((p) => { p.hidden = false; p.removeAttribute('role'); });
        }
      } else {
        rail.uit();
        if (el.classList.contains('podium__panelen')) {
          podium.classList.remove('is-rail-modus');
          panelen.forEach((p) => p.setAttribute('role', 'tabpanel'));
          kies(actief);
        }
      }
    });
  };
  zetModus();
  gsm.addEventListener('change', zetModus);

  /* ── veelgestelde vragen: per lijst één open ── */
  $$('[data-acc]').forEach((acc) => {
    const items = $$('.acc__item', acc);
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
  });

  /* ── sprongmenu op de dienstenpagina: huidige dienst markeren ── */
  const sprongLinks = $$('.sprong__lijst a');
  if (sprongLinks.length && 'IntersectionObserver' in window) {
    const doelen = sprongLinks.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        sprongLinks.forEach((a) => {
          const aan = a.getAttribute('href') === `#${e.target.id}`;
          a.classList.toggle('is-actief', aan);
          if (aan) { a.setAttribute('aria-current', 'true'); a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' }); }
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    doelen.forEach((d) => io.observe(d));
  }

  /* ── knoppen naar het aanvraagformulier (zelfde pagina), met de dienst al ingevuld ── */
  $$('[data-naar-form]').forEach((knop) => {
    knop.addEventListener('click', (e) => {
      const href = knop.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const doel = document.getElementById(href.slice(1));
      if (!doel) return;
      e.preventDefault();
      zetMenu(false);
      const form = doel.matches('form') ? doel : $('form[data-aanvraag]', doel);
      const dienst = knop.getAttribute('data-dienst');
      if (form && dienst) {
        const select = form.querySelector('select[name="werk"]');
        const optie = select && [...select.options].find((o) => o.text === dienst);
        if (optie) select.value = optie.value || optie.text;
      }
      doel.scrollIntoView({ behavior: scrollGedrag(), block: 'start' });
      history.replaceState(null, '', href);
      const eerste = form && form.querySelector('input, select, textarea');
      // alleen focussen als de bezoeker intussen nog geen ander veld koos
      if (eerste) setTimeout(() => { if (!form.contains(document.activeElement)) eerste.focus({ preventScroll: true }); }, rustig.matches ? 0 : 650);
    });
  });

  /* ── aanvraagformulieren ── */
  const ENDPOINT = document.documentElement.getAttribute('data-form-endpoint') || '';
  const MAIL = 'inzicht.bouw@gmail.com';
  const cijfers = (s) => s.replace(/\D/g, '');
  $$('form[data-aanvraag]').forEach((form) => {
    const veld = (n) => form.elements[n];
    const foutEl = $('.aanvraag__fout', form);
    const zetFout = (el, tekst) => {
      const p = document.getElementById(`${el.id}-fout`);
      el.setAttribute('aria-invalid', tekst ? 'true' : 'false');
      if (p) { p.textContent = tekst || ''; p.hidden = !tekst; }
    };
    ['naam', 'tel', 'mail', 'werk'].forEach((n) => {
      const el = veld(n);
      if (el) el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { if (el.getAttribute('aria-invalid') === 'true') zetFout(el, ''); });
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      foutEl.hidden = true;
      const naam = veld('naam'); const tel = veld('tel'); const mail = veld('mail'); const werk = veld('werk');
      const fouten = [];
      const check = (el, ok, tekst) => { zetFout(el, ok ? '' : tekst); if (!ok) fouten.push(el); };
      check(naam, naam.value.trim().length > 1, 'Vul uw voor- en achternaam in.');
      check(tel, cijfers(tel.value).length >= 8, 'Vul uw telefoonnummer in (minstens 8 cijfers).');
      check(mail, !mail.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim()), 'Dit e-mailadres klopt niet.');
      check(werk, !!werk.value, 'Kies om welk werk het gaat.');
      if (fouten.length) { fouten[0].focus(); return; }

      const gegevens = {
        naam: naam.value.trim(), telefoon: tel.value.trim(), email: mail.value.trim(), werk: werk.value,
        straat: veld('straat').value.trim(), gemeente: veld('gemeente').value.trim(), project: veld('project').value.trim(),
        pagina: location.pathname, verstuurd: new Date().toISOString(),
      };
      const klaar = $('[data-stap="klaar"]', form);
      const toonKlaar = (kop, tekst) => {
        if (kop) $('[data-klaar-kop]', klaar).textContent = kop;
        if (tekst) $('[data-klaar-tekst]', klaar).textContent = tekst;
        $('[data-stap="form"]', form).hidden = true;
        klaar.hidden = false;
        klaar.focus({ preventScroll: true });
        form.scrollIntoView({ behavior: scrollGedrag(), block: 'start' });
      };

      if (ENDPOINT) {
        const knop = form.querySelector('button[type="submit"]');
        knop.setAttribute('aria-busy', 'true');
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 8000);
        try {
          const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gegevens), keepalive: true, signal: ctrl.signal });
          if (!r.ok) throw new Error(String(r.status));
          toonKlaar('Bedankt voor uw aanvraag', 'We nemen contact met u op om het plaatsbezoek in te plannen.');
        } catch (err) {
          foutEl.textContent = `Verzenden lukte niet. Bel ons op 0468 35 90 93 of mail naar ${MAIL}.`;
          foutEl.hidden = false;
        } finally { clearTimeout(t); knop.removeAttribute('aria-busy'); }
        return;
      }

      // Zonder koppeling: de aanvraag gaat als e-mail vanuit het e-mailprogramma van de bezoeker.
      const regels = [
        'Aanvraag gratis plaatsbezoek via de website', '',
        `Naam: ${gegevens.naam}`, `Telefoon: ${gegevens.telefoon}`,
        gegevens.email ? `E-mail: ${gegevens.email}` : '', `Werk: ${gegevens.werk}`,
        gegevens.straat || gegevens.gemeente ? `Adres: ${[gegevens.straat, gegevens.gemeente].filter(Boolean).join(', ')}` : '',
        '', gegevens.project ? `Project:\n${gegevens.project}` : '',
      ].filter((r, i, a) => r !== '' || (a[i - 1] !== '' && i > 0));
      const href = `mailto:${MAIL}?subject=${encodeURIComponent(`Aanvraag plaatsbezoek: ${gegevens.werk}`)}&body=${encodeURIComponent(regels.join('\n'))}`;
      toonKlaar();
      window.location.href = href;
    });
  });

  /* ── belknop op gsm: weg zodra het formulier of de voet in beeld is ── */
  const fab = $('.fab');
  if (fab && 'IntersectionObserver' in window) {
    const zichtbaar = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? zichtbaar.add(e.target) : zichtbaar.delete(e.target)));
      fab.classList.toggle('is-verborgen', zichtbaar.size > 0);
    }, { threshold: 0.05 });
    $$('#plaatsbezoek, .contact, .voet, .hero').forEach((el) => io.observe(el));
  }

  /* ── onthulling: alleen doorzichtigheid, via IntersectionObserver ── */
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
