/* =========================================================
   Kartu Ucapan untuk Tania Renata
   Ubah teks di bagian CONFIG ini sesuka hati.
   ========================================================= */
const CONFIG = {
  to: "Tania Renata",
  from: "Hizul Wahyudn",              // ganti dengan namamu / panggilan sayang
  scenes: [
    { kicker: "untuk yang tersayang", lines: ["Tania", "Renata"], big: true, dur: 4600 },
    { kicker: "satu", lines: ["Ada hari-hari yang biasa saja,", "sampai kamu datang,", "dan semuanya jadi berwarna."], dur: 6600 },
    { kicker: "dua", lines: ["Terima kasih sudah sabar,", "sudah tertawa bersamaku,", "dan tetap tinggal."], dur: 6600 },
    { kicker: "tiga", lines: ["Aku sayang banget", "sama kamu."], big: true, heart: true, dur: 6800 }
  ],
  finalTitle: "Sayang banget, Tania.",
  finalText:
    "Terima kasih sudah jadi tempat pulang yang paling nyaman untukku. " +
    "Di setiap tawa, di setiap lelah yang kamu peluk, dan di setiap hari biasa yang kamu buat istimewa, " +
    "aku jatuh cinta lagi, berkali-kali. Aku tidak berjanji hidup akan selalu mudah, " +
    "tapi aku berjanji akan selalu ada di sampingmu."
};

/* ---------- util ---------- */
const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.random() * (b - a);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- isi teks dari CONFIG ---------- */
document.title = "Untuk " + CONFIG.to;
$("#gateName").textContent = CONFIG.to.split(" ")[0];
$("#fTitle").textContent = CONFIG.finalTitle;
$("#fText").textContent = CONFIG.finalText;
$("#fFrom").textContent = CONFIG.from;

/* =========================================================
   Latar partikel: kelopak mengambang -> membentuk hati
   ========================================================= */
const cv = $("#bg");
const ctx = cv.getContext("2d");
let W, H, DPR, mode = "float", heartCY = 0;

const sprite = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,235,240,1)");
  gr.addColorStop(0.25, "rgba(255,105,135,.85)");
  gr.addColorStop(1, "rgba(255,77,109,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return c;
})();

const N = innerWidth < 700 ? 150 : 280;
const particles = Array.from({ length: N }, () => {
  const edge = Math.random() < 0.72;
  return {
    x: rand(0, innerWidth), y: rand(0, innerHeight),
    vx: rand(-0.15, 0.15), vy: rand(-0.5, -0.08),
    s: rand(1.1, 3.4), a: rand(0.35, 0.95), ph: rand(0, 6.28),
    t: rand(0, Math.PI * 2),
    r: edge ? 1 : Math.sqrt(Math.random()) * 0.88,
    tx: 0, ty: 0
  };
});

function layoutHeart() {
  const sc = Math.min((W * 0.7) / 34, (H * 0.34) / 30);
  heartCY = H * 0.3;
  particles.forEach((p) => {
    const x = 16 * Math.pow(Math.sin(p.t), 3);
    const y = -(13 * Math.cos(p.t) - 5 * Math.cos(2 * p.t) - 2 * Math.cos(3 * p.t) - Math.cos(4 * p.t));
    p.tx = W / 2 + x * sc * p.r;
    p.ty = heartCY + y * sc * p.r;
  });
}

function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  layoutHeart();
}
addEventListener("resize", resize);
resize();

function setMode(m) {
  if (m === mode) return;
  if (m === "float") {
    particles.forEach((p) => { p.vx = rand(-0.9, 0.9); p.vy = rand(-1.6, -0.2); });
  }
  mode = m;
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = "lighter";
  const beat = 1 + 0.045 * Math.sin(t / 240) * Math.max(0, Math.sin(t / 1400) * 0.5 + 0.7);
  for (const p of particles) {
    p.ph += 0.025;
    if (mode === "heart") {
      const bx = W / 2 + (p.tx - W / 2) * beat;
      const by = heartCY + (p.ty - heartCY) * beat;
      p.x += (bx - p.x) * 0.045 + Math.sin(p.ph) * 0.25;
      p.y += (by - p.y) * 0.045 + Math.cos(p.ph) * 0.25;
    } else {
      p.vx *= 0.995;
      if (p.vy > -0.08) p.vy -= 0.004;
      p.x += p.vx + Math.sin(p.ph) * 0.25;
      p.y += p.vy;
      if (p.y < -20) { p.y = H + 20; p.x = rand(0, W); }
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
    }
    const size = p.s * 8;
    ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.ph * 1.3));
    ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* =========================================================
   Musik lembut (dibuat langsung di browser, tanpa file audio)
   ========================================================= */
let actx, master, noteTimer, muted = false;
const CHORDS = [
  [261.63, 329.63, 392.0],   // C
  [220.0, 261.63, 329.63],   // Am
  [174.61, 220.0, 261.63],   // F
  [196.0, 246.94, 293.66]    // G
];

function pluck(freq, when, vol = 0.12, dur = 2.2, type = "triangle") {
  const o = actx.createOscillator();
  const g = actx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(vol, when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  o.connect(g); g.connect(master);
  o.start(when); o.stop(when + dur + 0.1);
}

function startAudio() {
  try {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    master = actx.createGain();
    master.gain.value = 0.55;
    const delay = actx.createDelay();
    delay.delayTime.value = 0.44;
    const fb = actx.createGain();
    fb.gain.value = 0.4;
    delay.connect(fb); fb.connect(delay);
    master.connect(actx.destination);
    master.connect(delay); delay.connect(actx.destination);

    let step = 0;
    const order = [0, 1, 2, 1, 2, 1, 0, 1];
    noteTimer = setInterval(() => {
      const chord = CHORDS[Math.floor(step / 8) % CHORDS.length];
      const now = actx.currentTime + 0.05;
      if (step % 8 === 0) pluck(chord[0] / 2, now, 0.16, 3.6, "sine");
      pluck(chord[order[step % 8]] * 2, now, 0.1);
      step++;
    }, 480);
  } catch (e) { /* audio tidak didukung, lanjut tanpa suara */ }
}

$("#mute").addEventListener("click", () => {
  muted = !muted;
  if (master) master.gain.value = muted ? 0 : 0.55;
  $("#mute").textContent = "suara: " + (muted ? "off" : "on");
});

/* =========================================================
   Mesin adegan (seperti video pendek)
   ========================================================= */
const stage = $("#stage");
const hud = $("#hud");
const segs = $("#segs");
let timer, idx = 0;

CONFIG.scenes.forEach(() => {
  const s = document.createElement("div");
  s.className = "seg";
  s.innerHTML = "<b></b>";
  segs.appendChild(s);
});

function updateSegs(i) {
  [...segs.children].forEach((s, k) => {
    s.classList.remove("run", "done");
    const b = s.firstElementChild;
    b.style.animation = "";
    if (k < i) s.classList.add("done");
    if (k === i) {
      void b.offsetWidth;
      b.style.animationDuration = CONFIG.scenes[i].dur + "ms";
      s.classList.add("run");
    }
  });
}

function showScene(i) {
  clearTimeout(timer);
  idx = i;
  stage.querySelectorAll(".scene").forEach((el) => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 1100);
  });

  if (i >= CONFIG.scenes.length) return showFinal();

  $("#card").classList.remove("in");
  const s = CONFIG.scenes[i];
  const el = document.createElement("section");
  el.className = "scene" + (s.big ? " big" : "") + (s.heart ? " heart" : "");
  el.innerHTML =
    `<p class="kicker">${s.kicker}</p>` +
    s.lines.map((t, k) =>
      `<div class="line"><span style="transition-delay:${0.3 + k * 0.3}s">${t}</span></div>`
    ).join("");
  stage.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));

  setMode(s.heart ? "heart" : "float");
  updateSegs(i);
  timer = setTimeout(() => showScene(i + 1), s.dur);
}

function showFinal() {
  [...segs.children].forEach((s) => { s.classList.remove("run"); s.classList.add("done"); });
  setMode("float");
  setTimeout(() => {
    const c = $("#card");
    c.setAttribute("aria-hidden", "false");
    c.classList.add("in");
  }, 900);
}

/* ---------- kontrol ---------- */
$("#open").addEventListener("click", () => {
  startAudio();
  $("#gate").classList.add("gone");
  hud.classList.add("on");
  setTimeout(() => showScene(0), reduceMotion ? 0 : 700);
});
$("#skip").addEventListener("click", () => showScene(Math.min(idx + 1, CONFIG.scenes.length)));
$("#replay").addEventListener("click", () => { $("#card").classList.remove("in"); showScene(0); });

/* ---------- kursor kustom ---------- */
const cur = $("#cursor");
addEventListener("pointermove", (e) => {
  cur.classList.add("on");
  cur.style.left = e.clientX + "px";
  cur.style.top = e.clientY + "px";
});
document.querySelectorAll("button").forEach((b) => {
  b.addEventListener("pointerenter", () => cur.classList.add("big"));
  b.addEventListener("pointerleave", () => cur.classList.remove("big"));
});
