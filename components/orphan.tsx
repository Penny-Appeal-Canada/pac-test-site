"use client";

import { Fragment, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ORPHAN_MEDIA, ORPHAN_NEEDS, ORPHAN_OPTIONS, SPONSOR_MONTH, SPONSOR_PLACES, SPONSOR_YEAR } from "@/lib/content";
import { Dots, GiftProvider, GiveButton } from "@/components/gift";
import { Footer, Header } from "@/components/sections";
import { Lines, OptionBlocks, ProgrammeGift, cad } from "@/components/programme";
import { initOrphanEffects } from "@/lib/orphan-effects";

/* OrphanKind programme page. Concept: "a year of growing up, one month at a time".
   Through-line: the year ring. Twelve arcs fill over the hero as CAD 70 a month
   adds up to CAD 840, a whole year; the ring returns in the sponsor builder and
   the closing band. Motion lives in lib/orphan-effects.ts. */
/* eslint-disable @next/next/no-img-element */

const MONTHS = Array.from({ length: 12 }, (_, i) => i);

/** Twelve arcs, one per month. `on` fills the first n; the effects file can drive it instead. */
function Ring({ on = 0, id, className = "" }: { on?: number; id?: string; className?: string }) {
  const r = 44, c = 2 * Math.PI * r, seg = c / 12;
  return (
    <svg className={`ring ${className}`} id={id} viewBox="0 0 100 100" aria-hidden="true">
      {MONTHS.map((m) => (
        <circle key={m} cx="50" cy="50" r={r} className={m < on ? "is-on" : ""} style={{ ["--i" as string]: m }} strokeDasharray={`${seg - 2.2} ${c - seg + 2.2}`} strokeDashoffset={-seg * m} transform="rotate(-90 50 50)" />
      ))}
    </svg>
  );
}

/* ---------------- hero: a year fills as you scroll ---------------- */
function Hero() {
  return (
    <section className="ok-hero" id="top" aria-labelledby="okTitle">
      <div className="ok-hero__stage">
        <img className="ok-hero__img" src={ORPHAN_MEDIA.hero} alt="Girls laughing and waving outside their school" fetchPriority="high" />
        <div className="ok-hero__shade" />
        <div className="ok-hero__copy">
          <div className="eyebrow ok-hero__eyebrow">OrphanKind</div>
          <h1 id="okTitle">
            <span className="reveal-line"><span>Be there for</span></span>{" "}
            <span className="reveal-line"><span>a child, <span className="box">every month</span></span></span>
          </h1>
          <div className="ok-year">
            <div className="ok-year__dial">
              <Ring on={1} id="okRing" />
              <div className="ok-year__read" aria-hidden="true"><b id="okSum">CAD 70</b><span id="okMonths">1 month</span></div>
            </div>
            <p className="ok-hero__sub">CAD 70 a month gives an orphan school, meals, clothes, healthcare and care. Twelve months is a year of childhood.</p>
          </div>
          <div className="hero__ctas">
            <a className="btn" href="#sponsor">Sponsor a child <Dots /></a>
            <a className="btn btn--ghost" href="#ways">See the ways to give <Dots /></a>
          </div>
        </div>
        <div className="gift-dock tgift-dock"><ProgrammeGift title="Sponsor an orphan" options={ORPHAN_OPTIONS} /></div>
        <div className="th-cue ok-cue" aria-hidden="true"><i /><span>Scroll through the year</span></div>
      </div>
    </section>
  );
}

/* ---------------- option illustrations: line drawings, picked out in orange ---------------- */
/** A year: the twelve-month ring around a child. */
const YearArt = () => <>
  <circle className="w" cx="32" cy="32" r="26" style={{ fill: "none" }} strokeWidth="5" strokeDasharray="11.6 2" />
  <circle cx="32" cy="25" r="5" /><path d="M23 45v-6a9 9 0 0 1 18 0v6" />
</>;
const ART: Record<string, ReactNode> = {
  "sponsor-an-orphan-for-a-month-pakistan": <>
    <rect x="8" y="12" width="48" height="42" rx="5" /><path d="M8 24h48M20 8v8M44 8v8" />
    <path className="w" d="M32 47c-6-4-10-7-10-11a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-4 7-10 11z" />
  </>,
  "sponsor-an-orphan-for-a-month-palestine": <>
    <path d="M10 30 32 12l22 18" /><path d="M16 26v28h32V26" />
    <path className="w" d="M32 47c-6-4-10-7-10-11a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 4-4 7-10 11z" />
  </>,
  "orphan-kind-pakistan": <YearArt />,
  "orphan-kind-palestine": <YearArt />,
  "ok-where-most-needed": <>
    <path d="M14 54V38a8 8 0 0 1 16 0v16M34 54V38a8 8 0 0 1 16 0v16" /><circle cx="22" cy="22" r="6" /><circle cx="42" cy="22" r="6" />
    <path className="w" d="M32 16c-3-2-5-3.6-5-5.6a2.6 2.6 0 0 1 5-.5 2.6 2.6 0 0 1 5 .5c0 2-2 3.6-5 5.6z" />
  </>,
};
const NEED_ART: Record<string, ReactNode> = {
  school: <><path d="M8 24 32 12l24 12-24 12z" /><path className="w" d="M18 30v12c8 6 20 6 28 0V30l-14 6z" /><path d="M56 24v14" /></>,
  meals: <><path d="M8 30h48a24 24 0 0 1-48 0z" /><path d="M14 54h36" /><path className="w" d="M18 30c2-8 8-12 14-12s12 4 14 12z" /></>,
  clothes: <><path d="M22 10 10 18l6 10 6-4v30h20V24l6 4 6-10-12-8c-2 4-6 6-10 6s-8-2-10-6z" /><path className="w" d="M26 36h12v6H26z" /></>,
  health: <><rect x="10" y="16" width="44" height="38" rx="6" /><path d="M24 16v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" /><path className="w" d="M28 26h8v8h8v8h-8v8h-8v-8h-8v-8h8z" /></>,
  play: <><circle cx="32" cy="32" r="22" /><path className="w" d="M32 22l9 6-3 11H26l-3-11z" /><path d="M32 10v12M41 28l12-6M38 39l8 10M26 39l-8 10M23 28l-12-6" /></>,
  care: <><path d="M32 54C18 44 8 36 8 25a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 11-10 19-24 29z" /><path className="w" d="M32 44c-8-6-13-10-13-16a6 6 0 0 1 13-2 6 6 0 0 1 13 2c0 6-5 10-13 16z" /></>,
};

/* ---------------- why: scrubbed statement, figures, ways to give ---------------- */
const WHY = "When a child loses a parent, they can lose everything that comes with a childhood: school, food, warm clothes, a doctor when they fall ill. OrphanKind sponsors give all of it back, every month, for CAD 70.";
function Why() {
  return (
    <section className="th-why ok-why container" id="ways" aria-label="Why OrphanKind, and ways to give">
      <p className="th-why__words" data-words>
        {WHY.split(" ").map((w, i) => <Fragment key={i}><span className="w">{w}</span>{" "}</Fragment>)}
      </p>
      <dl className="th-figs">
        <div><dt>sponsors an orphan for one month</dt><dd><small>CAD</small><span data-count="70">70</span></dd></div>
        <div><dt>sponsors an orphan for a whole year</dt><dd><small>CAD</small><span data-count="840">840</span></dd></div>
        <div><dt>things every sponsorship provides: school, meals, clothes, healthcare, play and care</dt><dd><span data-count="6">6</span></dd></div>
      </dl>
      <OptionBlocks title="Ways to sponsor" give="orphan" options={ORPHAN_OPTIONS} art={ART} />
    </section>
  );
}

/* ---------------- what CAD 70 covers: sticky portrait + six needs ---------------- */
function Needs() {
  return (
    <section className="needs container" aria-labelledby="needsTitle">
      <div className="needs__aside">
        <figure className="needs__photo">
          <img src={ORPHAN_MEDIA.portrait} alt="A young child in a knitted hat looking out through a window" loading="lazy" />
          <figcaption><Ring className="ring--sm" on={12} /><span><b>CAD 70</b> a month, for one child</span></figcaption>
        </figure>
      </div>
      <div className="needs__list">
        <Lines id="needsTitle" lines={["What a", <>sponsorship <em>gives</em></>]} />
        <p className="lead">A safe, supportive community for each child, with the everyday things that let them grow up well.</p>
        <ol>
          {ORPHAN_NEEDS.map((n, i) => (
            <li key={n.k} className="need">
              <svg className="need__art" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{NEED_ART[n.k]}</svg>
              <span className="need__n">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{n.name}</h3><p>{n.line}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- sponsor builder: where, how, how many ---------------- */
type Plan = "month" | "year";
function Sponsor() {
  const [place, setPlace] = useState<(typeof SPONSOR_PLACES)[number]>("Pakistan");
  const [plan, setPlan] = useState<Plan>("month");
  const [n, setN] = useState(1);
  const each = plan === "month" ? SPONSOR_MONTH : SPONSOR_YEAR;
  const total = each * n;
  const kids = `${n} ${n === 1 ? "orphan" : "orphans"}`;
  const note = plan === "month" ? `Monthly Sponsorship (${place}), ${kids}` : `Sponsor an Orphan for a Year (${place}), ${kids}`;
  return (
    <section className="sponsor" id="sponsor" aria-labelledby="sponsorTitle">
      <div className="container">
        <div className="sponsor__head">
          <Lines id="sponsorTitle" lines={["Sponsor a child,", "your way"]} />
          <p className="lead">Choose where your sponsorship goes and how you&apos;d like to give. Monthly or all at once, it&apos;s the same year of care: CAD 840 for each child.</p>
        </div>
        <div className="sp">
          <div className="sp__form">
            <div className="sp__step">
              <span className="sp__label">1. Where</span>
              <div className="sp__choice" role="radiogroup" aria-label="Where to sponsor">
                {SPONSOR_PLACES.map((p) => <button key={p} type="button" role="radio" aria-checked={p === place} onClick={() => setPlace(p)}><b>{p}</b></button>)}
              </div>
            </div>
            <div className="sp__step">
              <span className="sp__label">2. How</span>
              <div className="sp__choice" role="radiogroup" aria-label="How to give">
                <button type="button" role="radio" aria-checked={plan === "month"} onClick={() => setPlan("month")}><b>Every month</b><span>{cad(SPONSOR_MONTH)} a month</span></button>
                <button type="button" role="radio" aria-checked={plan === "year"} onClick={() => setPlan("year")}><b>A year, upfront</b><span>{cad(SPONSOR_YEAR)} once</span></button>
              </div>
            </div>
            <div className="sp__step">
              <span className="sp__label">3. How many children</span>
              <div className="sp__kids" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <svg key={i} className={i < n ? "is-on" : ""} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6.5" r="3.6" /><path d="M6 22v-6a6 6 0 0 1 12 0v6z" /></svg>
                ))}
              </div>
              <div className="stepper sp__stepper">
                <button type="button" aria-label="One fewer child" disabled={n <= 1} onClick={() => setN(n - 1)}>−</button>
                <output aria-live="polite"><b>{n}</b> {n === 1 ? "child" : "children"}</output>
                <button type="button" aria-label="One more child" disabled={n >= 10} onClick={() => setN(n + 1)}>+</button>
              </div>
            </div>
          </div>
          <div className="sp__total">
            <div className="sp__dial">
              <Ring on={plan === "year" ? 12 : 1} className={plan === "year" ? "is-year" : ""} />
              <div><b>{plan === "year" ? "12" : "1"}</b><span>{plan === "year" ? "months, paid" : "month at a time"}</span></div>
            </div>
            <span className="sp__for">{kids} in {place}</span>
            <b className="sp__sum"><small>CAD</small>{total.toLocaleString("en-CA")}{plan === "month" && <small className="sp__per">/mo</small>}</b>
            <span className="sp__sub">{plan === "month" ? `${cad(total * 12)} over a year` : `the same as ${cad(SPONSOR_MONTH * n)} a month`}</span>
            <GiveButton give="orphan" amt={total} freq={plan === "month" ? "monthly" : "once"} note={note}>Sponsor {n === 1 ? "a child" : `${n} children`} <Dots /></GiveButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- closing: where most needed, over the schoolyard ---------------- */
function Closing() {
  return (
    <section className="ok-close" aria-labelledby="okCloseTitle">
      <img className="ok-close__img" src={ORPHAN_MEDIA.school} alt="" loading="lazy" />
      <div className="ok-close__shade" />
      <div className="container ok-close__inner">
        <Ring className="ring--close" on={12} id="okCloseRing" />
        <Lines id="okCloseTitle" className="h2 ok-close__h" lines={["A year of childhood,", "CAD 70 at a time."]} />
        <p>Can&apos;t choose a child to sponsor? Give to Where Most Needed and we&apos;ll direct it to the orphan care projects that need it most.</p>
        <div className="ok-close__ctas">
          <GiveButton give="orphan" amt={SPONSOR_MONTH} freq="monthly" note="Monthly Sponsorship (Pakistan), 1 orphan" className="btn">Sponsor for CAD 70 a month <Dots /></GiveButton>
          <GiveButton give="orphan" amt={250} note="Where Most Needed" className="btn btn--white">Give where most needed <Dots /></GiveButton>
        </div>
      </div>
    </section>
  );
}

export default function OrphanSite() {
  useEffect(() => initOrphanEffects(), []);
  return (
    <GiftProvider>
      <a className="skip" href="#main">Skip to content</a>
      <Header base="/" />
      <main id="main" className="ok">
        <Hero />
        <Why />
        <Needs />
        <Sponsor />
        <Closing />
      </main>
      <Footer />
    </GiftProvider>
  );
}
