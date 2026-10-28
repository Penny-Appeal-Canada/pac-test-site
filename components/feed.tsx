"use client";

import { Fragment, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AQIQA, FAMILY_TIERS, FEED_MEDIA, FEED_OPTIONS, FIDYA_DAY, FITR_PRICE, KAFFARAH, LIVELIHOOD_AMOUNTS, type GiveOption } from "@/lib/content";
import { Dots, GiftProvider, GiveButton } from "@/components/gift";
import { Footer, Header } from "@/components/sections";
import { Lines, OptionBlocks, ProgrammeGift, cad } from "@/components/programme";
import { initFeedEffects } from "@/lib/feed-effects";

/* Feed Our World programme page. Concept: "a month on the table".
   Through-line: the day cell. Thirty of them fill over the hero as the headline
   counts to a month; they return as the families in the tiers, the fast days you
   tap in the Fidya calculator, and the months in the closing band.
   Motion lives in lib/feed-effects.ts; this file only owns markup and state. */
/* eslint-disable @next/next/no-img-element */

type Freq = "once" | "monthly";
const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

function FreqToggle({ v, set, label = "Frequency" }: { v: Freq; set: (f: Freq) => void; label?: string }) {
  return (
    <div className="seg fw-freq" data-v={v} role="group" aria-label={label}>
      <i className="seg__pill" />
      <button type="button" aria-pressed={v === "once"} onClick={() => set("once")}>One-time</button>
      <button type="button" aria-pressed={v === "monthly"} onClick={() => set("monthly")}>Monthly</button>
    </div>
  );
}

/* ---------------- hero: thirty days fill as you scroll ---------------- */
function Hero() {
  return (
    <section className="fw-hero" id="top" aria-labelledby="fwTitle">
      <div className="fw-hero__stage">
        <img className="fw-hero__img" src={FEED_MEDIA.hero} alt="Children laughing together outdoors" fetchPriority="high" />
        <div className="days" id="days" aria-hidden="true">
          {DAYS.map((d) => <span key={d} className={d === 1 ? "is-on" : ""}><i>{d}</i></span>)}
        </div>
        <div className="fw-hero__shade" />
        <div className="fw-hero__copy">
          <div className="eyebrow fw-hero__eyebrow">Feed Our World</div>
          <h1 id="fwTitle" aria-label="Feed a family for a month">
            <span className="reveal-line" aria-hidden="true"><span>Feed a family</span></span>{" "}
            <span className="reveal-line" aria-hidden="true"><span>for <span className="box fw-count" id="fwCount">1 day</span></span></span>
          </h1>
          <p className="fw-hero__sub">CAD 120 puts food on one family&apos;s table for a whole month.</p>
          <div className="hero__ctas">
            <a className="btn" href="#ways">See the ways to give <Dots /></a>
            <GiveButton give="feed" amt={120} freq="monthly" note="Where Most Needed, 1 family for a month" className="btn btn--ghost">Feed a family monthly <Dots /></GiveButton>
          </div>
        </div>
        <div className="gift-dock tgift-dock"><ProgrammeGift title="Give food" options={FEED_OPTIONS} /></div>
        <div className="th-cue fw-cue" aria-hidden="true"><i /><span>Scroll to fill the month</span></div>
      </div>
    </section>
  );
}

/* ---------------- option illustrations: line drawings, food picked out in pink ---------------- */
const ART: Record<string, ReactNode> = {
  "fow-where-most-needed": <>
    <path d="M8 30h48a24 24 0 0 1-48 0z" /><path d="M14 54h36" />
    <path className="w" d="M18 30c2-8 8-12 14-12s12 4 14 12z" /><path d="M24 12c0-3 3-3 3-6M32 12c0-3 3-3 3-6M40 12c0-3 3-3 3-6" />
  </>,
  "support-the-livelihood-of-refugee-women": <>
    <path d="M8 22h48l-4-10H12z" /><path className="w" d="M8 22c0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0z" />
    <path d="M12 26v28M52 26v28M8 54h48M16 40h32v6H16z" /><circle cx="22" cy="36" r="3" /><circle cx="32" cy="36" r="3" /><circle cx="42" cy="36" r="3" />
  </>,
  "support-livelihood-of-farmers": <>
    <path d="M32 56V22" /><path className="w" d="M32 30c-8 0-12-6-12-12 8 0 12 6 12 12zM32 38c8 0 12-6 12-12-8 0-12 6-12 12zM32 46c-8 0-12-6-12-12 8 0 12 6 12 12z" />
    <path d="M10 56h44" /><path d="M32 22c-2-4-1-10 0-14 1 4 2 10 0 14z" />
  </>,
  "zakat-al-fitr": <>
    <path d="M44 10a18 18 0 1 0 6 26 14 14 0 1 1-6-26z" /><path className="w" d="M18 44h28v10H18z" /><path d="M14 44h36M22 44v-4h20v4" />
  </>,
  fidyakaffarah: <>
    <rect x="8" y="12" width="48" height="42" rx="5" /><path d="M8 24h48M20 8v8M44 8v8" />
    <path className="w" d="M15 30h8v7h-8zM28 30h8v7h-8z" /><path d="M41 30h8v7h-8zM15 42h8v7h-8zM28 42h8v7h-8zM41 42h8v7h-8z" opacity=".45" />
  </>,
  aqiqa: <>
    <path d="M14 34a18 14 0 0 1 36 0v4H14z" /><circle cx="32" cy="20" r="7" /><path d="M10 46h44" />
    <path className="w" d="M26 50c0-4 3-6 6-6s6 2 6 6c0 3-3 5-6 5s-6-2-6-5z" />
  </>,
};

/* ---------------- why: scrubbed statement, figures, ways to give ---------------- */
const WHY = "Feed Our World puts nutritious meals on the tables of families in crisis-hit countries across Asia, Africa and the Middle East. A month of food for one family costs CAD 120. And when farmers can harvest and women can earn again, the meals keep coming.";
function Why() {
  return (
    <section className="th-why fw-why container" id="ways" aria-label="Why Feed Our World, and ways to give">
      <p className="th-why__words" data-words>
        {WHY.split(" ").map((w, i) => <Fragment key={i}><span className="w">{w}</span>{" "}</Fragment>)}
      </p>
      <dl className="th-figs">
        <div><dt>feeds one family for a whole month</dt><dd><small>CAD</small><span data-count="120">120</span></dd></div>
        <div><dt>families fed for a month with CAD 1,200</dt><dd><span data-count="10">10</span></dd></div>
        <div><dt>gives a person in need a meal on Eid, as Zakat al-Fitr</dt><dd><small>CAD</small><span data-count="15">15</span></dd></div>
      </dl>
      <OptionBlocks title="Ways to give food" give="feed" options={FEED_OPTIONS} art={ART} />
    </section>
  );
}

/* ---------------- a month of meals: photo + 1 / 5 / 10 families ---------------- */
function Family() {
  return (
    <svg className="fam" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="7" cy="6" r="2.6" /><circle cx="17" cy="6" r="2.6" /><circle cx="12" cy="12" r="2" />
      <path d="M2.5 22v-6.5A4.5 4.5 0 0 1 7 11a4.5 4.5 0 0 1 3 1.2A3.6 3.6 0 0 0 9 15v7zM21.5 22v-6.5A4.5 4.5 0 0 0 17 11a4.5 4.5 0 0 0-3 1.2 3.6 3.6 0 0 1 1 2.8v7zM9.6 22v-6.4a2.4 2.4 0 0 1 4.8 0V22z" />
    </svg>
  );
}
function Table() {
  const [freq, setFreq] = useState<Freq>("once");
  return (
    <section className="table container" aria-labelledby="tableTitle">
      <figure className="table__photo">
        <img src={FEED_MEDIA.meal} alt="A mother serving a meal to her children at a table on a balcony" loading="lazy" />
      </figure>
      <div className="table__copy">
        <Lines id="tableTitle" lines={["A month of meals,", "for one family or ten"]} />
        <p className="lead">Where Most Needed sends food to the families who need it most right now. Give once, or keep their table full every month.</p>
        <FreqToggle v={freq} set={setFreq} />
        <div className="tiers">
          {FAMILY_TIERS.map((t, i) => {
            const n = parseInt(t.label, 10);
            return (
              <div key={t.label} className={`tier${i === 1 ? " tier--feature" : ""}`}>
                <div className="tier__fams" data-n={n}>{Array.from({ length: n }, (_, k) => <Family key={k} />)}</div>
                <b className="tier__n">{n} {n === 1 ? "family" : "families"}</b>
                <span className="tier__for">fed for a month{freq === "monthly" ? ", every month" : ""}</span>
                <span className="tier__price"><small>CAD</small>{t.amount.toLocaleString("en-CA")}{freq === "monthly" && <small className="tier__per">/mo</small>}</span>
                <GiveButton give="feed" amt={t.amount} freq={freq} note={`Where Most Needed, ${t.label} for a month`} className={`btn btn--sm${i === 1 ? "" : " btn--ink"}`}>Give <Dots /></GiveButton>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- livelihoods: two illustrated panels ---------------- */
function LivePanel({ o, tone }: { o: GiveOption; tone: "pink" | "green" }) {
  const [amt, setAmt] = useState(LIVELIHOOD_AMOUNTS[1]);
  const [freq, setFreq] = useState<Freq>("once");
  return (
    <article className={`live live--${tone}`} aria-labelledby={`l-${o.slug}`}>
      <svg className="live__art" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ART[o.slug]}</svg>
      <span className="live__tag">{o.tag}</span>
      <h3 id={`l-${o.slug}`}>{o.name.replace("Support Livelihood of ", "")}</h3>
      <p>{o.short}</p>
      <div className="live__form">
        <FreqToggle v={freq} set={setFreq} label={`${o.tag}: frequency`} />
        <div className="live__amts" role="group" aria-label={`${o.tag}: amount (CAD)`}>
          {LIVELIHOOD_AMOUNTS.map((a) => <button key={a} type="button" aria-pressed={a === amt} onClick={() => setAmt(a)}>{a}</button>)}
        </div>
        <GiveButton give="feed" amt={amt} freq={freq} note={o.name}>Give {cad(amt)}{freq === "monthly" ? " / month" : ""} <Dots /></GiveButton>
      </div>
    </article>
  );
}
function Livelihoods() {
  return (
    <section className="lives container" aria-labelledby="livesTitle">
      <Lines id="livesTitle" className="h2 lives__h" lines={["Food for today.", <>A <em>living</em> for tomorrow.</>]} />
      <div className="lives__grid">
        <LivePanel o={FEED_OPTIONS[1]} tone="pink" />
        <LivePanel o={FEED_OPTIONS[2]} tone="green" />
      </div>
    </section>
  );
}

/* ---------------- duties: Zakat al-Fitr, Fidya, Kaffarah, Aqiqa calculator ---------------- */
const TABS = ["Zakat al-Fitr", "Fidya", "Kaffarah", "Aqiqa"] as const;
type Tab = (typeof TABS)[number];
function Duties() {
  const [tab, setTab] = useState<Tab>("Zakat al-Fitr");
  const [people, setPeople] = useState(4);
  const [days, setDays] = useState<Set<number>>(() => new Set([1, 2, 3]));
  const [kType, setKType] = useState<"oath" | "fast">("oath");
  const [fasts, setFasts] = useState(1);
  const [aq, setAq] = useState(0);
  const [child, setChild] = useState("");

  const toggleDay = (d: number) => setDays((s) => { const n = new Set(s); if (n.has(d)) n.delete(d); else n.add(d); return n; });
  let total = 0, note = "", give = "feed", sub: ReactNode = null;
  if (tab === "Zakat al-Fitr") {
    total = people * FITR_PRICE; give = "zakat";
    note = `Zakat al-Fitr, ${people} ${people === 1 ? "person" : "people"}`;
    sub = `${people} × ${cad(FITR_PRICE)}`;
  } else if (tab === "Fidya") {
    total = days.size * FIDYA_DAY;
    note = `Fidya, ${days.size} ${days.size === 1 ? "day" : "days"}`;
    sub = `${days.size} ${days.size === 1 ? "day" : "days"} × ${cad(FIDYA_DAY)}`;
  } else if (tab === "Kaffarah") {
    total = kType === "oath" ? KAFFARAH.oath : fasts * KAFFARAH.fast;
    note = kType === "oath" ? "Kaffarah, broken oath" : `Kaffarah, ${fasts} broken ${fasts === 1 ? "fast" : "fasts"}`;
    sub = kType === "oath" ? "One broken oath" : `${fasts} × ${cad(KAFFARAH.fast)}`;
  } else {
    total = AQIQA[aq].amount;
    note = `Aqiqa, ${AQIQA[aq].label}${child.trim() ? `, for ${child.trim()}` : ""}`;
    sub = AQIQA[aq].label;
  }

  return (
    <section className="duties" id="duties" aria-labelledby="dutiesTitle">
      <div className="container">
        <div className="duties__head">
          <Lines id="dutiesTitle" lines={["Your duties,", "fulfilled as food"]} />
          <p className="lead">Zakat al-Fitr, Fidya, Kaffarah and Aqiqa all reach people in need through Feed Our World. Work out what you owe, then give it in one step.</p>
        </div>
        <div className="calc">
          <div className="calc__tabs" role="tablist" aria-label="Choose what to calculate">
            {TABS.map((t) => (
              <button key={t} type="button" role="tab" id={`tab-${t}`} aria-selected={t === tab} aria-controls="calcPanel" onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <div className="calc__panel" id="calcPanel" role="tabpanel" aria-labelledby={`tab-${tab}`} key={tab}>
            {tab === "Zakat al-Fitr" && (
              <>
                <p className="calc__lead">Pay before Eid. Each payment provides a meal to a person in need on Eid. Count everyone in your household, CAD {FITR_PRICE} per person.</p>
                <div className="people" aria-hidden="true">
                  {Array.from({ length: 20 }, (_, i) => (
                    <svg key={i} className={i < people ? "is-on" : ""} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="4" /><path d="M4 22a8 8 0 0 1 16 0z" /></svg>
                  ))}
                </div>
                <div className="stepper calc__stepper">
                  <button type="button" aria-label="One fewer person" disabled={people <= 1} onClick={() => setPeople(people - 1)}>−</button>
                  <output aria-live="polite"><b>{people}</b> {people === 1 ? "person" : "people"}</output>
                  <button type="button" aria-label="One more person" disabled={people >= 20} onClick={() => setPeople(people + 1)}>+</button>
                </div>
              </>
            )}
            {tab === "Fidya" && (
              <>
                <p className="calc__lead">For a fast missed with a valid reason: CAD {FIDYA_DAY} for each day. Tap the days you missed.</p>
                <div className="fdays" role="group" aria-label="Days of Ramadan missed">
                  {DAYS.map((d) => <button key={d} type="button" aria-pressed={days.has(d)} aria-label={`Day ${d}`} onClick={() => toggleDay(d)}>{d}</button>)}
                </div>
                <div className="calc__quick">
                  <button type="button" onClick={() => setDays(new Set(DAYS))}>All 30 days</button>
                  <button type="button" onClick={() => setDays(new Set())}>Clear</button>
                </div>
              </>
            )}
            {tab === "Kaffarah" && (
              <>
                <p className="calc__lead">For breaking an oath, or breaking a fast without a valid reason.</p>
                <div className="choice" role="radiogroup" aria-label="Kaffarah for">
                  <button type="button" role="radio" aria-checked={kType === "oath"} onClick={() => setKType("oath")}><b>A broken oath</b><span>{cad(KAFFARAH.oath)}</span></button>
                  <button type="button" role="radio" aria-checked={kType === "fast"} onClick={() => setKType("fast")}><b>A broken fast</b><span>{cad(KAFFARAH.fast)} per fast</span></button>
                </div>
                {kType === "fast" && (
                  <div className="stepper calc__stepper">
                    <button type="button" aria-label="One fewer fast" disabled={fasts <= 1} onClick={() => setFasts(fasts - 1)}>−</button>
                    <output aria-live="polite"><b>{fasts}</b> {fasts === 1 ? "fast" : "fasts"}</output>
                    <button type="button" aria-label="One more fast" disabled={fasts >= 30} onClick={() => setFasts(fasts + 1)}>+</button>
                  </div>
                )}
              </>
            )}
            {tab === "Aqiqa" && (
              <>
                <p className="calc__lead">The sacrifice of livestock, such as a goat or sheep, at the birth of a child: a Sunnah of the Prophet Muhammad (peace be upon him).</p>
                <div className="choice choice--3" role="radiogroup" aria-label="Aqiqa for">
                  {AQIQA.map((a, i) => (
                    <button key={a.label} type="button" role="radio" aria-checked={aq === i} onClick={() => setAq(i)}><b>{a.label}</b><span>{cad(a.amount)}</span><small>{a.text}</small></button>
                  ))}
                </div>
                <label className="field calc__name"><span>Child&apos;s name (optional)</span>
                  <input className="input" value={child} maxLength={40} onChange={(e) => setChild(e.target.value)} placeholder="e.g. Yusuf" />
                </label>
              </>
            )}
          </div>
          <div className="calc__total">
            <span>{tab}</span>
            <b><small>CAD</small>{total.toLocaleString("en-CA")}</b>
            <span className="calc__sub">{sub}</span>
            <GiveButton give={give} amt={total || undefined} note={note} disabled={!total}>Give {cad(total)} <Dots /></GiveButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- closing band: twelve months, filled ---------------- */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function Monthly() {
  return (
    <section className="monthly container" aria-labelledby="monthlyTitle">
      <div className="months" id="months" aria-hidden="true">{MONTHS.map((m, i) => <span key={m} style={{ ["--i" as string]: i }}>{m}</span>)}</div>
      <Lines id="monthlyTitle" className="h2 monthly__h" lines={["Keep a family fed,", "every month of the year."]} />
      <p>CAD 120 a month keeps one family&apos;s table full. Set it up once, and it gives every month.</p>
      <GiveButton give="feed" amt={120} freq="monthly" note="Where Most Needed, 1 family for a month" className="btn btn--white">Give CAD 120 a month <Dots /></GiveButton>
    </section>
  );
}

export default function FeedSite() {
  useEffect(() => initFeedEffects(), []);
  return (
    <GiftProvider>
      <a className="skip" href="#main">Skip to content</a>
      <Header base="/" />
      <main id="main" className="fw">
        <Hero />
        <Why />
        <Table />
        <Livelihoods />
        <Duties />
        <Monthly />
      </main>
      <Footer />
    </GiftProvider>
  );
}
