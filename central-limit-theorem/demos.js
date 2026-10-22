// Sample Space · Central Limit Theorem demos. Plain canvas, drawn at low resolution and scaled up pixelated.
(() => {
  const C = { screen: '#0e1211', dim: '#1b211f', ph: '#8dffa8', ink: '#d3e6da', acc: '#ff4d00', faint: '#3d5547' };
  const R = Math.random;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - R())) * Math.cos(2 * Math.PI * R());
  const pdf = (x, mu, sd) => Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
  const sdOf = v => { const m = v.reduce((s, x) => s + x, 0) / v.length; return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length); };
  const int = n => Math.round(n).toLocaleString('en-US');
  const $ = id => document.getElementById(id);
  const repeat = (k, f) => Array.from({ length: k }, f);

  function ctxOf(cv) { const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; return c; }

  // The method from "Build it". The page shows this function's own source text, so keep it readable.
  function interval(samples, z = 1.96) {
    const n = samples.length;
    // 1. average
    const avg = samples.reduce((s, x) => s + x, 0) / n;
    // 2. spread: the typical distance from the average
    const spread = Math.sqrt(samples.reduce((s, x) => s + (x - avg) ** 2, 0) / (n - 1));
    // 3. give or take z × spread ÷ √n
    const margin = z * spread / Math.sqrt(n);
    return [avg - margin, avg + margin];
  }
  $('code').textContent = interval.toString().replace(/\n {2}/g, '\n');

  /* ---------- shared drawing: bars with an orange truth line and an optional dotted bell ---------- */
  const B = 60;
  function counts(values, lo, hi) {
    const c = new Array(B).fill(0); let off = 0;
    for (const v of values) { const b = Math.floor((v - lo) / (hi - lo) * B); if (b < 0 || b >= B) off++; else c[b]++; }
    return { c, off };
  }
  function bars(cv, hs, { lo, hi, truth, curve } = {}) {
    const g = ctxOf(cv), W = cv.width, H = cv.height, w = W / hs.length;
    g.fillStyle = C.screen; g.fillRect(0, 0, W, H);
    if (truth !== undefined) { g.fillStyle = C.acc; g.fillRect(Math.round((truth - lo) / (hi - lo) * W), 0, 1, H); }
    g.fillStyle = C.ph;
    hs.forEach((h, i) => { const p = Math.round(Math.min(1, h) * (H - 4)); if (p) g.fillRect(Math.round(i * w), H - p, Math.max(1, Math.round(w) - 1), p); });
    if (curve) { g.fillStyle = C.ink; curve.forEach((h, i) => { if (h <= 1) g.fillRect(Math.round(i * w + w / 2 - 1), H - 1 - Math.round(h * (H - 4)), 2, 1); }); }
  }
  // histogram of values; bell = { mu, sd, step } draws the predicted curve (step: spacing of a whole-number source)
  function hist(cv, values, lo, hi, { truth, bell } = {}) {
    const { c, off } = counts(values, lo, hi), bw = (hi - lo) / B;
    const curve = bell && c.map((_, b) => values.length * Math.max(bw, (bell.step || 0)) * pdf(lo + (b + 0.5) * bw, bell.mu, bell.sd));
    const top = Math.max(...c, ...(curve || [0]));
    bars(cv, c.map(x => x / top), { lo, hi, truth, curve: curve && curve.map(x => x / top) });
    return off;
  }
  // horizontal intervals, one per row; green if it contains the truth
  function intervals(cv, list, truth, lo, hi) {
    const g = ctxOf(cv), W = cv.width, H = cv.height, row = H / list.length, h = Math.max(1, Math.floor(row * 0.6));
    const x = v => Math.round((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * (W - 1));
    g.fillStyle = C.screen; g.fillRect(0, 0, W, H);
    g.fillStyle = C.acc; g.fillRect(x(truth), 0, 1, H);
    let hits = 0;
    list.forEach(([a, b], i) => {
      const hit = a <= truth && truth <= b; hits += hit;
      g.fillStyle = hit ? C.ph : C.ink;
      g.fillRect(x(a), Math.floor(i * row + (row - h) / 2), Math.max(1, x(b) - x(a)), h);
    });
    return hits;
  }

  /* ---------- A. the coin pile ---------- */
  const pile = $('pile'), heads = new Array(11).fill(0); let throws = 0, last = '';
  function drawPile() {
    const g = ctxOf(pile), W = pile.width, H = pile.height, cap = Math.floor((H - 2) / 4);
    const k = Math.max(1, Math.ceil(Math.max(...heads) / cap)); // each block stands for k throws once a pile would overflow
    g.fillStyle = C.screen; g.fillRect(0, 0, W, H);
    heads.forEach((c, i) => {
      g.fillStyle = i === 5 ? C.ph : C.ink;
      for (let j = 0; j < Math.ceil(c / k); j++) g.fillRect(i * 20 + 1, H - 4 - j * 4, 18, 3);
    });
    $('pile-out').textContent = throws
      ? `${last}After ${int(throws)} throws: 5 heads came up ${heads[5]} times, 10 heads ${heads[10]} times.${k > 1 ? ` Each block is ${k} throws.` : ''}`
      : 'The piles are empty. Throw the coins.';
  }
  function throwCoins(times) {
    for (let t = 0; t < times; t++) {
      const coins = repeat(10, () => R() < 0.5), h = coins.filter(Boolean).length;
      heads[h]++; throws++;
      last = `Last throw: ${coins.map(c => (c ? 'H' : 'T')).join(' ')} → ${h} heads. `;
    }
    drawPile();
  }
  $('pile-1').addEventListener('click', () => throwCoins(1));
  $('pile-100').addEventListener('click', () => throwCoins(100));
  $('pile-reset').addEventListener('click', () => { heads.fill(0); throws = 0; last = ''; drawPile(); });

  /* ---------- B. the sum machine ---------- */
  const weights = [0.9, 0.7, 0.35, 0.15, 0.05, 0.05, 0.1, 0.25, 0.5, 0.8, 1, 0.6];
  const SRC = {
    coin: { lo: -0.1, hi: 1.1, mu: 0.5, sd: 0.5, step: 1, draw: () => +(R() < 0.5) },
    die: { lo: 0.5, hi: 6.5, mu: 3.5, sd: Math.sqrt(35 / 12), step: 1, draw: () => 1 + ((R() * 6) | 0) },
    wait: { lo: 0, hi: 5, mu: 1, sd: 1, draw: () => -Math.log(1 - R()) },
    torch: { lo: -10, hi: 10, draw: () => Math.tan(Math.PI * (R() - 0.5)) }, // Cauchy: no average, no spread
    get drawn() {
      const tot = weights.reduce((s, x) => s + x, 0), mu = weights.reduce((s, x, i) => s + i * x, 0) / tot;
      const sd = Math.sqrt(weights.reduce((s, x, i) => s + (i - mu) ** 2 * x, 0) / tot);
      return { lo: -0.5, hi: 11.5, mu, sd, step: 1, draw: () => { let u = R() * tot; for (let i = 0; i < 12; i++) if ((u -= weights[i]) < 0) return i; return 11; } };
    },
  };
  const src = $('src'), avg = $('avg'), avgN = $('avg-n'); let key = 'die';
  function runMachine() {
    const s = SRC[key], n = +avgN.value; $('avg-nv').textContent = n;
    if (key === 'drawn') { const top = Math.max(...weights); bars(src, weights.map(w => w / top), { lo: s.lo, hi: s.hi, truth: s.mu }); }
    else hist(src, repeat(20000, s.draw), s.lo, s.hi, { truth: s.mu });
    const avgs = repeat(2000, () => { let t = 0; for (let i = 0; i < n; i++) t += s.draw(); return t / n; });
    const off = hist(avg, avgs, s.lo, s.hi, { truth: s.mu, bell: s.sd && { mu: s.mu, sd: s.sd / Math.sqrt(n), step: s.step / n } });
    $('src-tag').textContent = key === 'drawn' ? 'What we sample from: drag on this screen to draw a shape' : 'What we sample from';
    src.style.touchAction = key === 'drawn' ? 'none' : '';
    $('avg-out').textContent = s.sd
      ? `${n} sample${n > 1 ? 's' : ''} per average. The hill's likely error is 2 × ${s.sd.toFixed(2)} ÷ √${n} = ±${(2 * s.sd / Math.sqrt(n)).toFixed(2)}.`
      : `${off} of 2,000 averages landed off the screen. Raise the samples: the hill never narrows, because one wild spot can drag any average.`;
  }
  function setSource(k) {
    key = k;
    document.querySelectorAll('[data-src]').forEach(b => b.setAttribute('aria-pressed', b.dataset.src === k));
    runMachine();
  }
  document.querySelectorAll('[data-src]').forEach(b => b.addEventListener('click', () => setSource(b.dataset.src)));
  avgN.addEventListener('input', runMachine);
  $('avg-go').addEventListener('click', runMachine);
  let queued = false;
  function paint(e) {
    if (key !== 'drawn') return;
    const r = src.getBoundingClientRect();
    const i = Math.min(11, Math.max(0, Math.floor((e.clientX - r.left) / r.width * 12)));
    weights[i] = Math.min(1, Math.max(0.02, 1 - (e.clientY - r.top) / r.height));
    if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; runMachine(); }); }
  }
  src.addEventListener('pointerdown', e => { if (key === 'drawn') { src.setPointerCapture(e.pointerId); paint(e); } });
  src.addEventListener('pointermove', e => { if (e.buttons & 1) paint(e); });
  document.querySelectorAll('[data-try]').forEach(b => b.addEventListener('click', () => {
    const [k, n] = b.dataset.try.split(','); avgN.value = n; setSource(k);
    $('machine').scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- C. interval coverage: does the "Build it" recipe keep its promise? ---------- */
  const cover = $('cover'), coverN = $('cover-n'); let z = 1.96;
  function runCover() {
    const n = Math.round(10 ** +coverN.value); $('cover-nv').textContent = n;
    const list = repeat(100, () => interval(repeat(n, SRC.die.draw), z));
    const hits = intervals(cover, list, 3.5, 1, 6), promise = { 1.645: 90, 1.96: 95, 2.576: 99 }[z];
    $('cover-out').textContent = `${hits} of 100 intervals caught 3.5. The promise is about ${promise}.`
      + (n < 15 ? ' With this few rolls the spread itself is a rough guess, so a few more miss than promised.' : '');
  }
  coverN.addEventListener('input', runCover);
  $('cover-go').addEventListener('click', runCover);
  document.querySelectorAll('[data-z]').forEach(b => b.addEventListener('click', () => {
    z = +b.dataset.z;
    document.querySelectorAll('[data-z]').forEach(o => o.setAttribute('aria-pressed', o === b));
    runCover();
  }));

  /* ---------- in the wild ---------- */
  const yesNo = (n, p) => repeat(n, () => +(R() < p));
  function runPoll() {
    const list = repeat(20, () => interval(yesNo(1000, 0.42)));
    const hits = intervals($('poll'), list, 0.42, 0.35, 0.49);
    const m = (list[0][1] - list[0][0]) / 2 * 100;
    $('poll-out').textContent = `20 polls of 1,000 voters each, true support 42%. ${hits} of 20 caught it. Each said "give or take ${m.toFixed(1)}".`;
  }
  $('poll-go').addEventListener('click', runPoll);

  const benchN = $('bench-n');
  function runBench() {
    const n = Math.round(10 ** +benchN.value / 10) * 10; $('bench-nv').textContent = int(n);
    intervals($('bench'), repeat(20, () => interval(yesNo(n, 0.8))), 0.8, 0.6, 1);
    const m = 1.96 * Math.sqrt(0.8 * 0.2 / n) * 100;
    $('bench-out').textContent = `One model, truly 80% right, scored on 20 different test sets of ${int(n)} questions. Its score wobbles about ±${m.toFixed(1)} points, so two models closer than that can't be told apart.`;
  }
  benchN.addEventListener('input', runBench);

  // one gradient per example: y = 2x + noise, slope of the squared error at w = 0
  const N = 20000, gs = repeat(N, () => { const x = 2 * R() - 1, y = 2 * x + gauss(); return -2 * x * y; });
  const gTrue = gs.reduce((s, x) => s + x, 0) / N, gSd = sdOf(gs);
  const sgdB = $('sgd-b');
  function runSgd() {
    const b = 2 ** +sgdB.value; $('sgd-bv').textContent = int(b);
    const ests = repeat(2000, () => { let s = 0; for (let j = 0; j < b; j++) s += gs[(R() * N) | 0]; return s / b; });
    hist($('sgd'), ests, gTrue - 4, gTrue + 4, { truth: gTrue, bell: { mu: gTrue, sd: gSd / Math.sqrt(b) } });
    $('sgd-out').textContent = `Batch ${int(b)}: 2,000 gradient estimates, spread ±${(gSd / Math.sqrt(b)).toFixed(2)} around the true one.`
      + (b < 8 ? ' At this size the pile is still lopsided. Raise the batch.' : ' The pile is a bell.');
  }
  sgdB.addEventListener('input', runSgd);

  const facts = {
    poll: ['1,000 people → ±3 points, for a country of any size.', 'Every margin of error on the news is the three-step recipe from "Build it", with a spread of about 0.5 for a split country. About 1 poll in 20 misses even when it is done perfectly.', 'var(--accent)'],
    bench: ['On a 1,000-question test, a model\'s score is good to about ±2.5 points.', 'When a new AI model "beats" an old one by a point on a small test, the gap may be luck. Leaderboards that print error bars use this formula, and so do A/B tests that compare two versions of a website.', 'var(--phosphor)'],
    sgd: ['A batch of 64 averages 64 noisy slopes, so its error is close to a bell.', 'A neural network learns by averaging the slope of its error over a small random batch. Its mistake on each step is close to a bell whose width shrinks like 1/√batch, which is why researchers often model training noise as a bell.', 'var(--muted)'],
  };
  const runs = { poll: runPoll, bench: runBench, sgd: runSgd }, done = {};
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

  /* ---------- the premonition: a frog that remembers ---------- */
  function frogWalk(n) {
    let pad = 1 + ((R() * 3) | 0), t = 0;
    for (let i = 0; i < n; i++) { t += pad; if (R() >= 0.8) pad = [1, 2, 3].filter(p => p !== pad)[(R() * 2) | 0]; }
    return t / n;
  }
  function runFrog() {
    const a = repeat(2000, () => { let t = 0; for (let i = 0; i < 50; i++) t += 1 + ((R() * 3) | 0); return t / 50; });
    const b = repeat(2000, () => frogWalk(50));
    const ca = counts(a, 1, 3).c, cb = counts(b, 1, 3).c, top = Math.max(...ca, ...cb); // one scale, so the wider hill is also lower
    bars($('frog-a'), ca.map(x => x / top), { lo: 1, hi: 3, truth: 2 });
    bars($('frog-b'), cb.map(x => x / top), { lo: 1, hi: 3, truth: 2 });
    $('frog-out').textContent = `Both hills sit on 2. The frog's hill is ${(sdOf(b) / sdOf(a)).toFixed(1)} times as wide.`;
  }
  $('frog-go').addEventListener('click', runFrog);

  /* ---------- pixel sprites and the series mark ---------- */
  const SPR = {
    coin: ['00111100', '01111110', '11100111', '11011011', '11011011', '11100111', '01111110', '00111100'],
    outlier: ['00000011', '00000011', '00000000', '00000000', '00000000', '00000000', '11011000', '11011000'],
    die: ['11111111', '10000001', '10100101', '10000001', '10000001', '10100101', '10000001', '11111111'],
    spike: ['00010000', '00010000', '00010000', '00010000', '00010000', '00111000', '01111100', '11111111'],
    chain: ['00000000', '01100000', '10011000', '01100110', '00011001', '00000110', '00000000', '00000000'],
    lens: ['00111000', '01000100', '10000010', '10000010', '01000100', '00111110', '00000111', '00000011'],
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

  throwCoins(100); runMachine(); runCover(); runFrog(); pick('poll');
})();
