// All editable site content lives here.
// Swap in real prices, services and images without touching the components.

export const brand = {
  name: "Pixelcraft",
  logo: "/logo.png", // rounded app-icon tile cut from the Pixelcraft logo; works on light and dark backgrounds
  // WhatsApp number in international format, no "+" or spaces (91 = India).
  whatsapp: "918910185902",
  whatsappDisplay: "+91 89101 85902",
  // Leave empty to hide the Instagram icon.
  instagram: "",
  email: "",
};

// Business name used in the footer copyright. The Privacy Policy and Terms are static pages in
// public/privacy.html and public/terms.html; update them by hand if your details change.
export const legal = {
  businessName: "Pixelcraft",
};

// "What we build" list. `price` is shown on the row; `service`/`plan` prefill the quote form.
export const services = [
  {
    id: "sites",
    title: "Business websites",
    blurb: "Home, services, about and contact pages for a shop, clinic, studio or firm. Designed for you, not picked from a theme store.",
    price: "from ₹5,000",
    service: "Website pack",
  },
  {
    id: "motion",
    title: "3D and motion websites",
    blurb: "Scroll animations and 3D scenes, for brands that want the site itself to be the first impression.",
    price: "from ₹49,999",
    service: "3D / advanced motion website",
  },
  {
    id: "store",
    title: "Online stores",
    blurb: "Product pages, cart, payments and order management for selling online.",
    price: "from ₹49,999",
    service: "E-commerce development",
  },
  {
    id: "seo",
    title: "SEO setup",
    blurb: "Complete on-page SEO so people searching for what you sell can find you on Google.",
    price: "₹14,000",
    service: "SEO setup",
  },
  {
    id: "care",
    title: "Maintenance",
    blurb: "We keep it online, update it and fix things when you message us.",
    price: "from ₹1,499/month",
    service: "Maintenance",
  },
];

// Concept sites shown on the laptop, tablet and phone. The brands are fictional (labelled as
// concepts on the page); swap in real client work once you have permission to show it.
// `src` is the first screen (hero windows); `full` is a whole-page capture that scrolls inside its frame.
export const devices = {
  desktop: { src: "/work/velorra.jpg", full: "/work/velorra-full.jpg", fullSize: [1000, 3171], href: "/demos/velorra/", name: "Velorra Motors", kind: "EV showroom" },
  tablet: { src: "/work/monsoon.jpg", full: "/work/monsoon-full.jpg", fullSize: [560, 4392], href: "/demos/monsoon/", name: "Monsoon Bean", kind: "Café" },
  phone: { src: "/work/crumb.jpg", full: "/work/crumb-full.jpg", fullSize: [420, 5416], href: "/demos/crumb/", name: "Crumb & Copper", kind: "Bakery" },
};

// Real client websites only (landscape screenshots, about 1200x900, in public/work/).
// The "Websites we have shipped" section stays hidden while this list is empty, so the site never
// shows stock photos as client work. Example entry:
//   { title: "Sen Bakes", tag: "E-commerce", image: "/work/sen-bakes.jpg" },
export const work = [];

// Old placeholder list kept only as a format reference; not rendered.
const _exampleWork = [
  { title: "Cafe website", tag: "Business site", image: "https://picsum.photos/seed/pixelcraft-cafe-site/1200/900" },
  { title: "Clothing store", tag: "E-commerce", image: "https://picsum.photos/seed/pixelcraft-fashion-store/1200/900" },
  { title: "Clinic booking site", tag: "Business site", image: "https://picsum.photos/seed/pixelcraft-clinic/1200/900" },
  { title: "Real estate listings", tag: "Web app", image: "https://picsum.photos/seed/pixelcraft-realestate/1200/900" },
  { title: "Coaching landing page", tag: "Landing page", image: "https://picsum.photos/seed/pixelcraft-coaching/1200/900" },
  { title: "Restaurant ordering", tag: "E-commerce", image: "https://picsum.photos/seed/pixelcraft-restaurant/1200/900" },
];

// Website packs, as printed on the price sheet. price is in INR.
export const packs = [
  {
    name: "Mini Website Pack",
    price: 5000,
    pages: "Up to 3 pages",
    tag: "Small beginnings",
    features: [
      "Responsive, mobile-friendly design",
      "WhatsApp contact integration",
      "Click-to-call button",
      "Google Maps location and business hours",
      "Social media links",
      "1 revision",
      "No SEO included",
      "Extra page: +₹500 per page",
    ],
  },
  {
    name: "Essential Pack",
    price: 10000,
    pages: "Up to 6 pages",
    tag: "Professional and practical",
    popular: true,
    features: [
      "Everything in Mini Pack",
      "Enquiry form (name, phone, requirement)",
      "Photo gallery / portfolio section",
      "Services / menu / price list page",
      "Clean, professional design",
      "Basic speed optimisation",
      "1 revision round",
    ],
  },
  {
    name: "Starter Launch Pack",
    price: 15000,
    pages: "Up to 9 pages",
    tag: "A strong start",
    features: [
      "Everything in Essential Pack",
      "Basic SEO setup",
      "WhatsApp / contact integration",
      "Enquiry form with email alerts",
      "Testimonials and FAQ sections",
      "Google Business Profile guidance",
      "1 revision round",
    ],
  },
  {
    name: "Business Growth Pack",
    price: 30000,
    pages: "Up to 12 pages",
    tag: "Built to attract and convert",
    features: [
      "Everything in Starter Launch Pack",
      "Premium UI/UX",
      "Lead forms / booking setup",
      "Copywriting support",
      "On-page SEO setup",
      "Blog / news section setup",
      "Google Analytics setup",
      "Speed and performance optimisation",
      "2 revision rounds",
    ],
  },
  {
    name: "Premium Scale Pack",
    price: 60000,
    pages: "Up to 15 pages",
    tag: "For brands that think bigger",
    features: [
      "Everything in Business Growth Pack",
      "Premium UI/UX with motion",
      "Professional copywriting",
      "Technical and on-page SEO foundation",
      "Google Analytics and Search Console setup",
      "Domain and hosting allowance up to ₹4,000",
      "3 revision rounds",
      "60 days launch support",
    ],
  },
];

export const addons = [
  { name: "3D / advanced motion website", price: "from ₹49,999" },
  { name: "E-commerce development", price: "from ₹49,999" },
  { name: "SEO setup", price: "₹14,000", note: "Complete on-page SEO setup for better visibility" },
  { name: "Maintenance", price: "from ₹1,499/month" },
  { name: "Reels and ads management", price: "₹10,000/month" },
  { name: "Ad creative", price: "₹3,000 to ₹5,000 per ad", note: "Ad pricing increases with duration, minutes and complexity" },
];

export const pricingNotes = [
  "50% advance before starting.",
  "Domain, hosting, paid plugins, APIs, ad spend and third-party subscriptions are charged separately.",
  "Large or advanced projects are quoted separately.",
];

// Options in the quote form. `plans` fills the second dropdown.
export const bookingOptions = [
  { service: "Website pack", plans: packs.map((p) => p.name) },
  ...addons.filter((a) => a.name !== "Reels and ads management" && a.name !== "Ad creative").map((a) => ({ service: a.name, plans: [] })),
  { service: "Reels and ads management", plans: [] },
];

export const timelines = ["As soon as possible", "Within a month", "1 to 3 months", "Just exploring"];

// Each step lists what you actually get from it.
export const process = [
  {
    title: "Chat",
    text: "Send the form, a voice note or a few photos on WhatsApp. We ask what the site needs to do, then send a written quote.",
    get: ["Written quote", "Rough launch date"],
  },
  {
    title: "Plan",
    text: "We agree the pages and who writes the text, then design the key pages for you to approve before any code is written.",
    get: ["Page list", "Design to approve"],
  },
  {
    title: "Build",
    text: "We build it and share a private preview link, so you can check it on your own phone while it comes together.",
    get: ["Preview link", "Your revisions"],
  },
  {
    title: "Launch",
    text: "We connect your domain, put it live and hand over every login. After that, message us whenever something needs changing.",
    get: ["Live site", "All logins"],
  },
];

// Only questions the rest of the page does not already answer.
export const faqs = [
  {
    q: "I already have a website. Can you work with it?",
    a: "Yes. Put the link in the form. We will tell you whether a fix is enough or a rebuild makes more sense, and quote whichever you pick.",
  },
  {
    q: "Who writes the text and takes the photos?",
    a: "You know your business best, so we usually start from your notes. We tidy the wording and tell you which photos are worth taking.",
  },
  {
    q: "What if I do not like the design?",
    a: "You see and approve the design before we build anything. Your quote lists how many rounds of changes are included.",
  },
  {
    q: "How does payment work, and what costs extra?",
    a: "50% advance before we start, the rest before the site goes live. Domain, hosting, paid plugins, APIs, ad spend and third-party subscriptions are charged separately, except the allowance in the Premium Scale Pack.",
  },
  {
    q: "Do I need a domain and hosting first?",
    a: "No. We can register and set them up for you, or use the ones you already own.",
  },
  {
    q: "Will I own the website?",
    a: "Yes. After the final payment, the design, the site and the domain are yours. Third-party plugins and fonts stay under their own licences.",
  },
  {
    q: "Can I update it myself later?",
    a: "If you want to, we add a simple editor for text, photos and products. If not, a care plan covers changes for you.",
  },
];
