import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, clamp, initChrome } from "@/lib/chrome";

/* Motion for /feed-our-world. The hero's thirty day cells fill in reading order
   as the pinned hero scrolls, and the headline counts with them: "1 day" up to
   "a month". Everything else is the shared reveals plus a few entrances. */

const ease = (x: number) => x * x * (3 - 2 * x);

export function initFeedEffects(): () => void {
  const hero = $(".fw-hero");
  // the pinned hero has its own CTAs, so the header stays clear and the mobile bar waits until it ends
  const heroEnd = () => hero.offsetHeight - innerHeight * 0.85;
  const chrome = initChrome({ solidAt: heroEnd, barAt: heroEnd });
  const { reduced, on } = chrome;
  const ctx = gsap.context(() => {});
  chrome.reveal();

  /* ---------- hero: a month fills ---------- */
  const cells = $$("#days span"), count = $("#fwCount");
  let shown = 1;
  function fill(p: number) {
    const n = 1 + Math.round(ease(clamp((p - 0.04) / 0.8)) * 29);
    if (n === shown) return;
    shown = n;
    cells.forEach((c, i) => c.classList.toggle("is-on", i < n));
    count.textContent = n === 30 ? "a month" : `${n} ${n === 1 ? "day" : "days"}`;
    hero.classList.toggle("is-full", n === 30);
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
    const months = $("#months");
    ScrollTrigger.create({ trigger: months, start: "top 85%", once: true, onEnter: () => months.classList.add("is-in") });

    if (!reduced) {
      gsap.from(".th-figs>div", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".th-figs", start: "top 85%" } });
      gsap.from(".tier", { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".tiers", start: "top 85%" } });
      gsap.from(".live", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".lives__grid", start: "top 85%" } });
      gsap.from(".calc", { y: 50, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".calc", start: "top 85%" } });
      gsap.fromTo(".table__photo img", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".table", start: "top bottom", end: "bottom top", scrub: true } });
    }
  });

  let booted = false;
  const boot = () => {
    if (booted || chrome.signal.aborted) return;
    booted = true;
    ScrollTrigger.refresh();
    if (!reduced) {
      gsap.from(".fw-hero .reveal-line>span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.15 });
      gsap.from([".fw-hero__eyebrow", ".fw-hero__sub", ".fw-hero .hero__ctas"], { y: 18, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.45 });
      gsap.from("#days span", { opacity: 0, duration: 0.8, ease: "power2.out", stagger: { each: 0.015, from: "start" }, delay: 0.2 });
      gsap.from(".fw-hero .gift", { y: 40, opacity: 0, duration: 1.3, ease: "expo.out", delay: 0.6 });
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
