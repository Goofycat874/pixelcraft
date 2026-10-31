import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/geist";
import { animate, scroll, stagger } from "motion";
import { mountBadge, mountCta, reduce, ease, range } from "../shared/demo.js";

mountBadge({ dark: true });
mountCta("car showroom");

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- paint colours (shared by the swatches and the scroll) ---------- */
// The photo is graphite grey. Each paint lightens the bodywork (lift) and blends a colour over it (tint, amount).
const paints = [
  { name: "Graphite", tint: "#3a5bd0", amount: 0, lift: 0 },
  { name: "Pearl White", tint: "#e8edf5", amount: 0.3, lift: 0.62 },
  { name: "Ember Red", tint: "#d42a1c", amount: 1, lift: 0.12 },
  { name: "Volt Lime", tint: "#c4f01e", amount: 1, lift: 0.45 },
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], t))).join(",")})`;
const paintCar = $(".paint-car");
const swatches = $$(".swatches button");
const colourName = $(".colour-name");
let shownPaint = 0;
function setPaint(pos) {
  // pos is a float: 1.4 means 40% of the way from paint 1 to paint 2
  const i = Math.min(paints.length - 1, Math.floor(pos));
  const j = Math.min(paints.length - 1, i + 1);
  const t = pos - i;
  const [a, b] = [paints[i], paints[j]];
  // fading to or from the untinted paint keeps the other paint's hue instead of passing through black
  const tint = a.amount === 0 ? b.tint : b.amount === 0 ? a.tint : mix(a.tint, b.tint, t);
  paintCar.style.setProperty("--tint", tint);
  paintCar.style.setProperty("--amount", String(lerp(a.amount, b.amount, t)));
  paintCar.style.setProperty("--lift", String(lerp(a.lift, b.lift, t)));
  const nearest = Math.round(pos);
  if (nearest !== shownPaint) {
    shownPaint = nearest;
    colourName.textContent = paints[nearest].name;
    swatches.forEach((b, k) => b.setAttribute("aria-pressed", String(k === nearest)));
  }
}
swatches.forEach((b, k) =>
  b.addEventListener("click", () => {
    if (reduce) return setPaint(k);
    const from = shownPaint;
    animate(from, k, { duration: 0.8, ease, onUpdate: setPaint });
  })
);

/* ---------- spec numbers ---------- */
const specs = $$(".spec").map((el) => ({ el, num: $(".num", el), to: Number(el.dataset.to), dec: Number(el.dataset.dec) }));
const fmt = (n, dec) => n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });

if (reduce) {
  setPaint(0);
  $(".track").tabIndex = 0; // it scrolls sideways without motion, so keyboard users need to reach it
} else {
  /* ---------- intro: headline rises, car drives in ---------- */
  animate($$(".hero-title .line > span"), { y: ["110%", "0%"] }, { duration: 1.1, delay: stagger(0.09, { startDelay: 0.15 }), ease });
  animate($$(".hero-sub, .hero-actions"), { opacity: [0, 1], y: [24, 0] }, { duration: 0.9, delay: stagger(0.1, { startDelay: 0.55 }), ease });
  // the car faces right, so it drives in from the left
  animate(".car-wrap", { x: ["-115vw", "0vw"] }, { duration: 1.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] });
  animate(".beam", { opacity: [0, 0.8] }, { duration: 0.6, delay: 1.9 });

  /* ---------- the floor and speed lines run on one clock ---------- */
  const floor = $(".floor");
  const lines = $$(".speed i");
  let speed = 1400; // px per second along the floor; eases down to a cruise after the intro
  let target = 1400;
  let floorX = 0;
  let heroP = 0;
  setTimeout(() => (target = 70), 1300);
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const want = target + heroP * 2600; // scrolling the hero floors it
    speed += (want - speed) * Math.min(1, dt * 3);
    floorX -= speed * dt;
    floor.style.backgroundPosition = `${floorX}px 0, ${floorX}px 0`;
    const streak = Math.min(1, Math.max(0, (speed - 200) / 1200));
    lines.forEach((l, i) => {
      l.style.opacity = String(streak * (0.35 + (i % 3) * 0.2));
      l.style.transform = `translateX(${((-floorX * (1.6 + i * 0.3)) % 1400) * -1}px)`;
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  /* ---------- hero scroll: headline tips back in 3D, car drives off ---------- */
  const copy = $(".hero-copy");
  const car = $(".car-wrap");
  scroll(
    (p) => {
      heroP = p;
      const t = range(p, 0, 0.6);
      copy.style.transform = `translateY(${-t * 140}px) rotateX(${t * 55}deg)`;
      copy.style.opacity = String(1 - range(p, 0.1, 0.55));
      const drive = range(p, 0.25, 1);
      car.style.transform = `translateX(${drive * drive * 110}vw) scale(${1 + range(p, 0, 0.3) * 0.08})`;
    },
    { target: $(".hero"), offset: ["start start", "end end"] }
  );

  /* ---------- specs: each number flips up and counts ---------- */
  const ghost = $(".ghost-word");
  const cells = $(".cells i");
  const pct = $(".pct");
  scroll(
    (p) => {
      ghost.style.transform = `translate(${lerp(20, -70, p)}%, -50%)`;
      specs.forEach((s, i) => {
        const t = range(p, 0.08 + i * 0.14, 0.26 + i * 0.14);
        const e = 1 - Math.pow(1 - t, 3);
        s.el.style.opacity = String(Math.min(1, t * 1.6));
        s.el.style.transform = `rotateX(${(1 - e) * -85}deg) translateY(${(1 - e) * 30}px)`;
        s.num.textContent = fmt(s.to * e, s.dec);
      });
      const charge = range(p, 0.05, 0.85);
      cells.style.transform = `scaleX(${charge})`;
      pct.textContent = `${Math.round(charge * 100)}%`;
    },
    { target: $(".specs"), offset: ["start start", "end end"] }
  );

  /* ---------- colours: scroll repaints the car and turns it a little ---------- */

  scroll(
    (p) => {
      const pos = range(p, 0.08, 0.92) * (paints.length - 1);
      setPaint(pos);
      const seg = pos % 1;
      paintCar.style.transform = `rotateY(${Math.sin(pos * Math.PI) * 10}deg) rotateX(${4 - range(p, 0, 0.2) * 4}deg) scale(${0.92 + range(p, 0, 0.2) * 0.08})`;
      paintCar.style.setProperty("--sweep", `${lerp(-20, 120, seg)}%`);
    },
    { target: $(".colours"), offset: ["start start", "end end"] }
  );

  /* ---------- features: vertical scroll pans a 3D coverflow ---------- */
  const track = $(".track");
  const cards = $$(".card");
  scroll(
    (p) => {
      const distance = track.scrollWidth - window.innerWidth;
      const x = -distance * p;
      track.style.transform = `translateX(${x}px)`;
      const mid = window.innerWidth / 2;
      cards.forEach((c) => {
        const centre = c.offsetLeft + c.offsetWidth / 2 + x;
        const d = Math.max(-1.2, Math.min(1.2, (centre - mid) / mid));
        c.style.transform = `rotateY(${d * -38}deg) translateZ(${-Math.abs(d) * 220}px)`;
        c.style.opacity = String(1 - Math.min(1, Math.abs(d)) * 0.5);
      });
    },
    { target: $(".features"), offset: ["start start", "end end"] }
  );

  /* ---------- final call: the headline stands up as it arrives ---------- */
  const ctaTitle = $(".cta-title");
  scroll(
    (p) => {
      const e = 1 - Math.pow(1 - p, 3);
      ctaTitle.style.transform = `rotateX(${(1 - e) * 70}deg) scale(${0.75 + e * 0.25})`;
      ctaTitle.style.opacity = String(Math.min(1, p * 1.5));
    },
    { target: $(".cta"), offset: ["start end", "center center"] }
  );
}
