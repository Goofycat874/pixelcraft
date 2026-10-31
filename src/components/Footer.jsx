import { motion, useReducedMotion } from "motion/react";
import { WhatsappLogo, InstagramLogo, ArrowUp } from "@phosphor-icons/react";
import { brand, legal, work } from "../data/site.js";
import { Logo } from "./ui.jsx";

const letters = brand.name.split("");

// Solid ink letters; "graph" picks up the one brand colour.
const colorAt = (i) => (i >= 6 ? "var(--color-accent)" : "var(--color-ink)");

// Each letter stands up in 3D, one after another, when the wordmark scrolls into view.
function Letter({ ch, i, n }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      style={{ transformOrigin: "50% 100%", color: colorAt(i) }}
      initial={reduce ? false : { rotateX: -100, y: "45%", opacity: 0 }}
      whileInView={{ rotateX: 0, y: "0%", opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block pb-[0.14em]"
    >
      {ch}
    </motion.span>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden px-4 pb-6 pt-10 sm:px-6">
      <div className="glass mx-auto max-w-7xl rounded-2xl p-8 md:p-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-muted">Websites for small businesses, quoted on WhatsApp.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-14 gap-y-3 text-[15px]">
            {[["Services", "services"], ["Demos", "screens"], ...(work.length ? [["Work", "work"]] : []), ["Pricing", "pricing"], ["Process", "process"], ["FAQ", "faq"]].map(([l, id]) => (
              <a key={l} href={`#${id}`} className="text-muted transition-colors hover:text-ink">
                {l}
              </a>
            ))}
            <a href="#book" className="text-muted transition-colors hover:text-ink">
              Get a quote
            </a>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="glass grid h-12 w-12 place-items-center rounded-xl text-wa-text transition-transform hover:-translate-y-1"
            >
              <WhatsappLogo size={22} weight="fill" />
            </a>
            {brand.instagram && (
              <a
                href={brand.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="glass grid h-12 w-12 place-items-center rounded-xl transition-transform hover:-translate-y-1"
              >
                <InstagramLogo size={22} />
              </a>
            )}
            <a
              href="#top"
              aria-label="Back to top"
              className="glass-accent grid h-12 w-12 place-items-center rounded-xl transition-transform hover:-translate-y-1"
            >
              <ArrowUp size={20} weight="bold" />
            </a>
          </div>
        </div>

        <div className="mt-14 [perspective:900px]" aria-hidden="true">
          <p className="flex select-none justify-center font-display text-[12.5vw] font-bold leading-[0.95] tracking-[-0.05em] md:text-[13.5vw] xl:text-[12.4rem]">
            {letters.map((ch, i) => (
              <Letter key={i} ch={ch} i={i} n={letters.length} />
            ))}
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {legal.businessName}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1">
            <a href="/privacy.html" className="hover:text-ink">Privacy Policy</a>
            <a href="/terms.html" className="hover:text-ink">Terms</a>
            <a href="/licenses.txt" className="hover:text-ink">Licenses</a>
            <a href={`tel:+${brand.phone}`} className="hover:text-ink">
              Call {brand.phoneDisplay}
            </a>
            <a href={`https://wa.me/${brand.whatsapp}`} className="hover:text-ink">
              WhatsApp {brand.whatsappDisplay}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
