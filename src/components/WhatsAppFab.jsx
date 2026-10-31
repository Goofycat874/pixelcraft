import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { brand } from "../data/site.js";

export default function WhatsAppFab() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 600));

  return (
    <motion.a
      href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hi ${brand.name}! I have a question.`)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={false}
      animate={{ scale: show ? 1 : 0, opacity: show ? 1 : 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fixed bottom-5 right-5 z-40 grid h-16 w-16 place-items-center rounded-2xl bg-wa text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.4),0_18px_40px_-12px_rgb(14_125_64/0.7)]"
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <span className="absolute inset-0 animate-ping rounded-2xl bg-wa/40 [animation-duration:2.4s]" aria-hidden="true" />
      <WhatsappLogo size={30} weight="fill" className="relative" />
    </motion.a>
  );
}
