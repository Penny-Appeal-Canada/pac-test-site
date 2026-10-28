import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, clamp, initChrome } from "@/lib/chrome";

/* Motion for /thirst-relief. The waterline is one function, `wave`, used three ways:
   - hero: scroll raises the water; the "after" photo is clipped to the wave
   - wells stage: each new photo rises in under a wave, and the gauge fills
   - closing band: the same wave forms its top edge
   Clipping uses CSS `clip-path: path()` rebuilt each frame (px units), and the
   rAF loop only runs while one of the wave elements is on screen. */

type Wave = { fill: string; line: string };

/** Water surface at height `y` (px from top) across width `w`, filled down to `h`. */
function wave(w: number, h: number, y: number, t: number, amp: number): Wave {
  let line = "";
  const step = Math.max(12, w / 90);
  for (let x = 0; x <= w + step; x += step) {
    const xx = Math.min(x, w);
    const yy = y + amp * (Math.sin(xx * 0.011 + t * 1.5) * 0.62 + Math.sin(xx * 0.029 - t * 2.2) * 0.38);
    line += `${x ? "L" : "M"}${xx.toFixed(1)} ${yy.toFixed(1)} `;
  }
  return { line, fill: `${line}L${w} ${h} L0 ${h} Z` };
}
const ease = (x: number) => x * x * (3 - 2 * x);

export function initThirstEffects(): () => void {
  const hero = $(".th-hero");
  // the pinned hero has its own CTAs, so the header stays clear and the mobile bar waits until it ends
  const heroEnd = () => hero.offsetHeight - innerHeight * 0.85;
  const chrome = initChrome({ solidAt: heroEnd, barAt: heroEnd });
  const { reduced, on } = chrome;
  const ctx = gsap.context(() => {});
  chrome.reveal();

  /* ======================================================
     Hero: the water rises over the walk
     ====================================================== */
  const stage = $("#thStage"), after = $("#thAfter"), heroLine = $<SVGPathElement>("#thLine path");
  let level = 0.07, heroP = 0;
  ctx.add(() => {
    ScrollTrigger.create({
      trigger: hero, start: "top top", end: "bottom bottom",
      onUpdate: (s) => { heroP = s.progress; },
    });
  });
  function drawHero(t: number) {
    const target = 0.07 + 0.93 * ease(clamp((heroP - 0.06) / 0.78));
    level += (target - level) * (reduced ? 1 : 0.12);
    const w = stage.clientWidth, h = stage.clientHeight, y = h * (1 - level);
    const amp = reduced ? 0 : 16 * clamp(Math.min(level * 6, (1 - level) * 6));
    const wv = wave(w, h, y, t, amp);
    after.style.clipPath = `path("${wv.fill}")`;
    heroLine.setAttribute("d", wv.line);
    stage.style.setProperty("--y", `${y}px`);
    stage.style.setProperty("--ta", String(clamp((0.86 - level) * 8))); // "before" tag fades near the top
    stage.style.setProperty("--tb", String(clamp((level - 0.14) * 8))); // "after" tag fades in once there is room
    hero.classList.toggle("is-after", level > 0.52);
    hero.classList.toggle("is-full", level > 0.985);
  }

  /* ======================================================
     Wells: stage photos rise in under a wave; gauge fills
     ====================================================== */
  const frame = $(".wstage__frame"), layers = $$(".wstage__img"), stageLine = $<SVGPathElement>("#wstageLine path");
  const wells = $$(".well"), gauge = $("#gauge"), ticks = $$("#gauge li");
  let cur = 0, z = 2;
  const wipe = { v: 1, el: layers[0] as HTMLElement };
  let wipeTween: gsap.core.Tween | null = null;
  function show(n: number) {
    if (n === cur) return;
    cur = n;
    wells.forEach((el, i) => el.classList.toggle("is-active", i === n));
    ticks.forEach((el, i) => el.classList.toggle("is-on", i <= n));
    gauge.style.setProperty("--lvl", String((n + 1) / layers.length));
    const el = layers[n];
    el.style.zIndex = String(++z);
    el.style.clipPath = "inset(100% 0 0 0)"; // hidden until the first wave frame draws
    el.classList.add("is-on");
    wipeTween?.kill();
    wipe.el = el; wipe.v = 0;
    wipeTween = gsap.to(wipe, {
      v: 1, duration: reduced ? 0 : 1.3, ease: "power2.inOut",
      onComplete: () => {
        el.style.clipPath = "";
        stageLine.setAttribute("d", "");
        layers.forEach((l) => { if (l !== el) l.classList.remove("is-on"); });
      },
    });
  }
  function drawStage(t: number) {
    if (wipe.v >= 1) return;
    const w = frame.clientWidth, h = frame.clientHeight, y = h * (1 - wipe.v) + 20 * (1 - wipe.v);
    const wv = wave(w, h, y, t, reduced ? 0 : 12 * Math.sin(Math.PI * wipe.v));
    wipe.el.style.clipPath = `path("${wv.fill}")`;
    stageLine.setAttribute("d", wv.line);
  }
  ctx.add(() => {
    wells.forEach((el, i) => ScrollTrigger.create({
      trigger: el, start: "top 62%", end: "bottom 62%",
      onToggle: (s) => { if (s.isActive) show(i); },
    }));
  });

  /* ======================================================
     Closing band: a wave for its top edge
     ====================================================== */
  const edge = $<SVGSVGElement>("#fundEdge"), edgePath = $<SVGPathElement>("#fundEdge path");
  function drawEdge(t: number) {
    const w = edge.clientWidth, h = edge.clientHeight;
    edgePath.setAttribute("d", wave(w, h, h * 0.55, t * 0.7, reduced ? 0 : h * 0.28).fill);
  }

  /* ======================================================
     Count-ups and reveals
     ====================================================== */
  ctx.add(() => {
    $$("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, { v: end, duration: reduced ? 0 : 2, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("en-CA"); } });
        },
      });
    });
    if (!reduced) {
      gsap.from(".th-figs>div", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".th-figs", start: "top 85%" } });
      gsap.from(".plaque", { y: 50, opacity: 0, rotate: -2, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".plaque", start: "top 88%" } });
      gsap.from(".drop", { y: 40, opacity: 0, duration: 1, ease: "back.out(1.6)", stagger: 0.07, scrollTrigger: { trigger: ".drops", start: "top 88%" } });
      gsap.fromTo(".truck__img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".truck", start: "top bottom", end: "bottom top", scrub: true } });
    }
  });

  /* ======================================================
     Frame loop, only while a wave is on screen
     ====================================================== */
  const visible = new Set<Element>();
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))));
  [hero, frame, edge].forEach((el) => io.observe(el));
  let raf = 0;
  const t0 = performance.now();
  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    const t = (now - t0) / 1000;
    if (visible.has(hero)) drawHero(t);
    if (visible.has(frame)) drawStage(t);
    if (visible.has(edge)) drawEdge(t);
  }

  let booted = false;
  const boot = () => {
    if (booted || chrome.signal.aborted) return;
    booted = true;
    ScrollTrigger.refresh();
    drawHero(0); drawEdge(0);
    if (!reduced) {
      gsap.from(".th-hero .reveal-line>span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.15 });
      gsap.from([".th-hero__eyebrow", ".th-swap", ".th-sub", ".th-hero .hero__ctas"], { y: 18, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.45 });
      gsap.from(".header", { opacity: 0, duration: 1, ease: "power2.out", delay: 0.2 });
    }
    raf = requestAnimationFrame(loop);
  };
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(boot);
  on(window, "load", () => { if (booted) ScrollTrigger.refresh(); });

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    wipeTween?.kill();
    ctx.revert();
    chrome.destroy();
  };
}
