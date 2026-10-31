import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { brand } from "../data/site.js";

const ease = [0.16, 1, 0.3, 1];

// Pulls toward the pointer on hover; springs back on leave.
export function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const move = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x: sx, y: sy }} className={`inline-flex ${className}`}>
      {children}
    </motion.div>
  );
}

export function Button({ as: Tag = "a", variant = "primary", className = "", children, ...props }) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3.5 text-[15px] font-semibold transition-transform duration-300 active:scale-[0.97] cursor-pointer select-none";
  const styles = {
    primary: "glass-accent",
    glass: "glass text-ink hover:bg-white/80",
  };
  return (
    <Tag className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

// Folds content up into place in 3D once it scrolls into view.
export function Reveal({ children, delay = 0, y = 40, tilt = 22, className = "", as = "div" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      style={{ transformPerspective: 1100, transformOrigin: "50% 0%" }}
      initial={reduce ? false : { opacity: 0, y, rotateX: tilt, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay, ease }}
    >
      {children}
    </M>
  );
}

// Headline whose words flip up in 3D one after another, like cards standing up.
// Words listed in `accent` are set in logo blue.
export function SplitWords({ text, className = "", delay = 0, accent = [], inView = true }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const anim = inView
    ? { whileInView: { y: "0%", rotateX: 0, opacity: 1 }, viewport: { once: true, amount: 0.6 } }
    : { animate: { y: "0%", rotateX: 0, opacity: 1 } };
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block pb-[0.12em] -mb-[0.12em] align-bottom [perspective:900px]">
          <motion.span
            className={`inline-block ${accent.includes(w) ? "text-accent" : ""}`}
            style={{ transformOrigin: "50% 100%" }}
            initial={reduce ? false : { y: "40%", rotateX: -95, opacity: 0 }}
            {...anim}
            transition={{ duration: 1.2, delay: delay + i * 0.08, ease }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export function Logo({ className = "" }) {
  return (
    <a href="#top" className={`flex items-center gap-2.5 ${className}`} aria-label={`${brand.name} home`}>
      <img src={brand.logo} alt="" width="40" height="40" className="h-10 w-10 object-contain" />
      <span className="font-display text-[19px] font-semibold tracking-tight">{brand.name}</span>
    </a>
  );
}

export function SectionTitle({ children, className = "" }) {
  return (
    <h2 className={`font-display text-4xl md:text-6xl font-semibold tracking-[-0.035em] leading-[1.02] ${className}`}>
      {children}
    </h2>
  );
}

// Writes pointer coords into CSS vars for the .spotlight border.
export const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

// Card that tilts toward the pointer in 3D with a moving glossy highlight.
export function Tilt({ children, className = "", max = 10, glare = true, ...props }) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.45), transparent 55%)`;

  const move = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={`group/tilt relative ${className}`}
      {...props}
    >
      {children}
      {glare && !reduce && (
        <motion.span
          aria-hidden="true"
          style={{ background: bg }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover/tilt:opacity-100"
        />
      )}
    </motion.div>
  );
}
