import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, clamp, initChrome } from "@/lib/chrome";

/* Motion for /zakat. As the pinned hero scrolls, forty coins fill one by one and the
   last turns gold: CAD 1 of every CAD 40 is Zakat. In the eight-groups section, each
   row lights as it crosses the middle of the screen, with its point on the star. */

export function initZakatEffects(): () => void {
  const hero = $(".zk-hero");
  // the pinned hero has its own CTAs, so the header stays clear and the mobile bar waits until it ends
  const heroEnd = () => hero.offsetHeight - innerHeight * 0.85;
  const chrome = initChrome({ solidAt: heroEnd, barAt: heroEnd });
  const { reduced, on } = chrome;
  const ctx = gsap.context(() => {});
  chrome.reveal();

  /* ---------- hero: forty coins ---------- */
  const coins = $$("#zkCoins i");
  let shown = 1;
  function fill(p: number) {
    const n = 1 + Math.round(clamp((p - 0.04) / 0.78) * 39);
    if (n === shown) return;
    shown = n;
    coins.forEach((c, i) => c.classList.toggle("is-on", i < n));
    hero.classList.toggle("is-full", n === 40);
  }

  ctx.add(() => {
    ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom bottom", onUpdate: (s) => fill(s.progress) });

    /* ---------- the eight: rows light, the star follows ---------- */
    const asnaf = $("#asnaf");
    $$(".asnaf__row").forEach((li) => ScrollTrigger.create({
      trigger: li, start: "top 60%", end: "bottom 40%",
      onToggle: (s) => {
        li.classList.toggle("is-on", s.isActive);
        if (s.isActive) asnaf.dataset.on = li.dataset.k;
      },
    }));

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
    if (!reduced) {
      gsap.from(".zk-hero .reveal-line>span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.15 });
      gsap.from([".zk-hero__eyebrow", ".zk-forty", ".zk-hero__sub", ".zk-hero .hero__ctas"], { y: 18, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.45 });
      gsap.from(".zk-hero .zk-arch", { y: 50, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.4 });
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
