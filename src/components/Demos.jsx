import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { devices } from "../data/site.js";
import { Reveal, SectionTitle } from "./ui.jsx";

const ease = [0.16, 1, 0.3, 1];

const frames = [
  { d: devices.desktop, ratio: [16, 10], kind: "browser", turn: 26, cls: "col-span-2 md:col-span-1" },
  { d: devices.tablet, ratio: [3, 4], kind: "tablet", turn: -8, cls: "" },
  { d: devices.phone, ratio: [9, 19], kind: "phone", turn: -26, cls: "" },
];

// A whole-page capture that scrolls up and down inside its frame, like someone browsing it.
function Screen({ d, ratio }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [w, h] = d.fullSize;
  const shown = ratio[1] / ratio[0] / (h / w); // share of the page the frame shows at once
  return (
    <div ref={ref} className="relative overflow-hidden" style={{ aspectRatio: `${ratio[0]} / ${ratio[1]}` }}>
      <img
        src={d.full}
        alt=""
        loading="lazy"
        width={w}
        height={h}
        className={`page-scroll block w-full ${inView ? "" : "paused"}`}
        style={{ "--travel": `${-(1 - shown) * 100}%`, "--dur": `${Math.round(6 + (h / w) * 3)}s` }}
      />
    </div>
  );
}

function Frame({ f }) {
  if (f.kind === "browser") {
    return (
      <span className="glass glass-strong block rounded-2xl px-2 pb-2">
        <span aria-hidden="true" className="flex h-8 items-center gap-1.5 px-2.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#ffc23e]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#2bc74f]" />
        </span>
        <span className="block overflow-hidden rounded-xl">
          <Screen d={f.d} ratio={f.ratio} />
        </span>
      </span>
    );
  }
  const phone = f.kind === "phone";
  return (
    <span className={`block bg-night ${phone ? "rounded-[30px] p-[6%]" : "rounded-[26px] p-[4%]"}`}>
      <span className={`block overflow-hidden ${phone ? "rounded-[22px]" : "rounded-[16px]"}`}>
        <Screen d={f.d} ratio={f.ratio} />
      </span>
    </span>
  );
}

export default function Demos() {
  const reduce = useReducedMotion();
  return (
    <section id="screens" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="max-w-3xl">
        <SectionTitle>
          Three demo sites. <span className="text-accent">Open one and scroll.</span>
        </SectionTitle>
        <p className="mt-5 max-w-[52ch] text-lg text-muted">
          A car showroom, a café and a bakery. The brands are made up; the websites are real, built the way we would build yours.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-[1.45fr_1fr] items-end gap-x-5 gap-y-12 [perspective:1600px] md:grid-cols-[2fr_1fr_0.62fr] md:gap-x-8">
        {frames.map((f, i) => (
          <motion.a
            key={f.d.href}
            href={f.d.href}
            className={`group block ${f.cls}`}
            style={{ transformStyle: "preserve-3d" }}
            initial={reduce ? false : { opacity: 0, rotateY: f.turn, z: -160, y: 50 }}
            whileInView={{ opacity: 1, rotateY: 0, z: 0, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.2, delay: i * 0.12, ease }}
          >
            <span className="block shadow-[0_50px_90px_-45px_rgb(30_50_120/0.55)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
              <Frame f={f} />
            </span>
            <span className="mt-5 block">
              <span className="block font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">{f.d.name}</span>
              <span className="block text-sm text-muted">{f.d.kind} concept</span>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent-text">
                Open live demo
                <ArrowUpRight weight="bold" aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
