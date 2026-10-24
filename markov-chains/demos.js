// Sample Space · Markov Chains demos. Plain canvas, drawn at low resolution and scaled up pixelated.
(() => {
  const C = { screen: '#0e1211', dim: '#1b211f', ph: '#8dffa8', ink: '#d3e6da', acc: '#ff4d00', faint: '#3d5547' };
  const R = Math.random;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - R())) * Math.cos(2 * Math.PI * R());
  const pct = x => `${Math.round(x * 100)}%`;
  const int = n => Math.round(n).toLocaleString('en-US');
  const $ = id => document.getElementById(id);
  const repeat = (k, f) => Array.from({ length: k }, f);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ctxOf(cv) { const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; return c; }
  function clear(cv) { const g = ctxOf(cv); g.fillStyle = C.screen; g.fillRect(0, 0, cv.width, cv.height); return g; }

  // The text machine from "Build it". The page shows this function's own source text, so keep it readable.
  function babble(text, memory = 1, length = 40) {
    const words = text.toLowerCase().match(/[a-z']+|[.,!?]/g);
    words.push(...words.slice(0, memory)); // wrap around, so every "now" has a next word
    // 1. count: for every "now" (the last few words), list the words that came next
    const next = {};
    for (let i = memory; i < words.length; i++) {
      const now = words.slice(i - memory, i).join(' ');
      (next[now] ||= []).push(words[i]);
    }
    // 2. babble: start somewhere, then keep picking a next word for the current "now"
    const at = Math.floor(Math.random() * (words.length - memory));
    const out = words.slice(at, at + memory);
    while (out.length < length) {
      const options = next[out.slice(-memory).join(' ')];
      out.push(options[Math.floor(Math.random() * options.length)]);
    }
    return out.join(' ').replace(/ ([.,!?])/g, '$1');
  }
  $('code').textContent = babble.toString().replace(/\n {2}/g, '\n');

  /* ---------- shared drawing ---------- */
  // one bar per state, full height = 100%; marks = optional orange tick per bar
  function padBars(cv, shares, marks) {
    const g = clear(cv), W = cv.width, H = cv.height, n = shares.length, w = W / n, bw = Math.round(w * 0.6);
    shares.forEach((s, i) => {
      const x = Math.round(i * w + (w - bw) / 2), h = Math.round(Math.min(1, s) * (H - 2));
      g.fillStyle = C.dim; g.fillRect(x, 0, bw, H);
      g.fillStyle = C.ph; if (h) g.fillRect(x, H - h, bw, h);
      if (marks) { g.fillStyle = C.acc; g.fillRect(x - 3, H - 1 - Math.round(marks[i] * (H - 2)), bw + 6, 1); }
    });
  }
  // histogram bars scaled 0..1 with an optional orange truth line (as in the earlier issues)
  function bars(cv, hs, { lo, hi, truth } = {}) {
    const g = clear(cv), W = cv.width, H = cv.height, w = W / hs.length;
    if (truth !== undefined) { g.fillStyle = C.acc; g.fillRect(Math.round((truth - lo) / (hi - lo) * W), 0, 1, H); }
    g.fillStyle = C.ph;
    hs.forEach((h, i) => { const p = Math.round(Math.min(1, h) * (H - 4)); if (p) g.fillRect(Math.round(i * w), H - p, Math.max(1, Math.round(w) - 1), p); });
  }

  // a chain is a table of rules: P[i][j] = chance of hopping from pad i to pad j
  const fromStay = s => s.map((si, i) => s.map((_, j) => (i === j ? si : (1 - si) / (s.length - 1))));
  function hop(P, i) { let u = R(); for (let j = 0; j < P.length; j++) if ((u -= P[i][j]) < 0) return j; return i; }
  const step = (P, p) => p.map((_, j) => p.reduce((s, pi, i) => s + pi * P[i][j], 0));

  /* ---------- A. the lazy frog ---------- */
  const LAZY = fromStay([0.8, 0.8, 0.8]);
  const SPR = {
    frog: ['01100110', '11111111', '10111101', '11111111', '01111110', '00111100', '01000010', '11000011'],
    bars: ['00000011', '00000011', '00110011', '00110011', '00110011', '11110011', '11110011', '11111111'],
    trap: ['11111111', '10000001', '10011001', '10111101', '10111101', '10011001', '10000001', '11111111'],
    loop: ['00111100', '01000110', '10000111', '10000000', '10000001', '10000001', '01000010', '00111100'],
    split: ['00000000', '11100000', '11110000', '11100000', '00000111', '00001111', '00000111', '00000000'],
    chain: ['00000000', '01100000', '10011000', '01100110', '00011001', '00000110', '00000000', '00000000'],
    lens: ['00111000', '01000100', '10000010', '10000010', '01000100', '00111110', '00000111', '00000011'],
  };
  const pond = $('pond'), tally = $('tally');
  let pad = 0, seen = [0, 0, 0], stays = 0, hops = 0, speed = 2, playing = !calm, acc = 0, lastT = 0;
  function drawPond() {
    const g = clear(pond), cy = 58;
    for (let k = 0; k < 3; k++) {
      const cx = 40 + k * 80;
      g.fillStyle = k === pad ? '#2c4a39' : C.faint;
      for (let y = -12; y <= 12; y++) { const half = Math.round(32 * Math.sqrt(1 - (y / 12) ** 2)); g.fillRect(cx - half, cy + y, half * 2, 1); }
    }
    g.fillStyle = C.acc;
    SPR.frog.forEach((row, y) => [...row].forEach((b, x) => { if (b === '1') g.fillRect(40 + pad * 80 - 8 + x * 2, 34 + y * 2, 2, 2); }));
    const tot = seen[0] + seen[1] + seen[2] || 1;
    padBars(tally, seen.map(c => c / tot), [1 / 3, 1 / 3, 1 / 3]);
    $('frog-out').textContent = hops
      ? `Hop ${int(hops)}. Pad 1: ${pct(seen[0] / tot)}, pad 2: ${pct(seen[1] / tot)}, pad 3: ${pct(seen[2] / tot)}. It stayed put ${pct(stays / hops)} of the time.`
      : 'The frog sits on pad 1. Press play.';
  }
  function frogHop() { const n = hop(LAZY, pad); stays += n === pad; pad = n; seen[pad]++; hops++; }
  function tick(t) {
    if (playing) {
      acc += Math.min(0.25, (t - lastT) / 1000) * speed;
      if (acc >= 1) { for (; acc >= 1; acc--) frogHop(); drawPond(); }
    }
    lastT = t; requestAnimationFrame(tick);
  }
  $('frog-play').addEventListener('click', () => { playing = !playing; $('frog-play').textContent = playing ? 'Pause' : 'Play'; });
  $('frog-play').textContent = playing ? 'Pause' : 'Play';
  $('frog-reset').addEventListener('click', () => { pad = 0; seen = [0, 0, 0]; stays = hops = acc = 0; drawPond(); });
  document.querySelectorAll('[data-speed]').forEach(b => b.addEventListener('click', () => {
    speed = +b.dataset.speed;
    document.querySelectorAll('[data-speed]').forEach(o => o.setAttribute('aria-pressed', o === b));
  }));

  /* ---------- B. the pond builder ---------- */
  const sliders = [$('s1'), $('s2'), $('s3')];
  const PRESETS = {
    trap: { stay: [0.5, 0.5, 1] },
    loop: { P: [[0, 1, 0], [0, 0, 1], [1, 0, 0]], note: 'The frog goes 1 → 2 → 3 → 1 forever. It spends a third of its time on each pad, but where it is never settles: the strip is a staircase.' },
    cut: { P: [[0.5, 0.5, 0], [0.5, 0.5, 0], [0, 0, 1]], note: 'Pads 1 and 2 swap, and pad 3 only leads to itself. Start on 3 and the frog never leaves; start on 1 or 2 and it never arrives. Try each start.' },
  };
  let custom = null, start = 0;
  const rulesNow = () => custom ? custom.P : fromStay(sliders.map(s => +s.value));
  function runPond() {
    const P = rulesNow(), T = 5000, path = new Array(T), seenB = [0, 0, 0];
    sliders.forEach((s, i) => { $(`s${i + 1}v`).textContent = custom ? '—' : pct(+s.value); });
    let i = start;
    for (let t = 0; t < T; t++) { path[t] = i; seenB[i]++; i = hop(P, i); }
    // the exact expected share of time from this start: average the frog's chances over the same T hops
    let p = [0, 0, 0], exp = [0, 0, 0]; p[start] = 1;
    for (let t = 0; t < T; t++) { exp = exp.map((e, j) => e + p[j] / T); p = step(P, p); }
    const g = clear($('strip')), W = $('strip').width;
    path.slice(-W).forEach((k, x) => { g.fillStyle = C.ph; g.fillRect(x, k * 10 + 2, 1, 6); });
    padBars($('share'), seenB.map(c => c / T), exp);
    $('rules').innerHTML = P.map((row, r) => `<tr><th scope="row">Pad ${r + 1}</th>${row.map((v, c) => `<td${r === c ? ' class="stay"' : ''}>${pct(v)}</td>`).join('')}</tr>`).join('');
    const trap = P.findIndex((row, k) => row[k] === 1);
    $('pond-out').textContent = custom && custom.note ? custom.note
      : trap >= 0 ? `Pad ${trap + 1} never lets go. Start anywhere: the frog ends up there and stays. The orange marks show what the rules predict for these 5,000 hops.`
      : `The rules predict pad 1 ${pct(exp[0])}, pad 2 ${pct(exp[1])}, pad 3 ${pct(exp[2])} (orange). The frog's 5,000 hops gave ${pct(seenB[0] / T)}, ${pct(seenB[1] / T)}, ${pct(seenB[2] / T)}.`;
  }
  sliders.forEach(s => s.addEventListener('input', () => { custom = null; runPond(); }));
  $('pond-go').addEventListener('click', runPond);
  document.querySelectorAll('[data-start]').forEach(b => b.addEventListener('click', () => {
    start = +b.dataset.start;
    document.querySelectorAll('[data-start]').forEach(o => o.setAttribute('aria-pressed', o === b));
    runPond();
  }));
  document.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => {
    const pr = PRESETS[b.dataset.preset];
    if (pr.stay) { custom = null; pr.stay.forEach((v, i) => { sliders[i].value = v; }); } else custom = pr;
    runPond();
    $('toy').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
  }));

  /* ---------- the 1913 strip: 400 letters from Markov's counts for Eugene Onegin ---------- */
  // after a vowel, 12.8% vowels; after a consonant, 66.3% vowels (long-run share 43.2%)
  (() => {
    const cv = $('onegin'), g = ctxOf(cv); let v = false;
    for (let k = 0; k < 400; k++) {
      v = R() < (v ? 0.128 : 0.663);
      g.fillStyle = v ? '#121417' : 'rgba(18,20,23,0.18)';
      g.fillRect((k % 40) * 2, Math.floor(k / 40) * 2, 2, 2);
    }
  })();

  /* ---------- C. 1,000 frogs forgetting pad 1 ---------- */
  const crowdS = $('crowd-s'), MAXH = 40;
  let frogs, trace, timer = null;
  function resetCrowd() {
    clearInterval(timer); timer = null;
    frogs = new Array(1000).fill(0); trace = [1]; $('crowd-sv').textContent = pct(+crowdS.value); drawCrowd();
  }
  function crowdHop() {
    const P = fromStay(new Array(3).fill(+crowdS.value));
    frogs = frogs.map(f => hop(P, f)); trace.push(frogs.filter(f => f === 0).length / 1000);
  }
  function drawCrowd() {
    const n = [0, 1, 2].map(k => frogs.filter(f => f === k).length / 1000);
    padBars($('crowd'), n, [1 / 3, 1 / 3, 1 / 3]);
    const cv = $('trace'), g = clear(cv), W = cv.width, H = cv.height, s = +crowdS.value, rho = (3 * s - 1) / 2;
    const y = v => H - 2 - Math.round(v * (H - 4)), x = k => Math.round(k / MAXH * (W - 3));
    g.fillStyle = C.acc; g.fillRect(0, y(1 / 3), W, 1);
    g.fillStyle = C.ink; for (let k = 0; k <= MAXH; k++) g.fillRect(x(k) + 1, y(1 / 3 + 2 / 3 * rho ** k), 1, 1);
    g.fillStyle = C.ph; trace.forEach((v, k) => g.fillRect(x(k), y(v) - 1, 3, 3));
    const k = trace.length - 1;
    $('crowd-out').textContent = k
      ? `After ${k} hop${k > 1 ? 's' : ''}: ${pct(trace[k])} still on pad 1. The rules predict ${pct(1 / 3 + 2 / 3 * rho ** k)} (white dots); a third is 33% (orange).${k >= MAXH ? ' Press "Back to pad 1" to start again.' : ''}`
      : 'All 1,000 frogs sit on pad 1.';
  }
  $('crowd-1').addEventListener('click', () => { if (trace.length <= MAXH) { crowdHop(); drawCrowd(); } });
  $('crowd-run').addEventListener('click', () => {
    if (timer) return;
    timer = setInterval(() => { if (trace.length > MAXH) { clearInterval(timer); timer = null; return; } crowdHop(); drawCrowd(); }, calm ? 0 : 90);
  });
  $('crowd-reset').addEventListener('click', resetCrowd);
  crowdS.addEventListener('input', resetCrowd);

  /* ---------- D. the babble machine ---------- */
  const SAMPLE = 'The frog sat on the first pad and looked at the water. The water was green and the sky was grey. '
    + 'The frog liked the first pad, so the frog stayed on the first pad for a long time. Then the frog jumped to the second pad and looked at the sky. '
    + 'The sky was big and the frog was small. The small frog liked the big sky, so it stayed on the second pad. '
    + 'Then the frog jumped to the third pad. The third pad was wet and the water was cold. '
    + 'The frog did not like the cold water, so the frog jumped back to the first pad and sat in the sun. '
    + 'The sun was warm and the frog was happy, and the happy frog stayed on the first pad until the sky was dark.';
  const corpus = $('corpus'); corpus.value = SAMPLE;
  let mem = 1;
  function runBabble() {
    const text = (corpus.value.match(/[a-z']+/gi) || []).length > 3 ? corpus.value : SAMPLE; // too little text: fall back to the sample
    $('babble').textContent = babble(text, mem, 40);
  }
  $('babble-go').addEventListener('click', runBabble);
  document.querySelectorAll('[data-mem]').forEach(b => b.addEventListener('click', () => {
    mem = +b.dataset.mem;
    document.querySelectorAll('[data-mem]').forEach(o => o.setAttribute('aria-pressed', o === b));
    runBabble();
  }));

  /* ---------- in the wild: web search ---------- */
  const LINKS = [[1, 2], [2], [0], [0, 2], [3]]; // A → B, C · B → C · C → A · D → A, C · E → D
  function runWeb() {
    const visits = [0, 0, 0, 0, 0]; let page = (R() * 5) | 0;
    for (let t = 0; t < 10000; t++) {
      page = R() < 0.15 ? (R() * 5) | 0 : LINKS[page][(R() * LINKS[page].length) | 0]; // now and then, jump anywhere
      visits[page]++;
    }
    const top = Math.max(...visits);
    padBars($('web'), visits.map(v => v / top));
    const order = visits.map((v, i) => [v, 'ABCDE'[i]]).sort((a, b) => b[0] - a[0]);
    $('web-out').textContent = `Rank: ${order.map(([v, k]) => `${k} ${pct(v / 10000)}`).join(' · ')}. A and C tie at the top: three pages link to C, but C's only link goes to A, so A inherits all of C's visits. Nobody links to E, so the surfer only lands there by jumping at random.`;
  }
  $('web-go').addEventListener('click', runWeb);

  /* ---------- in the wild: the keyboard ---------- */
  const kb = $('kb');
  function suggest() {
    const words = corpus.value.toLowerCase().match(/[a-z']+/g) || [], next = {};
    for (let i = 1; i < words.length; i++) { const m = (next[words[i - 1]] ||= {}); m[words[i]] = (m[words[i]] || 0) + 1; }
    const typed = kb.value.toLowerCase().match(/[a-z']+/g) || [], last = typed[typed.length - 1] || 'the';
    const opts = Object.entries(next[last] || {}).sort((a, b) => b[1] - a[1]);
    $('kb-chips').innerHTML = opts.slice(0, 3).map(([w]) => `<button type="button">${w}</button>`).join('');
    $('kb-out').textContent = opts.length
      ? `After "${last}" the text had: ${opts.slice(0, 5).map(([w, c]) => `${w} ×${c}`).join(', ')}.`
      : `"${last}" never came before another word in the text, so there's nothing to suggest.`;
  }
  $('kb-chips').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    kb.value = `${kb.value.replace(/\s*$/, ' ')}${e.target.textContent} `.trimStart(); kb.focus(); suggest();
  });
  kb.addEventListener('input', suggest);
  corpus.addEventListener('input', suggest);

  /* ---------- in the wild: GPS snapping ---------- */
  function runGps() {
    const cv = $('gps'), g = clear(cv), W = cv.width, ROAD = [40, 72], N = 30, SD = 20, STAY = 0.95;
    const truth = repeat(N, (_, i) => +(i >= 19)), dots = truth.map(r => ROAD[r] + gauss() * SD);
    const nearest = dots.map(y => +(Math.abs(y - ROAD[1]) < Math.abs(y - ROAD[0])));
    // the chain: the most likely sequence of roads, given that cars rarely switch roads (Viterbi)
    const fit = (y, r) => -((y - ROAD[r]) ** 2) / (2 * SD * SD);
    let score = [fit(dots[0], 0), fit(dots[0], 1)]; const back = [];
    for (let i = 1; i < N; i++) {
      const from = [0, 1].map(r => [0, 1].map(q => score[q] + Math.log(q === r ? STAY : 1 - STAY)));
      back.push(from.map(f => +(f[1] > f[0])));
      score = [0, 1].map(r => Math.max(...from[r]) + fit(dots[i], r));
    }
    const chain = new Array(N); chain[N - 1] = +(score[1] > score[0]);
    for (let i = N - 1; i > 0; i--) chain[i - 1] = back[i - 1][chain[i]];
    const x = i => 6 + Math.round(i * (W - 12) / (N - 1));
    g.fillStyle = C.faint; ROAD.forEach(y => g.fillRect(0, y - 1, W, 3));
    for (let i = 0; i < N; i++) {
      g.fillStyle = C.ink; g.fillRect(x(i) - 1, Math.round(dots[i]) - 1, 2, 2);
      if (nearest[i] !== truth[i]) { g.fillStyle = C.acc; g.fillRect(x(i) - 2, ROAD[nearest[i]] - 2, 4, 4); }
      g.fillStyle = C.ph; g.fillRect(x(i) - 1, ROAD[chain[i]] - 1, 3, 3);
    }
    const wrong = a => a.filter((r, i) => r !== truth[i]).length;
    $('gps-out').textContent = `The car takes the side road two-thirds of the way along. White dots are GPS readings. Nearest road: wrong ${wrong(nearest)} of 30 times (orange). Following the chain: wrong ${wrong(chain)} (green)${wrong(chain) ? ', usually right where the car changes road' : ''}.`;
  }
  $('gps-go').addEventListener('click', runGps);

  /* ---------- in the wild: noise, step by step ---------- */
  const ART = 48, BETA = 0.15, frames = [];
  (() => {
    const inside = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
    let img = repeat(ART * ART, (_, k) => {
      const x = k % ART, y = (k / ART) | 0;
      if (inside(x, y, 16, 14, 2.5) || inside(x, y, 32, 14, 2.5)) return -1;
      return inside(x, y, 24, 29, 14) || inside(x, y, 16, 14, 6) || inside(x, y, 32, 14, 6) ? 1 : -1;
    });
    frames.push(img);
    for (let t = 1; t <= 30; t++) { img = img.map(v => Math.sqrt(1 - BETA) * v + Math.sqrt(BETA) * gauss()); frames.push(img); }
  })();
  function drawArt() {
    const t = +$('art-t').value, g = ctxOf($('art')), d = g.createImageData(ART, ART);
    $('art-tv').textContent = t;
    frames[t].forEach((v, k) => {
      const a = Math.min(1, Math.max(0, (v + 1) / 2));
      d.data[k * 4] = 14 + a * (141 - 14); d.data[k * 4 + 1] = 18 + a * (255 - 18); d.data[k * 4 + 2] = 17 + a * (168 - 17); d.data[k * 4 + 3] = 255;
    });
    g.putImageData(d, 0, 0);
    $('art-out').textContent = `Step ${t}: ${pct(Math.sqrt(1 - BETA) ** t)} of the picture is left. Each step only looks at the step before: fade it a little, add a little fresh noise.`;
  }
  $('art-t').addEventListener('input', drawArt);

  const facts = {
    web: ['A page matters if pages that matter link to it.', 'Google\'s first ranking imagined a surfer who clicks a random link on every page and, now and then, jumps to a random page instead. The long-run share of time on each page was its rank. It\'s the pond builder, with web pages as lily pads.', 'var(--accent)'],
    keys: ['It only ever looks at the last word or two.', 'Phone keyboards count which words follow which and offer the most common next words. Chatbots also pick the next word from what came before, but their "now" is the whole conversation, and a huge neural network does the counting instead of a table.', 'var(--phosphor)'],
    gps: ['Your road is hidden. The dots are only clues.', 'GPS readings wobble by several metres, so the nearest road is often the wrong one. Maps treat your road as a chain: cars rarely jump between roads, so a run of dots near one road outweighs a stray dot. This is called a hidden Markov model.', 'var(--muted)'],
    art: ['Add noise step by step, then learn to walk back.', 'Image generators are trained on a chain that starts with a picture and adds a little noise at each step until only static is left. The model learns to run the chain backwards, from static to a picture. Step-by-step chains also power MCMC, a way of drawing samples from shapes too complicated to sample directly. That\'s for a later issue.', '#2b322f'],
  };
  const runs = { web: runWeb, keys: suggest, gps: runGps, art: drawArt }, done = {};
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

  /* ---------- the premonition: a frog on an endless row ---------- */
  const walkN = $('walk-n');
  function runWalk() {
    const n = +walkN.value; $('walk-nv').textContent = n;
    const ends = repeat(1000, () => { let x = 0; for (let i = 0; i < n; i++) x += R() < 0.5 ? -1 : 1; return x; });
    const c = new Array(31).fill(0); // 31 bins of 2 pads each, so odd and even endings share a bin
    ends.forEach(x => { if (Math.abs(x) <= 30) c[Math.floor((x + 31) / 2)]++; });
    const top = Math.max(...c);
    bars($('walk'), c.map(v => v / top), { lo: -31, hi: 31, truth: 0 });
    const r = Math.round(2 * Math.sqrt(n)), within = ends.filter(x => Math.abs(x) <= r).length;
    $('walk-out').textContent = `After ${n} hop${n > 1 ? 's' : ''}: ${int(within)} of 1,000 frogs are within ${r} pads of the start.`;
  }
  walkN.addEventListener('input', runWalk);
  $('walk-go').addEventListener('click', runWalk);

  /* ---------- pixel sprites and the series mark ---------- */
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
    const seenP = new Map();
    pending = pending.filter(el => {
      if (el.getBoundingClientRect().top > innerHeight * 0.94) return true;
      const k = seenP.get(el.parentElement) || 0; seenP.set(el.parentElement, k + 1);
      el.style.transitionDelay = `${Math.min(k, 5) * 70}ms`; el.classList.add('in');
      return false;
    });
    if (!pending.length) removeEventListener('scroll', onScroll);
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(reveal); } };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
  reveal();

  drawPond(); requestAnimationFrame(t => { lastT = t; tick(t); });
  runPond(); resetCrowd(); runBabble(); runWalk(); pick('web');
})();
