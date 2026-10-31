import { ArrowRight } from "@phosphor-icons/react";
import { services } from "../data/site.js";
import { useBooking } from "../booking.jsx";
import { Reveal, SectionTitle } from "./ui.jsx";

function Row({ s, i }) {
  const { choose } = useBooking();
  return (
    <Reveal delay={i * 0.06} tilt={14}>
      <button
        onClick={() => choose(s.service, "")}
        className="group grid w-full grid-cols-1 gap-3 rounded-2xl border-t border-line py-7 text-left transition-colors duration-300 hover:border-transparent hover:bg-white/60 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_11rem] md:items-baseline md:gap-10 md:px-5 md:py-9"
      >
        <h3 className="font-display text-3xl font-bold tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-4xl">
          {s.title}
        </h3>
        <p className="max-w-[52ch] leading-relaxed text-muted">{s.blurb}</p>
        <span className="flex items-center justify-between gap-3 font-semibold md:justify-end">
          <span>{s.price}</span>
          <ArrowRight size={18} weight="bold" className="text-accent-text transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </button>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="mb-12 max-w-3xl">
        <SectionTitle>What we build</SectionTitle>
        <p className="mt-5 max-w-[52ch] text-lg text-muted">Pick one to start a quote. The price shown is where that kind of project starts.</p>
      </Reveal>
      <div className="border-b border-line">
        {services.map((s, i) => (
          <Row key={s.id} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}
