// All page copy and data lives here, so text changes never touch the components.

export const IMG = "https://pennyappeal-caribbean.netlify.app/images/";

export type ProgKey = "thirst" | "feed" | "orphan" | "emergency";
export type GiftProg = "most" | ProgKey | "zakat";

export const PROGRAMMES: Record<ProgKey, { name: string; c: string; cd: string; where: string; img: string; line: string }> = {
  thirst: { name: "Thirst Relief", c: "var(--thirst)", cd: "var(--thirst-deep)", where: "Berbice, Guyana", img: "work-thirst.jpg", line: "A communal tap in Berbice means drinking, cooking, and washing without a day lost to fetching water." },
  feed: { name: "Feed Our World", c: "var(--feed)", cd: "var(--feed-deep)", where: "Couva, Trinidad", img: "work-feed.jpg", line: "Food packs and shared kitchens in Couva keep families fed this week, and skills that last beyond it." },
  orphan: { name: "OrphanKind", c: "var(--orphan)", cd: "var(--orphan-deep)", where: "Georgetown, Guyana", img: "work-schoolyard.jpg", line: "OrphanKind sponsorship covers fees, uniform, and a hot meal at midday." },
  emergency: { name: "Emergency Response", c: "var(--emergency)", cd: "var(--emergency-deep)", where: "Gaza", img: "work-emergency.jpg", line: "When a storm or flood hits, food, water, and shelter move first. Restricted Sadaqah, released fast." },
};
export const PROG_KEYS = Object.keys(PROGRAMMES) as ProgKey[];

export const SLIDES: { k: ProgKey; eyebrow: string; a: string; b: string; sub: string; img: string }[] = [
  { k: "thirst", eyebrow: "Thirst Relief", a: "Water for", b: "community", sub: "A well in Berbice starts with a gift today.", img: "hero-thirst.jpg" },
  { k: "feed", eyebrow: "Feed Our World", a: "Food for", b: "families", sub: "Food packs for families in Couva and across the region.", img: "hero-feed.jpg" },
  { k: "orphan", eyebrow: "OrphanKind", a: "Care for", b: "every child", sub: "School, meals, and care for one child at a time.", img: "hero-orphan.jpg" },
  { k: "emergency", eyebrow: "Emergency Response", a: "Help when", b: "it is needed", sub: "Shelter, water, and food when a crisis hits.", img: "hero-emergency.jpg" },
];

export const GIFT_PROGRAMMES: { v: GiftProg; label: string }[] = [
  { v: "most", label: "Where most needed" },
  { v: "thirst", label: "Thirst Relief" },
  { v: "feed", label: "Feed Our World" },
  { v: "orphan", label: "OrphanKind" },
  { v: "emergency", label: "Emergency Response" },
  { v: "zakat", label: "Zakat" },
];

export const CURRENCIES = ["CAD", "USD", "TTD", "JMD", "GYD", "XCD"] as const;
export type Currency = (typeof CURRENCIES)[number];
export const PRESETS: Record<Currency, number[]> = {
  CAD: [50, 100, 250],
  USD: [50, 100, 250],
  TTD: [300, 700, 1700],
  JMD: [7500, 15000, 40000],
  GYD: [10000, 20000, 50000],
  XCD: [130, 270, 680],
};

export const ABOUT_TEXT =
  "Penny Appeal Canada is a Canadian humanitarian organization. Since 2019, we have been working across food security, clean water, emergency response, and orphan care, addressing the fundamentals that empower families to rise out of poverty.";

export const STACK = [
  { img: "work-schoolyard.jpg", cap: "Georgetown", r: -9, x: 0, y: 4, s: 70 },
  { img: "work-feed.jpg", cap: "Couva", r: 7, x: 44, y: 0, s: -60 },
  { img: "work-thirst.jpg", cap: "Berbice", r: -3, x: 20, y: 34, s: 30 },
];

export const ON_THE_GROUND: { k: ProgKey; where: string; line: string }[] = [
  { k: "thirst", where: "Guyana", line: "A communal tap in Berbice" },
  { k: "feed", where: "Trinidad", line: "The Couva kitchen that feeds on Fridays" },
  { k: "orphan", where: "Guyana", line: "One desk in Georgetown" },
  { k: "emergency", where: "Gaza", line: "Food, water, and shelter first" },
];

export type CauseIcon = "autogive" | "zakat" | "child" | "drop" | "bowl" | "heart";
export const CAUSES: { tone: "orphan" | "zakat" | "thirst" | "feed"; title: string; line: string; cta: string; give: GiftProg | "monthly"; img: string; icon: CauseIcon }[] = [
  { tone: "orphan", title: "AutoGive", line: "Give every month, and keep a tap running in Berbice.", cta: "Give monthly", give: "monthly", img: "work-feed.jpg", icon: "autogive" },
  { tone: "zakat", title: "Zakat", line: "Calculated, then kept restricted.", cta: "Calculate Zakat", give: "zakat", img: "hero-thirst.jpg", icon: "zakat" },
  { tone: "orphan", title: "Sponsor a child", line: "School, meals, and care for one child.", cta: "Sponsor", give: "orphan", img: "hero-orphan.jpg", icon: "child" },
  { tone: "thirst", title: "Thirst Relief", line: "A communal tap in Berbice.", cta: "Support Thirst Relief", give: "thirst", img: "work-thirst.jpg", icon: "drop" },
  { tone: "feed", title: "Feed Our World", line: "Food packs and kitchens in Couva.", cta: "Support Feed", give: "feed", img: "hero-feed.jpg", icon: "bowl" },
  { tone: "orphan", title: "OrphanKind", line: "School, meals, and care in Georgetown.", cta: "Support OrphanKind", give: "orphan", img: "work-schoolyard.jpg", icon: "heart" },
];
export const TONES = {
  orphan: ["var(--orange)", "var(--orange-deep)"],
  zakat: ["#3f3a39", "#231f20"],
  thirst: ["var(--thirst)", "var(--thirst-deep)"],
  feed: ["var(--feed)", "var(--feed-deep)"],
} as const;

export const MARQUEE_PHRASE = "Give with care · reach families · stand with communities · ";

// Pins are placed by lat/lon. The projection was fitted to the map artwork's own anchors
// (Georgetown, Couva, Berbice, Gaza): x% = 53.51 + lon * 0.3911, y% = 60.29 - lat * 0.7656.
const proj = (lat: number, lon: number) => ({ x: 53.51 + lon * 0.3911, y: 60.29 - lat * 0.7656 });
export const PINS = [
  { k: "thirst", lat: 6.3, lon: -57.5, t: "Berbice, Guyana" },
  { k: "orphan", lat: 6.8, lon: -58.2, t: "Georgetown, Guyana" },
  { k: "feed", lat: 10.4, lon: -61.4, t: "Couva, Trinidad" },
  { k: "feed", lat: 18, lon: -76.8, t: "Jamaica" },
  { k: "emergency", lat: 31.5, lon: 34.4, t: "Gaza" },
  { k: "feed", lat: 31.95, lon: 35.9, t: "Jordan" },
  { k: "emergency", lat: 15.6, lon: 32.5, t: "Sudan" },
  { k: "thirst", lat: 24.9, lon: 67, t: "Pakistan" },
  { k: "orphan", lat: 39.9, lon: 32.9, t: "Turkey" },
  { k: "feed", lat: 28.6, lon: 77.2, t: "India" },
].map((p) => ({ ...p, k: p.k as ProgKey, ...proj(p.lat, p.lon) }));

export const RAISED_TOTAL = 7672075;
export const RAISED_UPDATED = "August 31, 2026";
export const TOTALS: { k: GiftProg; name: string; v: number; c: string }[] = [
  { k: "thirst", name: "Thirst Relief", v: 465042, c: "var(--thirst)" },
  { k: "orphan", name: "OrphanKind", v: 925375, c: "var(--orange)" },
  { k: "feed", name: "Feed Our World", v: 860365, c: "var(--feed)" },
  { k: "zakat", name: "Zakat", v: 3764433, c: "var(--green)" },
  { k: "emergency", name: "Emergency Response", v: 1625885, c: "var(--emergency)" },
];

export const PHOTOS: [string, string][] = [
  ["hero-thirst.jpg", "Thirst Relief"],
  ["work-feed.jpg", "Feed Our World"],
  ["hero-orphan.jpg", "OrphanKind"],
  ["hero-emergency.jpg", "Gaza, 2024"],
  ["work-thirst.jpg", "Thirst Relief"],
  ["hero-feed.jpg", "Feed Our World"],
  ["work-emergency.jpg", "Gaza, 2026"],
  ["happen-thirst.jpg", "Thirst Relief"],
];

export const FLOW: { k: ProgKey; eyebrow: string; h: string; p: string; cta: string; img: string }[] = [
  { k: "thirst", eyebrow: "Thirst Relief", h: "A communal tap in Berbice means drinking, cooking, and washing without a day lost to fetching water.", p: "From USD 150, or local equivalent in TTD, JMD, GYD, XCD, CAD.", cta: "Support Thirst Relief", img: "happen-thirst.jpg" },
  { k: "feed", eyebrow: "Feed Our World", h: "Food packs and shared kitchens in Couva keep families fed this week, and skills that last beyond it.", p: "Give once, or set up AutoGive to keep the kitchen stocked.", cta: "Support Feed Our World", img: "work-feed.jpg" },
  { k: "orphan", eyebrow: "OrphanKind", h: "OrphanKind sponsorship covers fees, uniform, and a hot meal at midday.", p: "School, meals, and care for one child at a time.", cta: "Sponsor a child", img: "work-schoolyard.jpg" },
  { k: "emergency", eyebrow: "Emergency Response", h: "When a storm or flood hits, food, water, and shelter move first.", p: "Restricted Sadaqah, released fast.", cta: "Give to Emergency Response", img: "work-emergency.jpg" },
];

export const IMPORTANT = [
  { img: "cutout-reports.png", eyebrow: "Read the reports", title: "Financial Reports", text: "What came in, and where it was spent.", href: "#", label: "Read the financial reports" },
  { img: "cutout-scholars.png", eyebrow: "Meet the scholars", title: "Our Scholars", text: "The scholars who review the fiqh of our programmes.", href: "#", label: "Meet our scholars" },
  { img: "cutout-volunteer.png", eyebrow: "Volunteer with us", title: "Volunteer", text: "Events, packs, and local work. Give the hours you have.", href: "#", label: "Volunteer with us" },
];
