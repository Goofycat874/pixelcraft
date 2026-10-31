import "@fontsource-variable/unbounded";
import "@fontsource-variable/geist";
import bagIcon from "@phosphor-icons/core/assets/fill/bag-fill.svg?raw";
import cookieIcon from "@phosphor-icons/core/assets/fill/cookie-fill.svg?raw";
import flameIcon from "@phosphor-icons/core/assets/fill/flame-fill.svg?raw";
import { animate, scroll, inView, stagger } from "motion";
import { mountBadge, mountCta, reduce, ease, range, splitWords } from "../shared/demo.js";

const mobile = window.matchMedia("(max-width: 760px)");
mountBadge({ bottom: mobile.matches ? 96 : 16 });
mountCta("bakery");

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const out3 = (t) => 1 - Math.pow(1 - t, 3);

// icons come from Phosphor's SVG files, inlined so they take the text colour
const icons = { bag: bagIcon, cookie: cookieIcon, flame: flameIcon };
$$("[data-icon]").forEach((el) => (el.innerHTML = icons[el.dataset.icon] ?? ""));

// A spring, sampled into a CSS linear() curve so the browser can run it.
function spring(stiffness = 170, damping = 11) {
  const pts = [];
  let x = 0;
  let v = 0;
  for (let i = 0; i < 100; i++) {
    v += (-stiffness * (x - 1) - damping * v) / 60;
    x += v / 60;
    pts.push(Number(x.toFixed(4)));
  }
  pts[pts.length - 1] = 1;
  return { easing: `linear(0, ${pts.join(", ")})`, duration: (pts.length / 60) * 1000 };
}

/* ---------- the tray: what's been added, shown on the ticket and the tray buttons ---------- */
const cards = $$(".card").map((card) => ({
  card,
  id: card.dataset.id,
  name: $("h3", card).textContent,
  price: Number(card.dataset.price),
  img: $("img", card),
  qty: 0,
}));
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const lines = $(".t-lines");
const ticket = $(".ticket");
const sum = $(".t-sum");
const counts = $$(".count");
const trayBtn = $(".tray-btn");
const status = $('[role="status"]');

function render(changed) {
  const items = cards.filter((c) => c.qty);
  const total = items.reduce((t, c) => t + c.qty * c.price, 0);
  const n = items.reduce((t, c) => t + c.qty, 0);
  lines.replaceChildren(
    ...items.map((c) => {
      const li = document.createElement("li");
      li.dataset.id = c.id;
      const a = document.createElement("span");
      a.textContent = `${c.qty} × ${c.name}`;
      const b = document.createElement("span");
      b.textContent = fmt(c.qty * c.price);
      li.append(a, b);
      return li;
    })
  );
  ticket.classList.toggle("filled", n > 0);
  sum.textContent = fmt(total);
  counts.forEach((el) => (el.textContent = String(n)));
  trayBtn.setAttribute("aria-label", `Your tray, ${n} ${n === 1 ? "item" : "items"}`);
  status.textContent = n ? `${n} ${n === 1 ? "item" : "items"} in your tray, ${fmt(total)}` : "Your tray is empty";
  cards.forEach((c) => {
    c.card.classList.toggle("has", c.qty > 0);
    c.n.textContent = String(c.qty);
  });
  if (!reduce && changed) {
    // the changed line prints in like a receipt
    const li = $(`li[data-id="${changed}"]`, lines);
    if (li) li.animate([{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }, { clipPath: "inset(0 0 0 0)", opacity: 1 }], { duration: 450, easing: "steps(12, end)" });
    counts.forEach((el) => el.animate([{ scale: "1.6" }, { scale: "1" }], spring(300, 12)));
  }
}

// Sends a copy of the pastry flying in an arc to whichever tray button is on screen.
function fly(img) {
  const target = (mobile.matches ? $(".tab-tray") : trayBtn).getBoundingClientRect();
  const from = img.getBoundingClientRect();
  const clone = img.cloneNode();
  clone.className = "flyer";
  document.body.append(clone);
  const x0 = from.left + from.width / 2 - 35;
  const y0 = from.top + from.height / 2 - 35;
  const x1 = target.left + target.width / 2 - 35;
  const y1 = target.top + target.height / 2 - 35;
  const lift = Math.min(y0, y1) - 160;
  clone.animate(
    [
      { transform: `translate(${x0}px, ${y0}px) scale(1.4) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${(x0 + x1) / 2}px, ${lift}px) scale(1.1) rotate(-160deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${x1}px, ${y1}px) scale(0.3) rotate(-320deg)`, opacity: 0.4 },
    ],
    { duration: 800, easing: "cubic-bezier(.45,0,.25,1)" }
  ).onfinish = () => clone.remove();
}

cards.forEach((c) => {
  // stepper: minus, count, plus (replaces the Add button once there is one in the tray)
  const step = document.createElement("div");
  step.className = "stepper";
  const minus = document.createElement("button");
  minus.type = "button";
  minus.textContent = "−";
  minus.setAttribute("aria-label", `Remove one ${c.name}`);
  const n = document.createElement("span");
  n.className = "n";
  n.setAttribute("aria-hidden", "true");
  const plus = document.createElement("button");
  plus.type = "button";
  plus.textContent = "+";
  plus.setAttribute("aria-label", `Add one more ${c.name}`);
  step.append(minus, n, plus);
  $(".buy", c.card).append(step);
  c.n = n;
  const add = $(".add", c.card);
  add.setAttribute("aria-label", `Add ${c.name} to your tray`);
  const more = () => {
    c.qty += 1;
    if (!reduce) {
      fly(c.img);
      c.img.animate([{ transform: "scale(1)" }, { transform: "scale(0.85) rotate(-6deg)" }, { transform: "scale(1)" }], { duration: 400, easing: "ease-out" });
    }
    render(c.id);
    if (add === document.activeElement) plus.focus();
  };
  add.addEventListener("click", more);
  plus.addEventListener("click", more);
  minus.addEventListener("click", () => {
    c.qty = Math.max(0, c.qty - 1);
    render(c.id);
    if (!c.qty) add.focus();
  });
});
$$('.pickup input').forEach((r) => r.addEventListener("change", () => ($(".t-time").textContent = `Pick-up ${r.value}`)));
render();

/* ---------- oven state shared by the scroll story and the reduced-motion view ---------- */
const ovenSticky = $(".oven-sticky");
const deg = $(".deg");
const time = $(".time");
const phase = $(".phase");
const phases = ["The dough is proving.", "Into the oven at 220°C.", "Golden. Nearly there.", "Door's open. Come and get it."];
const trayImgs = $$(".tray img");

if (reduce) {
  ovenSticky.style.setProperty("--heat", "1");
  deg.textContent = "220";
  time.textContent = "06:00";
  phase.textContent = phases[3];
} else {
  /* ---------- hero: words rise like dough, pastries pop onto the plate ---------- */
  const words = splitWords($(".hero-title"));
  const rise = spring(150, 9);
  words.forEach((w, i) => w.animate([{ scale: "1.3 0.04", opacity: 0 }, { scale: "1 1", opacity: 1 }], { ...rise, delay: 250 + i * 90, fill: "backwards" }));
  animate($$(".eyebrow, .hero-sub, .hero-actions").slice(0, 3), { opacity: [0, 1], y: [20, 0] }, { duration: 0.9, delay: stagger(0.15, { startDelay: 0.6 }), ease });
  const pop = spring(210, 12);
  const pieces = $$(".cluster .p");
  pieces.forEach((el, i) => el.animate([{ scale: "0", rotate: "-40deg" }, { scale: "1", rotate: "0deg" }], { ...pop, delay: 500 + i * 110, fill: "backwards" }));
  $(".stamp").animate([{ scale: "0" }, { scale: "1" }], { ...pop, delay: 1250, fill: "backwards" });
  $(".cluster").animate([{ scale: "0.6", opacity: 0 }, { scale: "1", opacity: 1 }], { ...spring(120, 14), delay: 300, fill: "backwards" });

  // pointer pulls the pastries around (each at its own depth); scrolling throws them outwards
  const depth = [0.5, 1.4, 1.1, 1.6, 0.9, 1.8];
  let mx = 0;
  let my = 0;
  let heroP = 0;
  const place = () => {
    pieces.forEach((el, i) => {
      const cx = el.offsetLeft + el.offsetWidth / 2 - el.parentElement.offsetWidth / 2;
      const cy = el.offsetTop + el.offsetHeight / 2 - el.parentElement.offsetHeight / 2;
      const t = out3(heroP);
      el.style.transform = `translate(${mx * 30 * depth[i] + cx * t * 0.9}px, ${my * 30 * depth[i] + cy * t * 0.9 - t * 80}px) rotate(${t * (i % 2 ? 90 : -90)}deg) scale(${1 + t * 0.25})`;
    });
  };
  $(".hero").addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
    requestAnimationFrame(place);
  });
  scroll(
    (p) => {
      heroP = p;
      place();
    },
    { target: $(".hero"), offset: ["start start", "end start"] }
  );

  /* ---------- oven: heat up, dough rises and browns, door drops open ---------- */
  const door = $(".door");
  const tray = $(".tray");
  const steam = $(".oven .steam");
  let shownPhase = 0;
  scroll(
    (p) => {
      const heat = range(p, 0.1, 0.42);
      ovenSticky.style.setProperty("--heat", heat.toFixed(3));
      deg.textContent = String(Math.round(220 * out3(heat) - 40 * range(p, 0.62, 0.9)));
      const mins = Math.round(lerp(270, 360, range(p, 0, 0.72)));
      time.textContent = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
      const bake = range(p, 0.2, 0.56);
      trayImgs.forEach((img, i) => {
        const up = out3(range(p, 0.04 + i * 0.04, 0.46 + i * 0.04));
        img.style.transform = `scale(${0.8 + up * 0.2}, ${0.58 + up * 0.42})`;
        img.style.filter = `drop-shadow(0 8px 8px rgb(0 0 0 / 0.4)) saturate(${0.2 + bake * 0.8}) brightness(${1.45 - bake * 0.45})`;
      });
      const open = out3(range(p, 0.5, 0.78));
      door.style.transform = `rotateX(${-open * 92}deg)`;
      const slide = out3(range(p, 0.66, 0.9));
      tray.style.transform = `translateZ(${slide * 110}px) translateY(${slide * 8}%)`;
      steam.style.opacity = String(slide);
      const ph = p < 0.1 ? 0 : p < 0.45 ? 1 : p < 0.6 ? 2 : 3;
      if (ph !== shownPhase) {
        shownPhase = ph;
        phase.textContent = phases[ph];
        animate(phase, { opacity: [0, 1], y: [12, 0] }, { duration: 0.5, ease });
      }
    },
    { target: $(".oven-sec"), offset: ["start start", "end end"] }
  );

  /* ---------- today's tray: titles rise, cards deal onto the table ---------- */
  $$(".title").forEach((t) => {
    const ws = splitWords(t);
    ws.forEach((w) => (w.style.opacity = "0"));
    const stop = inView(t, () => {
      ws.forEach((w, i) => w.animate([{ scale: "1.3 0.04", opacity: 0 }, { scale: "1 1", opacity: 1 }], { ...rise, delay: i * 90, fill: "backwards" }));
      ws.forEach((w) => (w.style.opacity = ""));
      stop();
    }, { amount: 0.6 });
  });
  cards.forEach(({ card }, i) => {
    card.style.opacity = "0";
    const stop = inView(card, () => {
      card.style.opacity = "";
      card.animate([{ transform: "translateY(60px) rotateX(35deg) rotateZ(-3deg)", opacity: 0 }, { transform: "none", opacity: 1 }], { ...spring(140, 15), delay: (i % 4) * 90, fill: "backwards" });
      stop();
    }, { amount: 0.25 });
    // a gentle tilt toward the pointer
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });

  // the ticket slides out of its slot when the order section arrives
  const tk = $(".ticket");
  tk.style.clipPath = "inset(0 0 100% 0)";
  const stopTicket = inView(".printer", () => {
    tk.animate([{ clipPath: "inset(0 0 100% 0)", transform: "translateY(-40%)" }, { clipPath: "inset(0 0 0 0)", transform: "none" }], { duration: 1100, easing: "steps(18, end)", fill: "forwards" });
    tk.style.clipPath = "";
    stopTicket();
  }, { amount: 0.4 });
}
