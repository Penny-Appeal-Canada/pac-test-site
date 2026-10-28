"use client";

import { Fragment, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { DELIVERY, GLOBAL_FUND, PA_MEDIA, PLAQUE_LINES, THIRST_HERO, WATER_OPTIONS, WELLS } from "@/lib/content";
import { Dots, GiftProvider, GiveButton } from "@/components/gift";
import { Arrow, Lines, OptionBlocks, ProgrammeGift, cad } from "@/components/programme";
import { Footer, Header } from "@/components/sections";
import { initThirstEffects } from "@/lib/thirst-effects";

/* Thirst Relief programme page. Concept: "the walk for water, ended".
   Through-line: the waterline. It rises over the hero, wipes between wells on
   the stage, fills the gauge as the wells grow, and edges the closing band.
   Motion lives in lib/thirst-effects.ts; this file only owns markup and state. */
/* eslint-disable @next/next/no-img-element */

/* ---------------- hero: the water rises over the walk ---------------- */
function Hero() {
  return (
    <section className="th-hero" id="top" aria-labelledby="thTitle">
      <div className="th-hero__stage" id="thStage">
        <img className="th-hero__img" src={PA_MEDIA + THIRST_HERO.before} alt="Women and girls walking across open land with water jars and cans on their heads" fetchPriority="high" />
        <div className="th-hero__after" id="thAfter">
          <img className="th-hero__img" src={PA_MEDIA + THIRST_HERO.after} alt="Children carrying water home from a village well" />
        </div>
        <svg className="waterline" id="thLine" aria-hidden="true"><path /></svg>
        <span className="th-tag th-tag--before" aria-hidden="true">Before: the daily walk</span>
        <span className="th-tag th-tag--after" aria-hidden="true">After: a village well</span>
        <div className="th-hero__shade" />
        <div className="th-hero__copy">
          <div className="eyebrow th-hero__eyebrow">Thirst Relief</div>
          <h1 id="thTitle">
            <span className="reveal-line"><span>The walk</span></span>{" "}
            <span className="reveal-line"><span>for water</span></span>{" "}
            <span className="th-swap">
              <span className="th-swap__a"><span className="box box--ink">takes hours</span></span>
              <span className="th-swap__b"><span className="box">ends at a well</span></span>
            </span>
          </h1>
          <div className="th-sub">
            <p className="th-sub__a">In the places we work, the day often starts with a long walk to fetch water that isn&apos;t safe to drink.</p>
            <p className="th-sub__b" aria-hidden="true">A well puts clean water a few steps from home, and gives those hours back.</p>
          </div>
          <div className="hero__ctas">
            <a className="btn" href="#wells">Choose a well <Dots /></a>
            <GiveButton give="thirst" note="Global Thirst Relief Fund" className="btn btn--ghost">Give where needed <Dots /></GiveButton>
          </div>
        </div>
        <div className="gift-dock tgift-dock"><ProgrammeGift title="Give water" options={WATER_OPTIONS} /></div>
        <div className="th-cue" aria-hidden="true"><i /><span>Scroll to fill the well</span></div>
      </div>
    </section>
  );
}

/* ---------------- option illustrations: line drawings, water picked out in blue ---------------- */
const ART: Record<string, ReactNode> = {
  "global-thirst-relief-fund": <>
    <circle cx="30" cy="32" r="20" /><path d="M10 32h40M30 12c-7 6-7 34 0 40M30 12c7 6 7 34 0 40M14 22h32M14 42h32" />
    <path className="w" d="M50 34s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />
  </>,
  "emergency-water-delivery": <>
    <path d="M4 44V24h32v20M36 30h12l8 9v5H36" /><circle cx="15" cy="47" r="5" /><circle cx="46" cy="47" r="5" /><path d="M4 44h6M20 44h21M51 44h5" />
    <path className="w" d="M20 26s5 6 5 9a5 5 0 0 1-10 0c0-3 5-9 5-9z" />
  </>,
  "hand-pump-well": <>
    <path d="M24 54V18h10v36M20 18h18M34 22l16-8M24 26h-9v6" /><path d="M12 54h40" />
    <path className="w" d="M15 37s3 4 3 6a3 3 0 0 1-6 0c0-2 3-6 3-6zM10 54h16l-2-5H12z" />
  </>,
  "high-yield-community-well": <>
    <path d="M6 24 32 8l26 16M12 24v30M52 24v30M8 54h48" /><path d="M20 34h24M24 34v6M32 34v6M40 34v6" />
    <path className="w" d="M18 46h28v8H18z" />
  </>,
  "community-borehole": <>
    <path d="M4 24h56" /><path d="M28 24V8h8v16M24 8h16" />
    <path d="M4 34c8 3 16-3 28 0s20 3 28 0M4 44c8 3 16-3 28 0s20 3 28 0" opacity=".45" />
    <path className="w" d="M30 24h4v30h-4z" /><path className="w" d="M24 56c4-3 12-3 16 0z" />
  </>,
  "off-grid-water-well": <>
    <path d="M6 22l8-12h22l-8 12zM12 16h20M18 10l-4 12M27 10l-4 12" /><path d="M21 22v8" />
    <path d="M38 22h18v20H38zM42 42v12M52 42v12M47 32v-0" /><path d="M8 54h52M28 54V44h10" />
    <path className="w" d="M38 32h18v10H38z" />
  </>,
};

/* ---------------- why: scrubbed statement + three figures ---------------- */
const WHY = "Dirty water spreads disease, and fetching it costs women and girls hours of every day. A well fixes both at once. It is built to last, and it keeps giving long after the day it opens.";
function Why() {
  return (
    <section className="th-why container" aria-label="Why wells, and ways to give">
      <p className="th-why__words" data-words>
        {WHY.split(" ").map((w, i) => <Fragment key={i}><span className="w">{w}</span>{" "}</Fragment>)}
      </p>
      <dl className="th-figs">
        <div><dt>people a day drink from one High-Yield Community Well</dt><dd><span data-count="150">150</span>+</dd></div>
        <div><dt>litres of clean water in every emergency truck</dt><dd><span data-count="5000">5,000</span></dd></div>
        <div><dt>is where a gift to the Global Thirst Relief Fund starts</dt><dd><small>CAD</small><span data-count="100">100</span></dd></div>
      </dl>
      <OptionBlocks title="Ways to give water" give="thirst" options={WATER_OPTIONS} art={ART} />
    </section>
  );
}

/* ---------------- wells: sticky stage + water gauge ---------------- */
function Wells({ onName }: { onName: (slug: string) => void }) {
  return (
    <section className="wells" id="wells" aria-labelledby="wellsTitle">
      <div className="wells__head container">
        <Lines id="wellsTitle" lines={["Four well types,", "from one family", "to a whole village"]} />
        <p className="lead">Each one is a complete water point, built where the need is and handed to the community. Prices are in Canadian dollars.</p>
      </div>
      <div className="wells__grid container">
        <div className="wstage" id="wstage" aria-hidden="true">
          <div className="wstage__frame">
            {WELLS.map((w, i) => (
              <figure key={w.slug} className={`wstage__img${i ? "" : " is-on"}`}>
                <img src={PA_MEDIA + w.img} alt="" loading={i ? "lazy" : "eager"} />
                <figcaption>{w.where.join(" · ")}</figcaption>
              </figure>
            ))}
            <svg className="waterline" id="wstageLine"><path /></svg>
          </div>
          <div className="gauge" id="gauge" style={{ ["--lvl" as string]: 1 / WELLS.length }}>
            <div className="gauge__tube"><i /></div>
            <ol>{WELLS.map((w, i) => <li key={w.slug} className={i ? "" : "is-on"}>{w.scale}</li>)}</ol>
          </div>
        </div>
        <div className="wells__list">
          {WELLS.map((w, i) => (
            <article key={w.slug} className={`well${i ? "" : " is-active"}`} aria-labelledby={`w-${w.slug}`}>
              <img className="well__img sr" src={PA_MEDIA + w.img} alt={w.alt} loading="lazy" />
              <span className="well__scale">{w.scale}</span>
              <h3 id={`w-${w.slug}`}>{w.name}</h3>
              <p className="well__price"><small>CAD</small>{w.price.toLocaleString("en-CA")}</p>
              <p className="well__text">{w.text}</p>
              <dl className="well__spec">
                <div><dt>What we build</dt><dd>{w.kind}</dd></div>
                <div><dt>Where</dt><dd>{w.where.join(", ")}</dd></div>
              </dl>
              <div className="well__ctas">
                <GiveButton give="thirst" amt={w.price} note={w.name}>Give {cad(w.price)} <Dots /></GiveButton>
                <a className="link-arrow" href="#name" onClick={() => onName(w.slug)}>Build it in a name <Arrow /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- name a well: live plaque ---------------- */
function NameAWell({ slug, setSlug }: { slug: string; setSlug: (s: string) => void }) {
  const well = WELLS.find((w) => w.slug === slug) ?? WELLS[0];
  const [line, setLine] = useState(PLAQUE_LINES[0]);
  const [name, setName] = useState("");
  const [pick, setWhere] = useState(well.where[0]);
  const where = well.where.includes(pick) ? pick : well.where[0]; // switching wells falls back to its first region
  const shown = name.trim() || "Your loved one";

  return (
    <section className="name container" id="name" aria-labelledby="nameTitle">
      <figure className="name__photo">
        <div className="name__pic">
          <img src={PA_MEDIA + WELLS[2].img} alt="A young woman pumping water at a Community Borehole in Kenya, next to its dedication plaque" loading="lazy" />
          <span className="hotspot" style={{ left: "80.5%", top: "44%" }} aria-hidden="true" />
        </div>
        <figcaption>A Community Borehole in Kenya, built as ongoing Sadaqah. The plaque carries the name it was given in.</figcaption>
      </figure>
      <div className="name__panel">
        <Lines id="nameTitle" lines={["Build it", <>in <em>their</em> name</>]} />
        <p className="lead">Every well can carry a plaque with a dedication: for a parent, a grandparent, or anyone you want to remember with ongoing charity.</p>

        <div className="plaque" aria-live="polite" aria-label="Plaque preview">
          <div className="plaque__top">
            <span>{line}</span>
            <b>{shown}</b>
          </div>
          <div className="plaque__band">
            <span>{where}</span>
            <i aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></svg></i>
          </div>
          <div className="plaque__foot">pennyappeal · Thirst Relief</div>
        </div>

        <div className="name__form">
          <label className="field"><span>Well</span>
            <span className="select"><select value={well.slug} onChange={(e) => setSlug(e.target.value)}>
              {WELLS.map((w) => <option key={w.slug} value={w.slug}>{w.name}, {cad(w.price)}</option>)}
            </select></span>
          </label>
          <label className="field"><span>Dedication</span>
            <span className="select"><select value={line} onChange={(e) => setLine(e.target.value)}>
              {PLAQUE_LINES.map((l) => <option key={l}>{l}</option>)}
            </select></span>
          </label>
          <div className="row2 name__row">
            <label className="field"><span>Name on the plaque</span>
              <input className="input" value={name} maxLength={40} placeholder="e.g. Amina Rahman" onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="field"><span>Region</span>
              <span className="select"><select value={where} onChange={(e) => setWhere(e.target.value)}>
                {well.where.map((p) => <option key={p}>{p}</option>)}
              </select></span>
            </label>
          </div>
          <GiveButton give="thirst" amt={well.price} note={`${well.name}, plaque: ${line} ${shown}`}>Give {cad(well.price)} in this name <Dots /></GiveButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- emergency water: full-bleed band ---------------- */
function Truck() {
  const [place, setPlace] = useState(DELIVERY.places[0]);
  return (
    <section className="truck" aria-labelledby="truckTitle">
      <img className="truck__img" src={PA_MEDIA + DELIVERY.img} alt="A boy in Gaza holding a full bottle of clean water beside a delivery truck" loading="lazy" />
      <div className="truck__in container">
        <p className="eyebrow">Emergency Water Delivery</p>
        <h2 className="truck__big" id="truckTitle"><span data-count="5000">5,000</span><span>litres</span></h2>
        <div className="truck__row">
          <p>{DELIVERY.text}</p>
          <div>
            <div className="truck__pick" role="group" aria-label="Where to send the truck">
              {DELIVERY.places.map((p) => <button key={p} type="button" aria-pressed={p === place} onClick={() => setPlace(p)}>{p}</button>)}
            </div>
            <GiveButton give="thirst" amt={DELIVERY.price} note={`Emergency Water Delivery, ${place}`} className="btn btn--white">Send a truck to {place}, {cad(DELIVERY.price)} <Dots /></GiveButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- global fund: wave-edged closing band ---------------- */
function Fund() {
  return (
    <section className="fund container" id="fund" aria-labelledby="fundTitle">
      <svg className="fund__edge" id="fundEdge" aria-hidden="true" preserveAspectRatio="none"><path /></svg>
      <div className="fund__copy">
        <Lines id="fundTitle" className="h2 fund__h" lines={["Not sure which well?", "Give where it's needed most."]} />
        <p>{GLOBAL_FUND.text}</p>
      </div>
      <div className="drops" role="group" aria-label="Give to the Global Thirst Relief Fund">
        {GLOBAL_FUND.amounts.map((a, i) => (
          <GiveButton key={a} give="thirst" amt={a} note="Global Thirst Relief Fund" className="drop" style={{ ["--s" as string]: i }}>
            <small>CAD</small>{a}
          </GiveButton>
        ))}
        <GiveButton give="thirst" note="Global Thirst Relief Fund" className="drop drop--other">Other</GiveButton>
      </div>
    </section>
  );
}

export default function ThirstSite() {
  const [slug, setSlug] = useState(WELLS[0].slug);
  useEffect(() => initThirstEffects(), []);

  return (
    <GiftProvider>
      <a className="skip" href="#main">Skip to content</a>
      <Header base="/" />
      <main id="main" className="th">
        <Hero />
        <Why />
        <Wells onName={setSlug} />
        <NameAWell slug={slug} setSlug={setSlug} />
        <Truck />
        <Fund />
      </main>
      <Footer />
    </GiftProvider>
  );
}
