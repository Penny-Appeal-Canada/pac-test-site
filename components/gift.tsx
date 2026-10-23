"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CURRENCIES, GIFT_PROGRAMMES, PRESETS, type Currency, type GiftProg } from "@/lib/content";

/* The gift form exists once as state and renders in two places:
   docked in the hero (desktop) and inside the drawer (everywhere else).
   Any <GiveButton> anywhere on the page opens it preset to its programme. */

type Freq = "once" | "monthly";
type GiftState = {
  prog: GiftProg; setProg: (p: GiftProg) => void;
  cur: Currency; setCur: (c: Currency) => void;
  freq: Freq; setFreq: (f: Freq) => void;
  amt: number; setAmt: (a: number) => void;
  custom: string; setCustom: (s: string) => void;
  drawerOpen: boolean;
  openGift: (preset?: string) => void;
  closeGift: () => void;
  notify: (msg: string) => void;
  dockRef: React.RefObject<HTMLDivElement | null>;
};

const GiftCtx = createContext<GiftState | null>(null);
export const useGift = () => {
  const ctx = useContext(GiftCtx);
  if (!ctx) throw new Error("useGift must be used inside <GiftProvider>");
  return ctx;
};

const fmt = (c: string, v: number) => `${c} ${v.toLocaleString("en-CA", { maximumFractionDigits: 2 })}`;
const progLabel = (p: GiftProg) => GIFT_PROGRAMMES.find((x) => x.v === p)?.label ?? "";

export function GiftProvider({ children }: { children: ReactNode }) {
  const [prog, setProg] = useState<GiftProg>("most");
  const [cur, setCurState] = useState<Currency>("CAD");
  const [freq, setFreq] = useState<Freq>("once");
  const [amt, setAmt] = useState(PRESETS.CAD[0]);
  const [custom, setCustom] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const dockRef = useRef<HTMLDivElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setCur = useCallback((c: Currency) => { setCurState(c); setCustom(""); setAmt(PRESETS[c][0]); }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4200);
  }, []);

  const openGift = useCallback((preset?: string) => {
    if (preset === "monthly") setFreq("monthly");
    else if (preset && GIFT_PROGRAMMES.some((p) => p.v === preset)) setProg(preset as GiftProg);

    // In the hero on desktop the form is already on screen: just draw attention to it.
    const dock = dockRef.current;
    const docked = !!dock && getComputedStyle(dock).display !== "none" && window.scrollY < window.innerHeight * 0.5;
    if (docked) {
      dock.querySelector<HTMLSelectElement>("select")?.focus();
      dock.firstElementChild?.animate([{ transform: "translateY(0)" }, { transform: "translateY(-8px)" }, { transform: "translateY(0)" }], { duration: 450, easing: "ease-out" });
      return;
    }
    lastFocus.current = document.activeElement as HTMLElement | null;
    setDrawerOpen(true);
    window.dispatchEvent(new CustomEvent("pa:lock")); // effects: stop smooth scroll, pause hero, close menu
  }, []);

  const closeGift = useCallback(() => {
    setDrawerOpen(false);
    window.dispatchEvent(new CustomEvent("pa:unlock"));
    lastFocus.current?.focus({ preventScroll: true });
  }, []);

  const value = useMemo<GiftState>(
    () => ({ prog, setProg, cur, setCur, freq, setFreq, amt, setAmt, custom, setCustom, drawerOpen, openGift, closeGift, notify, dockRef }),
    [prog, cur, setCur, freq, amt, custom, drawerOpen, openGift, closeGift, notify]
  );

  return (
    <GiftCtx.Provider value={value}>
      {children}
      <Drawer />
      <div className={`toast${toast ? " is-on" : ""}`} role="status">{toast}</div>
    </GiftCtx.Provider>
  );
}

export function Dots() {
  return (<><i className="d" /><i className="d" /><i className="d" /></>);
}

export function GiveButton({ give, className = "btn", children, ...rest }: { give?: string; className?: string; children?: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openGift } = useGift();
  return (
    <button type="button" className={className} onClick={() => openGift(give)} {...rest}>
      {children}
    </button>
  );
}

export function GiftForm({ inDrawer = false }: { inDrawer?: boolean }) {
  const g = useGift();
  const uid = useId();
  const [shake, setShake] = useState(false);
  const customRef = useRef<HTMLInputElement>(null);
  const value = g.custom ? parseFloat(g.custom.replace(/,/g, "")) : g.amt;
  const summary = value > 0
    ? <><strong>{fmt(g.cur, value)}</strong> {g.freq === "monthly" ? "every month" : "once"} to {progLabel(g.prog)}</>
    : "Enter an amount to continue";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!(value > 0)) { setShake(true); customRef.current?.focus(); return; }
    // Payment provider checkout plugs in here.
    g.notify(`Ready: ${fmt(g.cur, value)} ${g.freq === "monthly" ? "monthly" : "one-time"} to ${progLabel(g.prog)}. Checkout connects here in production.`);
  }

  return (
    <form className="gift" onSubmit={submit} noValidate aria-labelledby={`${uid}-t`}>
      <div className="gift__head">
        <h2 id={`${uid}-t`}>Choose your gift</h2>
        <span className="chip">{g.freq === "monthly" ? "MONTHLY · AUTOGIVE" : "ONE-TIME"}</span>
      </div>
      <label className="field">
        <span>Choose a programme</span>
        <span className="select">
          <select value={g.prog} onChange={(e) => g.setProg(e.target.value as GiftProg)} autoFocus={inDrawer}>
            {GIFT_PROGRAMMES.map((p) => <option key={p.v} value={p.v}>{p.label}</option>)}
          </select>
        </span>
      </label>
      <div className="row2">
        <label className="field">
          <span>Currency</span>
          <span className="select">
            <select value={g.cur} onChange={(e) => g.setCur(e.target.value as Currency)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </span>
        </label>
        <div className="field">
          <span id={`${uid}-f`}>Frequency</span>
          <div className="seg" data-v={g.freq} role="group" aria-labelledby={`${uid}-f`}>
            <i className="seg__pill" />
            <button type="button" aria-pressed={g.freq === "once"} onClick={() => g.setFreq("once")}>One-time</button>
            <button type="button" aria-pressed={g.freq === "monthly"} onClick={() => g.setFreq("monthly")}>Monthly</button>
          </div>
        </div>
      </div>
      <fieldset>
        <legend>Choose an amount ({g.cur})</legend>
        <div className="amounts">
          {PRESETS[g.cur].map((v) => (
            <button key={v} type="button" aria-pressed={!g.custom && v === g.amt} onClick={() => { g.setAmt(v); g.setCustom(""); }}>
              {fmt(g.cur, v)}
            </button>
          ))}
        </div>
        <label className={`custom${shake ? " shake" : ""}`} onAnimationEnd={() => setShake(false)}>
          <span className="sr">Other amount</span>
          <b>{g.cur}</b>
          <input ref={customRef} inputMode="decimal" placeholder="Other amount" autoComplete="off" value={g.custom} onChange={(e) => g.setCustom(e.target.value)} />
        </label>
      </fieldset>
      <button className="btn" type="submit">Continue to checkout <Dots /></button>
      <p className="gift__note">{summary}</p>
    </form>
  );
}

function Drawer() {
  const g = useGift();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!g.drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") g.closeGift();
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>("button, select, input")].filter((x) => x.offsetParent);
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [g.drawerOpen, g]);

  return (
    <div className={`drawer${g.drawerOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Choose your gift" aria-hidden={!g.drawerOpen}>
      <div className="drawer__shade" onClick={g.closeGift} />
      <div className="drawer__panel" ref={panel} data-lenis-prevent>
        <button className="drawer__close" type="button" onClick={g.closeGift} aria-label="Close">×</button>
        {g.drawerOpen && <GiftForm inDrawer />}
        <ul className="drawer__trust">
          <li><Tick />Zakat is kept restricted from general funds.</li>
          <li><Tick />Give in TTD, JMD, GYD, XCD, USD or CAD.</li>
        </ul>
      </div>
    </div>
  );
}

function Tick() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>;
}
