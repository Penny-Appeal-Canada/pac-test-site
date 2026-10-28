import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, clamp, initChrome } from "@/lib/chrome";

/* Motion for /emergency-response. As the pinned hero scrolls, colour sweeps back
   into the photo behind a red edge and the black place stamp steps through each
   live response. In the response list, the crisis photo follows the pointer. */

export function initEmergencyEffects(): () => void {
  const hero = $(".er-hero");
  // the pinned hero has its own CTAs, so the header stays clear and the mobile bar waits until it ends
  const heroEnd = () => hero.offsetHeight - innerHeight * 0.85;
  const chrome = initChrome({ solidAt: heroEnd, barAt: heroEnd });
  const { reduced, touch, on } = chrome;
  const ctx = gsap.context(() => {});
  chrome.reveal();

  /* ---------- hero: colour returns, places step ---------- */
  const colour = $("#erColour"), edge = $("#erEdge"), place = $("#erPlace"), live = $$("#erLive li");
  const places = live.map((l) => l.textContent || "");
  let shown = 0;
  function sweep(p: number) {
    const k = clamp((p - 0.04) / 0.82);
    colour.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`;
    edge.style.left = `${k * 100}%`;
    edge.style.opacity = k > 0.002 && k < 0.998 ? "1" : "0";
    const n = Math.min(places.length - 1, Math.floor(k * places.length));
    if (n === shown) return;
    shown = n;
    place.textContent = places[n];
    live.forEach((l, i) => l.classList.toggle("is-on", i <= n));
    hero.classList.toggle("is-full", n === places.length - 1);
  }
  sweep(0);

  ctx.add(() => {
    ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom bottom", onUpdate: (s) => sweep(s.progress) });

    $$("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count), dp = (el.dataset.count!.split(".")[1] || "").length;
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, { v: end, duration: reduced ? 0 : 1.8, ease: "power3.out", onUpdate: () => { el.textContent = o.v.toLocaleString("en-CA", { minimumFractionDigits: dp, maximumFractionDigits: dp }); } });
        },
      });
    });

    /* ---------- how help arrives: the village goes through each stage of a response ---------- */
    const arrive = $(".arrive"), stages = $$(".stage"), rail = $$(".rail li"), fill = $("#railFill"), num = $("#sceneN");
    let phase = 0;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    const houses = $$(".sc-house"), tents = $$(".sc-tent");
    tl.to("#scQuake", { strokeDashoffset: 0, duration: 0.7 }, 0)
      .to(houses, { rotation: (i) => [-6, 5, -4, 7][i], y: (i) => [6, 10, 4, 8][i], transformOrigin: "50% 100%", duration: 0.35, ease: (t: number) => t + Math.sin(t * 46) * 0.6 * (1 - t) }, 0.25)
      .to("#scCrack", { strokeDashoffset: 0, duration: 0.3 }, 0.35)
      .fromTo(".sc-dust", { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05 }, 0.4)
      .to(".sc-dust", { opacity: 0, y: -30, duration: 0.4 }, 1)
      .to("#scQuake", { opacity: 0.2, duration: 0.3 }, 1)
      .fromTo("#scTruck", { x: -360 }, { x: 330, duration: 0.6, ease: "power2.out" }, 1.05)
      .fromTo(".sc-crate", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, stagger: 0.08, ease: "bounce.out" }, 1.55)
      .fromTo(".sc-person", { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.06 }, 1.6)
      .to("#scTruck", { x: -420, duration: 0.5, ease: "power2.in" }, 2.0)
      .fromTo(tents, { scaleY: 0, opacity: 0, transformOrigin: "50% 100%" }, { scaleY: 1, opacity: 1, duration: 0.25, stagger: 0.12, ease: "back.out(1.6)" }, 2.25)
      .to(houses, { rotation: 0, y: 0, duration: 0.5, ease: "power2.inOut" }, 3.0)
      .to("#scCrack", { opacity: 0, duration: 0.3 }, 3.0)
      .to({}, { duration: 0.3 }, 3.7);
    gsap.set(".sc-crate,.sc-person", { opacity: 0 });
    gsap.set(tents, { scaleY: 0, opacity: 0, transformOrigin: "50% 100%" });
    gsap.set("#scTruck", { x: -360 });
    ScrollTrigger.create({
      trigger: arrive, start: "top top", end: "bottom bottom",
      onUpdate: (s) => {
        tl.progress(s.progress);
        fill.style.transform = `scaleX(${s.progress})`;
        const n = Math.min(3, Math.floor(s.progress * 4));
        if (n === phase) return;
        phase = n;
        arrive.dataset.phase = String(n);
        num.textContent = String(n + 1).padStart(2, "0");
        stages.forEach((st, i) => st.classList.toggle("is-on", i === n));
        rail.forEach((li, i) => li.classList.toggle("is-on", i <= n));
      },
    });
    ["#flight", "#units"].forEach((sel) => ScrollTrigger.create({ trigger: sel, start: "top 75%", once: true, onEnter: () => $(sel).classList.add("is-in") }));

    if (!reduced) {
      gsap.from(".th-figs>div", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".th-figs", start: "top 85%" } });
      gsap.from(".crisis", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".crises", start: "top 85%" } });
      gsap.from(".pack__grid", { y: 50, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".pack__grid", start: "top 85%" } });
      gsap.from(".care", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".cares__grid", start: "top 85%" } });
    }
  });

  /* ---------- responses: the photo follows the pointer (pointer devices only) ---------- */
  const peek = $("#peek"), peekImg = $<HTMLImageElement>("#peek img");
  if (!touch && !reduced) {
    const x = gsap.quickTo(peek, "x", { duration: 0.6, ease: "power3.out" }), y = gsap.quickTo(peek, "y", { duration: 0.6, ease: "power3.out" });
    $$(".crisis").forEach((row) => {
      on(row, "pointerenter", () => { peekImg.src = row.dataset.img || ""; peek.classList.add("is-on"); });
      on(row, "pointerleave", () => peek.classList.remove("is-on"));
    });
    on($(".crises"), "pointermove", (e: PointerEvent) => { x(e.clientX); y(e.clientY); });
  }

  let booted = false;
  const boot = () => {
    if (booted || chrome.signal.aborted) return;
    booted = true;
    ScrollTrigger.refresh();
    if (!reduced) {
      gsap.from(".er-hero .reveal-line>span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.15 });
      gsap.from([".er-hero__eyebrow", ".er-live", ".er-hero__sub", ".er-hero .hero__ctas"], { y: 18, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.45 });
      gsap.from(".er-hero .gift", { y: 40, opacity: 0, duration: 1.3, ease: "expo.out", delay: 0.6 });
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
