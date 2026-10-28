"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ASNAF, FITR, ZAKAT_COUNTS, ZAKAT_EXEMPT, ZAKAT_FAQ, ZAKAT_MEDIA, ZAKAT_OPTIONS } from "@/lib/content";
import { Dots, GiftProvider, GiveButton } from "@/components/gift";
import { Footer, Header } from "@/components/sections";
import { Arrow, Lines, PhotoCards, ProgrammeGift, cad } from "@/components/programme";
import { initZakatEffects } from "@/lib/zakat-effects";

/* Zakat programme page. Concept: "one in forty".
   Through-line: the gold eight-point star. It draws itself behind the hero's arch
   on load, then returns to show the eight who may receive Zakat. Below the hero,
   sections teach the rest: what counts, and the nisab (one gold bar against seven
   silver), then a break rewards the reader: one seed growing seven spikes (Qur'an 2:261)
   and what their Zakat becomes. The AI calculator from Zakah.com embeds in #calculate;
   until then it shows a screenshot. Motion lives in lib/zakat-effects.ts. */
/* eslint-disable @next/next/no-img-element */

/** Two squares, one turned 45°: the eight-point star. */
function Star({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <rect x="42" y="42" width="116" height="116" pathLength={1} />
      <rect x="42" y="42" width="116" height="116" pathLength={1} transform="rotate(45 100 100)" />
    </svg>
  );
}

/* ---------------- hero: the arch, the star and 2.5% ---------------- */
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
          <p className="zk-hero__sub">Your Zakat is a sacred trust. We use every contribution according to Islamic jurisprudence, to reach the people who need it most.</p>
          <div className="hero__ctas">
            <a className="btn" href="#calculate">Calculate my Zakat <Dots /></a>
            <a className="btn btn--ghost" href="#ways">Ways to pay <Dots /></a>
          </div>
        </div>
        <div className="zk-hero__art" aria-hidden="true">
          <div className="zk-hero__star"><Star /></div>
          <figure className="zk-arch"><img src={ZAKAT_MEDIA.hero} alt="" fetchPriority="high" /></figure>
          <div className="zk-badge"><b><span id="zkPct">2.5</span>%</b><span>of your wealth, once a lunar year</span></div>
        </div>
        <div className="gift-dock tgift-dock"><ProgrammeGift title="Pay your Zakat" options={ZAKAT_OPTIONS} /></div>
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

/* ---------------- what counts: coin stacks build as each asset passes ---------------- */
const COUNT_ART: Record<string, ReactNode> = {
  cash: <><rect x="6" y="16" width="52" height="32" rx="4" /><circle className="w" cx="32" cy="32" r="8" /><path d="M14 24v16M50 24v16" /></>,
  metal: <><path d="M10 46l8-18h28l8 18z" /><path className="w" d="M20 28l5-12h14l5 12z" /></>,
  invest: <><path d="M8 54h48" /><path className="w" d="M12 44l12-12 10 8 18-20" /><path d="M42 20h10v10" /></>,
  stock: <><path d="M8 26 32 14l24 12v26H8z" /><path className="w" d="M24 52V36h16v16" /></>,
  owed: <><path d="M10 40l12-10 10 4 10-8 12 6" /><path className="w" d="M22 50a10 10 0 1 0 0-.1M42 22a8 8 0 1 0 0-.1" /></>,
};
function Counts() {
  return (
    <section className="counts" id="counts" data-on="-1" aria-labelledby="countsTitle">
      <div className="container counts__grid">
        <div className="counts__list">
          <Lines id="countsTitle" lines={["What counts", <>towards <em>your Zakat</em></>]} />
          <p className="lead">Zakat is due on wealth that can grow. Add up everything below that you have held for a lunar year.</p>
          <ol>
            {ZAKAT_COUNTS.map((c, i) => (
              <li key={c.k} className="counts__row" data-k={i}>
                <svg className="counts__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{COUNT_ART[c.k]}</svg>
                <div><h3>{c.name}</h3><p>{c.line}</p></div>
              </li>
            ))}
            <li className="counts__row counts__row--no" data-k={ZAKAT_COUNTS.length}>
              <svg className="counts__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="32" cy="32" r="22" /><path d="M16 48 48 16" /></svg>
              <div><h3>Not counted</h3><p>Your home, your car, your personal belongings, and anything else you use rather than hold as wealth.</p></div>
            </li>
          </ol>
        </div>
        <div className="counts__aside" aria-hidden="true">
          <div className="counts__board">
            <div className="counts__stacks">
              {ZAKAT_COUNTS.map((c, i) => (
                <div key={c.k} className="counts__col" data-k={i}>
                  <div className="counts__coins">{Array.from({ length: 4 + (i % 3) }, (_, j) => <i key={j} style={{ "--j": j } as CSSProperties} />)}</div>
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{COUNT_ART[c.k]}</svg>
                </div>
              ))}
            </div>
            <div className="counts__total"><span>Total wealth</span><b>&times; 2.5%</b><span>= your Zakat</span></div>
            <ul className="counts__no">{ZAKAT_EXEMPT.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- the nisab: one gold bar against seven silver ---------------- */
const Bar = ({ i }: { i: number }) => <i className="bar" style={{ "--i": i } as CSSProperties} />;
function Nisab() {
  return (
    <section className="nisab" id="nisab" aria-labelledby="nisabTitle">
      <div className="container">
        <div className="nisab__head">
          <Lines id="nisabTitle" lines={["The nisab:", <>where Zakat <em>begins</em></>]} />
          <p className="lead">Zakat is only due once your wealth reaches a minimum, set by the value of gold or silver. The prices move every day, so the calculator always uses today&apos;s rate.</p>
        </div>
        <div className="nisab__grid">
          <figure className="metal metal--gold">
            <div className="metal__bars"><Bar i={0} /></div>
            <figcaption><b><span data-count="85">85</span>g</b><span>of gold</span></figcaption>
          </figure>
          <div className="nisab__or" aria-hidden="true">or</div>
          <figure className="metal metal--silver">
            <div className="metal__bars">{Array.from({ length: 7 }, (_, i) => <Bar key={i} i={i} />)}</div>
            <figcaption><b><span data-count="595">595</span>g</b><span>of silver: seven times the weight</span></figcaption>
          </figure>
        </div>
        <p className="nisab__note"><b>Which one?</b> Silver is worth far less, so its nisab is lower and more people reach it. Many scholars recommend the silver nisab for that reason.</p>
      </div>
    </section>
  );
}

/* ---------------- the break: one seed, seven spikes, and what your Zakat becomes ---------------- */
// seven stalks fan out of one seed; each carries an ear of grains along its last stretch
const STALKS = Array.from({ length: 7 }, (_, i) => {
  const a = ((i - 3) * 13 * Math.PI) / 180, L = 230 - Math.abs(i - 3) * 14;
  const bx = 300, by = 330, tx = bx + Math.sin(a) * L, ty = by - Math.cos(a) * L;
  const d = `M${bx} ${by}Q${bx + Math.sin(a) * L * 0.3} ${by - L * 0.55} ${tx} ${ty}`;
  const grains = Array.from({ length: 9 }, (_, g) => {
    const t = 0.62 + g * 0.045, side = g % 2 ? 1 : -1;
    return { x: bx + Math.sin(a) * L * t + Math.cos(a) * 7 * side, y: by - Math.cos(a) * L * t + Math.sin(a) * 7 * side, r: (a * 180) / Math.PI + side * 28 };
  });
  return { d, grains, i };
});
const BECOMES = [
  { amt: FITR, what: "An Eid meal for one person", note: "Zakat al-Fitr, 1 person" },
  { amt: 120, what: "Food for a family in Gaza", note: "Gaza Emergency Response, Feed 1 family" },
  { amt: 500, what: "Medical aid for two families in Gaza", note: "Gaza Emergency Response, Medical aid for 2 families" },
  { amt: 1000, what: "Shelter for a family of four in Gaza", note: "Gaza Emergency Response, Shelter for a family of 4" },
];
function Reward() {
  return (
    <section className="reward" id="reward" aria-labelledby="rewardTitle">
      <div className="container reward__in">
        <svg className="reward__wheat" viewBox="0 60 600 300" aria-hidden="true">
          {STALKS.map((st) => (
            <g key={st.i} className="stalk" style={{ "--i": st.i } as CSSProperties}>
              <path pathLength={1} d={st.d} />
              {st.grains.map((g, k) => <g key={k} transform={`rotate(${g.r} ${g.x} ${g.y})`}><ellipse cx={g.x} cy={g.y} rx="4.2" ry="9" style={{ "--k": k } as CSSProperties} /></g>)}
            </g>
          ))}
          <ellipse className="reward__seed" cx="300" cy="334" rx="9" ry="6" />
        </svg>
        <blockquote className="reward__verse">
          <p id="rewardTitle">&ldquo;The example of those who spend their wealth in the way of Allah is like a seed of grain which grows <em>seven spikes</em>; in each spike is <em>a hundred grains</em>. And Allah multiplies for whom He wills.&rdquo;</p>
          <cite>Qur&apos;an 2:261</cite>
        </blockquote>
        <h3 className="reward__h">What your Zakat becomes</h3>
        <ul className="reward__tiles">
          {BECOMES.map((b) => (
            <li key={b.amt}>
              <GiveButton give="zakat" amt={b.amt} freq="once" note={b.note} className="tile" aria-label={`Pay ${cad(b.amt)} Zakat: ${b.what}`}>
                <b><small>CAD</small>{b.amt.toLocaleString("en-CA")}</b>
                <span>{b.what}</span>
                <i aria-hidden="true">Pay this <Arrow /></i>
              </GiveButton>
            </li>
          ))}
        </ul>
        <div className="reward__ctas">
          <GiveButton give="zakat" note="Zakat, Where Most Needed" className="btn">Pay my Zakat <Dots /></GiveButton>
          <a className="btn btn--ghost" href="#calculate">Calculate it first <Dots /></a>
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
        <Counts />
        <Nisab />
        <Reward />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </GiftProvider>
  );
}
