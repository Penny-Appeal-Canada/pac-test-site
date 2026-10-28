import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* Motion every page shares: smooth scroll, menu, header and mobile donate bar,
   button glow, heading and word reveals, and the footer wordmark.
   Each page's own effects file calls this, then adds its own pieces. */

export type Chrome = {
  lenis: Lenis;
  reduced: boolean;
  touch: boolean;
  signal: AbortSignal;
  on: (t: EventTarget, type: string, fn: (e: never) => void, opts?: AddEventListenerOptions) => void;
  closeMenu: () => void;
  /** Starts heading and word reveals; call once fonts are ready. */
  reveal: () => void;
  destroy: () => void;
};

export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** `solidAt` / `barAt`: scroll depths where the header turns solid and the mobile donate bar appears. */
export function initChrome({ solidAt = () => innerHeight * 0.75, barAt = () => innerHeight * 0.6 }: { solidAt?: () => number; barAt?: () => number } = {}): Chrome {
  gsap.registerPlugin(ScrollTrigger);
  const ac = new AbortController();
  const on: Chrome["on"] = (t, type, fn, opts = {}) => t.addEventListener(type, fn as EventListener, { ...opts, signal: ac.signal });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none)").matches;

  /* ---------- smooth scroll ---------- */
  const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !reduced });
  lenis.on("scroll", ScrollTrigger.update);
  const lenisRaf = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);

  /* ---------- menu ---------- */
  const menuBtn = $("#menuBtn");
  const closeMenu = () => {
    if (!document.body.classList.contains("menu-open")) return; // only undo what opening the menu did
    document.body.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", "false"); lenis.start();
  };
  on(menuBtn, "click", () => {
    const open = !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    if (open) lenis.stop(); else lenis.start();
  });
  on(window, "keydown", (e: KeyboardEvent) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) closeMenu(); });

  /* in-page anchors scroll with Lenis */
  on(document, "click", (e: MouseEvent) => {
    const a = (e.target as Element).closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href") || "";
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault(); closeMenu();
    lenis.scrollTo(t as HTMLElement, { offset: id === "#top" ? 0 : -70, duration: 1.4 });
  });

  /* gift drawer open/close (dispatched by components/gift.tsx) */
  on(window, "pa:lock", () => { closeMenu(); lenis.stop(); });
  on(window, "pa:unlock", () => { lenis.start(); });

  /* ---------- header: solid after the first screen, hides on scroll down ---------- */
  const header = $("#header"), mbar = $("#mbar");
  let lastY = 0;
  lenis.on("scroll", ({ scroll }: { scroll: number }) => {
    header.classList.toggle("is-solid", scroll > solidAt());
    if (scroll > innerHeight && scroll > lastY + 2 && !document.body.classList.contains("menu-open")) header.classList.add("is-hidden");
    if (scroll < lastY - 2 || scroll <= innerHeight) header.classList.remove("is-hidden");
    lastY = scroll;
    mbar.classList.toggle("is-on", scroll > barAt());
  });

  /* ---------- buttons: glow follows the pointer ---------- */
  on(document, "pointermove", (e: PointerEvent) => {
    const b = (e.target as Element).closest?.(".btn") as HTMLElement | null;
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty("--gx", `${e.clientX - r.left}px`);
    b.style.setProperty("--gy", `${e.clientY - r.top}px`);
  });

  /* ---------- footer wordmark reacts to the pointer ---------- */
  const letters = $$("#giant span");
  if (!touch) on($(".footer"), "pointermove", (e: PointerEvent) => {
    letters.forEach((s) => {
      const r = s.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)), k = clamp(1 - d / 260);
      s.style.transform = `translateY(${-k * 22}px)`;
      s.classList.toggle("is-hot", k > 0.55);
    });
  });

  /* ---------- heading line masks + scrubbed word reveals ---------- */
  const ctx = gsap.context(() => {});
  const reveal = () => ctx.add(() => {
    if (!reduced) {
      $$("[data-lines]").forEach((h) => {
        gsap.from($$(".reveal-line>span", h), { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: h, start: "top 85%" } });
      });
    }
    $$("[data-words]").forEach((p) => {
      const ws = $$(".w", p);
      if (reduced) { ws.forEach((w) => (w.style.opacity = "1")); return; }
      ScrollTrigger.create({
        trigger: p, start: "top 80%", end: "bottom 45%", scrub: true,
        onUpdate: (s) => { const n = s.progress * ws.length; ws.forEach((w, i) => (w.style.opacity = String(clamp(0.16 + (n - i) * 0.84, 0.16, 1)))); },
      });
    });
  });

  return {
    lenis, reduced, touch, signal: ac.signal, on, closeMenu, reveal,
    destroy() {
      ac.abort();
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf("*");
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
      document.body.classList.remove("menu-open");
    },
  };
}
