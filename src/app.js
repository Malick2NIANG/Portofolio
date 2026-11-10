/* Malick Niang — portfolio v2. Assemblé avec esbuild en un seul fichier (main.js). */
import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute,
  ShaderMaterial, Points, Color, AdditiveBlending, NormalBlending, Group
} from "three";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/* =========================================================
   Textes
   ========================================================= */
const EN = {
  "skip": "Skip to content",
  "ch.0": "Home", "ch.1": "Work", "ch.2": "Services", "ch.3": "Background", "ch.4": "Contact",
  "hero.title": "I build tomorrow's software, from Dakar.",
  "hero.lede": "Freelance software engineer. Web platforms, mobile apps, SaaS and AI: I handle everything, from idea to launch.",
  "hero.cta": "Start a project", "hero.cta2": "See the work",
  "hero.status": "Available for freelance work", "hero.scroll": "Scroll",
  "work.title": "Work",
  "work.intro": "Complete products, built for real problems in Senegal and its diaspora.",
  "c1.title": "Verified real estate platform", "c1.tag": "Web and PWA, launching soon",
  "c1.pitch": "Many rental listings are fake or already taken. This platform has every property checked on site and holds the money until the tenant has moved in.",
  "c1.p1": "On-site checks by field agents, with photos and a rated report",
  "c1.p2": "Escrow payments, nightly or monthly rentals, and sales",
  "c1.p3": "Natural language search in French and English, with no paid API",
  "demo.title": "Try the search", "demo.label": "Type a housing search the way you would say it: type, area, bedrooms, budget.",
  "demo.clear": "Clear", "demo.ex": "Examples:",
  "proc.title": "How a project runs",
  "proc.1.t": "Discussion", "proc.1.d": "We clarify your needs and constraints.",
  "proc.2.t": "Proposal", "proc.2.d": "Scope, timeline and price, in writing.",
  "proc.3.t": "Development", "proc.3.d": "Regular demos so you can validate as we go.",
  "proc.4.t": "Launch", "proc.4.d": "Deployment, handover and follow-up.",
  "contact.hint": "For a precise answer, mention the type of project, your timeline and your budget.",
  "contact.wa": "Message on WhatsApp", "contact.mailbtn": "Send an email", "contact.copy": "Copy address",
  "foot.keys": "Shortcuts: keys <kbd>0</kbd> to <kbd>4</kbd> jump to a section.",
  "c2.title": "Senegal and diaspora marketplace", "c2.tag": "Mobile app, in development",
  "c2.pitch": "Products from home, ordered from abroad and delivered by verified travellers. The same shop sells in Dakar and to the diaspora from a single storefront.",
  "c2.p1": "One parcel per shop, all handed to the same traveller, capacity checked to the kilo",
  "c2.p2": "Payment held until delivery, proof photo at every step",
  "c2.p3": "Real-time group chat with voice notes, and made-to-measure orders",
  "more.title": "Other projects",
  "more.ssd": "Start-up co-founded with former classmates: SaaS solutions for businesses.",
  "more.fuel.n": "SaaS for fuel stations", "more.fuel": "Stock and sales management for fuel station shops.",
  "more.sen": "Event management app.",
  "more.parr.n": "Presidential endorsements", "more.parr": "Endorsement collection for Senegal's presidential election.",
  "more.bfem.n": "BFEM deliberations", "more.bfem": "Prototype for managing the national exam's deliberations.",
  "more.ftps.n": "FTPS server", "more.ftps": "Hardening a Linux FTP server with TLS encryption.",
  "svc.title": "Services", "svc.intro": "One point of contact, from the first call to launch.",
  "svc.1.t": "Web platforms and SaaS", "svc.1.d": "Client areas, dashboards, subscriptions, roles and admin.",
  "svc.2.t": "Mobile apps", "svc.2.d": "Android and iOS from one codebase: notifications, maps, chat.",
  "svc.3.t": "Local payments", "svc.3.d": "Wave, Orange Money, cards, escrow and amount checks.",
  "svc.4.t": "AI and smart search", "svc.4.d": "Natural language search, information extraction and assistants, at a controlled cost.",
  "svc.5.t": "Going live", "svc.5.d": "Server, Docker, HTTPS, backups, continuous integration and security audit.",
  "about.title": "Background",
  "about.lede": "Born and trained in Dakar, I write code to solve concrete problems: trust in online payments, logistics, and management tools for small businesses.",
  "tl.1": "Master 2 in Software Engineering and Information Systems, École Supérieure Polytechnique, Dakar",
  "tl.2": "Software developer intern, SSA Center at FBNBank Senegal",
  "tl.3": "Master 1 in Software Engineering and Information Systems, ESP Dakar",
  "tl.4": "Bachelor's in Software Engineering, Université Iba Der Thiam, Thiès",
  "tl.5": "Baccalauréat S1 (science), Cours Sainte Marie de Hann",
  "sk.lang": "Languages", "sk.fw": "Frameworks", "sk.data": "Data and infra", "sk.langs": "Spoken", "sk.langs.v": "French, Wolof, English",
  "contact.title": "Let's talk about your project",
  "contact.lede": "Reply within 24 hours with a first estimate.",
  "foot.top": "Back to top", "foot.tag": "Freelance software engineer. Web platforms, mobile apps, SaaS and AI, from Dakar.",
  "foot.nav": "Navigation", "foot.services": "Services", "foot.contact": "Contact",
  "foot.rights": "All rights reserved.", "foot.made": "Designed and built in Dakar, Senegal."
};
const META = {
  fr: { title: document.title, desc: $('meta[name="description"]').content },
  en: { title: "Malick Niang — Freelance software engineer",
        desc: "Malick Niang, software engineer in Dakar. Web platforms, mobile apps, SaaS and AI, from design to launch." }
};
const FR = {};
$$("[data-i18n]").forEach((el) => { FR[el.dataset.i18n] = el.innerHTML; });
const CHAPTERS = { fr: ["Accueil", "Réalisations", "Services", "Parcours", "Contact"], en: ["Home", "Work", "Services", "Background", "Contact"] };

let lang = "fr";
try {
  const s = localStorage.getItem("mn-lang");
  if (s === "fr" || s === "en") lang = s;
  else if ((navigator.language || "").toLowerCase().startsWith("en")) lang = "en";
} catch (_) {}

const langBtn = $("[data-lang-toggle]");
function applyLang(next) {
  lang = next;
  const dict = lang === "en" ? EN : FR;
  $$("[data-i18n]").forEach((el) => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
  document.documentElement.lang = lang;
  document.title = META[lang].title;
  $('meta[name="description"]').content = META[lang].desc;
  langBtn.textContent = lang === "en" ? "FR" : "EN";
  langBtn.setAttribute("aria-label", lang === "en" ? "Passer en français" : "Switch to English");
  setChapterLabel(current);
  try { localStorage.setItem("mn-lang", lang); } catch (_) {}
  runDemo();
  if (typeof syncThemeButton === "function") syncThemeButton();
  if (typeof syncMotionButton === "function") syncMotionButton();
}
langBtn.addEventListener("click", () => applyLang(lang === "fr" ? "en" : "fr"));

/* =========================================================
   Thème
   ========================================================= */
const themeBtn = $("[data-theme-toggle]");
const root = document.documentElement;
function syncThemeButton() {
  const dark = root.dataset.theme !== "light";
  const label = lang === "en"
    ? (dark ? "Switch to light theme" : "Switch to dark theme")
    : (dark ? "Passer au thème clair" : "Passer au thème sombre");
  themeBtn.setAttribute("aria-label", label); themeBtn.title = label;
  $('meta[name="theme-color"]').content = dark ? "#000000" : "#ffffff";
}
themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  try { localStorage.setItem("mn-theme", root.dataset.theme); } catch (_) {}
  syncThemeButton();
  updateSceneTheme();
});

/* =========================================================
   Scène 3D : noyau de particules
   ========================================================= */
const canvas = $(".scene");
let renderer = null;
try {
  renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
} catch (_) { canvas.remove(); }

const isSmall = () => window.innerWidth < 760;
const N = isSmall() ? 3800 : 7600;
const rand = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();

function sphere() {
  const a = new Float32Array(N * 3), g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i;
    const R = 1.7 + (rand() - .5) * .12;
    a[i * 3] = Math.cos(th) * r * R; a[i * 3 + 1] = y * R; a[i * 3 + 2] = Math.sin(th) * r * R;
  }
  return a;
}
function rings() {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const k = i % 3, u = rand() * Math.PI * 2, v = rand() * Math.PI * 2;
    const R = [1.9, 1.35, .8][k], tube = [.09, .07, .05][k];
    let x = (R + tube * Math.cos(v)) * Math.cos(u), y = tube * Math.sin(v), z = (R + tube * Math.cos(v)) * Math.sin(u);
    const tilt = [.35, -.6, 1.1][k];
    const cy = Math.cos(tilt), sy = Math.sin(tilt);
    a[i * 3] = x; a[i * 3 + 1] = y * cy - z * sy; a[i * 3 + 2] = y * sy + z * cy;
  }
  return a;
}
function lattice() {
  const a = new Float32Array(N * 3), S = 1.25, steps = 9;
  for (let i = 0; i < N; i++) {
    // points sur les arêtes d'une grille cubique
    const axis = i % 3;
    const p = [0, 0, 0];
    p[axis] = (rand() * 2 - 1) * S;
    p[(axis + 1) % 3] = (Math.round(rand() * (steps - 1)) / (steps - 1) * 2 - 1) * S;
    p[(axis + 2) % 3] = (Math.round(rand() * (steps - 1)) / (steps - 1) * 2 - 1) * S;
    a[i * 3] = p[0]; a[i * 3 + 1] = p[1]; a[i * 3 + 2] = p[2];
  }
  return a;
}
function monogram() {
  // même tracé que le logo : M6 42 V6 L20 26 L34 6 L52 42 V6
  const pts = [[6, 42], [6, 6], [20, 26], [34, 6], [52, 42], [52, 6]];
  const segs = []; let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], l = Math.hypot(x2 - x1, y2 - y1);
    segs.push([x1, y1, x2, y2, l]); total += l;
  }
  const a = new Float32Array(N * 3), sc = 3.4 / 46;
  for (let i = 0; i < N; i++) {
    let d = rand() * total, s = segs[0];
    for (const sg of segs) { if (d <= sg[4]) { s = sg; break; } d -= sg[4]; }
    const t = d / s[4];
    const x = s[0] + (s[2] - s[0]) * t, y = s[1] + (s[3] - s[1]) * t;
    const r = Math.sqrt(rand()) * 2.1, th = rand() * Math.PI * 2; // épaisseur du trait
    a[i * 3] = (x - 29 + Math.cos(th) * r) * sc;
    a[i * 3 + 1] = -(y - 24 + Math.sin(th) * r) * sc;
    a[i * 3 + 2] = (rand() - .5) * .35;
  }
  return a;
}
function galaxy() {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const arm = i % 3, r = 1.15 + Math.pow(rand(), .8) * 1.5;
    const ang = r * 2.2 + arm * (Math.PI * 2 / 3) + (rand() - .5) * .5;
    a[i * 3] = Math.cos(ang) * r; a[i * 3 + 1] = (rand() - .5) * .18 * (2.8 - r); a[i * 3 + 2] = Math.sin(ang) * r;
  }
  return a;
}

const SHAPES = [sphere(), rings(), lattice(), monogram(), galaxy()];
// place, taille et intensité de l'objet par chapitre (grand écran)
const PLACE_X = [2.4, 2.7, 2.6, 3.0, 2.9];
const PLACE_S = [1, .95, .9, .72, .78];
const PLACE_A = [1, .7, .75, .55, .6];
const SHAPE_ROT = [[0, 0], [0.5, 0], [0.35, 0.6], [0, 0], [0.9, 0]]; // inclinaison (x, z) propre à chaque forme

let scene, camera, group, geo, mat, pos;
if (renderer) {
  scene = new Scene();
  camera = new PerspectiveCamera(42, 1, .1, 100);
  camera.position.set(0, 0, 7.2);
  group = new Group();
  scene.add(group);

  geo = new BufferGeometry();
  pos = new Float32Array(SHAPES[0]);
  const rnd = new Float32Array(N);
  for (let i = 0; i < N; i++) rnd[i] = rand();
  geo.setAttribute("position", new BufferAttribute(pos, 3));
  geo.setAttribute("aRand", new BufferAttribute(rnd, 1));

  mat = new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      uTime: { value: 0 }, uPR: { value: 1 }, uSize: { value: 26 },
      uA: { value: new Color("#fa6e00") }, uB: { value: new Color("#ffffff") },
      uAlpha: { value: 1 }, uMotion: { value: reduceMotion ? 0 : 1 }, uScatter: { value: 0 }
    },
    vertexShader: `
      attribute float aRand;
      uniform float uTime, uPR, uSize, uMotion, uScatter;
      varying float vR; varying float vDepth;
      void main() {
        vR = aRand;
        vec3 p = position;
        float w = sin(uTime * 1.3 + aRand * 40.0) * 0.025 * uMotion;
        p += normalize(p + 0.0001) * (w + uScatter * (aRand - 0.3) * 0.9);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (0.55 + aRand * 0.9) / vDepth;
      }`,
    fragmentShader: `
      uniform vec3 uA, uB; uniform float uAlpha;
      varying float vR; varying float vDepth;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        vec3 c = vR > 0.68 ? uA : uB;
        float fade = clamp(1.25 - (vDepth - 5.6) * 0.32, 0.25, 1.0);
        gl_FragColor = vec4(c, a * uAlpha * fade * (vR > 0.68 ? 1.0 : 0.55));
      }`
  });
  group.add(new Points(geo, mat));
}

function updateSceneTheme() {
  if (!mat) return;
  const light = root.dataset.theme === "light";
  mat.uniforms.uB.value.set(light ? "#000000" : "#ffffff");
  mat.blending = light ? NormalBlending : AdditiveBlending;
  mat.needsUpdate = true;
}

let W = 0, H = 0;
function resize() {
  if (!renderer) return;
  W = window.innerWidth; H = window.innerHeight;
  const pr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(pr);
  renderer.setSize(W, H, false);
  camera.aspect = W / H; camera.updateProjectionMatrix();
  mat.uniforms.uPR.value = pr;
}

/* Progression du défilement par chapitre */
const sections = $$("section.chapter");
const photo = $(".hero-photo-frame");
let tops = [];
function measure() { tops = sections.map((s) => s.offsetTop); }
function chapterProgress() {
  const y = window.scrollY + window.innerHeight * 0.45;
  let i = 0;
  while (i < tops.length - 1 && y >= tops[i + 1]) i++;
  const next = i < tops.length - 1 ? tops[i + 1] : document.documentElement.scrollHeight;
  const t = clamp((y - tops[i]) / Math.max(1, next - tops[i]), 0, 1);
  return { i, t };
}

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener("pointermove", (e) => {
  mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

let lastY = window.scrollY, vel = 0, spin = 0, clock = 0, prevTs = 0;
function frame(ts) {
  const dt = Math.min(.05, (ts - prevTs) / 1000 || 0); prevTs = ts; clock += dt;
  const { i, t } = chapterProgress();
  const f = smooth(.6, 1, t);
  const A = SHAPES[i], B = SHAPES[Math.min(i + 1, SHAPES.length - 1)];
  const k = reduceMotion ? 1 : .12; // inertie : les points rejoignent leur cible en douceur
  for (let j = 0; j < N * 3; j++) {
    const target = A[j] + (B[j] - A[j]) * f;
    pos[j] += (target - pos[j]) * k;
  }
  geo.attributes.position.needsUpdate = true;

  // vitesse de défilement → dispersion passagère
  const y = window.scrollY; vel += ((y - lastY) - vel) * .15; lastY = y;
  mat.uniforms.uScatter.value = reduceMotion ? 0 : clamp(Math.abs(vel) / 120, 0, .6);
  mat.uniforms.uTime.value = clock;

  // rotation, inclinaison propre à la forme, parallaxe souris
  if (!reduceMotion) spin += dt * .12;
  mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
  const ra = SHAPE_ROT[i], rb = SHAPE_ROT[Math.min(i + 1, SHAPE_ROT.length - 1)];
  const isMono = (i === 3 && f < .5) || (i === 2 && f > .5);
  const rx = ra[0] + (rb[0] - ra[0]) * f + mouse.y * .25;
  const rz = ra[1] + (rb[1] - ra[1]) * f;
  // le monogramme reste face à l'écran : on ramène la rotation au tour le plus proche, sans saut
  let ry = spin + mouse.x * .35;
  if (isMono) { const turn = Math.PI * 2; ry = Math.round(group.rotation.y / turn) * turn + Math.sin(clock * .6) * .25 + mouse.x * .35; }
  group.rotation.x += (rx - group.rotation.x) * .08;
  group.rotation.z += (rz - group.rotation.z) * .08;
  group.rotation.y += (ry - group.rotation.y) * .06;
  if (isMono) spin = group.rotation.y;

  // place de l'objet : à droite du texte sur grand écran, en fond sur mobile
  const small = isSmall();
  const lerpArr = (arr) => arr[i] + (arr[Math.min(i + 1, arr.length - 1)] - arr[i]) * f;
  let tx = small ? 0 : lerpArr(PLACE_X);
  let ty = small ? .9 : 0;
  let sc = (small ? .72 : 1) * lerpArr(PLACE_S);
  // au dernier chapitre, la galaxie se centre sur la photo de contact
  if (photo && (i === 4 || (i === 3 && f > 0))) {
    const r = photo.getBoundingClientRect();
    if (r.width) {
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z, halfW = halfH * camera.aspect;
      const px = ((r.left + r.width / 2) / W * 2 - 1) * halfW;
      const py = -((r.top + r.height / 2) / H * 2 - 1) * halfH;
      const ps = (r.width / 2 / H * 2 * halfH) * 1.25 / 1.1;
      const k2 = i === 4 ? 1 : f;
      tx += (px - tx) * k2; ty += (py - ty) * k2; sc += (ps - sc) * k2;
    }
  }
  group.position.x += (tx - group.position.x) * .08;
  group.position.y += (ty - group.position.y) * .08;
  group.scale.setScalar(group.scale.x + (sc - group.scale.x) * .08);
  const alpha = (small ? .35 : 1) * lerpArr(PLACE_A);
  mat.uniforms.uAlpha.value += (alpha - mat.uniforms.uAlpha.value) * .08;

  renderer.render(scene, camera);
  raf = requestAnimationFrame(frame);
}
let raf = 0, running = false;
let paused = reduceMotion;
try { const m = localStorage.getItem("mn-motion"); if (m === "off") paused = true; else if (m === "on") paused = false; } catch (_) {}
function start() { if (renderer && !running && !paused) { running = true; prevTs = performance.now(); raf = requestAnimationFrame(frame); } }
function stop() { running = false; cancelAnimationFrame(raf); }
document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

/* contrôle explicite : l'utilisateur peut suspendre puis reprendre les animations */
const motionBtn = $("[data-motion-toggle]");
function syncMotionButton() {
  motionBtn.setAttribute("aria-pressed", String(paused));
  const label = paused
    ? (lang === "en" ? "Resume animations" : "Reprendre les animations")
    : (lang === "en" ? "Pause animations" : "Mettre les animations en pause");
  motionBtn.setAttribute("aria-label", label); motionBtn.title = label;
  root.classList.toggle("no-motion", paused);
}
function renderStill() {
  if (!renderer) return;
  // place directement les points sur la forme du chapitre en cours, sans animation
  const { i, t } = chapterProgress();
  const f = smooth(.6, 1, t), A = SHAPES[i], B = SHAPES[Math.min(i + 1, SHAPES.length - 1)];
  for (let j = 0; j < N * 3; j++) pos[j] = A[j] + (B[j] - A[j]) * f;
  geo.attributes.position.needsUpdate = true;
  mat.uniforms.uScatter.value = 0;
  renderer.render(scene, camera);
}
motionBtn.addEventListener("click", () => {
  paused = !paused;
  try { localStorage.setItem("mn-motion", paused ? "off" : "on"); } catch (_) {}
  syncMotionButton();
  if (paused) { stop(); renderStill(); } else start();
});
window.addEventListener("scroll", () => { if (paused) requestAnimationFrame(renderStill); }, { passive: true });

/* =========================================================
   Chapitres : HUD, barre de progression, libellé du haut
   ========================================================= */
let current = -1;
const hudLinks = $$(".topnav a");
const topBar = $(".top");
const bar = $(".progress span");
function setChapterLabel() {}
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  topBar.classList.toggle("is-scrolled", window.scrollY > 20);
  const { i } = chapterProgress();
  if (i !== current) {
    current = i;
    setChapterLabel(i);
    hudLinks.forEach((a) => {
      const on = +a.dataset.chapter === i;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
}
window.addEventListener("scroll", onScroll, { passive: true });

/* menu mobile */
const menu = $("#menu"), menuBtn = $("[data-menu-toggle]");
function setMenu(open) {
  menu.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? (lang === "en" ? "Close menu" : "Fermer le menu") : (lang === "en" ? "Open menu" : "Ouvrir le menu"));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) $("a", menu).focus({ preventScroll: true });
}
menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
});
window.addEventListener("resize", () => { if (window.innerWidth > 960 && menu.classList.contains("is-open")) setMenu(false); });

/* défilement doux vers les ancres (sauf mouvement réduit) */
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const target = $(a.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  if (menu.classList.contains("is-open")) setMenu(false);
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  history.replaceState(null, "", a.getAttribute("href"));
  target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true });
}));

/* =========================================================
   Révélations et texte qui se décode
   ========================================================= */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_";
function scramble(el) {
  if (reduceMotion || el.dataset.scrambled) return;
  el.dataset.scrambled = "1";
  const final = el.textContent; const len = final.length; const dur = 900; const t0 = performance.now();
  el.setAttribute("aria-label", final);
  (function step(now) {
    const p = Math.min(1, (now - t0) / dur);
    let out = "";
    for (let i = 0; i < len; i++) {
      const ch = final[i];
      if (ch === " " || i / len < p) out += ch;
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step); else { el.textContent = final; el.removeAttribute("aria-label"); }
  })(t0);
}
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      if (e.target.hasAttribute("data-scramble")) scramble(e.target);
      $$("[data-scramble]", e.target).forEach(scramble);
      io.unobserve(e.target);
    });
  }, { threshold: .15, rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal]").forEach((el) => io.observe(el));
} else {
  $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
}

/* =========================================================
   Démo : recherche en langage naturel
   ========================================================= */
const norm = (s) => s.toLowerCase().replace(/œ/g, "oe").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, " ");
const PLACES = [
  ["Almadies", ["almadies"]], ["Mermoz", ["mermoz"]], ["Ngor", ["ngor"]], ["Ouakam", ["ouakam"]],
  ["Plateau", ["plateau"]], ["Point E", ["point e", "point-e"]], ["Fann", ["fann"]],
  ["Sacré-Cœur", ["sacre coeur", "sacre-coeur"]], ["Grand Yoff", ["grand yoff"]], ["Yoff", ["yoff"]],
  ["Mamelles", ["mamelles"]], ["Liberté", ["liberte"]], ["Parcelles Assainies", ["parcelles"]],
  ["Médina", ["medina"]], ["HLM", ["hlm"]], ["Pikine", ["pikine"]], ["Guédiawaye", ["guediawaye"]],
  ["Keur Massar", ["keur massar"]], ["Rufisque", ["rufisque"]], ["Diamniadio", ["diamniadio"]],
  ["Saly", ["saly"]], ["Somone", ["somone"]], ["Mbour", ["mbour"]], ["Thiès", ["thies"]],
  ["Saint-Louis", ["saint louis", "saint-louis"]], ["Dakar", ["dakar"]]
];
const TYPES = [
  ["Appartement", "Apartment", /\b(appart\w*|apartment|flat)\b/], ["Studio", "Studio", /\bstudio\b/],
  ["Villa", "Villa", /\bvilla\b/], ["Maison", "House", /\b(maison|house)\b/],
  ["Terrain", "Land", /\b(terrain|land|plot)\b/], ["Bureau", "Office", /\b(bureau|office)\b/]
];
const AMEN = [
  ["Climatisation", "Air conditioning", /\b(clim\w*|air con\w*)\b/], ["Piscine", "Pool", /\b(piscine|pool)\b/],
  ["Vue mer", "Sea view", /\b(vue (sur la )?mer|sea view|ocean view)\b/], ["Parking", "Parking", /\b(parking|garage)\b/],
  ["Wifi", "Wi-Fi", /\b(wifi|wi-fi|internet)\b/]
];
const L = {
  fr: { type: "Type", loc: "Quartier", rooms: "Chambres", budget: "Budget max", tx: "Transaction", furn: "Ameublement", amen: "Équipement",
        empty: "Aucun critère reconnu. Essayez un quartier, un budget ou un nombre de chambres.",
        rent: "Location", night: "Location à la nuit", month: "Location au mois", sale: "Vente", furnished: "Meublé", unfurnished: "Non meublé",
        fnote: (f, n) => `${f} (${n} chambre${n > 1 ? "s" : ""})` },
  en: { type: "Type", loc: "Area", rooms: "Bedrooms", budget: "Max budget", tx: "Deal", furn: "Furnishing", amen: "Amenity",
        empty: "No criteria recognised. Try an area, a budget or a number of bedrooms.",
        rent: "Rent", night: "Nightly rental", month: "Monthly rental", sale: "For sale", furnished: "Furnished", unfurnished: "Unfurnished",
        fnote: (f, n) => `${f} (${n} bedroom${n > 1 ? "s" : ""})` }
};
function parseAmount(numStr, unit) {
  let n = parseFloat(numStr.replace(/[\s.,](?=\d{3}\b)/g, "").replace(",", "."));
  if (!isFinite(n)) return null;
  unit = (unit || "").toLowerCase();
  if (unit === "k") n *= 1e3; else if (unit === "m" || unit.startsWith("million")) n *= 1e6;
  return n >= 1000 ? Math.round(n) : null;
}
function parse(q) {
  const s = " " + norm(q) + " ", out = [], t = L[lang];
  let typed = false;
  for (const [fr, en, re] of TYPES) if (re.test(s)) { out.push(["type", lang === "en" ? en : fr]); typed = true; break; }
  if (!typed && /\b(chambre|room)\b/.test(s) && !/\d\s*(chambres?|rooms?)\b/.test(s)) out.push(["type", lang === "en" ? "Room" : "Chambre"]);
  const rm = s.match(/\b(\d{1,2})\s*(chambres?|ch\b|bedrooms?|beds?|br\b)/), fm = s.match(/\bf\s?([1-9])\b/);
  if (rm) out.push(["rooms", rm[1]]); else if (fm) out.push(["rooms", t.fnote("F" + fm[1], Math.max(1, +fm[1] - 1))]);
  for (const [label, keys] of PLACES) {
    if (!keys.some((k) => s.includes(" " + k) || s.includes("-" + k))) continue;
    if (label === "Yoff" && s.includes("grand yoff")) continue;
    if (label === "Dakar" && out.some((o) => o[0] === "loc")) continue;
    out.push(["loc", label]);
  }
  const b = s.match(/(moins de|max(?:imum)?|under|below|jusqu a|budget(?: de)?|pas plus de|less than|up to)\s*([\d][\d\s.,]*)\s*(k|m|millions?|fcfa|cfa|xof|f)?\b/)
         || s.match(/\b([\d][\d\s.,]*)\s*(k|m|millions?)\b/)
         || s.match(/\b(\d{2,3}[\s.,]\d{3}(?:[\s.,]\d{3})?)\s*(fcfa|cfa|xof|f)?\b/);
  if (b) {
    const pre = b.length === 4, amount = parseAmount(pre ? b[2] : b[1], pre ? b[3] : b[2]);
    if (amount) out.push(["budget", amount.toLocaleString(lang === "en" ? "en-US" : "fr-FR").replace(/ /g, " ") + " FCFA"]);
  }
  if (/\b(a vendre|achat|acheter|for sale|to buy|buy)\b/.test(s)) out.push(["tx", t.sale]);
  else if (/\b(a la nuit|par nuit|nuitee|night\w*|short stay|weekend)\b/.test(s)) out.push(["tx", t.night]);
  else if (/\b(au mois|par mois|mensuel\w*|monthly|per month)\b/.test(s)) out.push(["tx", t.month]);
  else if (/\b(louer|location|a louer|rent|for rent|rental)\b/.test(s)) out.push(["tx", t.rent]);
  if (/\b(non meuble|unfurnished)\b/.test(s)) out.push(["furn", t.unfurnished]);
  else if (/\b(meuble\w*|furnished)\b/.test(s)) out.push(["furn", t.furnished]);
  for (const [fr, en, re] of AMEN) if (re.test(s)) out.push(["amen", lang === "en" ? en : fr]);
  return out;
}
const input = $("#demo-input"), chips = $("#demo-chips");
let prev = new Set();
function runDemo() {
  const res = parse(input.value), t = L[lang];
  chips.innerHTML = "";
  if (!res.length) {
    const li = document.createElement("li"); li.className = "chips-empty"; li.textContent = t.empty; chips.appendChild(li);
    prev = new Set(); return;
  }
  const keys = new Set();
  res.forEach(([k, v]) => {
    const key = k + ":" + v; keys.add(key);
    const li = document.createElement("li");
    li.className = "chip" + (prev.has(key) || reduceMotion ? "" : " is-new");
    const a = document.createElement("span"); a.className = "chip-k"; a.textContent = t[k];
    const b = document.createElement("span"); b.className = "chip-v"; b.textContent = v;
    li.append(a, b); chips.appendChild(li);
  });
  prev = keys;
}
let dt;
input.addEventListener("input", () => { clearTimeout(dt); dt = setTimeout(runDemo, 120); });
$("[data-demo-clear]").addEventListener("click", () => { input.value = ""; runDemo(); input.focus(); });
$$(".demo-examples button").forEach((btn) => btn.addEventListener("click", () => { input.value = btn.dataset.q; runDemo(); input.focus(); }));

/* =========================================================
   Démarrage
   ========================================================= */
$("#year").textContent = new Date().getFullYear();
applyLang(lang);
syncThemeButton();
syncMotionButton();
updateSceneTheme();
measure(); resize(); onScroll();
if (paused) renderStill();
window.addEventListener("resize", () => { measure(); resize(); });
window.addEventListener("load", measure);
if ("ResizeObserver" in window) new ResizeObserver(() => measure()).observe(document.body);
start();

const count = $(".boot-count");
const bootTime = reduceMotion ? 0 : 700, t0 = performance.now();
let booted = false;
function endBoot() { if (booted) return; booted = true; document.body.classList.remove("is-loading"); }
$(".boot").addEventListener("click", endBoot);
window.addEventListener("keydown", endBoot, { once: true });
(function tick(now) {
  if (booted) return;
  const p = bootTime ? Math.min(1, (now - t0) / bootTime) : 1;
  count.textContent = String(Math.round(p * 100)).padStart(3, "0");
  if (p < 1) requestAnimationFrame(tick); else setTimeout(endBoot, reduceMotion ? 0 : 120);
})(t0);

/* copie de l'adresse, avec retour immédiat et solution de repli */
const copyBtn = $("[data-copy]"), copyStatus = $(".copy-status");
let copyT;
copyBtn.addEventListener("click", async () => {
  const value = copyBtn.dataset.copy;
  let ok = false;
  try { await navigator.clipboard.writeText(value); ok = true; } catch (_) {
    const ta = document.createElement("textarea"); ta.value = value; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
    ta.remove();
  }
  copyStatus.textContent = ok
    ? (lang === "en" ? "Address copied." : "Adresse copiée.")
    : (lang === "en" ? "Copy failed: select the address above and copy it manually." : "Copie impossible : sélectionnez l'adresse ci-dessus et copiez-la manuellement.");
  clearTimeout(copyT); copyT = setTimeout(() => { copyStatus.textContent = ""; }, 4000);
});

/* raccourcis clavier pour les utilisateurs expérimentés : 0 à 4 */
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
  if (/^[0-4]$/.test(e.key)) {
    const target = sections[+e.key];
    if (target) target.scrollIntoView({ behavior: reduceMotion || paused ? "auto" : "smooth" });
  }
});
