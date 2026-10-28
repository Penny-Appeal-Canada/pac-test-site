"use client";

import { Fragment, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { GiftProg, GiveOption } from "@/lib/content";
import { Dots, GiveButton, useGift } from "@/components/gift";

/* Pieces every programme page shares: the hero gift card (all of a programme's
   giving options in one simple form) and the "ways to give" blocks.
   Styles live in app/programme.css. */

export const cad = (v: number) => `CAD ${v.toLocaleString("en-CA")}`;

export function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

/** Heading whose lines slide up out of masks (animated in lib/chrome.ts). */
export function Lines({ lines, id, className = "h2" }: { lines: ReactNode[]; id: string; className?: string }) {
  return (
    <h2 className={className} id={id} data-lines>
      {lines.map((l, i) => (
        <Fragment key={i}><span className="reveal-line"><span>{l}</span></span>{i < lines.length - 1 ? " " : null}</Fragment>
      ))}
    </h2>
  );
}

/** The lowest amount an option can be given at, for "From CAD x" labels. */
export function fromPrice(o: GiveOption) {
  if (o.price) return { from: false, v: o.price };
  if (o.unit) return { from: false, v: o.unit.price };
  const all = o.tiers?.map((t) => t.amount) ?? o.amounts ?? [];
  return { from: true, v: Math.min(...all) };
}

type Sel = { amt: number; tier: number; count: number; place: string; custom: string; monthly: boolean };
const fresh = (o: GiveOption): Sel => ({ amt: o.amounts?.[1] ?? o.amounts?.[0] ?? 0, tier: 0, count: 1, place: o.places?.[0] ?? "", custom: "", monthly: false });

/* ---------------- hero gift card ---------------- */
export function ProgrammeGift({ title, options }: { title: string; options: GiveOption[] }) {
  const { notify } = useGift();
  const uid = useId();
  const [slug, setSlug] = useState(options[0].slug);
  const o = options.find((x) => x.slug === slug) ?? options[0];
  const [sel, setSelState] = useState<Sel>(() => fresh(o));
  const set = (patch: Partial<Sel>) => setSelState((s) => ({ ...s, ...patch }));
  const [shake, setShake] = useState(false);
  const customRef = useRef<HTMLInputElement>(null);

  const typed = sel.custom ? parseFloat(sel.custom.replace(/,/g, "")) : 0;
  const value = o.price ?? (o.unit ? o.unit.price * sel.count : sel.custom ? typed : o.tiers ? o.tiers[sel.tier].amount : sel.amt);
  const target = [
    o.name,
    o.places && sel.place,
    o.tiers && !sel.custom && o.tiers[sel.tier].label,
    o.unit && `${sel.count} ${sel.count === 1 ? o.unit.one : o.unit.many}`,
  ].filter(Boolean).join(", ");
  const monthly = !!o.everyMonth || (!!o.monthly && sel.monthly);

  function pick(x: GiveOption) { setSlug(x.slug); setSelState(fresh(x)); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!(value > 0)) { setShake(true); customRef.current?.focus(); return; }
    // Payment provider checkout plugs in here.
    notify(`Ready: ${cad(value)} ${monthly ? "every month" : "one-time"} to ${target}. Checkout connects here in production.`);
  }

  const customField = (
    <label className={`custom${shake ? " shake" : ""}`} onAnimationEnd={() => setShake(false)}>
      <span className="sr">Other amount</span>
      <b>CAD</b>
      <input ref={customRef} inputMode="decimal" placeholder="Other amount" autoComplete="off" value={sel.custom} onChange={(e) => set({ custom: e.target.value })} />
    </label>
  );

  return (
    <form className="gift tgift" onSubmit={submit} noValidate aria-labelledby={`${uid}-t`}>
      <div className="gift__head">
        <h2 id={`${uid}-t`}>{title}</h2>
        <span className="chip">{monthly ? "MONTHLY" : "ONE-TIME"} · CAD</span>
      </div>
      <fieldset>
        <legend className="sr">Choose how to give</legend>
        <div className="tgift__opts">
          {options.map((x) => {
            const f = fromPrice(x);
            return (
              <button key={x.slug} type="button" aria-pressed={x.slug === slug} onClick={() => pick(x)}>
                <b>{x.tag}</b><span>{x.unit ? `${cad(f.v)} ${x.everyMonth ? "a month" : `per ${x.unit.one}`}` : f.from ? `From ${cad(f.v)}` : cad(f.v)}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="tgift__detail" key={o.slug}>
        {o.monthly && (
          <div className="seg tgift__freq" data-v={sel.monthly ? "monthly" : "once"} role="group" aria-label="Frequency">
            <i className="seg__pill" />
            <button type="button" aria-pressed={!sel.monthly} onClick={() => set({ monthly: false })}>One-time</button>
            <button type="button" aria-pressed={sel.monthly} onClick={() => set({ monthly: true })}>Monthly</button>
          </div>
        )}
        {o.amounts && (
          <div className="amounts tgift__amts" role="group" aria-label="Amount (CAD)" style={{ gridTemplateColumns: `repeat(${o.amounts.length},1fr)` }}>
            {o.amounts.map((v) => (
              <button key={v} type="button" aria-pressed={!sel.custom && v === sel.amt} onClick={() => set({ amt: v, custom: "" })}>{v.toLocaleString("en-CA")}</button>
            ))}
          </div>
        )}
        {o.tiers && (
          <div className="tgift__tiers" role="group" aria-label="Choose an option" style={{ gridTemplateColumns: `repeat(${o.tiers.length > 3 ? 2 : o.tiers.length},1fr)` }}>
            {o.tiers.map((t, i) => (
              <button key={t.label} type="button" aria-pressed={!sel.custom && i === sel.tier} onClick={() => set({ tier: i, custom: "" })}>
                <b>{t.amount.toLocaleString("en-CA")}</b><span>{t.label}</span>
              </button>
            ))}
          </div>
        )}
        {(o.amounts || o.tiers) && o.custom && customField}
        {o.unit && (
          <div className="stepper">
            <button type="button" aria-label={`One fewer ${o.unit.one}`} onClick={() => set({ count: Math.max(1, sel.count - 1) })} disabled={sel.count <= 1}>−</button>
            <output aria-live="polite"><b>{sel.count}</b> {sel.count === 1 ? o.unit.one : o.unit.many}</output>
            <button type="button" aria-label={`One more ${o.unit.one}`} onClick={() => set({ count: Math.min(30, sel.count + 1) })} disabled={sel.count >= 30}>+</button>
          </div>
        )}
        {o.places && (
          <div className="tgift__places" role="group" aria-label="Where to send it">
            {o.places.map((p) => <button key={p} type="button" aria-pressed={p === sel.place} onClick={() => set({ place: p })}>{p}</button>)}
          </div>
        )}
        {(o.places || o.unit) && <p className="tgift__desc tgift__desc--sm">{o.short}</p>}
        {o.price && !o.places && <p className="tgift__desc">{o.short}{o.detail && <><br />{o.detail}</>}</p>}
      </div>
      <button className="btn" type="submit">Donate{value > 0 ? ` ${cad(value)}` : ""}{monthly ? " / month" : ""} <Dots /></button>
      <p className="gift__note">{value > 0 ? <>To <strong>{target}</strong></> : "Enter an amount to continue"}</p>
    </form>
  );
}

/* ---------------- "ways to give" blocks: icon left, price + donate ---------------- */
export function OptionBlocks({ title, give, options, art }: { title: string; give: GiftProg; options: GiveOption[]; art: Record<string, ReactNode> }) {
  return (
    <div className="opts" aria-labelledby="optsTitle">
      <h2 className="opts__title" id="optsTitle">{title}</h2>
      <div className="opts__grid">
        {options.map((o) => {
          const f = fromPrice(o);
          const note = o.places ? `${o.name}, ${o.places[0]}` : o.name;
          return (
            <article key={o.slug} className="opt">
              <svg className="opt__art" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{art[o.slug]}</svg>
              <div className="opt__body">
                <span className="opt__tag">{o.tag}</span>
                <h3>{o.name}</h3>
                <p>{o.short}</p>
                <div className="opt__foot">
                  <span className="opt__price">
                    <small>{f.from ? "From CAD" : "CAD"}</small>{f.v.toLocaleString("en-CA")}{o.unit && <small className="opt__per"> / {o.everyMonth ? "month" : o.unit.one}</small>}
                  </span>
                  <GiveButton give={give} amt={o.price ?? (o.everyMonth ? f.v : undefined)} freq={o.everyMonth ? "monthly" : undefined} note={note} className="btn btn--sm" aria-label={`Donate to ${o.name}`}>Donate <Dots /></GiveButton>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- "ways to give" photo cards: three quick amounts, or a per-person stepper ---------------- */
type CardOpts = {
  options: GiveOption[];
  give: (o: GiveOption) => GiftProg;
  /** label for the first (wide) card's button */
  leadCta: string;
  /** small badge on the photo, top right */
  badge?: (o: GiveOption) => string | undefined;
  /** photos that need lifting */
  dim?: Set<string>;
  /** what the description loses once the badge says it */
  trim?: RegExp;
};
function UnitCard({ o, give }: { o: GiveOption; give: GiftProg }) {
  const [n, setN] = useState(1);
  const u = o.unit!;
  const label = `${n} ${n === 1 ? u.one : u.many}`;
  return (
    <>
      <div className="rc__unit">
        <div className="stepper">
          <button type="button" aria-label={`One fewer ${u.one}`} disabled={n <= 1} onClick={() => setN(n - 1)}>−</button>
          <output aria-live="polite"><b>{n}</b> {n === 1 ? u.one : u.many}</output>
          <button type="button" aria-label={`One more ${u.one}`} disabled={n >= 30} onClick={() => setN(n + 1)}>+</button>
        </div>
      </div>
      <GiveButton give={give} amt={u.price * n} freq="once" note={`${o.name}, ${label}`} className="btn btn--sm rc__cta">Pay {cad(u.price * n)} <Dots /></GiveButton>
    </>
  );
}
export function PhotoCards({ options, give, leadCta, badge, dim, trim }: CardOpts) {
  return (
    <div className="rc-grid">
      {options.map((o, i) => {
        const g = give(o), b = badge?.(o);
        const picks = (o.tiers ?? (o.amounts ?? []).map((amount) => ({ label: "", amount }))).slice(0, 3);
        return (
          <article key={o.slug} className={`rc${i === 0 ? " rc--lead" : ""}`}>
            <div className="rc__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={dim?.has(o.slug) ? "is-dim" : ""} src={o.img} alt="" loading="lazy" />
              <span className="rc__tag">{o.tag}</span>
              {b && <span className="rc__zakat">{b}</span>}
            </div>
            <div className="rc__body">
              <h3>{o.name}</h3>
              <p>{b && trim ? o.short.replace(trim, "") : o.short}</p>
              {o.unit ? <UnitCard o={o} give={g} /> : (
                <>
                  <div className="rc__amts" role="group" aria-label={`${o.name}: quick amounts`}>
                    {picks.map((t) => (
                      <GiveButton key={t.amount} give={g} amt={t.amount} note={t.label ? `${o.name}, ${t.label}` : o.name} className="rc__amt" aria-label={`Give ${cad(t.amount)} to ${o.name}${t.label ? `, ${t.label}` : ""}`}>
                        <b>{cad(t.amount)}</b>{t.label && <span>{t.label}</span>}
                      </GiveButton>
                    ))}
                  </div>
                  <GiveButton give={g} note={o.name} className="btn btn--sm rc__cta" aria-label={`Donate to ${o.name}`}>{i === 0 ? leadCta : "Donate"} <Dots /></GiveButton>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
