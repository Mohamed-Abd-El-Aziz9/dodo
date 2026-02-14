const START_DATE = new Date("2025-12-12T00:00:00");
const DEFAULT_NAME = "Dodo";
function getNextDate() {
  const params = new URLSearchParams(window.location.search);
  const d = params.get("next");
  if (d) {
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date("2026-02-14T00:00:00");
}
const NEXT_DATE = getNextDate();
function getHerName() {
  const params = new URLSearchParams(window.location.search);
  const p = params.get("name");
  const s = window.localStorage.getItem("herName");
  const n = p || s || DEFAULT_NAME;
  window.localStorage.setItem("herName", n);
  return n;
}
const HER_NAME = getHerName();

const headlineText = `For ${HER_NAME}, My Forever ❤️`;
const headlineEl = document.getElementById("headline");
const herNameEl = document.getElementById("herName");
const herNameInlineEl = document.getElementById("herNameInline");
if (herNameEl) herNameEl.textContent = HER_NAME;
if (herNameInlineEl) herNameInlineEl.textContent = HER_NAME;
let typeIndex = 0;
function typeHeadline() {
  if (!headlineEl) return;
  const step = () => {
    if (typeIndex <= headlineText.length) {
      headlineEl.textContent = headlineText.slice(0, typeIndex);
      typeIndex += 1;
      setTimeout(step, 60);
    }
  };
  step();
}

const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const bgAudio = document.getElementById("bgAudio");
function openModal() {
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
  if (bgAudio) {
    try {
      bgAudio.muted = false;
      const p = bgAudio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
      fadeAudio(0.18, 1000);
    } catch {}
  }
}
function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
}
if (openModalBtn) openModalBtn.addEventListener("click", openModal);
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (modal) modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) closeModal();
});

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
function updateCounter() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  const now = new Date();
  let diff = Math.max(0, now.getTime() - START_DATE.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 60 * 1000;
  const seconds = Math.floor(diff / 1000);
  const setVal = (el, val) => {
    const prev = el.textContent;
    const next = String(val);
    if (prev !== next) {
      el.textContent = next;
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    }
  };
  setVal(daysEl, days);
  setVal(hoursEl, String(hours).padStart(2, "0"));
  setVal(minutesEl, String(minutes).padStart(2, "0"));
  setVal(secondsEl, String(seconds).padStart(2, "0"));
}
setInterval(updateCounter, 1000);
updateCounter();

function updateCountdown() {
  const el = document.getElementById("nextCountdown");
  if (!el) return;
  const now = new Date();
  let diff = Math.max(0, NEXT_DATE.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 60 * 1000;
  const seconds = Math.floor(diff / 1000);
  el.textContent = `Countdown: ${String(days)}d ${String(hours).padStart(2,"0")}h ${String(minutes).padStart(2,"0")}m ${String(seconds).padStart(2,"0")}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

const moreBtn = document.getElementById("moreBtn");
const hiddenMessage = document.getElementById("hiddenMessage");
const sparkleLayer = document.getElementById("sparkleLayer");
function showMore() {
  if (hiddenMessage) hiddenMessage.classList.add("show");
  if (bgAudio) fadeAudio(Math.min(0.35, (bgAudio.volume || 0.2) + 0.15), 900);
  if (sparkleLayer) sparkles();
  intensifyHearts();
}
if (moreBtn) moreBtn.addEventListener("click", showMore);

const canvas = document.getElementById("hearts-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let hearts = [];
let dust = [];
let vw = 0;
let vh = 0;
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function setCanvasSize() {
  if (!canvas) return;
  vw = window.innerWidth;
  vh = window.innerHeight;
  canvas.width = vw;
  canvas.height = vh;
}
function createHearts() {
  if (!ctx) return;
  hearts = [];
  dust = [];
  const count = vw < 700 ? 24 : 42;
  const dustCount = vw < 700 ? 18 : 28;
  for (let i = 0; i < count; i++) {
    const size = rand(8, 18);
    hearts.push({
      x: rand(0, vw),
      y: rand(0, vh),
      size,
      speed: rand(0.15, 0.6),
      drift: rand(-0.3, 0.3),
      alpha: rand(0.18, 0.38),
      hue: rand(335, 355)
    });
  }
  for (let i = 0; i < dustCount; i++) {
    dust.push({
      x: rand(0, vw),
      y: rand(0, vh),
      r: rand(1.5, 2.8),
      alpha: rand(0.15, 0.35),
      speed: rand(0.05, 0.12)
    });
  }
}
function drawHeart(x, y, size, color, alpha) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.beginPath();
  ctx.moveTo(0, -0.5);
  ctx.bezierCurveTo(0.5, -1.15, 1.5, -0.1, 0, 1.05);
  ctx.bezierCurveTo(-1.5, -0.1, -0.5, -1.15, 0, -0.5);
  ctx.closePath();
  ctx.fillStyle = `hsla(${color}, 60%, 70%, ${alpha})`;
  ctx.fill();
  ctx.restore();
}
function drawDust() {
  if (!ctx) return;
  ctx.save();
  for (const d of dust) {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${d.alpha})`;
    ctx.fill();
  }
  ctx.restore();
}
let boostTimeout = null;
function intensifyHearts() {
  if (!ctx) return;
  const extra = vw < 700 ? 12 : 18;
  for (let i = 0; i < extra; i++) {
    hearts.push({
      x: rand(0, vw),
      y: rand(vh * 0.7, vh),
      size: rand(12, 20),
      speed: rand(0.4, 0.9),
      drift: rand(-0.2, 0.2),
      alpha: rand(0.32, 0.5),
      hue: rand(335, 355)
    });
  }
  if (boostTimeout) clearTimeout(boostTimeout);
  boostTimeout = setTimeout(() => {
    hearts.splice(-extra, extra);
  }, 2500);
}
function animateHearts() {
  if (!ctx) return;
  ctx.clearRect(0, 0, vw, vh);
  drawDust();
  for (const d of dust) {
    d.y -= d.speed;
    if (d.y < -10) {
      d.y = vh + 10;
      d.x = rand(0, vw);
    }
  }
  for (const h of hearts) {
    h.y -= h.speed;
    h.x += h.drift * 0.6;
    if (h.y < -20) {
      h.y = vh + 20;
      h.x = rand(0, vw);
    }
    drawHeart(h.x, h.y, h.size / 18, h.hue, h.alpha);
  }
  requestAnimationFrame(animateHearts);
}
window.addEventListener("resize", () => {
  setCanvasSize();
  createHearts();
});

window.addEventListener("DOMContentLoaded", () => {
  setCanvasSize();
  createHearts();
  animateHearts();
  typeHeadline();
  bindGallery();
  extractPalette();
  runIntro();
  bindButtonsRipple();
  setupCounterReveal();
  setupFinalConfetti();
  initTheme();
  initGreeting();
  initLoveReaction();
  initAudioMini();
  ensureAudioSource();
  initAudioAutoplay();
  initSecretEaster();
  initIntroSkip();
  setTitle();
  initNavbar();
  initStoryProgress();
  bindStoryLightbox();
  bindStoryTapGlow();

const parallaxEls = document.querySelectorAll("[data-parallax]");
window.addEventListener("scroll", () => {
  const y = window.scrollY || 0;
  parallaxEls.forEach((el) => {
    const rate = parseFloat(el.getAttribute("data-parallax") || "0.06");
    el.style.transform = `translateY(${y * rate}px)`;
  });
});

function initNavbar() {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("navToggle");
  const sheet = document.getElementById("mobileSheet");
  const centerLinks = Array.from(document.querySelectorAll(".nav-center .nav-link"));
  const sheetLinks = Array.from(sheet ? sheet.querySelectorAll(".nav-link") : []);
  const links = centerLinks.concat(sheetLinks);
  let open = false;
  function setOpen(next) {
    open = next;
    if (!nav) return;
    nav.classList.toggle("open", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (sheet) sheet.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) {
    toggle.addEventListener("click", () => setOpen(!open));
  }
  links.forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });
  function onScroll() {
    if (!nav) return;
    const scrolled = (window.scrollY || 0) > 20;
    nav.classList.toggle("scrolled", scrolled);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const sections = links.map((a) => {
    const id = a.getAttribute("href");
    return id ? document.querySelector(id) : null;
  }).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      centerLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === id);
      });
      sheetLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === id);
      });
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0.01 });
  sections.forEach((s) => observer.observe(s));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function ensureAudioSource() {
  if (!bgAudio) return;
  const fallback = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  function set(src) {
    try {
      bgAudio.src = src;
      bgAudio.load();
    } catch {}
  }
  const s = bgAudio.querySelector("source");
  const src = s ? (s.getAttribute("src") || "") : "";
  if (!src) set(fallback);
  bgAudio.addEventListener("error", () => set(fallback), { once: true });
  document.addEventListener("click", () => {
    if (bgAudio.error) set(fallback);
  }, { once: true });
}
function initAudioAutoplay() {
  if (!bgAudio) return;
  function attemptAudible() {
    try {
      bgAudio.muted = false;
      bgAudio.volume = 0.18;
      const p = bgAudio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {}).catch(fallbackMuted);
      }
    } catch {
      fallbackMuted();
    }
  }
  function fallbackMuted() {
    try {
      bgAudio.muted = true;
      bgAudio.volume = 0;
      const p = bgAudio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {}
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      try {
        bgAudio.muted = false;
        fadeAudio(0.18, 800);
      } catch {}
    };
    document.addEventListener("click", go, { once: true });
    document.addEventListener("touchstart", go, { once: true, passive: true });
    document.addEventListener("keydown", go, { once: true });
    window.addEventListener("scroll", go, { once: true, passive: true });
  }
  attemptAudible();
}
function bindGallery() {
  const track = document.querySelector(".slider-track");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prev = document.querySelector(".slider-btn.prev");
  const next = document.querySelector(".slider-btn.next");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbClose = document.getElementById("lightboxClose");
  let index = 0;
  function getWidth() {
    const slider = document.querySelector(".slider");
    return slider ? slider.clientWidth : window.innerWidth;
  }
  function render() {
    if (!track) return;
    const w = getWidth();
    track.style.transform = `translateX(${-index * w}px)`;
    track.style.transition = "transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1)";
  }
  function go(i) {
    index = (i + slides.length) % slides.length;
    render();
  }
  if (prev) prev.addEventListener("click", () => go(index - 1));
  if (next) next.addEventListener("click", () => go(index + 1));
  // Touch swipe support
  let startX = 0;
  let dragging = false;
  let deltaX = 0;
  function onStart(e) {
    if (!track) return;
    dragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    deltaX = 0;
    track.style.transition = "none";
  }
  function onMove(e) {
    if (!dragging || !track) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    deltaX = x - startX;
    const w = getWidth();
    const px = (-index * w) + deltaX;
    track.style.transform = `translateX(${px}px)`;
  }
  function onEnd() {
    if (!dragging || !track) return;
    dragging = false;
    const threshold = 50;
    if (deltaX > threshold) go(index - 1);
    else if (deltaX < -threshold) go(index + 1);
    else render();
  }
  if (track) {
    track.addEventListener("touchstart", onStart, { passive: true });
    track.addEventListener("touchmove", onMove, { passive: true });
    track.addEventListener("touchend", onEnd);
    track.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
  }
  window.addEventListener("resize", render);
  slides.forEach((img) => {
    img.addEventListener("click", () => {
      if (!lightbox || !lbImg) return;
      lbImg.src = img.src;
      lightbox.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  });
  function closeLb() {
    if (!lightbox) return;
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
  }
  if (lbClose) lbClose.addEventListener("click", closeLb);
  const lbBackdrop = document.querySelector(".lightbox-backdrop");
  if (lbBackdrop) lbBackdrop.addEventListener("click", closeLb);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  });
  render();
}

function bindStoryLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const items = document.querySelectorAll(".story-media img");
  items.forEach((img) => {
    img.addEventListener("click", () => {
      if (!lightbox || !lbImg) return;
      lbImg.src = img.src;
      lightbox.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  });
}

function bindStoryTapGlow() {
  const figures = document.querySelectorAll(".story-media");
  figures.forEach((f) => {
    f.addEventListener("touchstart", () => {
      f.classList.add("touched");
      setTimeout(() => f.classList.remove("touched"), 600);
    }, { passive: true });
  });
}

function initStoryProgress() {
  const section = document.getElementById("story");
  const bar = document.querySelector(".story-progress");
  const fill = document.querySelector(".story-progress .fill");
  if (!section || !bar || !fill) return;
  function update() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height - vh;
    let y = Math.min(Math.max(vh - rect.top, 0), rect.height);
    const pct = total > 0 ? Math.min(Math.max(y - vh * 0.2, 0), total) / total : 0;
    fill.style.height = `${Math.round(pct * 100)}%`;
  }
  const obs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        bar.classList.add("active");
        update();
      } else {
        bar.classList.remove("active");
      }
    }
  }, { threshold: 0.05 });
  obs.observe(section);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function extractPalette() {
  const img = document.getElementById("heroPhoto");
  if (!img) return;
  const c = document.createElement("canvas");
  const cx = c.getContext("2d");
  function applyFrom(avg) {
    const [r, g, b] = avg;
    const accent = `rgba(${r},${g},${b},0.25)`;
    document.documentElement.style.setProperty("--glass", "rgba(255,255,255,0.55)");
    document.documentElement.style.setProperty("--border", "rgba(255,255,255,0.62)");
    document.documentElement.style.setProperty("--dynamic-overlay", accent);
  }
  function compute() {
    const w = Math.min(80, img.naturalWidth || 80);
    const h = Math.min(80, img.naturalHeight || 80);
    c.width = w;
    c.height = h;
    try {
      cx.drawImage(img, 0, 0, w, h);
      const data = cx.getImageData(0, 0, w, h).data;
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
      r = Math.round(r / n);
      g = Math.round(g / n);
      b = Math.round(b / n);
      applyFrom([r, g, b]);
    } catch {}
  }
  if (img.complete) compute();
  else img.addEventListener("load", compute);
}

function sparkles() {
  const layer = document.getElementById("sparkleLayer");
  if (!layer) return;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = `${rand(10, 90)}%`;
    s.style.top = `${rand(60, 90)}%`;
    layer.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
}

function runIntro() {
  const overlay = document.getElementById("introOverlay");
  if (!overlay) return;
  const seen = window.localStorage.getItem("introSeen") === "1";
  const small = window.innerWidth < 700;
  if (seen || small) {
    overlay.classList.add("hide");
    return;
  }
  overlay.classList.add("show1");
  setTimeout(() => {
    overlay.classList.remove("show1");
    overlay.classList.add("show2");
    setTimeout(() => {
      overlay.classList.add("hide");
      window.localStorage.setItem("introSeen", "1");
    }, 1400);
  }, 1600);
}

function bindButtonsRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.style.position = "relative";
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}

let countUpDone = false;
function setupCounterReveal() {
  const counterSection = document.getElementById("counter");
  if (!counterSection) return;
  const obs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !countUpDone) {
        countUpDone = true;
        animateCountUp();
        obs.unobserve(counterSection);
      }
    }
  }, { threshold: 0.25 });
  obs.observe(counterSection);
}
function easeOutQuad(t) { return t * (2 - t); }
function fadeAudio(target, duration) {
  if (!bgAudio) return;
  const startVol = bgAudio.volume || 0;
  const start = performance.now();
  function step(ts) {
    const t = Math.min(1, (ts - start) / duration);
    const e = easeOutQuad(t);
    bgAudio.volume = startVol + (target - startVol) * e;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function animateCountUp() {
  const now = new Date();
  let diff = Math.max(0, now.getTime() - START_DATE.getTime());
  const target = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
  const dur = 1200;
  const start = performance.now();
  function step(ts) {
    const t = Math.min(1, (ts - start) / dur);
    const e = easeOutQuad(t);
    const dd = Math.floor(target.days * e);
    const hh = Math.floor(target.hours * e);
    const mm = Math.floor(target.minutes * e);
    const ss = Math.floor(target.seconds * e);
    const setVal = (el, val) => {
      const next = String(val);
      el.textContent = next;
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    };
    if (daysEl) setVal(daysEl, dd);
    if (hoursEl) setVal(hoursEl, String(hh).padStart(2, "0"));
    if (minutesEl) setVal(minutesEl, String(mm).padStart(2, "0"));
    if (secondsEl) setVal(secondsEl, String(ss).padStart(2, "0"));
    if (t < 1) requestAnimationFrame(step);
    else updateCounter();
  }
  requestAnimationFrame(step);
}

function setupFinalConfetti() {
  const finalSection = document.getElementById("final");
  const layer = document.getElementById("confettiLayer");
  if (!finalSection || !layer) return;
  let fired = false;
  const obs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !fired) {
        fired = true;
        confettiHearts();
        setTimeout(() => confettiHearts(), 600);
        setTimeout(() => confettiHearts(), 1200);
        obs.unobserve(finalSection);
      }
    }
  }, { threshold: 0.45 });
  obs.observe(finalSection);
}
function confettiHearts() {
  const layer = document.getElementById("confettiLayer");
  if (!layer) return;
  const flowers = ["🌸"];
  for (let i = 0; i < 16; i++) {
    const f = document.createElement("span");
    f.className = "confetti-flower";
    f.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    f.style.left = `${rand(5, 95)}%`;
    f.style.top = `${rand(-5, 5)}%`;
    f.style.fontSize = `${rand(16, 26)}px`;
    layer.appendChild(f);
    setTimeout(() => f.remove(), 2800);
  }
}

function setTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  window.localStorage.setItem("theme", theme);
  const nightToggle = document.getElementById("nightToggle");
  if (nightToggle) nightToggle.checked = theme === "midnight";
  const stars = document.getElementById("starsLayer");
  if (stars) stars.style.display = theme === "midnight" ? "block" : "none";
}
function initTheme() {
  const themeBtn = document.getElementById("themeBtn");
  const themePanel = document.getElementById("themePanel");
  const themeClose = document.getElementById("themeClose");
  const nightToggle = document.getElementById("nightToggle");
  const saved = window.localStorage.getItem("theme") || "blush";
  setTheme(saved);
  if (themeBtn && themePanel) {
    themeBtn.addEventListener("click", () => themePanel.classList.add("show"));
  }
  if (themeClose && themePanel) {
    themeClose.addEventListener("click", () => themePanel.classList.remove("show"));
  }
  document.querySelectorAll(".palette").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-theme") || "blush";
      setTheme(t);
      const p = document.getElementById("themePanel");
      if (p) p.classList.remove("show");
    });
  });
  if (nightToggle) {
    nightToggle.addEventListener("change", (e) => {
      const on = e.target.checked;
      if (on) setTheme("midnight");
      else {
        const fallback = window.localStorage.getItem("lastLightTheme") || "blush";
        setTheme(fallback);
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && themePanel && themePanel.classList.contains("show")) {
      themePanel.classList.remove("show");
    }
  });
  const current = window.localStorage.getItem("theme");
  if (current && current !== "midnight") window.localStorage.setItem("lastLightTheme", current);
}

function initLoveReaction() {
  const btn = document.getElementById("loveBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (navigator.vibrate) try { navigator.vibrate(30); } catch {}
    const start = Date.now();
    const run = () => {
      confettiHearts();
      intensifyHearts();
      if (Date.now() - start < 2800) setTimeout(run, 600);
    };
    run();
  });
}

function initAudioMini() {
  const playBtn = document.getElementById("audioPlay");
  const pauseBtn = document.getElementById("audioPause");
  const vol = document.getElementById("audioVolume");
  const mini = document.getElementById("audioMini");
  if (playBtn) playBtn.addEventListener("click", () => {
    if (!bgAudio) return;
    try {
      bgAudio.muted = false;
      const p = bgAudio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
      fadeAudio(0.2, 600);
      if (mini) mini.classList.add("playing");
    } catch {}
  });
  if (pauseBtn) pauseBtn.addEventListener("click", () => {
    if (!bgAudio) return;
    fadeAudio(0, 600);
    setTimeout(() => {
      try { bgAudio.pause(); } catch {}
      if (mini) mini.classList.remove("playing");
    }, 620);
  });
  if (vol) vol.addEventListener("input", () => {
    if (!bgAudio) return;
    bgAudio.volume = parseFloat(vol.value || "0.2");
  });
  if (bgAudio && mini) {
    bgAudio.addEventListener("play", () => mini.classList.add("playing"));
    bgAudio.addEventListener("pause", () => mini.classList.remove("playing"));
  }
}

function initSecretEaster() {
  const nameSpan = document.getElementById("herName");
  const msg = document.getElementById("hiddenMessage");
  let clicks = 0;
  let resetT = null;
  if (!nameSpan || !msg) return;
  nameSpan.addEventListener("click", () => {
    clicks += 1;
    if (resetT) clearTimeout(resetT);
    resetT = setTimeout(() => { clicks = 0; }, 1400);
    if (clicks >= 3) {
      msg.classList.add("show");
      sparkles();
      clicks = 0;
    }
  });
}

function initGreeting() {
  const el = document.getElementById("greeting");
  if (!el) return;
  const h = new Date().getHours();
  let text = `Hello, ${HER_NAME}`;
  if (h < 12) text = `Good Morning, ${HER_NAME}`;
  else if (h < 18) text = `Good Afternoon, ${HER_NAME}`;
  else text = `Good Evening, ${HER_NAME}`;
  el.textContent = text;
}

function initIntroSkip() {
  const btn = document.getElementById("introSkip");
  const overlay = document.getElementById("introOverlay");
  if (!btn || !overlay) return;
  btn.addEventListener("click", () => {
    overlay.classList.add("hide");
  });
}

function setTitle() {
  try {
    document.title = `${HER_NAME} • Love Story`;
  } catch {}
}});
