(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Floating nav: hides on scroll down, returns on scroll up */
  const bar = $('.bar');
  let lastY = window.scrollY;
  const drawer = $('#drawer');
  const menuBtn = $('.bar__menu');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (drawer.hidden) bar.classList.toggle('is-hidden', y > lastY && y > 300);
    lastY = y;
  }, { passive: true });
  const setDrawer = (open) => { drawer.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.textContent = open ? 'Close' : 'Menu'; };
  menuBtn.addEventListener('click', () => setDrawer(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });

  /* Hero headline: words slide up out of a mask */
  const h1 = $('.reveal-words');
  const words = h1.textContent.trim().split(/\s+/);
  h1.setAttribute('aria-label', h1.textContent.trim());
  h1.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
  requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add('is-in')));

  /* Hero video pause */
  const video = $('.hero__video');
  const pause = $('.hero__pause');
  if (reduce) video.pause();
  const syncPause = () => { pause.textContent = video.paused ? 'Play' : 'Pause'; pause.setAttribute('aria-pressed', String(video.paused)); };
  pause.addEventListener('click', () => (video.paused ? video.play().catch(() => {}) : video.pause()));
  video.addEventListener('play', syncPause); video.addEventListener('pause', syncPause); syncPause();

  /* Segmented buttons (shared) */
  const segValue = (seg) => $('[aria-pressed="true"]', seg).dataset.v;
  $$('.seg').forEach((seg) => seg.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', seg).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    seg.dispatchEvent(new CustomEvent('segchange', { bubbles: true }));
  }));

  /* Course finder */
  const FINDER = {
    uk: { pg: ['£15,000 – £35,000', "1-year master's, January or September start"], ug: ['£16,000 – £30,000', '3-year degree (4 in Scotland), September start'] },
    ca: { pg: ['CA$20,000 – $40,000', "1–2 year master's or PG diploma, Jan, May or Sep"], ug: ['CA$25,000 – $50,000', '4-year degree, September start'] },
    au: { pg: ['A$32,000 – $50,000', "1.5–2 year master's, February or July start"], ug: ['A$30,000 – $48,000', '3-year degree, February or July start'] },
    de: { pg: ['Little or no tuition', 'Public universities charge a semester fee of roughly €150 – €400'], ug: ['Little or no tuition', 'Most bachelor\'s degrees are taught in German'] },
    ie: { pg: ['€12,000 – €28,000', "1-year master's, September start"], ug: ['€12,000 – €25,000', '3–4 year degree, September start'] },
  };
  const finder = $('#finder');
  const out = $('.finder__out', finder);
  finder.addEventListener('segchange', () => {
    const c = segValue($('[data-name="country"]', finder));
    const l = segValue($('[data-name="level"]', finder));
    const [range, meta] = FINDER[c][l];
    $('[data-out="range"]', finder).textContent = range;
    $('[data-out="meta"]', finder).textContent = meta;
    out.classList.remove('is-swap'); void out.offsetWidth; out.classList.add('is-swap');
  });
  finder.addEventListener('submit', (e) => e.preventDefault());

  /* Countries: vertical scroll moves the track sideways (desktop) */
  const section = $('.countries');
  const sticky = $('.countries__sticky');
  const track = $('.countries__track');
  const desktop = window.matchMedia('(min-width: 901px)');
  let travel = 0;
  const sizeCountries = () => {
    if (!desktop.matches) { section.style.height = ''; track.style.transform = ''; return; }
    travel = Math.max(0, track.scrollWidth - window.innerWidth);
    section.style.height = `${sticky.offsetHeight + travel}px`;
    moveCountries();
  };
  const moveCountries = () => {
    if (!desktop.matches) return;
    const top = section.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / (section.offsetHeight - sticky.offsetHeight || 1)));
    track.style.transform = `translate3d(${-p * travel}px,0,0)`;
  };
  window.addEventListener('scroll', moveCountries, { passive: true });
  window.addEventListener('resize', sizeCountries);
  window.addEventListener('load', sizeCountries);
  desktop.addEventListener('change', sizeCountries);
  sizeCountries();
  // keyboard: arrow keys on the focused track scroll the page by one card
  track.addEventListener('keydown', (e) => {
    if (!desktop.matches) return;
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return; e.preventDefault();
    window.scrollBy({ top: dir * 380, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* Passport stamps thump in once the passport is in view */
  const passport = $('.passport');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { passport.classList.add('is-stamped'); io.disconnect(); } }, { threshold: 0.45 });
    io.observe(passport);
  } else passport.classList.add('is-stamped');

  /* Cost estimator (indicative, ₹ lakh per year) */
  const COST = {
    uk: { t: 22, big: 15, small: 11, v: 1.6, s: 1.5 },
    ca: { t: 20, big: 12.5, small: 9.5, v: 1.0, s: 1.6 },
    au: { t: 26, big: 15, small: 12, v: 1.6, s: 1.7 },
    ie: { t: 16, big: 13, small: 10, v: 0.7, s: 1.3 },
    de: { t: 0.6, big: 10.5, small: 9, v: 1.3, s: 1.2 },
    nl: { t: 15, big: 11.5, small: 9.5, v: 0.9, s: 1.3 },
    nz: { t: 20, big: 13, small: 10.5, v: 0.9, s: 1.9 },
  };
  const calc = $('#calc');
  const fmt = (n) => `₹${n < 10 ? n.toFixed(1).replace(/\.0$/, '') : Math.round(n)} lakh`;
  const runCalc = () => {
    const c = COST[$('#c-country').value];
    const yrs = Number(segValue($('[data-name="years"]', calc)));
    const city = segValue($('[data-name="city"]', calc));
    const parts = { tuition: c.t * yrs, living: c[city] * yrs, visa: c.v * (yrs === 2 ? 1.5 : 1), setup: c.s };
    const total = Object.values(parts).reduce((a, b) => a + b, 0);
    const max = Math.max(...Object.values(parts));
    $('[data-out="total"]', calc).textContent = fmt(total);
    Object.entries(parts).forEach(([k, v]) => {
      $(`[data-out="${k}"]`, calc).textContent = fmt(v);
      $(`[data-bar="${k}"]`, calc).style.width = `${Math.max(3, (v / max) * 100)}%`;
    });
  };
  $('#c-country').addEventListener('change', runCalc);
  calc.addEventListener('segchange', runCalc);
  runCalc();

  /* Journey: red line fills as you scroll through the steps */
  const steps = $('.steps');
  const fill = $('.steps__fill');
  const items = $$('.steps li');
  const moveSteps = () => {
    const r = steps.getBoundingClientRect();
    const mid = window.innerHeight * 0.55;
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    fill.style.height = `${p * 100}%`;
    items.forEach((li) => li.classList.toggle('is-done', li.getBoundingClientRect().top + 16 < mid));
  };
  window.addEventListener('scroll', moveSteps, { passive: true });
  moveSteps();

  /* Callback form (front-end only — connect to CRM / form endpoint) */
  const form = $('#callback-form');
  const msg = $('.callback__msg', form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#cb-name'); const phone = $('#cb-phone');
    const badName = !name.value.trim();
    const badPhone = !phone.checkValidity() || !phone.value.trim();
    name.setAttribute('aria-invalid', String(badName));
    phone.setAttribute('aria-invalid', String(badPhone));
    if (badName) { msg.textContent = 'Enter your name so we know who to ask for.'; name.focus(); return; }
    if (badPhone) { msg.textContent = 'Enter a 10-digit Indian mobile number.'; phone.focus(); return; }
    console.log('Callback request', Object.fromEntries(new FormData(form)));
    msg.textContent = `Thanks, ${name.value.trim().split(' ')[0]}. A counsellor will call you within one working day.`;
    form.reset();
  });
})();
