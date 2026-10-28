"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ABOUT_TEXT, CAUSES, FLOW, IMG, IMPORTANT, MARQUEE_PHRASE, ON_THE_GROUND, PHOTOS, PINS, PROGRAMMES, PROG_KEYS,
  RAISED_TOTAL, RAISED_UPDATED, SLIDES, STACK, TONES, TOTALS, type CauseIcon, type ProgKey,
} from "@/lib/content";
import { Dots, GiftForm, GiveButton, useGift } from "@/components/gift";

/* Plain <img> on purpose: photos are hotlinked from the live Netlify site.
   Move them into /public and switch to next/image when the assets live in this repo. */
/* eslint-disable @next/next/no-img-element */

const vars = (o: Record<string, string | number>) => o as CSSProperties;
/** Each programme's own page. */
const PAGES: Record<ProgKey, string> = { thirst: "/thirst-relief", feed: "/feed-our-world", orphan: "/orphankind", emergency: "/emergency-response" };

function Arrow({ size }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" style={size ? { width: size, height: size } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Heading whose lines slide up out of masks (animated in lib/effects.ts). */
function Lines({ lines, id, className = "h2" }: { lines: { text: ReactNode; cls?: string }[]; id: string; className?: string }) {
  return (
    <h2 className={className} id={id} data-lines>
      {lines.map((l, i) => (
        <Fragment key={i}>
          <span className="reveal-line"><span className={l.cls}>{l.text}</span></span>{i < lines.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h2>
  );
}

/* ---------------- header + mobile nav ---------------- */
/** `base` is "/" on inner pages, so section links lead back to the home page. */
export function Header({ base = "" }: { base?: string }) {
  return (
    <>
      <header className="header" id="header">
        <a className="logo" href={base || "#top"} aria-label="Penny Appeal Caribbean, home"><span>pennyappeal</span><span>caribbean</span></a>
        <nav className="nav" aria-label="Main">
          <div className="nav__drop">
            <a href={`${base}#causes`} aria-haspopup="true">Our Work <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg></a>
            <ul className="nav__menu" aria-label="Our programmes">
              {PROG_KEYS.map((k) => <li key={k}><a href={PAGES[k]} style={vars({ "--c": PROGRAMMES[k].c })}><i />{PROGRAMMES[k].name}</a></li>)}
            </ul>
          </div>
          <a href="/emergency-response">Emergency Response</a><a href="/zakat">Zakat</a><a href={`${base}#about`}>About Us</a>
        </nav>
        <GiveButton className="btn btn--sm">Donate <Dots /></GiveButton>
        <button className="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Menu"><i /></button>
      </header>
      <nav className="mobile-nav" id="mobileNav" aria-label="Mobile">
        {PROG_KEYS.map((k) => <a key={k} href={PAGES[k]}>{PROGRAMMES[k].name}</a>)}
        <a href="/zakat">Zakat</a>
        <a className="mobile-nav__sm" href={`${base}#about`}>About Us</a>
        <div style={{ marginTop: 24 }}><GiveButton>Donate <Dots /></GiveButton></div>
      </nav>
    </>
  );
}

/* ---------------- hero ---------------- */
export function Hero() {
  const { dockRef } = useGift();
  const next = SLIDES[1];
  return (
    <section className="hero" id="top" aria-roledescription="carousel" aria-label="Our appeals">
      <div id="slides">
        {SLIDES.map((s, i) => (
          <div key={s.k} className={`slide${i ? "" : " is-current"}`} aria-hidden={i ? "true" : "false"}>
            <img src={IMG + s.img} alt="" loading={i ? "lazy" : "eager"} fetchPriority={i ? "auto" : "high"} />
          </div>
        ))}
      </div>
      <div className="hero__shade" />
      <div className="hero__copy" id="heroCopy" aria-live="polite">
        {SLIDES.map((s, i) => (
          <div key={s.k} className={`copy copy--${s.k}${i ? "" : " is-current"}`}>
            <div className="hero__eyebrow eyebrow">{s.eyebrow}</div>
            {/* only the visible slide carries the page's h1 */}
            {i === 0 ? (
              <h1><span className="reveal-line"><span>{s.a}</span></span> <span className="reveal-line"><span><span className="box">{s.b}</span></span></span></h1>
            ) : (
              <p className="h1" role="heading" aria-level={1}><span className="reveal-line"><span>{s.a}</span></span> <span className="reveal-line"><span><span className="box">{s.b}</span></span></span></p>
            )}
            <p className="hero__sub">{s.sub}</p>
            <div className="hero__ctas">
              <GiveButton give={s.k}>Donate now <Dots /></GiveButton>
              <GiveButton give="zakat" className="btn btn--ghost">Give Zakat <Dots /></GiveButton>
            </div>
          </div>
        ))}
      </div>
      <div className="gift-dock" id="giftDock" ref={dockRef}><GiftForm /></div>
      <div className="hero__ctrl">
        <button className="round" id="prev" type="button" aria-label="Previous appeal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg></button>
        <button className="round" id="next" type="button" aria-label="Next appeal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg></button>
        <button className="next-peek" id="peek" type="button">
          <span className="next-peek__thumb"><img id="peekImg" src={IMG + next.img} alt="" /></span>
          <span><small>NEXT</small><b id="peekName">{next.eyebrow}</b></span>
        </button>
        <div className="dots" id="dots" role="tablist" aria-label="Choose appeal">
          {SLIDES.map((s, i) => <button key={s.k} type="button" role="tab" aria-label={s.eyebrow} aria-selected={!i}><span /></button>)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- about + programmes ticker ---------------- */
export function About() {
  return (
    <>
      <section className="about container" id="about" aria-labelledby="aboutTitle">
        <div>
          <Lines id="aboutTitle" lines={[{ text: "Penny Appeal" }, { text: "Caribbean", cls: "accent" }]} />
          <p className="words" data-words>
            {ABOUT_TEXT.split(" ").map((w, i) => <Fragment key={i}><span className="w">{w}</span>{" "}</Fragment>)}
          </p>
          <a className="btn btn--ink" href="#causes">Our programmes <Dots /></a>
        </div>
        <div className="stack" id="stack" aria-hidden="true">
          {STACK.map((s) => (
            <figure key={s.cap} style={{ left: `${s.x}%`, top: `${s.y}%` }} data-r={s.r} data-s={s.s}>
              <img src={IMG + s.img} alt="" loading="lazy" /><figcaption>{s.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <div className="prog-ticker" aria-label="Programmes on the ground">
        <h2 className="sr">Programmes on the ground</h2>
        <div className="ticker" id="progTicker" data-speed="38">
          <div className="ticker__track">
            {[0, 1, 2].map((copy) => ON_THE_GROUND.map((o) => {
              const p = PROGRAMMES[o.k];
              return (
                <div className="prog" key={`${copy}-${o.k}`} aria-hidden={copy ? "true" : undefined}>
                  <i style={{ background: p.c }}>{p.name[0]}</i>
                  <div><b>{p.name} is at work in {o.where}</b><span>{o.line}</span></div>
                </div>
              );
            }))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- causes ---------------- */
const ICONS: Record<CauseIcon, ReactNode> = {
  autogive: <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />,
  zakat: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  child: <><circle cx="12" cy="7" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  drop: <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />,
  bowl: <path d="M4 11h16a8 8 0 0 1-16 0zM8 7c0-2 2-2 2-4M14 7c0-2 2-2 2-4" />,
  heart: <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z" />,
};
export function Causes() {
  return (
    <section className="causes container" id="causes" aria-labelledby="causesTitle">
      <img className="causes__map" id="carMap" src={IMG + "caribbean-map.png?v=carib5"} alt="" aria-hidden="true" />
      <div className="causes__head">
        <Lines id="causesTitle" lines={[{ text: "Donate to a cause" }, { text: <>you <em>care</em> about</> }]} />
        <p className="lead">Penny Appeal Caribbean is a Muslim charity working across the region. We keep Zakat restricted from general funds.</p>
      </div>
      <div className="cards" id="cards">
        {CAUSES.map((c) => (
          <article key={c.title} className="cause" style={vars({ "--c": TONES[c.tone][0], "--cd": TONES[c.tone][1] })}>
            <img src={IMG + c.img} alt="" loading="lazy" />
            <h3>{c.title}</h3>
            <div className="cause__more"><div><p>{c.line}</p></div></div>
            <div className="cause__foot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{ICONS[c.icon]}</svg>
              {c.cta}
              <span className="arr"><Arrow size={18} /></span>
            </div>
            <GiveButton give={c.give} className="cover" aria-label={c.cta} />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- curved velocity marquee ---------------- */
const ROUTE_D = "M-80 170 C 240 60, 520 40, 760 110 S 1260 210, 1520 60";
export function RouteMarquee() {
  return (
    <div className="route" aria-label="Give with care. Reach families. Stand with communities.">
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true" id="routeSvg">
        <path id="routePath" d={ROUTE_D} fill="none" />
        <path className="band" d={ROUTE_D} />
        <text dy="15"><textPath href="#routePath" id="routeText">{MARQUEE_PHRASE.repeat(6)}</textPath></text>
      </svg>
      <button className="route__pause" id="routePause" type="button" aria-label="Pause the moving text" aria-pressed="false">
        <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
      </button>
    </div>
  );
}

/* ---------------- impact: chips, map, place card, totals ---------------- */
export function Impact() {
  const [k, setK] = useState<ProgKey>("thirst");
  const p = PROGRAMMES[k];
  const maxT = Math.max(...TOTALS.map((t) => t.v));
  return (
    <section className="impact container" id="impact" aria-labelledby="impactTitle">
      <div className="impact__grid">
        <div>
          <Lines id="impactTitle" lines={[{ text: "Our impact" }, { text: "reaches across" }, { text: <em>communities</em> }]} />
          <p className="lead">Since 2019, we have supported food security, clean water, child sponsorship, and emergency response in the places where families need it.</p>
          <div className="chips" role="group" aria-label="Filter by programme">
            {PROG_KEYS.map((key) => (
              <button key={key} type="button" style={vars({ "--c": PROGRAMMES[key].c })} aria-pressed={k === key} onClick={() => setK(key)}>
                {PROGRAMMES[key].name}
              </button>
            ))}
          </div>
        </div>
        <div className="worldmap" id="worldmap">
          <img className="worldmap__img" src={IMG + "impact-world-map.svg"} alt="World map showing where Penny Appeal works" />
          {PINS.map((pin, i) => (
            <span key={pin.t} className={`pin ${pin.k === k ? "is-on" : "is-off"}`} title={pin.t}
              style={vars({ left: `${pin.x}%`, top: `${pin.y}%`, "--c": PROGRAMMES[pin.k].c, "--i": i })} />
          ))}
          <div className="place" aria-live="polite">
            <div className="place__in" key={k}>
              <div className="place__img"><img src={IMG + p.img} alt={`${p.name} in ${p.where}`} /></div>
              <div>
                <small>{p.where}</small>
                <h3>{p.name}</h3>
                <p>{p.line}</p>
                <a className="link-arrow" href={PAGES[k]} style={{ color: p.cd }}>Programme details <Arrow /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="raised">
        <div className="raised__head">
          <h3>Together we raised <strong><small>CAD</small>$<span data-count={RAISED_TOTAL}>0</span></strong> in 2026</h3>
          <span className="raised__date">Last updated: {RAISED_UPDATED}</span>
        </div>
        <div className="totals">
          {TOTALS.map((t) => (
            <div key={t.k} className="total" style={vars({ "--c": t.c })}>
              <b>{t.name}</b>
              <div className="amt"><small>CAD</small>$<span data-count={t.v}>0</span></div>
              <div className="bar"><i data-w={t.v / maxT} /></div>
              <GiveButton give={t.k} className="">Chip in <Arrow /></GiveButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- field photographs ---------------- */
function PhotoRow({ id, list, speed }: { id: string; list: [string, string][]; speed: number }) {
  return (
    <div className="ticker" id={id} data-speed={speed}>
      <div className="ticker__track">
        {[0, 1, 2].map((copy) => list.map(([f, c], i) => (
          <figure className="photo" style={{ margin: 0 }} key={`${copy}-${i}`} aria-hidden={copy ? "true" : undefined}>
            <img src={IMG + f} alt={`${c}, field photograph`} loading="lazy" draggable={false} /><span>{c}</span>
          </figure>
        )))}
      </div>
    </div>
  );
}
export function FieldPhotos() {
  return (
    <section className="field-photos" aria-labelledby="photosTitle">
      <div className="container title">
        <h2 className="eyebrow" id="photosTitle" style={{ color: "var(--thirst-deep)" }}>Field photographs</h2>
        <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Drag to look around</span>
      </div>
      <PhotoRow id="photosA" list={PHOTOS} speed={26} />
      <PhotoRow id="photosB" list={PHOTOS.slice(4).concat(PHOTOS.slice(0, 4))} speed={-26} />
    </section>
  );
}

/* ---------------- take action: coverflow ---------------- */
export function TakeAction() {
  const [fi, setFi] = useState(0);
  const [wide, setWide] = useState(true);
  const startX = useRef<number | null>(null);
  const n = FLOW.length;
  const go = (i: number) => setFi(((i % n) + n) % n);

  useEffect(() => {
    const mq = matchMedia("(min-width: 901px)");
    const update = () => setWide(mq.matches);
    update(); mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const gap = wide ? 0.62 : 0.9;
  return (
    <section className="take container" id="take" aria-labelledby="takeTitle" aria-roledescription="carousel"
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(fi + 1); if (e.key === "ArrowLeft") go(fi - 1); }}>
      <div className="take__head">
        <div>
          <Lines id="takeTitle" lines={[{ text: <>Take action <em>today</em></> }]} />
          <p className="lead">We focus on long-term solutions that help families build stability, dignity, and resilience across the Caribbean.</p>
        </div>
        <div className="take__nav">
          <span className="take__count" aria-live="polite">{FLOW[fi].eyebrow}, {fi + 1} of {n}</span>
          <button className="round" type="button" aria-label="Previous programme" onClick={() => go(fi - 1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg></button>
          <button className="round" type="button" aria-label="Next programme" onClick={() => go(fi + 1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>
      <div className="flow"
        onPointerDown={(e) => { startX.current = e.clientX; }}
        onPointerUp={(e) => { if (startX.current === null) return; const dx = e.clientX - startX.current; if (Math.abs(dx) > 60) go(fi + (dx < 0 ? 1 : -1)); startX.current = null; }}>
        {FLOW.map((f, i) => {
          let d = i - fi;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const a = Math.abs(d);
          const p = PROGRAMMES[f.k];
          return (
            <article key={f.k} className={`fcard${a ? "" : " is-active"}`} aria-roledescription="slide" aria-label={`${f.eyebrow}, ${i + 1} of ${n}`} aria-hidden={a ? "true" : "false"}
              onClickCapture={(e) => { if (a) { e.preventDefault(); e.stopPropagation(); go(i); } }}
              style={vars({ "--c": p.c, "--cd": p.cd, transform: `translateX(${d * gap * 100}%) scale(${a ? 0.8 : 1}) rotateY(${-d * 4}deg)`, opacity: a > 1 ? 0 : a ? 0.55 : 1, filter: a ? "saturate(.6)" : "none", zIndex: 10 - a })}>
              <div className="fcard__body">
                <span className="eyebrow">{f.eyebrow}</span>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
                <GiveButton give={f.k} tabIndex={a ? -1 : 0}>{f.cta} <Dots /></GiveButton>
              </div>
              <div className="fcard__img"><img src={IMG + f.img} alt="" loading="lazy" /></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- zakat ring-fence ---------------- */
export function Zakat() {
  return (
    <section className="zakat container" id="zakat" aria-labelledby="zakatTitle">
      <div>
        <Lines id="zakatTitle" lines={[{ text: "Zakat, kept" }, { text: <em>restricted</em> }]} />
        <p>Thirst Relief, Feed Our World, and OrphanKind. We do not mix it with general funds.</p>
        <GiveButton give="zakat" className="btn btn--white">Calculate Zakat <Dots /></GiveButton>
      </div>
      <div className="fence" id="fence">
        <svg aria-hidden="true"><rect id="fenceRect" x="1" y="1" rx="34" ry="34" /></svg>
        <span className="lock" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        </span>
        <span className="pill"><i style={{ background: "var(--thirst)" }} />Thirst Relief</span>
        <span className="pill"><i style={{ background: "var(--feed)" }} />Feed Our World</span>
        <span className="pill"><i style={{ background: "#fff" }} />OrphanKind</span>
        <span className="fence__note">ZAKAT ONLY</span>
      </div>
    </section>
  );
}

/* ---------------- the important parts ---------------- */
export function Important() {
  return (
    <section className="important container" aria-labelledby="impTitle">
      <Lines id="impTitle" lines={[{ text: <>The important <em>parts</em></> }]} />
      <div className="parts">
        {IMPORTANT.map((p) => (
          <article className="part" key={p.title}>
            <div className="part__fig"><img src={IMG + p.img} alt="" loading="lazy" /></div>
            <div className="part__body"><span className="eyebrow">{p.eyebrow}</span><h3>{p.title}</h3><p>{p.text}</p></div>
            <span className="part__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            <a className="cover" href={p.href} aria-label={p.label} />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- footer + mobile donate bar ---------------- */
export function Footer() {
  return (
    <>
      <footer className="footer container">
        <div className="footer__cta">
          <h2>Support the <span className="accent">work</span></h2>
          <GiveButton>Donate <Dots /></GiveButton>
        </div>
        <div className="fcols">
          <div><h3>Penny Appeal Caribbean</h3><p>Contact: [PLACEHOLDER]<br />Charity number: [PLACEHOLDER]</p></div>
          <div><h3>Programmes</h3><ul><li><a href="/thirst-relief">Thirst Relief</a></li><li><a href="/feed-our-world">Feed Our World</a></li><li><a href="/orphankind">OrphanKind</a></li><li><a href="/emergency-response">Emergency Response</a></li></ul></div>
          <div><h3>Get involved</h3><ul><li><a href="/zakat">Zakat</a></li><li><GiveButton give="monthly" className="">Give monthly</GiveButton></li><li><a href="#">Volunteer</a></li><li><a href="#">News</a></li></ul></div>
          <div><h3>Legal</h3><ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul><p style={{ marginTop: 14, fontSize: 13 }}>Currencies we accept include TTD, JMD, GYD, XCD, USD, and CAD.</p></div>
        </div>
        <div className="giant" id="giant" aria-hidden="true">{[..."caribbean"].map((c, i) => <span key={i}>{c}</span>)}</div>
        <div className="footer__legal"><span>© 2026 Penny Appeal Caribbean</span><span>Give with care. Reach families. Stand with communities.</span></div>
      </footer>
      <div className="mbar" id="mbar">
        <a className="btn btn--ghost" href="/zakat">Zakat</a>
        <GiveButton>Donate <Dots /></GiveButton>
      </div>
    </>
  );
}
