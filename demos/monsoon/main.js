import "@fontsource/dm-serif-display/400.css";
import "@fontsource/dm-serif-display/400-italic.css";
import "@fontsource-variable/geist";
import { animate, scroll, inView, stagger } from "motion";
import { mountBadge, mountCta, reduce, ease, range, splitWords } from "../shared/demo.js";

mountBadge();
mountCta("café");

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const out3 = (t) => 1 - Math.pow(1 - t, 3);
const smooth = (t) => t * t * (3 - 2 * t);

/* ---------- rain: a canvas of streaks that only runs while on screen ---------- */
function makeRain(canvas, count) {
  const ctx = canvas.getContext("2d");
  const tone = { rgb: [42, 29, 21], alpha: 0.3 };
  let w = 0;
  let h = 0;
  let on = false;
  let last = 0;
  const fit = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const drop = (y) => ({ x: Math.random() * (w + 200) - 60, y: y ?? Math.random() * h, len: 12 + Math.random() * 26, v: 700 + Math.random() * 700, a: 0.25 + Math.random() * 0.75 });
  fit();
  const drops = Array.from({ length: count }, () => drop());
  const frame = (now) => {
    if (!on) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.2;
    ctx.lineCap = "round";
    const [r, g, b] = tone.rgb;
    for (const d of drops) {
      d.y += d.v * dt;
      d.x -= d.v * dt * 0.14;
      if (d.y - d.len > h) Object.assign(d, drop(-20));
      ctx.strokeStyle = `rgba(${r},${g},${b},${d.a * tone.alpha})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.len * 0.14, d.y - d.len);
      ctx.stroke();
    }
    requestAnimationFrame(frame);
  };
  new ResizeObserver(fit).observe(canvas);
  new IntersectionObserver(([e]) => {
    const was = on;
    on = e.isIntersecting;
    if (on && !was) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  }).observe(canvas);
  return tone;
}

/* ---------- words fall like raindrops, squash on landing and leave a ripple ---------- */
function dropWords(el, startDelay = 0) {
  const words = splitWords(el);
  const ripples = words.map((w) => {
    const r = document.createElement("span");
    r.className = "ripple";
    w.parentElement.append(r);
    return r;
  });
  words.forEach((w) => (w.style.opacity = "0"));
  return () => {
    const fall = window.innerHeight * 0.7;
    animate(
      words,
      { y: [-fall, 0, -10, 0], scaleY: [1.5, 0.78, 1.06, 1], scaleX: [0.7, 1.16, 0.97, 1], opacity: [0, 1, 1, 1] },
      { duration: 1.05, times: [0, 0.6, 0.8, 1], ease: ["easeIn", "easeOut", "easeInOut"], delay: stagger(0.13, { startDelay }) }
    );
    animate(ripples, { scaleX: [0.2, 1.9], opacity: [0.9, 0] }, { duration: 0.9, ease: "easeOut", delay: stagger(0.13, { startDelay: startDelay + 0.63 }) });
  };
}

/* ---------- split-flap board ---------- */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function buildFlaps(el) {
  // one group per word so a long name wraps between words, never mid-word
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = "";
  return words.flatMap((word) => {
    const group = document.createElement("span");
    group.className = "fw";
    el.append(group);
    return [...word].map((ch) => {
      const s = document.createElement("span");
      s.className = "flap";
      s.dataset.ch = ch;
      s.textContent = reduce ? ch : "";
      group.append(s);
      return s;
    });
  });
}
function riffle(tiles, { spread = 30, min = 3, extra = 6 } = {}) {
  let longest = 0;
  tiles.forEach((t, i) => {
    let left = min + Math.floor(Math.random() * extra);
    longest = Math.max(longest, i * spread + left * 75);
    const tick = () => {
      t.textContent = left > 0 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : t.dataset.ch;
      t.animate([{ transform: "rotateX(-88deg)", filter: "brightness(0.5)" }, { transform: "none", filter: "none" }], { duration: 110, easing: "cubic-bezier(.3,.7,.4,1)" });
      if (left-- > 0) setTimeout(tick, 75);
    };
    setTimeout(tick, i * spread);
  });
  return longest + 120;
}

const rows = $$(".board li").map((li) => ({ li, tiles: buildFlaps($(".flaps", li)), busy: false }));
const headTiles = buildFlaps($(".board-top .flaps"));
const clock = $(".board-top .clock");
const now = () => new Date().toTimeString().slice(0, 5);
clock.textContent = now();
const clockTiles = buildFlaps(clock);

if (reduce) {
  $$(".steps li").forEach((li) => li.classList.add("on"));
} else {
  document.documentElement.classList.add("motion");

  /* ---------- hero ---------- */
  const heroRain = makeRain($(".hero .rain"), 150);
  const win = $(".window");
  const img = $(".window img");
  const inner = $(".hero-inner");
  const pourLine = $(".pour-line");
  let heroP = 0;
  const start = (vw, vh) => {
    if (vw <= 760) {
      const d = Math.min(vw * 0.8, vh * 0.4);
      return { x: (vw - d) / 2, y: vh * 0.96 - d, d };
    }
    const d = Math.min(vw * 0.42, vh * 0.66);
    return { x: vw * 0.95 - d, y: vh * 0.54 - d / 2, d };
  };
  const renderHero = () => {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const s = start(vw, vh);
    const e = smooth(range(heroP, 0.12, 0.7));
    win.style.width = `${lerp(s.d, vw, e)}px`;
    win.style.height = `${lerp(s.d, vh, e)}px`;
    win.style.transform = `translate(${lerp(s.x, 0, e)}px, ${lerp(s.y, 0, e)}px)`;
    win.style.borderRadius = `${lerp(s.d / 2, 0, e)}px`;
    win.style.setProperty("--dim", String(e * 0.62));

    const t = range(heroP, 0, 0.42);
    inner.style.transform = `translateY(${-t * 120}px) rotateX(${t * 62}deg)`;
    inner.style.opacity = String(1 - range(heroP, 0.04, 0.36));

    const pl = out3(range(heroP, 0.6, 0.86));
    pourLine.style.opacity = String(pl);
    pourLine.style.transform = `translateY(${(1 - pl) * 50}px) scale(${0.9 + pl * 0.1})`;

    heroRain.rgb = [Math.round(lerp(42, 243, e)), Math.round(lerp(29, 236, e)), Math.round(lerp(21, 226, e))];
    heroRain.alpha = lerp(0.28, 0.5, e);
  };
  renderHero();
  window.addEventListener("resize", renderHero);
  scroll(
    (p) => {
      heroP = p;
      renderHero();
    },
    { target: $(".hero"), offset: ["start start", "end end"] }
  );

  // intro: the window irises open, the headline rains in
  animate(win, { clipPath: ["circle(0% at 50% 50%)", "circle(75% at 50% 50%)"] }, { duration: 1.6, delay: 0.15, ease });
  animate(img, { scale: [1.4, 1.04] }, { duration: 3, delay: 0.15, ease });
  animate($(".hero-eyebrow"), { opacity: [0, 1], y: [16, 0] }, { duration: 0.8, delay: 0.1, ease });
  dropWords($(".hero-title"), 0.35)();
  animate($$(".hero-sub, .hero-actions"), { opacity: [0, 1], y: [24, 0] }, { duration: 0.9, delay: stagger(0.12, { startDelay: 1.1 }), ease });

  /* ---------- menu: the board tips up, each row riffles in ---------- */
  const board = $(".board");
  scroll(
    (p) => {
      const e = out3(p);
      board.style.transform = `rotateX(${(1 - e) * 40}deg) translateY(${(1 - e) * 90}px) scale(${0.9 + e * 0.1})`;
    },
    { target: board, offset: ["start end", "start 0.3"] }
  );
  inView(".board-top", () => {
    riffle(headTiles, { spread: 40 });
    riffle(clockTiles, { spread: 60, min: 5 });
  });
  rows.forEach((row) => {
    const go = (opts) => {
      if (row.busy) return;
      row.busy = true;
      setTimeout(() => (row.busy = false), riffle(row.tiles, opts));
    };
    inView(row.li, () => go(), { amount: 0.6 });
    row.li.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && go({ spread: 18, min: 1, extra: 3 }));
  });
  setInterval(() => {
    const t = now();
    clockTiles.forEach((tile, i) => {
      if (tile.dataset.ch !== t[i]) {
        tile.dataset.ch = t[i];
        riffle([tile], { min: 2, extra: 2 });
      }
    });
  }, 10000);

  /* ---------- titles come into focus ---------- */
  inView(".reveal", (el) => {
    animate(el, { opacity: [0, 1], y: [40, 0], filter: ["blur(12px)", "blur(0px)"] }, { duration: 1.1, ease });
  });

  /* ---------- brew: grind, bloom, pour, sip ---------- */
  const cup = $(".cup");
  const grounds = $$(".cup .grounds circle");
  const bubbles = $$(".cup .bubbles circle");
  const coffee = $(".cup .coffee");
  const milk = $(".cup .milk");
  const heart = $(".cup .heart");
  const tail = $(".cup .tail");
  const steam = $(".steam");
  const steps = $$(".steps li");
  const stepAt = [0, 0.27, 0.5, 0.77];
  scroll(
    (p) => {
      const flat = out3(range(p, 0, 0.3));
      const sip = out3(range(p, 0.78, 0.95));
      cup.style.transform = `rotateX(${(1 - flat) * 58}deg) rotateZ(${(1 - flat) * -28 - sip * 12}deg) translateZ(${sip * 70}px)`;
      grounds.forEach((g, i) => {
        const t = out3(range(p, 0.04 + i * 0.011, 0.12 + i * 0.011));
        g.style.opacity = String(t);
        g.style.transform = `translateY(${(1 - t) * -90}px) scale(${0.4 + t * 0.6})`;
      });
      const b = range(p, 0.28, 0.46);
      coffee.style.opacity = String(Math.min(1, b * 1.6));
      coffee.style.transform = `scale(${0.35 + out3(b) * 0.65})`;
      bubbles.forEach((c, i) => {
        const t = range(p, 0.34 + i * 0.02, 0.46 + i * 0.02);
        c.style.opacity = String(Math.sin(t * Math.PI));
        c.style.transform = `scale(${0.3 + t * 1.1})`;
      });
      const m = range(p, 0.52, 0.64);
      milk.style.opacity = String(Math.min(1, m * 2));
      milk.style.transform = `scale(${out3(m)})`;
      heart.style.strokeDashoffset = String(1 - range(p, 0.6, 0.72));
      heart.style.fillOpacity = String(range(p, 0.7, 0.76));
      tail.style.strokeDashoffset = String(1 - range(p, 0.72, 0.76));
      steam.style.opacity = String(sip);
      let active = 0;
      stepAt.forEach((at, i) => p >= at && (active = i));
      steps.forEach((li, i) => li.classList.toggle("on", i === active));
    },
    { target: $(".brew"), offset: ["start start", "end end"] }
  );

  /* ---------- beans: each bag turns round as it passes ---------- */
  const wide = window.matchMedia("(min-width: 761px)");
  $$(".bag").forEach((bag, i) => {
    scroll(
      (p) => {
        const x = 0.5 - p + (wide.matches ? (i - 1) * 0.07 : 0);
        const turn = Math.min(1, Math.max(0, Math.abs(x) - 0.1) / 0.38);
        bag.style.transform = `translateY(${x * 80}px) rotateX(${x * 18}deg) rotateY(${Math.sign(x) * smooth(turn) * 180}deg)`;
      },
      { target: bag, offset: ["start end", "end start"] }
    );
  });

  /* ---------- visit: heavier rain, the title falls in ---------- */
  const visitRain = makeRain($(".visit .rain"), 220);
  visitRain.rgb = [243, 236, 226];
  visitRain.alpha = 0.38;
  const dropVisit = dropWords($(".visit-title"));
  const stopVisit = inView(".visit-title", () => {
    dropVisit();
    stopVisit();
  }, { amount: 0.6 });
}
