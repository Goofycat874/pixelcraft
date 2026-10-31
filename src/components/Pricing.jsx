import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ArrowRight } from "@phosphor-icons/react";
import { addons, packs, pricingNotes } from "../data/site.js";
import { inr, useBooking } from "../booking.jsx";
import { Reveal, SectionTitle } from "./ui.jsx";

const ease = [0.16, 1, 0.3, 1];

// Pick a pack on the left, see everything in it on the right. Five side-by-side cards
// would need tiny text; this keeps the full feature list readable.
export default function Pricing() {
  const [i, setI] = useState(1);
  const { choose } = useBooking();
  const reduce = useReducedMotion();
  const pack = packs[i];

  const onKey = (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) + packs.length) % packs.length;
    setI(next);
    document.getElementById(`pack-tab-${next}`)?.focus();
  };

  return (
    <section id="pricing" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="max-w-3xl">
        <SectionTitle>What it costs</SectionTitle>
        <p className="mt-5 max-w-[52ch] text-lg text-muted">Five website packs by number of pages and what is included, then add-ons. Prices are in rupees.</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
        <div role="tablist" aria-label="Website packs" aria-orientation="vertical" onKeyDown={onKey} className="glass self-start overflow-hidden rounded-2xl">
          {packs.map((p, n) => (
            <button
              key={p.name}
              role="tab"
              id={`pack-tab-${n}`}
              aria-selected={i === n}
              aria-controls="pack-panel"
              tabIndex={i === n ? 0 : -1}
              onClick={() => setI(n)}
              className={`relative flex w-full items-baseline justify-between gap-4 border-b border-line px-4 py-5 text-left transition-colors duration-300 last:border-b-0 lg:px-5 ${
                i === n ? "bg-white/75" : "hover:bg-white/45"
              }`}
            >
              {i === n && (
                <motion.span layoutId="pack-mark" className="absolute inset-y-0 left-0 w-1 bg-accent" transition={{ type: "spring", stiffness: 380, damping: 34 }} />
              )}
              <span>
                <span className="block font-display text-xl font-semibold tracking-tight">{p.name}</span>
                <span className="mt-0.5 block text-sm text-muted">
                  {p.pages}
                  {p.popular && <span className="ml-2 rounded-lg bg-brand-orange px-2 py-0.5 text-xs font-medium text-night">Most popular</span>}
                </span>
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight">{inr(p.price)}</span>
            </button>
          ))}
        </div>

        <div id="pack-panel" role="tabpanel" aria-labelledby={`pack-tab-${i}`} className="[perspective:1200px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pack.name}
              initial={reduce ? false : { opacity: 0, rotateX: -18, y: 16 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, rotateX: 12, y: -10 }}
              transition={{ duration: 0.45, ease }}
              style={{ transformOrigin: "50% 0%" }}
              className="glass glass-strong rounded-2xl p-7 md:p-10"
            >
              <p className="text-sm text-muted">{pack.tag}</p>
              <h3 className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{pack.name}</h3>
              <p className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-6xl font-semibold tracking-[-0.045em] md:text-7xl">{inr(pack.price)}</span>
                <span className="text-muted">{pack.pages}</span>
              </p>
              <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={16} weight="bold" className="mt-1 shrink-0 text-accent-text" />
                    <span className="text-ink/90">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => choose("Website pack", pack.name)}
                className="glass-accent group mt-9 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3.5 font-semibold transition-transform duration-300 active:scale-[0.97]"
              >
                Ask about {pack.name}
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      <Reveal className="mt-20">
        <h3 className="font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">Add-ons and marketing</h3>
        <dl className="mt-8 grid border-t border-line md:grid-cols-2 md:gap-x-12">
          {addons.map((a) => (
            <div key={a.name} className="flex items-baseline justify-between gap-6 border-b border-line py-5">
              <dt className="font-medium">
                {a.name}
                {a.note && <span className="mt-1 block text-sm font-normal text-muted">{a.note}</span>}
              </dt>
              <dd className="shrink-0 text-right font-display text-lg font-semibold tracking-tight">{a.price}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-8 max-w-[70ch] space-y-1.5 text-sm leading-relaxed text-muted">
          {pricingNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
          <li>
            Your final scope and price are confirmed in writing before any work starts. See our{" "}
            <a href="/terms.html" className="underline underline-offset-2 hover:text-ink">Terms</a>.
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
