import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { work } from "../data/site.js";
import { SectionTitle } from "./ui.jsx";

// Coverflow: each card turns in 3D based on how far it sits from the screen centre.
function Card3D({ w, x }) {
  const ref = useRef(null);
  const center = (v) => {
    const el = ref.current;
    if (!el) return 0;
    const mid = el.offsetLeft + el.offsetWidth / 2 + v;
    return (mid - window.innerWidth / 2) / (window.innerWidth / 2); // -1 left .. 1 right
  };
  const rotateY = useTransform(x, (v) => Math.max(-1, Math.min(1, center(v))) * -38);
  const z = useTransform(x, (v) => -Math.min(1.2, Math.abs(center(v))) * 180);
  const opacity = useTransform(x, (v) => 1 - Math.min(1, Math.abs(center(v))) * 0.35);
  return (
    <motion.div ref={ref} style={{ rotateY, z, opacity, transformStyle: "preserve-3d" }} className="shrink-0">
      <Card w={w} />
    </motion.div>
  );
}

function Card({ w }) {
  return (
    <figure className="group w-[78vw] shrink-0 snap-center sm:w-[46vw] md:w-[30vw] lg:w-[26vw]">
      <div className="glass overflow-hidden rounded-2xl p-2">
        <div className="overflow-hidden rounded-xl">
          <img
            src={w.image}
            alt={w.title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          />
        </div>
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4 px-2">
        <span className="font-display text-xl font-semibold tracking-tight">{w.title}</span>
        <span className="shrink-0 text-sm text-muted">{w.tag}</span>
      </figcaption>
    </figure>
  );
}

// Vertical scroll pans the gallery sideways on desktop; plain swipe row on mobile.
export default function Work() {
  if (!work.length) return null;
  return <WorkGallery />;
}

function WorkGallery() {
  const section = useRef(null);
  const track = useRef(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      setDesktop(window.matchMedia("(min-width: 768px)").matches && !reduce);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduce, desktop]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"]);

  const title = (
    <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-6 px-4 sm:px-6">
      <SectionTitle>
        Websites we have <em className="text-accent-text">shipped</em>
      </SectionTitle>
      {desktop && (
        <div className="mb-3 hidden h-[3px] w-48 overflow-hidden rounded-lg bg-ink/10 md:block">
          <motion.div style={{ width: bar }} className="h-full rounded-lg bg-accent" />
        </div>
      )}
    </div>
  );

  if (!desktop) {
    return (
      <section id="work" className="relative py-20">
        {title}
        <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
          {work.map((w) => (
            <Card key={w.title} w={w} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="work" ref={section} className="relative" style={{ height: `calc(100dvh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        {title}
        <div className="[perspective:1600px]">
          <motion.div
            ref={track}
            style={{ x, transformStyle: "preserve-3d" }}
            className="flex w-max gap-6 px-[37vw] lg:gap-8"
          >
            {work.map((w) => (
              <Card3D key={w.title} w={w} x={x} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
