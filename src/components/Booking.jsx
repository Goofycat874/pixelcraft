import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WhatsappLogo, CheckCircle, CaretDown, ArrowCounterClockwise } from "@phosphor-icons/react";
import { bookingOptions, brand, timelines } from "../data/site.js";
import { useBooking, whatsappLink } from "../booking.jsx";
import { Magnetic, Reveal, SectionTitle } from "./ui.jsx";

const ease = [0.16, 1, 0.3, 1];
const empty = { name: "", phone: "", business: "", service: "", plan: "", timeline: "", website: "", message: "" };
const OTHER = "Something else";

function Field({ id, label, error, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="e"
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-danger"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p className="text-sm text-muted">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const inputCls = (err) =>
  `w-full rounded-xl border bg-white/75 px-4 py-3.5 text-[16px] text-ink placeholder:text-[#6b7290] outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-accent/15 ${
    err ? "border-danger/80" : "border-line focus:border-accent"
  }`;

export function buildMessage(f) {
  const details = [
    ["Name", f.name.trim()],
    ["Phone", f.phone.trim()],
    ["Business", f.business.trim()],
    ["Project", f.service],
    ["Package", f.plan],
    ["Timeline", f.timeline],
    ["Current website", f.website.trim()],
    ["Details", f.message.trim()],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  return [`Hi ${brand.name}! I'd like to get a website made.`, "", ...details].join("\n");
}

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) e.phone = "Enter a valid phone number, like 98765 43210.";
  if (!f.service) e.service = "Pick what you want built.";
  return e;
}

export default function Booking() {
  const { pick } = useBooking();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);

  useEffect(() => {
    if (!pick) return;
    setSent(null);
    setForm((f) => ({ ...f, service: pick.service, plan: pick.plan }));
    setErrors((e) => ({ ...e, service: undefined }));
  }, [pick]);

  const plans = bookingOptions.find((o) => o.service === form.service)?.plans ?? [];

  const set = (k) => (ev) => {
    const v = ev.target.value;
    setForm((f) => ({ ...f, [k]: v, ...(k === "service" ? { plan: "" } : {}) }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`bk-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const url = whatsappLink(brand.whatsapp, buildMessage(form));
    window.open(url, "_blank", "noopener");
    setSent(url);
  };

  return (
    <section id="book" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <Reveal className="glass flex flex-col justify-between overflow-hidden rounded-2xl p-8 md:p-10">
          <div>
            <SectionTitle>Get a quote</SectionTitle>
            <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-muted">
              Fill in what you know. It opens WhatsApp with the message already written, so you only press send.
            </p>
            {/* the message builds itself as the form is filled in */}
            <figure className="mt-8 hidden rounded-2xl bg-[#efe9df] p-4 sm:block" aria-hidden="true">
              <figcaption className="mb-2 flex items-center gap-2 text-xs font-semibold text-wa-text">
                <WhatsappLogo size={16} weight="fill" />
                Your WhatsApp message
              </figcaption>
              <motion.p
                layout
                transition={{ duration: 0.3, ease }}
                className="ml-auto w-fit max-w-full whitespace-pre-line rounded-xl rounded-tr-sm bg-[#d9fdd3] px-4 py-3 text-[14px] leading-relaxed text-night shadow-[0_1px_1px_rgb(0_0_0/0.08)]"
              >
                {buildMessage(form)}
              </motion.p>
            </figure>
          </div>

          <dl className="mt-10 grid gap-6 border-t border-line pt-8 text-[15px]">
            <div>
              <dt className="font-medium">Prefer to just chat?</dt>
              <dd className="mt-1 text-muted">
                Message{" "}
                <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noreferrer" className="font-medium text-accent-text underline-offset-4 hover:underline">
                  {brand.whatsappDisplay}
                </a>{" "}
                directly, or call{" "}
                <a href={`tel:+${brand.phone}`} className="font-medium text-accent-text underline-offset-4 hover:underline">
                  {brand.phoneDisplay}
                </a>
                .
              </dd>
            </div>
            <div>
              <dt className="font-medium">What you get back</dt>
              <dd className="mt-1 text-muted">A few questions, then a written quote with the price, what is included and a rough launch date.</dd>
            </div>
            <div>
              <dt className="font-medium">No obligation</dt>
              <dd className="mt-1 text-muted">Nothing is booked and nothing is paid until you say yes to the quote.</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="glass glass-strong relative overflow-hidden rounded-2xl p-6 sm:p-8 md:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="done"
                style={{ transformPerspective: 1400 }}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.55, ease }}
                className="flex min-h-[520px] flex-col items-center justify-center text-center"
                role="status"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  className="grid h-24 w-24 place-items-center rounded-2xl bg-wa/10 text-wa-text"
                >
                  <CheckCircle size={56} weight="fill" />
                </motion.span>
                <h3 className="mt-7 font-display text-3xl font-semibold tracking-tight md:text-4xl">WhatsApp is opening</h3>
                <p className="mt-3 max-w-[38ch] text-muted">
                  Your project details are ready. Just press send in WhatsApp and we will get back to you with next steps.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a href={sent} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-wa px-6 py-3.5 font-semibold text-white transition active:scale-[0.97]">
                    <WhatsappLogo size={20} weight="fill" />
                    Open WhatsApp again
                  </a>
                  <button
                    onClick={() => {
                      setSent(null);
                      setForm(empty);
                    }}
                    className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold active:scale-[0.97]"
                  >
                    <ArrowCounterClockwise size={18} />
                    New booking
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={submit}
                style={{ transformPerspective: 1400 }}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                <Field id="bk-name" label="Your name" error={errors.name}>
                  <input
                    id="bk-name"
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "bk-name-error" : undefined}
                    className={inputCls(errors.name)}
                    placeholder="Aarav Sharma"
                  />
                </Field>
                <Field id="bk-phone" label="Phone number" error={errors.phone}>
                  <input
                    id="bk-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "bk-phone-error" : undefined}
                    className={inputCls(errors.phone)}
                    placeholder="98765 43210"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="bk-business" label="Business name" hint="Optional">
                    <input
                      id="bk-business"
                      autoComplete="organization"
                      value={form.business}
                      onChange={set("business")}
                      className={inputCls()}
                      placeholder="Sen's Bakery"
                    />
                  </Field>
                </div>
                <Field id="bk-service" label="What do you need?" error={errors.service}>
                  <div className="relative">
                    <select
                      id="bk-service"
                      value={form.service}
                      onChange={set("service")}
                      aria-invalid={!!errors.service}
                      aria-describedby={errors.service ? "bk-service-error" : undefined}
                      className={`${inputCls(errors.service)} appearance-none pr-11 ${form.service ? "" : "text-[#6b7290]"}`}
                    >
                      <option value="" disabled>
                        Choose a project type
                      </option>
                      {bookingOptions.map((o) => (
                        <option key={o.service}>{o.service}</option>
                      ))}
                      <option>{OTHER}</option>
                    </select>
                    <CaretDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </Field>
                <Field id="bk-plan" label="Package" hint={plans.length ? "Optional" : "Pick a project type first"}>
                  <div className="relative">
                    <select
                      id="bk-plan"
                      value={form.plan}
                      onChange={set("plan")}
                      disabled={!plans.length}
                      className={`${inputCls()} appearance-none pr-11 disabled:cursor-not-allowed disabled:opacity-60 ${form.plan ? "" : "text-[#6b7290]"}`}
                    >
                      <option value="">Not sure yet</option>
                      {plans.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    <CaretDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </Field>
                <Field id="bk-timeline" label="When do you need it?" hint="Optional">
                  <div className="relative">
                    <select
                      id="bk-timeline"
                      value={form.timeline}
                      onChange={set("timeline")}
                      className={`${inputCls()} appearance-none pr-11 ${form.timeline ? "" : "text-[#6b7290]"}`}
                    >
                      <option value="">Choose a timeline</option>
                      {timelines.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <CaretDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </Field>
                <Field id="bk-website" label="Current website" hint="Optional, if you have one">
                  <input
                    id="bk-website"
                    type="url"
                    inputMode="url"
                    value={form.website}
                    onChange={set("website")}
                    className={inputCls()}
                    placeholder="yourbusiness.com"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="bk-message" label="Tell us about your project" hint="Optional">
                    <textarea
                      id="bk-message"
                      rows={4}
                      value={form.message}
                      onChange={set("message")}
                      className={`${inputCls()} resize-none`}
                      placeholder="What does your business do, and what should the website help you with?"
                    />
                  </Field>
                </div>
                <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[36ch] text-sm leading-relaxed text-muted">
                    Opens WhatsApp with your details filled in. Nothing is stored on this website. See our{" "}
                    <a href="/privacy.html" className="underline underline-offset-2 hover:text-ink">Privacy Policy</a>.
                  </p>
                  <Magnetic>
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2.5 rounded-xl bg-wa px-7 py-4 text-base font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_16px_36px_-14px_rgb(14_125_64/0.7)] transition active:scale-[0.97]"
                    >
                      <WhatsappLogo size={22} weight="fill" className="transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:scale-110" />
                      Send on WhatsApp
                    </button>
                  </Magnetic>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
