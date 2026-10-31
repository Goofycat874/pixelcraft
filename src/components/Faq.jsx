import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "@phosphor-icons/react";
import { faqs } from "../data/site.js";
import { Reveal, SectionTitle } from "./ui.jsx";

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-24 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:py-32">
      <Reveal>
        <SectionTitle className="md:sticky md:top-32">
          Before you message us
        </SectionTitle>
      </Reveal>
      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className={`glass overflow-hidden rounded-2xl transition-colors duration-500 ${isOpen ? "glass-strong" : ""}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left md:px-8 md:py-6"
                >
                  <span className="font-display text-xl font-semibold tracking-tight md:text-2xl">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`grid h-10 w-10 shrink-0 place-items-center ${isOpen ? "text-accent-text" : "text-ink"}`}
                  >
                    <Plus size={18} weight="bold" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="max-w-[60ch] px-6 pb-6 text-lg leading-relaxed text-muted md:px-8 md:pb-8">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
