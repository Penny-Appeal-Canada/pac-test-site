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

/* ---------- Thirst Relief programme page (/thirst-relief) ----------
   Programmes, prices (CAD) and photos come from the Penny Appeal donate system
   (donate.pennyappeal.ca/program/thirst-relief). */
export const PA_MEDIA = "https://pac-crm-media.s3.us-east-1.amazonaws.com/campaigns/";

export type Well = { slug: string; name: string; price: number; scale: string; where: string[]; kind: string; text: string; img: string; alt: string };
// Smallest to largest, so the stage's water gauge rises as the wells grow.
export const WELLS: Well[] = [
  {
    slug: "hand-pump-well", name: "Hand-Pump Well", price: 1400, scale: "A family", where: ["Bangladesh", "Kashmir", "Pakistan"],
    kind: "Sealed hand pump, or a mechanized deep pump where the ground is hard",
    text: "A sealed hand-pump well that brings safe water within reach of a family or small cluster of homes, from arsenic-affected Bangladesh to the rocky highlands of Kashmir and Pakistan. Where the ground is hard or water sits deep, it's built as a mechanized deep pump so it runs year-round.",
    img: "c58cc1c3-f4be-475e-aec9-a9608e4f173d.jpeg", alt: "A small boy laughing as water from a hand pump splashes over his hands",
  },
  {
    slug: "high-yield-community-well", name: "High-Yield Community Well", price: 3200, scale: "150+ people a day", where: ["Bangladesh", "Pakistan", "Indonesia"],
    kind: "Shared village well, drilled to deep pressurized groundwater",
    text: "A shared village well serving 150+ people a day across Bangladesh, Pakistan and Indonesia. Built to reach deep, pressurized groundwater that stays clean when shallow sources turn salty or flood-contaminated.",
    img: "d6111800-c828-4922-8272-c4ba1dcdde23.jpeg", alt: "Children smiling as they carry metal water pots on their heads past a village well wall",
  },
  {
    slug: "community-borehole", name: "Community Borehole", price: 4000, scale: "A whole village", where: ["East Africa", "West Africa"],
    kind: "Deep hand-pump borehole with a community-maintainable pump",
    text: "A deep, durable hand-pump borehole for villages facing severe water scarcity across East and West Africa. Drilled to a protected aquifer and fitted with a community-maintainable pump, so the water keeps flowing long after the well is handed over.",
    img: "985a24c5-cbcb-4480-b642-50ed402e90ab.jpeg", alt: "A young woman working a borehole pump in Kenya beside a dedication plaque",
  },
  {
    slug: "off-grid-water-well", name: "Off-Grid Water Well", price: 5000, scale: "A village, off-grid", where: ["Pakistan", "Ghana", "Senegal"],
    kind: "Solar pump, elevated storage and multiple tap stands",
    text: "A high-capacity solar water system for off-grid communities: pump, elevated storage and multiple tap stands. It banks water for the dry season and ends the long daily walk for water, especially for women and girls. Placed at a mosque and school, it gives an entire village a reliable communal water point.",
    img: "9d028ce7-d129-453e-8b26-ad6099be52b7.jpeg", alt: "A woman filling a clay pot at a row of taps fed by a solar water system",
  },
];

export const THIRST_HERO = {
  before: "7641db21-2a4d-48a0-9d29-8915304b8bc0.jpeg", // the walk: women and girls carrying water
  after: "d6111800-c828-4922-8272-c4ba1dcdde23.jpeg", // the well: children at a village tap
};

export const DELIVERY = {
  price: 500, img: "2c3aea7f-4528-40ee-a29e-b732a4a8f663.jpeg", places: ["Gaza", "Sudan", "Yemen"],
  text: "Clean water trucked straight to displaced and besieged families in Gaza, Sudan and Yemen, where wells and pipes have been destroyed. Each 5,000-litre delivery keeps a community going until fixed systems can be rebuilt.",
};

export const GLOBAL_FUND = {
  amounts: [100, 150, 300, 500],
  text: "A flexible gift we direct to the water projects where the need is greatest, funding larger shared wells and filling gaps other donations can't reach.",
};

export const PLAQUE_LINES = ["Ongoing Sadaqah for the soul of", "In loving memory of", "On behalf of"];

/* Every Thirst Relief giving option on the donate system, in its order there:
   feeds the hero form and the option blocks. `price` is fixed; `amounts` means choose. */
/** One giving option on a programme page. Exactly one of price / amounts / tiers / unit sets the amount. */
export type GiveTier = { label: string; amount: number };
export type GiveOption = {
  slug: string; name: string; tag: string; short: string; img?: string;
  price?: number; amounts?: number[]; tiers?: GiveTier[]; unit?: { price: number; one: string; many: string };
  places?: string[]; custom?: boolean; monthly?: boolean; detail?: string;
  /** always given monthly, with no one-time choice (e.g. a monthly sponsorship) */
  everyMonth?: boolean;
};
export type WaterOption = GiveOption;
const WELL_TAGS: Record<string, string> = { "hand-pump-well": "Hand-pump well", "high-yield-community-well": "Community well", "community-borehole": "Borehole", "off-grid-water-well": "Off-grid solar well" };
export const WATER_OPTIONS: WaterOption[] = [
  { slug: "global-thirst-relief-fund", name: "Global Thirst Relief Fund", tag: "Most needed", short: "Directed to the water projects where the need is greatest.", img: THIRST_HERO.before, amounts: GLOBAL_FUND.amounts, custom: true },
  { slug: "emergency-water-delivery", name: "Emergency Water Delivery", tag: "Emergency water", short: "A 5,000-litre truck of clean water for families in crisis.", img: DELIVERY.img, price: DELIVERY.price, places: DELIVERY.places },
  ...WELLS.map((w) => ({ slug: w.slug, name: w.name, tag: WELL_TAGS[w.slug], short: `${w.scale}. ${w.where.join(", ")}.`, img: w.img, price: w.price, detail: "Can carry a dedication plaque in a loved one's name." })),
];

/* ---------- Feed Our World programme page (/feed-our-world) ----------
   Options and prices come from the donate system (donate.pennyappeal.ca/program/feed-our-world).
   The two livelihood programmes have no description there; their lines here are ours to confirm. */
export const FEED_MEDIA = {
  hero: IMG + "hero-feed.jpg",
  meal: PA_MEDIA + "254f0604-9703-4ffa-818d-9abfeb9d9902.jpeg", // a family sharing a meal
  fitr: PA_MEDIA + "5b30454a-e1d0-46d7-83c0-3db5ca9773d4.jpeg", // a food box delivered to an elderly woman
};

export const FAMILY_TIERS: GiveTier[] = [
  { label: "1 family", amount: 120 },
  { label: "5 families", amount: 600 },
  { label: "10 families", amount: 1200 },
];
export const LIVELIHOOD_AMOUNTS = [100, 250, 500];
export const FITR_PRICE = 15;
export const FIDYA_DAY = 15;
export const KAFFARAH = { oath: 150, fast: 900 };
export const AQIQA: (GiveTier & { text: string })[] = [
  { label: "Girl", amount: 160, text: "Fulfils an Aqiqa for a girl: the sacrifice of one animal." },
  { label: "Boy", amount: 320, text: "Fulfils an Aqiqa for a boy." },
  { label: "Sadaqah", amount: 100, text: "Give Sadaqah on behalf of your child." },
];

export const FEED_OPTIONS: GiveOption[] = [
  { slug: "fow-where-most-needed", name: "Where Most Needed", tag: "Most needed", short: "A month of food for each family, wherever hunger is worst right now.", tiers: FAMILY_TIERS, custom: true, monthly: true },
  { slug: "support-the-livelihood-of-refugee-women", name: "Support Livelihood of Refugee Women", tag: "Refugee women", short: "Help women who have lost their homes earn a living for their families.", amounts: LIVELIHOOD_AMOUNTS, custom: true, monthly: true },
  { slug: "support-livelihood-of-farmers", name: "Support Livelihood of Farmers", tag: "Farmers", short: "Help farmers grow enough to feed their families, and sell the rest.", amounts: LIVELIHOOD_AMOUNTS, custom: true, monthly: true },
  { slug: "zakat-al-fitr", name: "Zakat al-Fitr", tag: "Zakat al-Fitr", short: "Pay before Eid. It provides a meal to a person in need on Eid.", unit: { price: FITR_PRICE, one: "person", many: "people" } },
  { slug: "fidyakaffarah", name: "Fidya & Kaffarah", tag: "Fidya & Kaffarah", short: "For fasts missed or broken, and for broken oaths.", custom: true,
    tiers: [{ label: "Fidya, 1 day", amount: FIDYA_DAY }, { label: "Fidya, 30 days", amount: FIDYA_DAY * 30 }, { label: "Kaffarah, oath", amount: KAFFARAH.oath }, { label: "Kaffarah, fast", amount: KAFFARAH.fast }] },
  { slug: "aqiqa", name: "Aqiqa", tag: "Aqiqa", short: "The Sunnah sacrifice to celebrate a child's birth.", tiers: AQIQA.map(({ label, amount }) => ({ label, amount })) },
];

/* ---------- OrphanKind programme page (/orphankind) ----------
   Options and prices come from the donate system (donate.pennyappeal.ca/program/orphankind).
   Every OrphanKind campaign there shares one portrait, so the hero uses the home page's photo. */
export const ORPHAN_MEDIA = {
  hero: IMG + "hero-orphan.jpg", // girls laughing outside their school
  portrait: "https://pac-crm-media.s3.us-east-1.amazonaws.com/funds/2a2e73fb-c896-4dd3-9600-aad598c2d167.jpeg", // a child looking through a window
  school: IMG + "work-schoolyard.jpg",
};
export const SPONSOR_MONTH = 70;
export const SPONSOR_YEAR = 840;
export const SPONSOR_PLACES = ["Pakistan", "Palestine"] as const;
/** What a sponsorship provides, from the donate system's description. */
export const ORPHAN_NEEDS: { k: string; name: string; line: string }[] = [
  { k: "school", name: "Education", line: "School fees, books and a uniform, so they keep learning." },
  { k: "meals", name: "Daily meals", line: "Nutritious food every day, not just on the good days." },
  { k: "clothes", name: "Clothes", line: "Warm, clean clothes that fit as they grow." },
  { k: "health", name: "Healthcare", line: "Check-ups and treatment when they fall ill." },
  { k: "play", name: "Play", line: "Recreational activities, and time to just be a child." },
  { k: "care", name: "Psychosocial support", line: "Someone to talk to, and help to heal from loss." },
];
export const ORPHAN_OPTIONS: GiveOption[] = [
  { slug: "sponsor-an-orphan-for-a-month-pakistan", name: "Monthly Sponsorship (Pakistan)", tag: "Monthly · Pakistan", short: "Sponsor an orphan in Pakistan every month: school, meals, clothes, healthcare and care.", unit: { price: SPONSOR_MONTH, one: "orphan", many: "orphans" }, everyMonth: true },
  { slug: "sponsor-an-orphan-for-a-month-palestine", name: "Monthly Sponsorship (Palestine)", tag: "Monthly · Palestine", short: "Sponsor an orphan in Palestine every month: school, meals, clothes, healthcare and care.", unit: { price: SPONSOR_MONTH, one: "orphan", many: "orphans" }, everyMonth: true },
  { slug: "orphan-kind-pakistan", name: "Sponsor an Orphan for a Year (Pakistan)", tag: "A year · Pakistan", short: "A full year of care for an orphan in Pakistan, in one gift.", unit: { price: SPONSOR_YEAR, one: "orphan", many: "orphans" } },
  { slug: "orphan-kind-palestine", name: "Sponsor an Orphan for a Year (Palestine)", tag: "A year · Palestine", short: "A full year of care for an orphan in Palestine, in one gift.", unit: { price: SPONSOR_YEAR, one: "orphan", many: "orphans" } },
  { slug: "ok-where-most-needed", name: "Where Most Needed", tag: "Most needed", short: "Directed to the orphan care projects where the need is greatest.", amounts: [250, 500], custom: true, monthly: true },
];

/* ---------- Emergency Response programme page (/emergency-response) ----------
   Options and prices come from the donate system (donate.pennyappeal.ca/program/emergency-response).
   "Cold Days Warm Hearts" is listed there with no prices, so it is left out.
   Yemen's campaign carries Syria's photo and description, so its line here is ours to confirm. */
export const ER_MEDIA = {
  hero: IMG + "hero-emergency.jpg", // relief tents going up on the sand, Gaza
  delivery: IMG + "work-emergency.jpg", // food packs loaded onto a cart, Gaza
  gaza: PA_MEDIA + "9bed6b57-1043-464d-a36c-09f0b1793fab.jpeg",
  sudan: PA_MEDIA + "31b405d2-f4e8-4445-abbb-88b3748507a0.jpeg",
  syria: PA_MEDIA + "20027653-7f3b-4844-a2cf-202db30b3227.jpeg",
  afghanistan: PA_MEDIA + "bc56cc25-382f-44a8-8d6d-11195db95dbc.png",
  fund: "https://pac-crm-media.s3.us-east-1.amazonaws.com/funds/4b127797-f018-4ab3-a97f-9344e4707499.jpeg", // a family among rubble
  mothers: PA_MEDIA + "f18f6aa0-b2e9-48b6-bc66-cd2bba1e0224.jpeg", // an illustration: the campaign has no photo yet
};
/** Gaza: the one appeal that lets a donor pick several items at once. */
export const GAZA_ITEMS: { k: string; label: string; amount: number }[] = [
  { k: "formula", label: "Baby formula", amount: 20 },
  { k: "food", label: "Feed 1 family", amount: 120 },
  { k: "medical", label: "Medical aid for 2 families", amount: 500 },
  { k: "shelter", label: "Shelter for a family of 4", amount: 1000 },
];
export const MOTHER_TIERS: (GiveTier & { text: string })[] = [
  { label: "Nutrition pack", amount: 50, text: "Nutritious food for a new mother and her child for one month." },
  { label: "Safe delivery", amount: 100, text: "Medical supplies for a safe childbirth at a mother and child health centre." },
  { label: "Medicine & lab tests", amount: 250, text: "Essential medication and diagnostic tests for a mother and her child." },
  { label: "A mother's full care", amount: 500, text: "A safe delivery, post-natal care and newborn essentials for one family." },
];
export const WINTER_TIERS: GiveTier[] = [
  { label: "1 family", amount: 150 },
  { label: "2 families", amount: 300 },
  { label: "5 families", amount: 750 },
];
export type Crisis = { slug: string; place: string; title: string; line: string; img: string; items: GiveTier[]; zakat?: boolean };
export const CRISES: Crisis[] = [
  { slug: "gaza-emergency-response", place: "Gaza", title: "Food, medicine and shelter", line: "Food parcels, baby formula, medical aid and shelter for families who have lost their homes.", img: ER_MEDIA.gaza, zakat: true,
    items: GAZA_ITEMS.map(({ label, amount }) => ({ label, amount })) },
  { slug: "sudan-emergency-response", place: "Sudan", title: "The world's largest displacement crisis", line: "12.3 million people are displaced, about half of them children. We provide food packs, health kits, surgeries and shelter.", img: ER_MEDIA.sudan,
    items: [{ label: "Hygiene kit", amount: 50 }, { label: "Food pack for a family", amount: 125 }, { label: "Emergency surgeries", amount: 300 }, { label: "Shelter kit", amount: 500 }] },
  { slug: "syria-emergency-response", place: "Syria", title: "A new chapter, still in crisis", line: "Millions still need immediate relief after years of war. Our teams deliver aid as the situation changes.", img: ER_MEDIA.syria,
    items: [50, 100, 200, 500].map((a) => ({ label: "Relief", amount: a })) },
  { slug: "afghanistan-earthquake", place: "Afghanistan", title: "Earthquake relief", line: "Hot meals, hygiene kits, food packs and tents for families whose homes collapsed.", img: ER_MEDIA.afghanistan,
    items: [{ label: "Hot meals", amount: 10 }, { label: "Hygiene kit", amount: 35 }, { label: "Food pack", amount: 120 }, { label: "Emergency tent", amount: 250 }] },
  { slug: "yemen-emergency-response", place: "Yemen", title: "Relief in a long war", line: "Emergency food and essentials for families caught in one of the world's longest crises.", img: ER_MEDIA.fund,
    items: [50, 100, 200, 500].map((a) => ({ label: "Relief", amount: a })) },
];
export const ER_OPTIONS: GiveOption[] = [
  { slug: "er-where-most-needed", name: "Where Most Needed", tag: "Most needed", img: ER_MEDIA.delivery, short: "Sent to the emergency where help is needed first. Zakat eligible.", amounts: [250, 500, 750], custom: true, monthly: true },
  { slug: "gaza-emergency-response", name: "Gaza Emergency Response", tag: "Gaza", img: ER_MEDIA.gaza, short: "Food, baby formula, medical aid and shelter. Zakat eligible.", tiers: CRISES[0].items, custom: true },
  { slug: "sudan-emergency-response", name: "Sudan Emergency Response", tag: "Sudan", img: ER_MEDIA.sudan, short: "Food packs, hygiene kits, surgeries and shelter for displaced families.", tiers: CRISES[1].items, custom: true, monthly: true },
  { slug: "syria-emergency-response", name: "Syria Emergency Response", tag: "Syria", img: ER_MEDIA.syria, short: "Relief for families as the situation in Syria changes.", amounts: [50, 100, 200, 500], custom: true, monthly: true },
  { slug: "afghanistan-earthquake", name: "Afghanistan Earthquake", tag: "Afghanistan", img: ER_MEDIA.afghanistan, short: "Hot meals, hygiene kits, food packs and tents after the earthquake.", tiers: CRISES[3].items, custom: true },
  { slug: "yemen-emergency-response", name: "Yemen Emergency Response", tag: "Yemen", img: ER_MEDIA.fund, short: "Emergency food and essentials for families in Yemen.", amounts: [50, 100, 200, 500], custom: true, monthly: true },
  { slug: "expecting-mothers", name: "Expecting Mothers", tag: "Mothers", img: ER_MEDIA.mothers, short: "Safe pregnancy, childbirth and newborn care for mothers in crisis.", tiers: MOTHER_TIERS.map(({ label, amount }) => ({ label, amount })), custom: true, monthly: true },
  { slug: "international-winter-care-kit", name: "Winter Care Kit", tag: "Winter kits", img: ER_MEDIA.hero, short: "Warm clothes, blankets and essentials to get a family through winter.", tiers: WINTER_TIERS, custom: true, monthly: true },
];

/* ---------- Zakat programme page (/zakat) ----------
   From the donate system's Zakat fund (donate.pennyappeal.ca/program/zakat) and the two
   Emergency Response campaigns it marks as Zakat eligible. All three Zakat images in the
   system are the same 900px photo. */
export const ZAKAT_MEDIA = {
  hero: "https://pac-crm-media.s3.us-east-1.amazonaws.com/funds/56c1a503-d9d9-48cd-a2da-b31442e933bb.jpeg", // a volunteer bringing a food box to an elderly woman
  calculator: "/zakat/calculator-placeholder.jpg", // zakah.com calculator, until the embed is in
  fitr: IMG + "work-feed.jpg", // stand-in: the Zakat al-Fitr image is the same photo as the hero
};
export const FITR = 15;
export const ZAKAT_OPTIONS: GiveOption[] = [
  { slug: "zakat-where-most-needed", name: "Zakat, Where Most Needed", tag: "Most needed", img: ZAKAT_MEDIA.hero, short: "Distributed to the people who need it most, according to Islamic jurisprudence.", amounts: [250, 500, 1000], custom: true, monthly: true },
  { slug: "zakat-al-fitr", name: "Zakat al-Fitr", tag: "Before Eid", img: ZAKAT_MEDIA.fitr, short: "CAD 15 for each person in your household. It gives a person in need a meal on Eid.", unit: { price: FITR, one: "person", many: "people" } },
  { slug: "gaza-emergency-response", name: "Gaza Emergency Response", tag: "Gaza", img: ER_MEDIA.gaza, short: "Food, baby formula, medical aid and shelter for families in Gaza.", tiers: CRISES[0].items, custom: true },
  { slug: "er-where-most-needed", name: "Emergency Response, Where Most Needed", tag: "Emergencies", img: ER_MEDIA.delivery, short: "Sent to whichever emergency needs help first.", amounts: [250, 500, 750], custom: true, monthly: true },
];
/** The eight who may receive Zakat (Qur'an 9:60). */
export const ASNAF = [
  { ar: "Al-Fuqara", en: "The poor", line: "People with little or nothing to live on." },
  { ar: "Al-Masakin", en: "The needy", line: "People who cannot meet their basic needs." },
  { ar: "Al-Amilin", en: "Those who administer it", line: "The people who collect and deliver Zakat." },
  { ar: "Al-Mu'allafah", en: "Those whose hearts are to be reconciled", line: "New Muslims, and people drawn closer to the community." },
  { ar: "Fir-Riqab", en: "Those in bondage", line: "To free people held captive or enslaved." },
  { ar: "Al-Gharimin", en: "Those in debt", line: "People weighed down by debts they cannot pay." },
  { ar: "Fi Sabilillah", en: "In the cause of Allah", line: "Work for the sake of Allah and the good of the community." },
  { ar: "Ibn as-Sabil", en: "The stranded traveller", line: "Travellers cut off from their means, far from home." },
];
export const ZAKAT_FAQ = [
  { q: "What is Zakat?", a: "Zakat is the third pillar of Islam: an obligatory charity of 2.5% of the wealth you have held for a lunar year, once it is above the nisab. The word means purification and growth." },
  { q: "Who has to pay it?", a: "Every adult Muslim of sound mind whose wealth stays at or above the nisab for one full lunar year (the hawl)." },
  { q: "What is the nisab?", a: "The minimum wealth before Zakat is due. It is the value of 85 grams of gold or 595 grams of silver, so it changes with metal prices. The calculator uses today's rates." },
  { q: "What counts towards it?", a: "Cash and savings, gold and silver, investments and shares, business stock, and money owed to you. Your home, car and personal belongings do not count." },
  { q: "What is Zakat al-Fitr?", a: "A separate, smaller Zakat paid for every member of the household before Eid al-Fitr, so that everyone can celebrate Eid. It is CAD 15 per person." },
  { q: "Can I pay my Zakat monthly?", a: "Yes. Zakat, Where Most Needed can be given monthly, so you can spread your Zakat across the year." },
];
