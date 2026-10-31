import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Button, Logo, Magnetic } from "./ui.jsx";
import { work } from "../data/site.js";

const links = [
  { href: "#services", label: "Services" },
  { href: "#screens", label: "Demos" },
  ...(work.length ? [{ href: "#work", label: "Work" }] : []),
  { href: "#pricing", label: "Pricing" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
    setScrolled(y > 24);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav
        className={`glass mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl pl-4 pr-2 transition-all duration-500 ${
          // once content scrolls under it, the bar goes almost solid so text behind never shows through
          scrolled ? "!bg-white/95" : ""
        }`}
      >
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative rounded-xl px-4 py-2 text-[15px] font-medium text-muted transition-colors hover:bg-white/70 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          {/* the menu already has "Get a quote" on phones, so the header keeps room for the name */}
          <div className="hidden sm:block">
            <Magnetic>
              <Button href="#book" className="!py-2.5 !px-5">
                Get a quote
              </Button>
            </Magnetic>
          </div>
          <button
            className="glass grid h-12 w-12 place-items-center rounded-xl lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="glass glass-strong mx-auto mt-3 max-w-7xl rounded-2xl p-3 lg:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {[...links, { href: "#book", label: "Get a quote" }].map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3.5 font-display text-2xl font-semibold tracking-tight hover:bg-white/70"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
