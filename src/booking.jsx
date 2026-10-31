import { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  // { service, plan, nonce } set when a pricing card is picked; the form fills itself from it
  const [pick, setPick] = useState(null);
  const choose = (service, plan) => {
    setPick({ service, plan, nonce: Date.now() });
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <BookingContext.Provider value={{ pick, choose }}>{children}</BookingContext.Provider>;
}

export const useBooking = () => useContext(BookingContext);

export function whatsappLink(number, text) {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
