import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, initChrome } from "@/lib/chrome";

/* Motion for /zakat. The hero animates once on load: the eight-point star draws, the
   arch photo opens upward and the 2.5% badge lands. Below it, the explainer sections
   light their rows as they cross the middle of the screen and drive a sticky visual
   (the star's points, the coin stacks), and the break grows seven spikes from one seed. */

export function initZakatEffects(): () => void {
  const hero = $(".zk-hero");
  // the hero has its own CTAs, so the header stays clear and the mobile bar waits until it ends
  const heroEnd = () => hero.offsetHeight - innerHeight * 0.85;
  const chrome = initChrome({ solidAt: heroEnd, barAt: heroEnd });
  const { reduced, on } = chrome;
  const ctx = gsap.context(() => {});
  chrome.reveal();

  /* ---------- rows that light as they cross the middle; `pick` hears which one ---------- */
  const rows = (sel: string, pick: (k: number) => void) => $$(sel).forEach((li) => ScrollTrigger.create({
    trigger: li, start: "top 60%", end: "bottom 40%",
    onToggle: (s) => {
      li.classList.toggle("is-on", s.isActive);
      if (s.isActive) pick(Number(li.dataset.k));
    },
  }));

  ctx.add(() => {
    /* ---------- the eight: rows light, the star follows ---------- */
    const asnaf = $("#asnaf");
    rows(".asnaf__row", (k) => (asnaf.dataset.on = String(k)));

    /* ---------- what counts: each asset drops its coins, then the exemptions strike out ---------- */
    const counts = $("#counts"), cols = $$(".counts__col");
    rows(".counts__row", (k) => {
      cols.forEach((c, i) => c.classList.toggle("is-on", i <= k));
      counts.classList.toggle("is-done", k >= cols.length);
    });

    /* ---------- the nisab: bars stack in ---------- */
    ScrollTrigger.create({ trigger: "#nisab .nisab__grid", start: "top 75%", once: true, onEnter: () => $("#nisab").classList.add("is-in") });
    $$("#nisab [data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, { v: end, duration: reduced ? 0 : 1.6, ease: "power3.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
        },
      });
    });

    /* ---------- the break: the seed grows its seven spikes ---------- */
    ScrollTrigger.create({ trigger: ".reward__wheat", start: "top 80%", once: true, onEnter: () => $("#reward").classList.add("is-in") });
    if (!reduced) gsap.from(".tile", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".reward__tiles", start: "top 88%" } });

    if (!reduced) {
      gsap.from(".zk-widget", { y: 60, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".zk-calc", start: "top 75%" } });
      gsap.from(".zk-steps li", { y: 30, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".zk-steps", start: "top 85%" } });
      gsap.from(".rc", { y: 50, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".rc-grid", start: "top 85%" } });
      gsap.from(".asnaf__star svg", { rotation: -45, scale: 0.85, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".asnaf", start: "top 70%" } });
      gsap.fromTo(".zk-arch--close img", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".zk-close", start: "top bottom", end: "bottom top", scrub: true } });
    }
  });

  let booted = false;
  const boot = () => {
    if (booted || chrome.signal.aborted) return;
    booted = true;
    ScrollTrigger.refresh();
    // the star draws, the arch opens and the badge lands (CSS, keyed off is-in); the badge counts up to 2.5
    hero.classList.add("is-in");
    if (!reduced) {
      const pct = $("#zkPct"), o = { v: 0 };
      gsap.to(o, { v: 2.5, duration: 1.4, ease: "power3.out", delay: 1.2, onUpdate: () => { pct.textContent = o.v.toFixed(1); } });
      gsap.from(".zk-hero .reveal-line>span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.15 });
      gsap.from([".zk-hero__eyebrow", ".zk-hero__sub", ".zk-hero .hero__ctas"], { y: 18, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.45 });
      gsap.from(".zk-hero .gift", { y: 40, opacity: 0, duration: 1.3, ease: "expo.out", delay: 0.6 });
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
