"use client";

import { useEffect, useState } from "react";
import { ASNAF, FITR, ZAKAT_FAQ, ZAKAT_MEDIA, ZAKAT_OPTIONS } from "@/lib/content";
import { Dots, GiftProvider, GiveButton } from "@/components/gift";
import { Footer, Header } from "@/components/sections";
import { Arrow, Lines, PhotoCards, ProgrammeGift, cad } from "@/components/programme";
import { initZakatEffects } from "@/lib/zakat-effects";

/* Zakat programme page. Concept: "one in forty".
   Through-line: the coin and the eight-point star. Zakat is 2.5%, CAD 1 of every CAD 40:
   forty coins fill as the hero scrolls and the last one turns gold. The star returns
   to show the eight who may receive Zakat. The AI calculator from Zakah.com embeds in
   #calculate; until then it shows a screenshot. Motion lives in lib/zakat-effects.ts. */
/* eslint-disable @next/next/no-img-element */

const COINS = Array.from({ length: 40 }, (_, i) => i);

/* ---------------- hero: forty coins, one of them Zakat ---------------- */
function Hero() {
  return (
    <section className="zk-hero" id="top" aria-labelledby="zkTitle">
      <div className="zk-hero__stage">
        <div className="zk-hero__copy">
          <div className="eyebrow zk-hero__eyebrow">Zakat</div>
          <h1 id="zkTitle">
            <span className="reveal-line"><span>Zakat, kept</span></span>{" "}
            <span className="reveal-line"><span>as an <span className="box">Amanah</span></span></span>
          </h1>
          <div className="zk-forty">
            <div className="zk-coins" id="zkCoins" aria-hidden="true">
              {COINS.map((i) => <i key={i} className={i === 0 ? "is-on" : ""} />)}
            </div>
            <p className="zk-forty__read" aria-live="polite">
              <span className="zk-forty__a">Of every <b>CAD 40</b> you hold&hellip;</span>
              <span className="zk-forty__b"><b>CAD 1</b> is Zakat. That&apos;s 2.5%.</span>
            </p>
          </div>
          <p className="zk-hero__sub">Your Zakat is a sacred trust. We use every contribution according to Islamic jurisprudence, to reach the people who need it most.</p>
          <div className="hero__ctas">
            <a className="btn" href="#calculate">Calculate my Zakat <Dots /></a>
            <a className="btn btn--ghost" href="#ways">Ways to pay <Dots /></a>
          </div>
        </div>
        <figure className="zk-arch" aria-hidden="true"><img src={ZAKAT_MEDIA.hero} alt="" fetchPriority="high" /></figure>
        <div className="gift-dock tgift-dock"><ProgrammeGift title="Pay your Zakat" options={ZAKAT_OPTIONS} /></div>
        <div className="th-cue zk-cue" aria-hidden="true"><i /><span>Scroll</span></div>
      </div>
    </section>
  );
}

/* ---------------- calculator: the Zakah.com widget slot, and a quick pay ---------------- */
const STEPS = [
  { t: "Tell it what you own", d: "Cash, savings, gold and silver, investments, business assets and crypto." },
  { t: "Ask as you go", d: "The AI assistant explains every field in plain language." },
  { t: "Get your Zakat", d: "It checks today's nisab and works out exactly what is due." },
];
function Calculator() {
  const [amt, setAmt] = useState("");
  const v = parseFloat(amt.replace(/,/g, "")) || 0;
  return (
    <section className="zk-calc container" id="calculate" aria-labelledby="calcTitle">
      <div className="zk-calc__copy">
        <span className="zk-kicker">AI Zakat calculator</span>
        <Lines id="calcTitle" lines={["Know exactly", <><em>what you owe</em></>]} />
        <p className="lead">Zakat is a duty, and working it out can be hard. Our calculator takes you through it step by step, in about ten minutes.</p>
        <ol className="zk-steps">
          {STEPS.map((s, i) => <li key={s.t}><b>{String(i + 1).padStart(2, "0")}</b><div><h3>{s.t}</h3><p>{s.d}</p></div></li>)}
        </ol>
        <p className="zk-calc__by">Calculator by <a href="https://www.zakah.com" target="_blank" rel="noopener">Zakah.com</a>. Its method is reviewed by Islamic scholars.</p>
      </div>
      <div className="zk-calc__side">
        {/* Zakah.com AI calculator: replace this figure with the embed */}
        <figure className="zk-widget" data-embed="zakah-calculator">
          <div className="zk-widget__bar" aria-hidden="true"><i /><i /><i /><span>AI Zakat calculator</span></div>
          <img src={ZAKAT_MEDIA.calculator} alt="Preview of the Zakah.com calculator: What Zakah are you calculating? Personal Zakah or Business Zakah." />
          <figcaption className="zk-widget__ph">Calculator loads here</figcaption>
        </figure>
        <form className="zk-quick" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="zkAmt">Already know your Zakat?</label>
          <div className="zk-quick__row">
            <div className="custom zk-quick__amt"><b>CAD</b><input id="zkAmt" inputMode="decimal" placeholder="Your Zakat amount" autoComplete="off" value={amt} onChange={(e) => setAmt(e.target.value)} /></div>
            <GiveButton give="zakat" amt={v || undefined} freq="once" note="Zakat, Where Most Needed" className="btn">Pay{v ? ` ${cad(v)}` : ""} <Dots /></GiveButton>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ---------------- ways to pay ---------------- */
function Ways() {
  return (
    <section className="ways container" id="ways" aria-labelledby="waysTitle">
      <div className="ways__head">
        <Lines id="waysTitle" lines={["Pay your", <><em>Zakat</em></>]} />
        <p className="lead">Give it where it&apos;s needed most, pay Zakat al-Fitr for your household, or send it to an emergency that is Zakat eligible.</p>
      </div>
      <PhotoCards options={ZAKAT_OPTIONS} give={() => "zakat"} leadCta="Pay Zakat" />
    </section>
  );
}

/* ---------------- the eight who may receive Zakat: an eight-point star ---------------- */
const TIPS = Array.from({ length: 8 }, (_, k) => {
  const a = (k * 45 - 90) * (Math.PI / 180);
  return { x: 100 + Math.cos(a) * 82, y: 100 + Math.sin(a) * 82 };
});
function Asnaf() {
  return (
    <section className="asnaf" id="asnaf" data-on="0" aria-labelledby="asnafTitle">
      <div className="container asnaf__grid">
        <div className="asnaf__aside">
          <div className="asnaf__star">
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <rect className="asnaf__sq" x="42" y="42" width="116" height="116" />
              <rect className="asnaf__sq" x="42" y="42" width="116" height="116" transform="rotate(45 100 100)" />
              <circle className="asnaf__in" cx="100" cy="100" r="40" />
              {TIPS.map((t, k) => (
                <g key={k} className="asnaf__tip" data-k={k}>
                  <circle cx={t.x} cy={t.y} r="13" />
                  <text x={t.x} y={t.y + 4.5} textAnchor="middle">{k + 1}</text>
                </g>
              ))}
            </svg>
            <div className="asnaf__mid"><b>8</b><span>Qur&apos;an 9:60</span></div>
          </div>
        </div>
        <div className="asnaf__list">
          <Lines id="asnafTitle" lines={["Where your Zakat", <><em>can go</em></>]} />
          <p className="lead">The Qur&apos;an names eight groups of people who may receive Zakat. Every gift is used according to Islamic jurisprudence to reach them.</p>
          <ol>
            {ASNAF.map((a, i) => (
              <li key={a.ar} className="asnaf__row" data-k={i}>
                <span className="asnaf__n">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{a.en}</h3><span className="asnaf__ar">{a.ar}</span><p>{a.line}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- the basics ---------------- */
function Faq() {
  return (
    <section className="zk-faq container" aria-labelledby="faqTitle">
      <div className="zk-faq__head">
        <Lines id="faqTitle" lines={["Zakat,", <><em>simply</em> explained</>]} />
        <p className="lead">Still unsure? The calculator&apos;s AI assistant can answer questions about your own situation.</p>
        <a className="link-arrow" href="#calculate">Open the calculator <Arrow /></a>
      </div>
      <div className="zk-faq__list">
        {ZAKAT_FAQ.map((f, i) => (
          <details key={f.q} open={i === 0}>
            <summary>{f.q}<i aria-hidden="true" /></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------------- closing: the Amanah ---------------- */
function Closing() {
  return (
    <section className="zk-close" aria-labelledby="zkCloseTitle">
      <div className="container zk-close__grid">
        <figure className="zk-arch zk-arch--close"><img src={ZAKAT_MEDIA.hero} alt="A Penny Appeal volunteer bringing a food box to an elderly woman at home" loading="lazy" /></figure>
        <div>
          <Lines id="zkCloseTitle" className="h2 zk-close__h" lines={["Your Zakat,", "delivered with dignity."]} />
          <p>We treat every contribution as an Amanah, and we sustain the hands that deliver your Zakat with dignity and care, so your giving goes further.</p>
          <div className="zk-close__ctas">
            <a className="btn btn--white" href="#calculate">Calculate my Zakat <Dots /></a>
            <GiveButton give="zakat" note="Zakat, Where Most Needed" className="btn btn--ghost">Pay Zakat <Dots /></GiveButton>
          </div>
          <p className="zk-close__fitr">Paying for Eid? <GiveButton give="zakat" amt={FITR} freq="once" note="Zakat al-Fitr, 1 person" className="zk-close__link">Zakat al-Fitr is {cad(FITR)} a person <Arrow /></GiveButton></p>
        </div>
      </div>
    </section>
  );
}

export default function ZakatSite() {
  useEffect(() => initZakatEffects(), []);
  return (
    <GiftProvider>
      <a className="skip" href="#main">Skip to content</a>
      <Header base="/" />
      <main id="main" className="zk">
        <Hero />
        <Calculator />
        <Ways />
        <Asnaf />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </GiftProvider>
  );
}
