import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand } from "../data/site.js";

const ease = [0.76, 0, 0.24, 1];
// two periods of a sine wave, drawn twice as wide as the box so it can slide sideways forever
const WAVE = "M0 20 Q 75 0 150 20 T 300 20 T 450 20 T 600 20 T 750 20 T 900 20 T 1050 20 T 1200 20 V 200 H 0 Z";

// Intro: the wordmark fills with liquid that rises and sloshes, then the screen wipes away.
export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(!reduce);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), 1650);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  const word = brand.name;
  const textProps = {
    x: "340",
    y: "96",
    textAnchor: "middle",
    style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 112, letterSpacing: "-0.05em" },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="sky fixed inset-0 z-[100] grid place-items-center"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="flex w-[min(86vw,640px)] flex-col items-center gap-6">
            <motion.img
              src={brand.logo}
              alt=""
              className="h-14 w-14"
              initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <svg viewBox="0 0 680 130" className="w-full" role="img" aria-label={brand.name}>
              <defs>
                <clipPath id="pl-text">
                  <text {...textProps}>{word}</text>
                </clipPath>
                <linearGradient id="pl-liquid" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#86a9ff" />
                  <stop offset="0.55" stopColor="#2c68fa" />
                  <stop offset="1" stopColor="#1f36c4" />
                </linearGradient>
              </defs>
              {/* empty outline of the word */}
              <text {...textProps} fill="none" stroke="rgb(15 22 56 / 0.16)" strokeWidth="1.5">
                {word}
              </text>
              <g clipPath="url(#pl-text)">
                <motion.g initial={{ y: 128 }} animate={{ y: -6 }} transition={{ duration: 1.35, ease: [0.45, 0, 0.2, 1] }}>
                  <g className="pl-wave">
                    <path d={WAVE} fill="url(#pl-liquid)" />
                  </g>
                </motion.g>
              </g>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
