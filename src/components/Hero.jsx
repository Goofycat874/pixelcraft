import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { devices } from "../data/site.js";
import { Button, Magnetic, SplitWords } from "./ui.jsx";

const ease = [0.16, 1, 0.3, 1];
const INTRO = 1.5; // seconds, so the hero starts as the preloader wipes away

// The three concept sites, placed as a loose stack of windows (positions are % of the stage).
const windows = [
  { d: devices.desktop, kind: "browser", style: { left: "4%", top: "4%", width: "92%" }, z: -90, spread: -140 },
  { d: devices.tablet, kind: "browser", style: { left: "61%", top: "33%", width: "38%" }, z: 60, spread: 120 },
  { d: devices.phone, kind: "phone", style: { left: "2%", top: "47%", width: "24%" }, z: 150, spread: 260 },
];

function Window({ w, i, progress, reduce, narrow }) {
  // on phones the windows sit closer together in depth so perspective doesn't push them off screen
  const depth = narrow ? 0.4 : 1;
  const z = useTransform(progress, [0, 1], [w.z * depth, (w.z + w.spread) * depth]);
  const y = useTransform(progress, [0, 1], ["0%", `${(i - 1) * -14}%`]);
  const phone = w.kind === "phone";
  return (
    <motion.div className="absolute [transform-style:preserve-3d]" style={{ ...w.style, ...(narrow && w.kind === "phone" ? { left: "5%" } : {}), z: reduce ? w.z * depth : z, y: reduce ? 0 : y }}>
      <motion.a
        href={w.d.href}
        className={`group relative block [transform-style:preserve-3d] ${phone ? "rounded-[28px] bg-night p-[6%]" : "rounded-2xl bg-[#f7f9ff] px-2 pb-2 ring-1 ring-white"}`}
        style={{ boxShadow: "0 50px 90px -40px rgb(30 50 120 / 0.55)" }}
        initial={reduce ? false : { opacity: 0, z: -500, y: 80, rotateY: 24 }}
        animate={{ opacity: 1, z: 0, y: 0, rotateY: 0 }}
        whileHover={reduce ? undefined : { z: 40 }}
        transition={{ duration: 1.3, delay: reduce ? 0 : INTRO + 0.15 + i * 0.14, ease }}
      >
        {!phone && (
          <span aria-hidden="true" className="flex h-7 items-center gap-1.5 px-2.5">
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#ffc23e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#2bc74f]" />
          </span>
        )}
        <span className={`block overflow-hidden ${phone ? "rounded-[22px]" : "rounded-xl"}`}>
          <img
            src={w.d.src}
            alt={`${w.d.name}, a concept ${w.d.kind.toLowerCase()} website. Open the live demo.`}
            className="block w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[7%] left-1/2 inline-flex -translate-x-1/2 translate-y-2 items-center gap-1 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-[13px] font-semibold text-night opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          Open live demo <ArrowUpRight weight="bold" />
        </span>
      </motion.a>
    </motion.div>
  );
}

// The demo sites as a 3D stack of windows: they fly in, lean toward the pointer, and drift apart
// in depth as the hero scrolls away.
function Fan({ progress, mx, my, reduce }) {
  // phones get a gentler angle so the stack stays inside the screen
  const [narrow] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const baseY = narrow ? -7 : -16;
  const baseX = narrow ? 4 : 7;
  const rotateY = useTransform([mx, progress], ([x, p]) => baseY + x * 10 - p * (narrow ? 6 : 14));
  const rotateX = useTransform([my, progress], ([y, p]) => baseX - y * 8 + p * 10);
  return (
    <div className="relative mx-auto aspect-[680/600] w-[90%] max-w-[680px] [perspective:1800px] md:w-full">
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={reduce ? { rotateY: baseY, rotateX: baseX } : { rotateY, rotateX }}
      >
        {windows.map((w, i) => (
          <Window key={w.d.href} w={w} i={i} progress={progress} reduce={reduce} narrow={narrow} />
        ))}
      </motion.div>
    </div>
  );
}

const facts = [
  { big: "₹5,000", small: "is where websites start" },
  { big: "Free", small: "written quote before you pay" },
  { big: "Yours", small: "code, domain and content" },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const copyY = useTransform(progress, [0, 1], ["0%", "-18%"]);
  const copyOpacity = useTransform(progress, [0, 0.7], [1, 0]);

  // pointer position over the hero, -0.5..0.5, smoothed
  const mx = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section id="top" ref={ref} onPointerMove={onMove} className="relative overflow-x-clip">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-10 pt-32 sm:px-6 md:min-h-[calc(100dvh-6rem)] md:grid-cols-[1fr_1.08fr] md:gap-6 md:pb-6 md:pt-28">
        <motion.div style={reduce ? undefined : { y: copyY, opacity: copyOpacity }} className="relative z-10">
          <h1 className="font-display text-[clamp(2.8rem,5.4vw,5rem)] font-bold leading-[0.98] tracking-[-0.045em]">
            <SplitWords text="Websites that don't look like everyone else's." accent={["everyone", "else's."]} delay={INTRO} inView={false} />
          </h1>
          <motion.p
            className="mt-7 max-w-[34ch] text-lg leading-relaxed text-muted md:text-xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: INTRO + 0.45, ease }}
          >
            Design and code for small businesses. Message us on WhatsApp, get a written quote, own everything we build.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: INTRO + 0.6, ease }}
          >
            <Magnetic>
              <Button href="#book" className="!px-7 !py-4 text-base">
                Get a quote
                <ArrowRight size={18} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="#pricing" variant="glass" className="!px-7 !py-4 text-base">
                See prices
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <Fan progress={reduce ? scrollYProgress : progress} mx={mx} my={my} reduce={reduce} />
      </div>

      <motion.ul
        className="glass mx-4 grid grid-cols-1 rounded-2xl sm:mx-6 md:mx-auto md:max-w-7xl md:grid-cols-3"
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: INTRO + 0.8, ease }}
      >
        {facts.map((f, i) => (
          <li
            key={f.big}
            className={`flex items-baseline gap-3 px-6 py-5 md:px-8 md:py-7 ${i ? "border-t border-line md:border-l md:border-t-0" : ""}`}
          >
            <span className="font-display text-2xl font-bold tracking-[-0.03em] md:text-3xl">{f.big}</span>
            <span className="text-muted">{f.small}</span>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
