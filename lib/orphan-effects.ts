import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, clamp, initChrome } from "@/lib/chrome";

/* Motion for /orphankind. The hero's year ring fills one month at a time as the
   pinned hero scrolls, and the readout adds up: CAD 70 for 1 month to CAD 840 for
   a year. The six needs light up as they cross the middle of the screen. */

const ease = (x: number) => x * x * (3 - 2 * x);

export function initOrphanEffects(): () => void {
  const hero = $(".ok-hero");
  // the pinned hero has its own CTAs, so the header stays clear and the mobile bar waits until it ends
  const heroEnd = () => hero.offsetHeight - innerHeight * 0.85;
  const chrome = initChrome({ solidAt: heroEnd, barAt: heroEnd });
  const { reduced, on } = chrome;
  const ctx = gsap.context(() => {});
  chrome.reveal();

  /* ---------- hero: a year fills ---------- */
  const arcs = $$("#okRing circle"), sum = $("#okSum"), months = $("#okMonths");
  let shown = 1;
  function fill(p: number) {
    const n = 1 + Math.round(ease(clamp((p - 0.04) / 0.8)) * 11);
    if (n === shown) return;
    shown = n;
    arcs.forEach((a, i) => a.classList.toggle("is-on", i < n));
    sum.textContent = `CAD ${(70 * n).toLocaleString("en-CA")}`;
    months.textContent = n === 12 ? "a whole year" : `${n} ${n === 1 ? "month" : "months"}`;
    hero.classList.toggle("is-full", n === 12);
  }
  ctx.add(() => {
    ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom bottom", onUpdate: (s) => fill(s.progress) });

    $$("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, { v: end, duration: reduced ? 0 : 1.8, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("en-CA"); } });
        },
      });
    });

    // each need lights while it sits across the middle of the screen
    $$(".need").forEach((li) => ScrollTrigger.create({ trigger: li, start: "top 62%", end: "bottom 38%", toggleClass: "is-on" }));
    const close = $("#okCloseRing");
    ScrollTrigger.create({ trigger: close, start: "top 85%", once: true, onEnter: () => close.classList.add("is-in") });

    if (!reduced) {
      gsap.from(".th-figs>div", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".th-figs", start: "top 85%" } });
      gsap.from(".sp", { y: 50, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".sp", start: "top 85%" } });
      gsap.fromTo(".needs__photo img", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".needs", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".ok-close__img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".ok-close", start: "top bottom", end: "bottom top", scrub: true } });
    }
  });

  let booted = false;
  const boot = () => {
    if (booted || chrome.signal.aborted) return;
    booted = true;
    ScrollTrigger.refresh();
    if (!reduced) {
      gsap.from(".ok-hero .reveal-line>span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.15 });
      gsap.from([".ok-hero__eyebrow", ".ok-year", ".ok-hero .hero__ctas"], { y: 18, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.45 });
      gsap.from(".ok-hero .gift", { y: 40, opacity: 0, duration: 1.3, ease: "expo.out", delay: 0.6 });
      gsap.from(".header", { opacity: 0, duration: 1, ease: "power2.out", delay: 0.2 });
    }
  };
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(boot);
  on(window, "load", () => { if (booted) ScrollTrigger.refresh(); });

  return () => {
    ctx.revert();
    chrome.destroy();
  };
}
