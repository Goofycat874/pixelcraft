import { animate } from "motion";
import "./demo.css";

export const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const ease = [0.16, 1, 0.3, 1];

// Honest label on every demo, and the way back to the real site.
export function mountBadge({ dark = false, bottom = 16 } = {}) {
  const a = document.createElement("a");
  a.href = "/#screens";
  a.className = `cg-badge${dark ? " cg-dark" : ""}`;
  a.style.setProperty("--cg-badge-bottom", `${bottom}px`);
  const img = document.createElement("img");
  img.src = "/favicon.png";
  img.alt = "";
  const span = document.createElement("span");
  span.append("Concept by ");
  const b = document.createElement("b");
  b.textContent = "Creatograph";
  span.append(b);
  a.append(img, span);
  document.body.append(a);
}

// Every [data-cta] button in a demo opens this instead of a fake booking flow.
export function mountCta(business) {
  const dlg = document.createElement("dialog");
  dlg.className = "cg-modal";
  dlg.setAttribute("aria-labelledby", "cg-title");

  const k = document.createElement("p");
  k.className = "cg-k";
  k.textContent = "Concept site";
  const h = document.createElement("h2");
  h.id = "cg-title";
  h.textContent = `This ${business} is made up. The website is real.`;
  const p = document.createElement("p");
  p.textContent = "Creatograph designed and built this page to show what we can do. Want one like it for your business?";
  const actions = document.createElement("div");
  actions.className = "cg-actions";
  const go = document.createElement("a");
  go.className = "cg-primary";
  go.href = "/#book";
  go.textContent = "Get a quote";
  const stay = document.createElement("button");
  stay.type = "button";
  stay.className = "cg-ghost";
  stay.textContent = "Keep exploring";
  actions.append(go, stay);
  dlg.append(k, h, p, actions);
  document.body.append(dlg);

  stay.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  document.querySelectorAll("[data-cta]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      dlg.showModal();
      if (!reduce) animate(dlg, { opacity: [0, 1], transform: ["translateY(24px) scale(0.96)", "none"] }, { duration: 0.5, ease });
    })
  );
}

// Splits an element's text into word spans (for staggered reveals), keeping a readable label.
export function splitWords(el, wrapClass = "w") {
  const text = el.textContent;
  el.setAttribute("aria-label", text.replace(/\s+/g, " ").trim());
  const parts = [];
  el.childNodes.forEach((node) => parts.push(node));
  el.textContent = "";
  for (const node of parts) {
    if (node.nodeType === Node.TEXT_NODE) {
      for (const word of node.textContent.split(/(\s+)/)) {
        if (!word) continue;
        if (/^\s+$/.test(word)) {
          el.append(" ");
          continue;
        }
        const outer = document.createElement("span");
        outer.className = wrapClass;
        outer.setAttribute("aria-hidden", "true");
        const inner = document.createElement("span");
        inner.textContent = word;
        outer.append(inner);
        el.append(outer);
      }
    } else if (node.nodeName === "BR") {
      el.append(node);
    } else {
      // inline elements like <em> are split too: each word gets its own copy of the element
      node.textContent.split(/\s+/).filter(Boolean).forEach((word, i) => {
        if (i > 0) el.append(" ");
        const outer = document.createElement("span");
        outer.className = wrapClass;
        outer.setAttribute("aria-hidden", "true");
        const copy = node.cloneNode(false);
        copy.textContent = word;
        outer.append(copy);
        el.append(outer);
      });
    }
  }
  return [...el.querySelectorAll(`.${wrapClass} > *`)];
}

// Maps a 0..1 progress to a sub-range, clamped.
export const range = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
