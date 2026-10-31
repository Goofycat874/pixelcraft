import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { process } from "../data/site.js";
import { Reveal, SectionTitle } from "./ui.jsx";

const ease = [0.16, 1, 0.3, 1];

// One step on the line: its dot fills as the line reaches it, then the card rises into place.
function Step({ step, i, total, line, reduce }) {
  const at = i / (total - 1);
  const fill = useTransform(line, [Math.max(0, at - 0.02), at + 0.02], [0, 1]);
  const last = i === total - 1;
  return (
    <li className="relative pl-12 md:pl-0 md:pt-14">
      <span aria-hidden="true" className="absolute left-[9px] top-1 grid h-6 w-6 place-items-center rounded-full border-2 border-accent bg-white md:left-0 md:top-0">
        <motion.span className="h-3 w-3 rounded-full bg-accent" style={{ scale: reduce ? 1 : fill }} />
      </span>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40, rotateX: 30 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, delay: i * 0.08, ease }}
        style={{ transformPerspective: 1000, transformOrigin: "50% 0%" }}
        className={`rounded-2xl p-6 md:p-7 ${last ? "glass-accent" : "glass"}`}
      >
        <h3 className="font-display text-4xl font-bold tracking-[-0.04em] md:text-5xl">{step.title}</h3>
        <p className={`mt-4 leading-relaxed ${last ? "text-white" : "text-muted"}`}>{step.text}</p>
        <p className="mt-5 text-sm font-semibold">You get: {step.get.join(", ").toLowerCase()}</p>
      </motion.div>
    </li>
  );
}

// Four steps on a line that draws itself as you scroll (across on desktop, down on phones).
export default function Process() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <section id="process" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="max-w-3xl">
        <SectionTitle>What happens after you message us</SectionTitle>
      </Reveal>
      <div ref={ref} className="relative mt-14">
        {/* the track and the drawn line */}
        <span aria-hidden="true" className="absolute bottom-0 left-[20px] top-1 w-0.5 bg-line md:left-3 md:right-0 md:top-[11px] md:h-0.5 md:w-auto" />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-[20px] top-1 hidden w-0.5 origin-top bg-accent md:left-3 md:right-0 md:top-[11px] md:block md:h-0.5 md:w-auto md:origin-left"
          style={{ scaleX: reduce ? 1 : line }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-[20px] top-1 w-0.5 origin-top bg-accent md:hidden"
          style={{ scaleY: reduce ? 1 : line }}
        />
        <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-5">
          {process.map((s, i) => (
            <Step key={s.title} step={s} i={i} total={process.length} line={reduce ? scrollYProgress : line} reduce={reduce} />
          ))}
        </ol>
      </div>
    </section>
  );
}
