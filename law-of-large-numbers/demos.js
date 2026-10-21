// Sample Space · Law of Large Numbers demos. Plain canvas, drawn at low resolution and scaled up pixelated.
(() => {
  const C = { screen: '#0e1211', dim: '#1b211f', band: '#223029', ph: '#8dffa8', ink: '#d3e6da', acc: '#ff4d00', faint: '#3d5547' };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = Math.random;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - R())) * Math.cos(2 * Math.PI * R());
  const fmt = (x, d = 3) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(d);
  const int = n => Math.round(n).toLocaleString('en-US');
  const $ = id => document.getElementById(id);

  function ctxOf(cv) { const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; return c; }

  // running means of a sampler, as a Float64Array of length n
  function runMean(n, sample) {
    const m = new Float64Array(n); let s = 0;
    for (let i = 0; i < n; i++) { s += sample(); m[i] = s / (i + 1); }
    return m;
  }

  // One chart for every "average over n" demo: log-x, pixel columns, an orange true-value row.
  function chart(cv, { nmax, lo, hi, truths, paths, band, upTo = 1 }) {
    const g = ctxOf(cv), W = cv.width, H = cv.height, L = Math.log10(nmax);
    const y = v => Math.round((1 - (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * (H - 1));
    const nAt = x => Math.max(1, Math.round(10 ** (x / (W - 1) * L)));
    g.fillStyle = C.screen; g.fillRect(0, 0, W, H);
    const cols = Math.round((W - 1) * upTo);
    if (band) for (let x = 0; x <= cols; x++) {
      const n = nAt(x), h = band(n), t = truths[0];
      const a = y(t + h), b = y(t - h); g.fillStyle = C.band; g.fillRect(x, a, 1, b - a + 1);
    }
    g.fillStyle = C.acc; for (const t of truths) g.fillRect(0, y(t), W, 1);
    for (const p of paths) {
      g.fillStyle = p.color; let prev = null;
      for (let x = 0; x <= cols; x++) {
        const n = nAt(x); if (n > p.m.length) break;
        const v = y(p.m[n - 1]);
        if (prev === null) g.fillRect(x, v, 1, 1);
        else g.fillRect(x, Math.min(prev, v), 1, Math.abs(prev - v) + 1);
        prev = v;
      }
    }
  }

  // reveal a chart left to right over ~1.2 s
  function animate(draw) {
    if (reduce) return draw(1);
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1200); draw(k); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------- A. the coin (the live toy) ---------- */
  const coin = $('coin'), coinN = $('coin-n'), coinC = $('coin-cauchy');
  function runCoin() {
    const n = Math.round(10 ** +coinN.value), cauchy = coinC.getAttribute('aria-pressed') === 'true';
    $('coin-nv').textContent = int(n);
    const sample = cauchy ? () => Math.tan(Math.PI * (R() - 0.5)) : () => (R() < 0.5 ? 1 : 0);
    const cols = [C.ph, C.ink, C.ph, C.ink, C.ph];
    const paths = cols.map(color => ({ color, m: runMean(n, sample) }));
    const opts = cauchy
      ? { nmax: n, lo: -2, hi: 2, truths: [0], paths }
      : { nmax: n, lo: 0.15, hi: 0.85, truths: [0.5], paths, band: k => 0.5 / Math.sqrt(k) };
    animate(k => chart(coin, { ...opts, upTo: k }));
    const ends = paths.map(p => fmt(p.m[n - 1])).join('  ');
    $('coin-out').textContent = cauchy
      ? `After ${int(n)} Cauchy samples, five averages: ${ends}. There is no σ and no band. Run it again: they never settle.`
      : `After ${int(n)} flips, five averages: ${ends}. Typical error σ/√n = ±${(0.5 / Math.sqrt(n)).toFixed(4)}.`;
  }
  coinN.addEventListener('input', runCoin);
  $('coin-go').addEventListener('click', runCoin);
  coinC.addEventListener('click', () => { coinC.setAttribute('aria-pressed', coinC.getAttribute('aria-pressed') !== 'true'); runCoin(); });

  /* ---------- speed tiles: n×n pixels, one per flip ---------- */
  document.querySelectorAll('.g canvas').forEach(cv => {
    const n = +cv.dataset.n; cv.width = cv.height = n;
    const g = cv.getContext('2d'), img = g.createImageData(n, n), d = img.data;
    for (let i = 0; i < n * n; i++) {
      const h = R() < 0.5;
      d[i * 4] = h ? 0x8d : 0x0e; d[i * 4 + 1] = h ? 0xff : 0x12; d[i * 4 + 2] = h ? 0xa8 : 0x11; d[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });

  /* ---------- B. Monte Carlo π ---------- */
  const pi = $('pi'), pg = ctxOf(pi); let inside = 0, total = 0;
  function piReset() {
    inside = total = 0; pg.fillStyle = C.screen; pg.fillRect(0, 0, 200, 200);
    pg.fillStyle = C.dim; for (let x = 0; x < 200; x++) { const h = Math.round(Math.sqrt(200 * 200 - x * x)); pg.fillRect(x, 200 - h, 1, h); }
    $('pi-out').textContent = 'Throw darts at the square. π ≈ 4 × (darts inside the quarter circle) / (all darts).';
  }
  function throwDarts(k) {
    for (let i = 0; i < k; i++) {
      const x = R(), y = R(), hit = x * x + y * y <= 1;
      inside += hit; total++;
      pg.fillStyle = hit ? C.ph : C.faint; pg.fillRect(Math.floor(x * 200), 199 - Math.floor(y * 200), 1, 1);
    }
    const est = 4 * inside / total;
    $('pi-out').textContent = `${int(total)} darts · π ≈ ${est.toFixed(4)} · off by ${Math.abs(est - Math.PI).toFixed(4)} · expected error about ±${(1.64 / Math.sqrt(total)).toFixed(4)}`;
  }
  $('pi-100').addEventListener('click', () => throwDarts(100));
  $('pi-10k').addEventListener('click', () => throwDarts(10000));
  $('pi-reset').addEventListener('click', piReset);

  /* ---------- C. mini-batch SGD: y = 2x + noise, gradient of MSE at w = 0 ---------- */
  const N = 20000, xs = new Float64Array(N), gs = new Float64Array(N); let gTrue = 0;
  for (let i = 0; i < N; i++) { const x = 2 * R() - 1, y = 2 * x + gauss(); xs[i] = x; gs[i] = -2 * x * y; gTrue += gs[i] / N; }
  const sgd = $('sgd'), sb = $('sgd-b');
  function runSgd() {
    const b = 2 ** +sb.value; $('sgd-bv').textContent = int(b);
    const g = ctxOf(sgd), W = 240, H = 200, lo = gTrue - 3, hi = gTrue + 3, K = 300;
    g.fillStyle = C.screen; g.fillRect(0, 0, W, H);
    const xOf = v => Math.round((v - lo) / (hi - lo) * (W - 1));
    g.fillStyle = C.acc; g.fillRect(xOf(gTrue), 0, 1, H);
    let ss = 0;
    for (let k = 0; k < K; k++) {
      let s = 0; for (let j = 0; j < b; j++) s += gs[(R() * N) | 0];
      const est = s / b; ss += (est - gTrue) ** 2;
      const x = xOf(est); if (x < 0 || x >= W) continue;
      g.fillStyle = C.ph; g.fillRect(x, 8 + ((R() * (H - 16)) | 0), 2, 2);
    }
    $('sgd-out').textContent = `Batch ${int(b)}: 300 gradient estimates, spread ±${Math.sqrt(ss / K).toFixed(3)} around the true gradient ${fmt(gTrue)}. Quadruple the batch to halve the spread.`;
  }
  sb.addEventListener('input', runSgd);

  /* ---------- D. the house edge: red on a single-zero wheel ---------- */
  const house = $('house');
  function runHouse() {
    const take = () => (R() < 18 / 37 ? -1 : 1); // the house's result on one even-money bet
    const nights = [0, 1, 2, 3].map(() => runMean(200, take));
    const big = runMean(100000, take);
    const paths = [...nights.map(m => ({ color: C.ink, m })), { color: C.ph, m: big }];
    animate(k => chart(house, { nmax: 100000, lo: -0.5, hi: 0.5, truths: [1 / 37], paths, upTo: k }));
    const players = nights.map(m => { const v = -Math.round(m[199] * 200); return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v); }).join(', ');
    $('house-out').textContent = `Four players, 200 bets each, end the night at ${players} units. Over 100,000 bets the house keeps ${(big[99999] * 100).toFixed(2)}% per bet.`;
  }
  $('house-go').addEventListener('click', runHouse);

  /* ---------- E. A/B test: 10% vs 11% ---------- */
  const ab = $('ab');
  function runAb() {
    const n = 50000, a = runMean(n, () => +(R() < 0.10)), b = runMean(n, () => +(R() < 0.11));
    let flips = 0, last = 0;
    for (let i = 1; i < n; i++) if ((b[i] > a[i]) !== (b[i - 1] > a[i - 1])) { flips++; last = i + 1; }
    animate(k => chart(ab, { nmax: n, lo: 0.04, hi: 0.17, truths: [0.10, 0.11], paths: [{ color: C.ph, m: a }, { color: C.ink, m: b }], upTo: k }));
    $('ab-out').textContent = `The leader changed ${flips} times${flips ? `, last at visitor ${int(last)}` : ''}. After ${int(n)} visitors each: A ${(a[n - 1] * 100).toFixed(2)}%, B ${(b[n - 1] * 100).toFixed(2)}%.`;
  }
  $('ab-go').addEventListener('click', runAb);

  /* ---------- the "in the wild" switcher ---------- */
  const facts = {
    pi: ['100× the darts buys 10× the accuracy.', 'The fraction of random darts that land inside the quarter circle is π/4. Physics simulations, option pricing, path-traced film frames and the rollouts in reinforcement learning are this same trick at scale.', 'var(--accent)'],
    sgd: ['Batch 256 is 16× less noisy than batch 1, for 256× the compute.', 'A neural network can\'t afford the gradient of its loss over all its data, so each step averages the gradient of a small random batch. The law says that average points the right way; the batch size decides how noisy it is.', 'var(--phosphor)'],
    house: ['Betting red on a single-zero wheel, the house edge is 1/37 ≈ 2.70%.', 'One player\'s night is chaos. Across millions of bets the casino\'s average take per bet locks onto its edge. Insurers price premiums the same way.', 'var(--muted)'],
    ab: ['Telling 10% from 11% with 80% power takes about 15,000 visitors per version.', 'Two versions of a page convert at 10% and 11%. Early on the leader flips back and forth; only with enough visitors do the averages separate for good. Polls, clinical trials and benchmark scores are the same calculation.', 'var(--ink)'],
  };
  const runs = { pi: () => { if (!total) { piReset(); throwDarts(1000); } }, sgd: runSgd, house: runHouse, ab: runAb };
  const done = {};
  function pick(k) {
    document.querySelectorAll('.wild-list button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.dataset.k === k));
    $('fact-big').textContent = facts[k][0]; $('fact-text').textContent = facts[k][1];
    document.querySelector('.block').style.setProperty('--blk', facts[k][2]);
    if (!done[k]) { done[k] = 1; runs[k](); }
  }
  document.querySelectorAll('.wild-list button').forEach(b => {
    b.addEventListener('click', () => pick(b.dataset.k));
    b.addEventListener('mouseenter', () => matchMedia('(hover: hover)').matches && pick(b.dataset.k));
  });

  /* ---------- the premonition: one pixel per experiment ---------- */
  const hist = $('hist'); hist.height = 215;
  function runHist(instant) {
    const g = ctxOf(hist), W = hist.width, H = hist.height, counts = new Array(41).fill(0), E = 500;
    g.fillStyle = C.screen; g.fillRect(0, 0, W, H);
    g.fillStyle = C.acc; g.fillRect(20 * 5, H - 1, 4, 1);
    const bins = Array.from({ length: E }, () => { let h = 0; for (let i = 0; i < 100; i++) h += R() < 0.5; return Math.min(40, Math.max(0, h - 30)); });
    let i = 0;
    const drop = () => {
      const upto = reduce || instant ? E : Math.min(E, i + 6);
      for (; i < upto; i++) {
        const b = bins[i], c = counts[b]++;
        g.fillStyle = C.ph; g.fillRect(b * 5, H - 3 - (c + 1) * 5, 4, 4);
      }
      if (i < E) requestAnimationFrame(drop);
    };
    drop();
  }
  runHist(true); // never an empty screen, even without scrolling
  $('hist-go').addEventListener('click', () => runHist());
  // the pile builds itself the first time it comes into view
  if ('IntersectionObserver' in window) {
    const ho = new IntersectionObserver(es => { if (es[0].isIntersecting) { ho.disconnect(); runHist(); } }, { threshold: 0.4 });
    ho.observe(hist);
  } else runHist();


  /* ---------- pixel sprites and the series mark ---------- */
  const SPR = {
    coin: ['00111100', '01111110', '11100111', '11011011', '11011011', '11100111', '01111110', '00111100'],
    outlier: ['00000011', '00000011', '00000000', '00000000', '00000000', '00000000', '11011000', '11011000'],
    die: ['11111111', '10000001', '10100101', '10000001', '10000001', '10100101', '10000001', '11111111'],
    spike: ['00010000', '00010000', '00010000', '00010000', '00010000', '00111000', '01111100', '11111111'],
    chain: ['00000000', '01100000', '10011000', '01100110', '00011001', '00000110', '00000000', '00000000'],
    lens: ['00111000', '01000100', '10000010', '10000010', '01000100', '00111110', '00000111', '00000011'],
    calendar: ['01000010', '11111111', '10000001', '11111111', '10010001', '10000001', '10000101', '11111111'],
  };
  const NS = 'http://www.w3.org/2000/svg';
  const rects = (svg, rows, fill, ox = 0, oy = 0) => rows.forEach((r, y) => [...r].forEach((b, x) => {
    if (b !== '1') return;
    const e = document.createElementNS(NS, 'rect');
    e.setAttribute('x', ox + x); e.setAttribute('y', oy + y); e.setAttribute('width', 1); e.setAttribute('height', 1); e.setAttribute('fill', fill);
    svg.appendChild(e);
  }));
  document.querySelectorAll('[data-sprite]').forEach(s => { s.setAttribute('viewBox', '0 0 8 8'); rects(s, SPR[s.dataset.sprite], '#121417'); });

  const F = {
    S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'], A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'], P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
    L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'], E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  };
  const mark = $('mark'), word = 'SAMPLE SPACE'; let x = 0;
  for (const ch of word) { if (ch === ' ') { x += 3; continue; } rects(mark, F[ch], '#121417', x, 0); x += 6; }
  rects(mark, ['1', '1', '1', '1', '1', '1', '1'], '#ff4d00', x, 0); // a cursor block
  mark.setAttribute('viewBox', `0 0 ${x + 1} 7`);

  /* ---------- entrances: reveal whatever has scrolled into view, staggered within its parent ---------- */
  let pending = [...document.querySelectorAll('.rise')], ticking = false;
  function reveal() {
    ticking = false;
    const seen = new Map();
    pending = pending.filter(el => {
      if (el.getBoundingClientRect().top > innerHeight * 0.94) return true;
      const k = seen.get(el.parentElement) || 0; seen.set(el.parentElement, k + 1);
      el.style.transitionDelay = `${Math.min(k, 5) * 70}ms`; el.classList.add('in');
      return false;
    });
    if (!pending.length) removeEventListener('scroll', onScroll);
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(reveal); } };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
  reveal();

  runCoin(); pick('pi');
})();
