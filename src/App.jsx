import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { BookingProvider } from "./booking.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { brand } from "./data/site.js";
import Background from "./components/Background.jsx";
import Preloader from "./components/Preloader.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Ring from "./components/Ring.jsx";
import Demos from "./components/Demos.jsx";
import Services from "./components/Services.jsx";
import Work from "./components/Work.jsx";
import Pricing from "./components/Pricing.jsx";
import Process from "./components/Process.jsx";
import Booking from "./components/Booking.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFab from "./components/WhatsAppFab.jsx";

export default function App() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -80 } });
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [reduce]);

  return (
    <BookingProvider>
      <Preloader />
      <Background />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <ErrorBoundary>
          <Ring />
        </ErrorBoundary>
        <ErrorBoundary>
          <Services />
        </ErrorBoundary>
        <ErrorBoundary>
          <Work />
        </ErrorBoundary>
        <ErrorBoundary>
          <Demos />
        </ErrorBoundary>
        <ErrorBoundary>
          <Pricing />
        </ErrorBoundary>
        <ErrorBoundary>
          <Process />
        </ErrorBoundary>
        <ErrorBoundary
          fallback={
            <p className="mx-auto max-w-7xl px-4 py-24 text-center text-lg">
              Book on WhatsApp: <a className="text-accent underline" href={`https://wa.me/${brand.whatsapp}`}>{brand.whatsappDisplay}</a>
            </p>
          }
        >
          <Booking />
        </ErrorBoundary>
        <ErrorBoundary>
          <Faq />
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppFab />
    </BookingProvider>
  );
}
