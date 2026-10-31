import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

// What we promise, not what we sell (the services list covers that).
const words = ["Written quote first", "You own it all", "No templates", "No lock-in", "Humans on WhatsApp", "Phones first", "Price agreed upfront"];
const faces = [...words, ...words];
const STEP = 360 / faces.length;
const FACE_W = 320;
const RADIUS = Math.round(FACE_W / 2 / Math.tan(Math.PI / faces.length)) + 24;

function Face({ word, i, rot }) {
  // faces turning away from the viewer fade out
  const opacity = useTransform(rot, (r) => 0.18 + 0.82 * Math.max(0, Math.cos(((r + i * STEP) * Math.PI) / 180)));
  const accent = i % 3 === 1;
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -ml-[160px] -mt-[40px] flex h-[80px] w-[320px] items-center justify-center gap-3 rounded-2xl border px-6 [backface-visibility:hidden]"
      style={{
        opacity,
        transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)`,
        background: accent ? "var(--color-accent)" : "rgb(255 255 255 / 0.85)",
        borderColor: accent ? "var(--color-accent-deep)" : "rgb(255 255 255 / 0.95)",
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.5), 0 22px 40px -24px rgb(30 50 120 / 0.45)",
        color: accent ? "#fff" : "var(--color-ink)",
      }}
    >
      <span className="whitespace-nowrap font-display text-[28px] font-semibold tracking-[-0.03em]">{word}</span>
    </motion.div>
  );
}

// A 3D cylinder of services that spins on its own and speeds up / reverses with scroll.
export default function Ring() {
  const reduce = useReducedMotion();
  const rot = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-1000, 0, 1000], [-5, 0, 5], { clamp: false });
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < -0.05) dir.current = -1;
    else if (f > 0.05) dir.current = 1;
    rot.set(rot.get() - dir.current * (delta / 1000) * (9 + 9 * Math.abs(f)));
  });

  if (reduce) {
    return (
      <section aria-label="What we promise" className="relative z-10 mx-auto flex max-w-5xl flex-wrap justify-center gap-3 px-4 py-12">
        {words.map((w) => (
          <span key={w} className="glass rounded-xl px-5 py-2.5 font-display text-xl font-semibold">
            {w}
          </span>
        ))}
      </section>
    );
  }

  return (
    <section id="ring" aria-label="What we promise" className="relative z-10 overflow-hidden py-6 md:py-10">
      <ul className="sr-only">
        {words.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="relative mx-auto h-[200px] scale-[0.6] sm:h-[240px] sm:scale-80 md:h-[300px] md:scale-100 [perspective:1600px]">
        {/* the cylinder is pushed back by its radius so the front face sits at screen depth */}
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ z: -RADIUS, rotateX: -10, rotateY: rot }}
        >
          {faces.map((w, i) => (
            <Face key={i} word={w} i={i} rot={rot} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
