"use client";

import { Fragment, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CRISES, ER_MEDIA, ER_OPTIONS, GAZA_ITEMS, IMG, MOTHER_TIERS, WINTER_TIERS } from "@/lib/content";
import { Dots, GiftProvider, GiveButton } from "@/components/gift";
import { Footer, Header } from "@/components/sections";
import { Arrow, Lines, PhotoCards, ProgrammeGift, cad } from "@/components/programme";
import { initEmergencyEffects } from "@/lib/emergency-effects";

/* Emergency Response programme page. Concept: "help arrives".
   Through-line: the place stamp. The hero's black box steps through each live
   response (Gaza, Sudan, Syria, Afghanistan, Yemen) while colour sweeps back into
   the photo; the same places become the response list, and Gaza gets its own
   aid package builder. Motion lives in lib/emergency-effects.ts. */
/* eslint-disable @next/next/no-img-element */

type Freq = "once" | "monthly";
const PLACES = CRISES.map((c) => c.place);

function FreqToggle({ v, set, label = "Frequency" }: { v: Freq; set: (f: Freq) => void; label?: string }) {
  return (
    <div className="seg er-freq" data-v={v} role="group" aria-label={label}>
      <i className="seg__pill" />
      <button type="button" aria-pressed={v === "once"} onClick={() => set("once")}>One-time</button>
      <button type="button" aria-pressed={v === "monthly"} onClick={() => set("monthly")}>Monthly</button>
    </div>
  );
}

/* ---------------- hero: colour returns, the place stamp steps through each response ---------------- */
function Hero() {
  return (
    <section className="er-hero" id="top" aria-labelledby="erTitle">
      <div className="er-hero__stage">
        <img className="er-hero__img er-hero__img--grey" src={ER_MEDIA.hero} alt="" aria-hidden="true" />
        <div className="er-hero__colour" id="erColour">
          <img className="er-hero__img" src={ER_MEDIA.hero} alt="Relief tents going up on the sand in Gaza" fetchPriority="high" />
        </div>
        <i className="er-hero__edge" id="erEdge" aria-hidden="true" />
        <div className="er-hero__shade" />
        <div className="er-hero__copy">
          <div className="eyebrow er-hero__eyebrow">Emergency Response</div>
          <h1 id="erTitle" aria-label={`First to help, in ${PLACES.join(", ")}`}>
            <span className="reveal-line" aria-hidden="true"><span>First to help,</span></span>{" "}
            <span className="reveal-line" aria-hidden="true"><span>in <span className="box er-place" id="erPlace">{PLACES[0]}</span></span></span>
          </h1>
          <ol className="er-live" id="erLive" aria-label="Live responses">
            {PLACES.map((p, i) => <li key={p} className={i === 0 ? "is-on" : ""}>{p}</li>)}
          </ol>
          <p className="er-hero__sub">Food, water, shelter and medical care for families caught in war and disaster, delivered by teams on the ground.</p>
          <div className="hero__ctas">
            <a className="btn" href="#responses">See where we&apos;re responding <Dots /></a>
            <GiveButton give="emergency" note="Where Most Needed" className="btn btn--ghost">Give where most needed <Dots /></GiveButton>
          </div>
        </div>
        <div className="gift-dock tgift-dock"><ProgrammeGift title="Respond now" options={ER_OPTIONS} /></div>
        <div className="th-cue er-cue" aria-hidden="true"><i /><span>Scroll</span></div>
      </div>
    </section>
  );
}

/* ---------------- option illustrations: line drawings, picked out in red ---------------- */
const Box = <><path d="M10 24 32 14l22 10v22L32 56 10 46z" /><path d="M10 24l22 10 22-10M32 34v22" /></>;
const ART: Record<string, ReactNode> = {
  "er-where-most-needed": <><circle cx="32" cy="32" r="22" /><path d="M32 6v8M32 50v8M6 32h8M50 32h8" /><circle className="w" cx="32" cy="32" r="7" /></>,
  "gaza-emergency-response": <>{Box}<path className="w" d="M32 30c-4-3-7-5-7-8a3.5 3.5 0 0 1 7-1 3.5 3.5 0 0 1 7 1c0 3-3 5-7 8z" /></>,
  "sudan-emergency-response": <><path d="M6 52 26 14l20 38z" /><path className="w" d="M26 52v-12l-6 12zM26 40l6 12h-6z" /><path d="M44 22l12 30" /></>,
  "syria-emergency-response": <><path d="M8 54V30l12-8 12 8v24M32 54V18l12-8 12 8v36" /><path className="w" d="M14 40h8v14h-8zM38 30h12v6H38z" /></>,
  "afghanistan-earthquake": <><path d="M6 46h12l4-10 6 18 6-26 6 22 4-4h14" /><path className="w" d="M20 22l6-10 6 10z" /></>,
  "yemen-emergency-response": <><path d="M14 22h36v32H14z" /><path d="M24 22v-6a8 8 0 0 1 16 0v6" /><path className="w" d="M24 34h16v10H24z" /></>,
  "expecting-mothers": <><path className="w" d="M30 10a20 20 0 0 1 20 20H30z" /><path d="M30 10v20H10a20 20 0 0 0 40 0M50 30l4-12h6" /><circle cx="18" cy="54" r="4" /><circle cx="42" cy="54" r="4" /></>,
  "international-winter-care-kit": <><path d="M32 6v52M8 19l48 26M8 45l48-26" /><path className="w" d="M32 14l-5-5M32 14l5-5M32 50l-5 5M32 50l5 5" /></>,
};

const WHY = "Each year we respond to dozens of disasters, emergencies and conflicts around the world, so that thousands of people get food, clean water, healthcare and shelter when they need it most.";

/* ---------------- how help arrives: a pinned, illustrated response in four stages ----------------
   One village, drawn in line. Scroll shakes it, drives the relief truck in, raises the camp and
   brings the winter; the copy beside it prices each stage from the live appeals. */
type Cost = { label: string; amount: number; per?: string };
const STAGES: { k: string; title: string; line: string; costs?: Cost[] }[] = [
  { k: "The disaster", title: "Everything goes at once.", line: "An earthquake or a war takes homes, food, water and medical care in a single day. These are the responses live right now." },
  { k: "Help arrives", title: "Food and water move first.", line: "Teams on the ground hand out hot meals, food packs and baby formula while families are still in the open.",
    costs: [{ label: "Hot meals, Afghanistan", amount: 10 }, { label: "Baby formula, Gaza", amount: 20 }, { label: "Hygiene kit, Afghanistan", amount: 35 }, { label: "Feed a family, Gaza", amount: 120 }] },
  { k: "Shelter and care", title: "A roof, and a doctor.", line: "Tents and shelter kits go up, and medical teams treat the injured and the sick.",
    costs: [{ label: "Emergency tent, Afghanistan", amount: 250 }, { label: "Emergency surgeries, Sudan", amount: 300 }, { label: "Medical aid for 2 families, Gaza", amount: 500 }, { label: "Shelter a family of 4, Gaza", amount: 1000 }] },
  { k: "We stay", title: "Long after the headlines.", line: "Mothers still give birth and winter still comes. Monthly gifts keep the help going when the cameras leave.",
    costs: [{ label: "Nutrition for a new mother", amount: 50, per: "/ month" }, { label: "Winter care kit, 1 family", amount: 150 }, { label: "Winter care kits, 2 families", amount: 300 }, { label: "A mother's full care", amount: 500 }] },
];
const KINDS = [
  { kind: "Conflict", places: CRISES.filter((c) => c.slug !== "afghanistan-earthquake").map((c) => c.place) },
  { kind: "Earthquake", places: ["Afghanistan"] },
];

const HOUSES = [770, 868, 966, 1064];
const TENTS = [96, 226, 356];
// deterministic scatter, so the server and client draw the same snow
const SNOW = Array.from({ length: 46 }, (_, i) => ({ x: (i * 263) % 1200, y: (i * 157) % 420, r: 2 + (i % 3), d: (i % 7) * 0.6 }));

// price tags pinned to the drawing, one set per stage
const TAGS = [
  { on: 0, x: 960, y: 250, to: 316, text: "Homes lost", alert: true },
  { on: 1, x: 632, y: 300, to: 372, text: "Feed a family · CAD 120" },
  { on: 1, x: 420, y: 250, to: 350, text: "Hot meals · CAD 10" },
  { on: 2, x: 554, y: 270, to: 346, text: "Surgeries · CAD 300" },
  { on: 2, x: 210, y: 270, to: 352, text: "Emergency tent · CAD 250" },
  { on: 3, x: 960, y: 250, to: 316, text: "Winter kit · CAD 150" },
];

function Scene() {
  return (
    <svg className="scene__svg" viewBox="0 206 1200 304" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle className="sc-sun" cx="1130" cy="262" r="30" />
      <path className="sc-hill" d="M-10 440 120 318l96 70 128-116 176 168z" />
      <path className="sc-hill" d="M540 440 700 296l110 80 150-120 250 170v14z" />
      <path className="sc-quake" id="scQuake" pathLength={1} d="M-10 300h330l12-22 12 44 14-74 16 96 14-64 12 38 10-24 10 12h170l10-14 12 24 12-10h560" />
      <path className="sc-ground" d="M-10 440h1220" />
      <path className="sc-road" d="M-10 474h1220" />
      <path className="sc-crack" id="scCrack" pathLength={1} d="M840 440l16 16-12 18 22 14-8 22 16 14M1050 440l-10 14 14 16-10 20" />

      {HOUSES.map((x, i) => (
        <g key={x} className="sc-house" data-i={i}>
          <rect className="sc-house__wall" x={x} y={364} width={84} height={76} />
          <path className="sc-house__roof" d={`M${x - 10} 366 ${x + 42} 318 ${x + 94} 366z`} />
          <rect className="sc-house__win" x={x + 12} y={384} width={20} height={18} />
          <path d={`M${x + 52} 440v-34h18v34`} />
          <path className="sc-house__crack" d={`M${x + 60} 366l-10 22 12 10-8 22`} />
        </g>
      ))}
      <g id="scDust">
        {[[800, 404, 26], [920, 396, 34], [1010, 410, 24], [1120, 400, 30], [870, 420, 18]].map(([x, y, r]) => <circle key={x} className="sc-dust" cx={x} cy={y} r={r} />)}
      </g>

      <g id="scTents">
        {TENTS.map((x) => (
          <g key={x} className="sc-tent">
            <path className="sc-tent__body" d={`M${x} 440l58-82 58 82z`} />
            <path d={`M${x + 58} 358l-14 82M${x + 58} 358l14 82M${x + 50} 352l8 6 8-6`} />
          </g>
        ))}
        <g className="sc-tent sc-tent--med">
          <path className="sc-tent__body" d="M484 440v-60l70-30 70 30v60z" />
          <path className="sc-cross" d="M546 386h16v12h12v16h-12v12h-16v-12h-12v-16h12z" />
        </g>
      </g>

      <g id="scCrates">
        {[[612, 410], [652, 410], [632, 380]].map(([x, y]) => (
          <g key={`${x}${y}`} className="sc-crate"><rect x={x} y={y} width={36} height={30} /><path d={`M${x} ${y + 10}h36M${x + 18} ${y}v10`} /></g>
        ))}
      </g>
      <g id="scPeople">
        {[[710, 1], [730, 0.8], [746, 0.62]].map(([x, s]) => (
          <g key={x} className="sc-person" transform={`translate(${x} 440) scale(${s})`}>
            <circle cx="0" cy="-62" r="10" /><path d="M-12 0v-30a12 12 0 0 1 24 0v30M-12-28l-6 18M12-28l6 18" />
          </g>
        ))}
      </g>

      <g id="scTruck">
        <path className="sc-truck__box" d="M0 360h150v66H0z" />
        <path className="sc-truck__stripe" d="M0 400h150" />
        <path className="sc-truck__cab" d="M150 380h44l24 26v20h-68z" />
        <path d="M162 386h28l14 16h-42z" />
        <circle className="sc-wheel" cx="40" cy="430" r="13" /><circle className="sc-wheel" cx="186" cy="430" r="13" />
        <path className="sc-cross" d="M66 370h18v10h10v18h-10v10H66v-10H56v-18h10z" />
      </g>

      {TAGS.map((t) => {
        const w = t.text.length * 7.6 + 26;
        return (
          <g key={t.text} className={`sc-tag${t.alert ? " sc-tag--alert" : ""}`} data-on={t.on}>
            <path d={`M${t.x} ${t.y + 15}V${t.to}`} />
            <rect x={t.x - w / 2} y={t.y - 15} width={w} height={30} rx={15} />
            <text x={t.x} y={t.y + 4.5} textAnchor="middle">{t.text}</text>
          </g>
        );
      })}
      <g className="sc-snow">
        {SNOW.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.r} style={{ animationDelay: `${-f.d}s` }} />)}
      </g>
    </svg>
  );
}

const barW = (a: number) => `${Math.round(Math.sqrt(a / 1000) * 100)}%`;
function Arrival() {
  return (
    <section className="arrive" id="arrive" data-phase="0" aria-labelledby="arriveTitle">
      <div className="arrive__stage">
        <div className="arrive__copy">
          <h2 className="arrive__eyebrow" id="arriveTitle">How help arrives</h2>
          <div className="arrive__stages">
            {STAGES.map((s, i) => (
              <article key={s.k} className={`stage${i === 0 ? " is-on" : ""}`} aria-label={`${i + 1}. ${s.k}`}>
                <div className="stage__txt"><span className="stage__k"><b>{String(i + 1).padStart(2, "0")}</b>{s.k}</span><h3>{s.title}</h3><p>{s.line}</p></div>
                {s.costs ? (
                  <ul className="costs">
                    {s.costs.map((c, j) => (
                      <li key={c.label} style={{ "--w": barW(c.amount), "--j": j } as CSSProperties}>
                        <span>{c.label}</span><b>{cad(c.amount)}{c.per && <small> {c.per}</small>}</b><i />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="kinds">
                    {KINDS.map((k) => (
                      <li key={k.kind}>
                        <span>{k.kind}</span>
                        <div>{k.places.map((p) => <em key={p} className={k.kind === "Earthquake" ? "is-quake" : ""}>{p}</em>)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
        <span className="scene__n" id="sceneN" aria-hidden="true">01</span>
        <div className="scene"><div className="scene__cam"><Scene /></div></div>
        <ol className="rail" aria-hidden="true">
          <i className="rail__fill" id="railFill" />
          {STAGES.map((s, i) => <li key={s.k} className={i === 0 ? "is-on" : ""}><b>{String(i + 1).padStart(2, "0")}</b><span>{s.k}</span></li>)}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- the disaster in numbers: where the gifts go, and Sudan at scale ---------------- */
const ORIGIN = { lat: 10.65, lon: -61.5 };
const SPOTS = [
  { place: "Gaza", lat: 31.5, lon: 34.4 }, { place: "Sudan", lat: 15.6, lon: 32.5 }, { place: "Syria", lat: 34.8, lon: 38.9 },
  { place: "Afghanistan", lat: 34.5, lon: 69.2 }, { place: "Yemen", lat: 15.4, lon: 44.2 },
];
// the world map artwork is equirectangular, 1200 × 471, cropped to 56°S–84°N; fitted on Cape Agulhas, India's tip and Panama
const mapXY = (lat: number, lon: number) => ({ x: (560 + 3.329 * lon) / 12, y: (282 - 3.329 * lat) / 4.71 });
const DISPLACED = 123, CHILDREN = 62; // 12.3 million, one dot per 100,000 people; about half are children
function Numbers() {
  const o = mapXY(ORIGIN.lat, ORIGIN.lon);
  const ox = o.x * 12, oy = o.y * 4.71;
  return (
    <section className="nums container" aria-labelledby="numsTitle">
      <h2 className="nums__h" id="numsTitle" data-words>
        {WHY.split(" ").map((w, i) => <Fragment key={i}><span className="w">{w}</span>{" "}</Fragment>)}
      </h2>
      <div className="nums__grid">
        <figure className="flight" id="flight">
          <div className="flight__map">
            <img src={IMG + "impact-world-map.svg"} alt="" aria-hidden="true" />
            <svg viewBox="0 0 1200 471" aria-hidden="true">
              {SPOTS.map((s, i) => {
                const p = mapXY(s.lat, s.lon), x = p.x * 12, y = p.y * 4.71;
                const mx = (ox + x) / 2, my = Math.min(oy, y) - Math.abs(x - ox) * 0.28;
                return <path key={s.place} className="flight__arc" pathLength={1} style={{ "--i": i } as CSSProperties} d={`M${ox} ${oy}Q${mx} ${my} ${x} ${y}`} />;
              })}
            </svg>
            <span className="flight__you" style={{ left: `${o.x}%`, top: `${o.y}%` }}>Your gift</span>
            {SPOTS.map((s, i) => {
              const p = mapXY(s.lat, s.lon);
              return <span key={s.place} className="flight__pin" title={s.place} style={{ left: `${p.x}%`, top: `${p.y}%`, "--i": i } as CSSProperties}>{i + 1}</span>;
            })}
          </div>
          <figcaption className="flight__key">
            {SPOTS.map((s, i) => <span key={s.place}><b>{i + 1}</b>{s.place}</span>)}
          </figcaption>
        </figure>
        <figure className="units" id="units">
          <div className="units__big"><b><span data-count="12.3">12.3</span> million</b><span>people displaced in Sudan, the world&apos;s largest displacement crisis</span></div>
          <div className="units__dots" role="img" aria-label="123 dots, one for every 100,000 displaced people. About half of them are children.">
            {Array.from({ length: DISPLACED }, (_, i) => <i key={i} className={i < CHILDREN ? "is-child" : ""} style={{ "--i": i } as CSSProperties} />)}
          </div>
          <figcaption className="units__key"><span><i />100,000 people</span><span><i className="is-child" />about half are children</span></figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------------- where to respond: photo cards, three quick amounts each ---------------- */
const DIM = new Set(["sudan-emergency-response", "afghanistan-earthquake"]); // dark source photos, lifted a little
const ZAKAT_OK = new Set(["er-where-most-needed", "gaza-emergency-response"]);
function Ways() {
  return (
    <section className="ways container" id="ways" aria-labelledby="waysTitle">
      <div className="ways__head">
        <Lines id="waysTitle" lines={["Where to", <><em>respond</em></>]} />
        <p className="lead">Choose an appeal and an amount. Every gift goes to the crisis you pick.</p>
      </div>
      <PhotoCards options={ER_OPTIONS} give={() => "emergency"} leadCta="Give where most needed" dim={DIM}
        badge={(o) => (ZAKAT_OK.has(o.slug) ? "Zakat eligible" : undefined)} trim={/ ?Zakat eligible\.$/} />
    </section>
  );
}

/* ---------------- live responses: one row per place, photo follows the pointer ---------------- */
function Responses() {
  return (
    <section className="responses" id="responses" aria-labelledby="respTitle">
      <div className="container">
        <div className="responses__head">
          <Lines id="respTitle" lines={["Where we're", "responding now"]} />
          <p className="lead">Every appeal goes to a named crisis. Pick one and give exactly what it needs.</p>
        </div>
        <ol className="crises">
          {CRISES.map((c, i) => (
            <li key={c.slug} className="crisis" data-img={c.img}>
              <span className="crisis__n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="crisis__place">{c.place}</h3>
              <div className="crisis__body">
                <img className="crisis__img" src={c.img} alt="" loading="lazy" />
                <b>{c.title}{c.zakat && <span className="crisis__zakat">Zakat eligible</span>}</b>
                <p>{c.line}</p>
                <div className="crisis__gifts">
                  {c.items.map((t) => (
                    <GiveButton key={t.amount} give="emergency" amt={t.amount} note={`${c.place} Emergency Response${t.label === "Relief" ? "" : `, ${t.label}`}`} className="chipbtn">
                      <b>{cad(t.amount)}</b>{t.label !== "Relief" && <span>{t.label}</span>}
                    </GiveButton>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="peek" id="peek" aria-hidden="true"><img alt="" /></div>
    </section>
  );
}

/* ---------------- Gaza: build an aid package ---------------- */
const ITEM_ART: Record<string, ReactNode> = {
  formula: <><path d="M24 6h16v6H24zM22 12h20l-2 6v34a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V18z" /><path className="w" d="M26 34h12v16H26z" /></>,
  food: Box,
  medical: <><rect x="8" y="18" width="48" height="36" rx="6" /><path d="M24 18v-6h16v6" /><path className="w" d="M28 26h8v8h8v8h-8v8h-8v-8h-8v-8h8z" /></>,
  shelter: <><path d="M6 54 32 12l26 42z" /><path className="w" d="M32 30l-8 24h16z" /></>,
};
function Package() {
  const [q, setQ] = useState<Record<string, number>>({ formula: 0, food: 2, medical: 0, shelter: 0 });
  const [zakat, setZakat] = useState(false);
  const bump = (k: string, d: number) => setQ((s) => ({ ...s, [k]: Math.min(20, Math.max(0, s[k] + d)) }));
  const chosen = GAZA_ITEMS.filter((it) => q[it.k] > 0);
  const total = chosen.reduce((a, it) => a + it.amount * q[it.k], 0);
  const note = `Gaza Emergency Response${zakat ? " (Zakat)" : ""}: ${chosen.map((it) => `${q[it.k]} × ${it.label}`).join(", ")}`;
  return (
    <section className="pack container" aria-labelledby="packTitle">
      <div className="pack__head">
        <Lines id="packTitle" lines={["Pack an aid", <>parcel for <em>Gaza</em></>]} />
        <p className="lead">Choose what goes in. Mix baby formula, food, medical aid and shelter, as much of each as you like, and give it as Sadaqah or Zakat.</p>
      </div>
      <div className="pack__grid">
        <ul className="pack__items">
          {GAZA_ITEMS.map((it) => (
            <li key={it.k} className={`item${q[it.k] ? " is-on" : ""}`}>
              <svg className="item__art" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ITEM_ART[it.k]}</svg>
              <div className="item__txt"><b>{it.label}</b><span>{cad(it.amount)} each</span></div>
              <div className="stepper item__stepper">
                <button type="button" aria-label={`One fewer: ${it.label}`} disabled={q[it.k] <= 0} onClick={() => bump(it.k, -1)}>−</button>
                <output aria-live="polite"><b>{q[it.k]}</b></output>
                <button type="button" aria-label={`One more: ${it.label}`} disabled={q[it.k] >= 20} onClick={() => bump(it.k, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="parcel">
          <div className="parcel__crate" aria-hidden="true">
            {chosen.length === 0 && <span className="parcel__empty">Your parcel is empty</span>}
            {chosen.flatMap((it) => Array.from({ length: Math.min(q[it.k], 8) }, (_, i) => (
              <svg key={`${it.k}${i}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{ITEM_ART[it.k]}</svg>
            )))}
          </div>
          <ul className="parcel__lines">
            {chosen.map((it) => <li key={it.k}><span>{q[it.k]} × {it.label}</span><b>{cad(it.amount * q[it.k])}</b></li>)}
          </ul>
          <div className="seg er-freq parcel__type" data-v={zakat ? "monthly" : "once"} role="group" aria-label="Give as">
            <i className="seg__pill" />
            <button type="button" aria-pressed={!zakat} onClick={() => setZakat(false)}>Sadaqah</button>
            <button type="button" aria-pressed={zakat} onClick={() => setZakat(true)}>Zakat</button>
          </div>
          <div className="parcel__total"><span>Total</span><b><small>CAD</small>{total.toLocaleString("en-CA")}</b></div>
          <GiveButton give={zakat ? "zakat" : "emergency"} amt={total || undefined} note={note} disabled={!total}>Send this parcel <Dots /></GiveButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- mothers and winter: two panels ---------------- */
function Mothers() {
  const [i, setI] = useState(1);
  const [freq, setFreq] = useState<Freq>("once");
  const t = MOTHER_TIERS[i];
  return (
    <article className="care care--mothers" aria-labelledby="cMothers">
      <svg className="care__art" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ART["expecting-mothers"]}</svg>
      <span className="care__tag">Expecting mothers</span>
      <h3 id="cMothers">A safe birth, in the middle of a crisis</h3>
      <p>Care for mothers through pregnancy, childbirth and the weeks after, for a healthier start for their children.</p>
      <div className="care__opts" role="radiogroup" aria-label="Expecting mothers: choose a gift">
        {MOTHER_TIERS.map((m, k) => (
          <button key={m.label} type="button" role="radio" aria-checked={k === i} onClick={() => setI(k)}><b>{cad(m.amount)}</b><span>{m.label}</span></button>
        ))}
      </div>
      <p className="care__what">{t.text}</p>
      <div className="care__foot">
        <FreqToggle v={freq} set={setFreq} label="Expecting mothers: frequency" />
        <GiveButton give="emergency" amt={t.amount} freq={freq} note={`Expecting Mothers, ${t.label}`}>Give {cad(t.amount)}{freq === "monthly" ? " / month" : ""} <Dots /></GiveButton>
      </div>
    </article>
  );
}
function Winter() {
  const [i, setI] = useState(0);
  const [freq, setFreq] = useState<Freq>("once");
  const t = WINTER_TIERS[i];
  return (
    <article className="care care--winter" aria-labelledby="cWinter">
      <svg className="care__art" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ART["international-winter-care-kit"]}</svg>
      <span className="care__tag">Winter care kits</span>
      <h3 id="cWinter">Get a family through the winter</h3>
      <p>Warm clothes, blankets and essentials for displaced families facing the cold without a proper home.</p>
      <div className="care__opts care__opts--3" role="radiogroup" aria-label="Winter care kits: how many families">
        {WINTER_TIERS.map((w, k) => (
          <button key={w.label} type="button" role="radio" aria-checked={k === i} onClick={() => setI(k)}><b>{cad(w.amount)}</b><span>{w.label}</span></button>
        ))}
      </div>
      <p className="care__what">A winter care kit for {t.label}.</p>
      <div className="care__foot">
        <FreqToggle v={freq} set={setFreq} label="Winter care kits: frequency" />
        <GiveButton give="emergency" amt={t.amount} freq={freq} note={`Winter Care Kit, ${t.label}`}>Give {cad(t.amount)}{freq === "monthly" ? " / month" : ""} <Dots /></GiveButton>
      </div>
    </article>
  );
}
function Care() {
  return (
    <section className="cares container" aria-labelledby="caresTitle">
      <Lines id="caresTitle" className="h2 cares__h" lines={["Beyond the headlines:", <>care that <em>can&apos;t wait</em></>]} />
      <div className="cares__grid"><Mothers /><Winter /></div>
    </section>
  );
}

/* ---------------- closing band: where most needed ---------------- */
const READY = [250, 500, 750];
function Ready() {
  const [amt, setAmt] = useState(READY[0]);
  const [freq, setFreq] = useState<Freq>("monthly");
  return (
    <section className="ready container" aria-labelledby="readyTitle">
      <div className="ready__copy">
        <Lines id="readyTitle" className="h2 ready__h" lines={["Be there for", "the next one."]} />
        <p>Where Most Needed lets us send help to whichever emergency needs it first, including the ones that haven&apos;t happened yet. It&apos;s Zakat eligible.</p>
      </div>
      <div className="ready__form">
        <FreqToggle v={freq} set={setFreq} label="Where Most Needed: frequency" />
        <div className="ready__amts" role="group" aria-label="Amount (CAD)">
          {READY.map((a) => <button key={a} type="button" aria-pressed={a === amt} onClick={() => setAmt(a)}>{a}</button>)}
        </div>
        <GiveButton give="emergency" amt={amt} freq={freq} note="Where Most Needed" className="btn btn--white">Give {cad(amt)}{freq === "monthly" ? " / month" : ""} <Dots /></GiveButton>
        <GiveButton give="zakat" freq="once" note="Emergency Response, Where Most Needed" className="ready__zakat">Pay Zakat to Emergency Response <Arrow /></GiveButton>
      </div>
    </section>
  );
}

export default function EmergencySite() {
  useEffect(() => initEmergencyEffects(), []);
  return (
    <GiftProvider>
      <a className="skip" href="#main">Skip to content</a>
      <Header base="/" />
      <main id="main" className="er">
        <Hero />
        <Numbers />
        <Ways />
        <Arrival />
        <Responses />
        <Package />
        <Care />
        <Ready />
      </main>
      <Footer />
    </GiftProvider>
  );
}
