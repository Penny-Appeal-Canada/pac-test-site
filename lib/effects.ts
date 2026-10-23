import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { MARQUEE_PHRASE, SLIDES } from "@/lib/content";

/* Imperative motion for the page: smooth scroll, hero carousel, reveals, tickers,
   curved marquee, counters and small interactions. React owns the markup and the
   stateful widgets (gift form, impact filter, coverflow); this only animates it.

   Returns a cleanup that undoes everything, so React Strict Mode's double effect
   run in development is safe.

   Rule learned the hard way: never let GSAP tween `transform` on an element that
   also has a CSS transition on transform; they fight and the element freezes
   part-way. Use opacity, the independent `translate` property, or classes. */

type Ticker = { measure: () => void; tick: (dt: number, boost: number) => void };

export function initEffects(): () => void {
  gsap.registerPlugin(ScrollTrigger);
  const ac = new AbortController();
  const on = <K extends keyof WindowEventMap>(t: EventTarget, type: K | string, fn: (e: never) => void, opts: AddEventListenerOptions = {}) =>
    t.addEventListener(type, fn as EventListener, { ...opts, signal: ac.signal });
  const timers: ReturnType<typeof setTimeout>[] = [];
  const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none)").matches;
  const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
  const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- smooth scroll ---------- */
  const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !reduced });
  lenis.on("scroll", ScrollTrigger.update);
  const lenisRaf = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);

  const ctx = gsap.context(() => {});
  const add = (fn: () => void) => ctx.add(fn);

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

  /* ---------- header: solid after hero, hides on scroll down ---------- */
  const header = $("#header"), mbar = $("#mbar");
  let lastY = 0;
  lenis.on("scroll", ({ scroll }: { scroll: number }) => {
    header.classList.toggle("is-solid", scroll > innerHeight * 0.75);
    if (scroll > innerHeight && scroll > lastY + 2 && !document.body.classList.contains("menu-open")) header.classList.add("is-hidden");
    if (scroll < lastY - 2 || scroll <= innerHeight) header.classList.remove("is-hidden");
    lastY = scroll;
    mbar.classList.toggle("is-on", scroll > innerHeight * 0.6);
  });

  /* ---------- buttons: glow follows the pointer ---------- */
  on(document, "pointermove", (e: PointerEvent) => {
    const b = (e.target as Element).closest?.(".btn") as HTMLElement | null;
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty("--gx", `${e.clientX - r.left}px`);
    b.style.setProperty("--gy", `${e.clientY - r.top}px`);
  });

  /* ======================================================
     HERO carousel: wipe + Ken Burns + line reveal + autoplay progress
     ====================================================== */
  const slideEls = $$(".slide"), copies = $$("#heroCopy .copy"), dotEls = $$("#dots button");
  const DUR = 7;
  let cur = 0, busy = false;
  let progTween: gsap.core.Tween | null = null;
  const parts = (c: Element) => $$(".reveal-line>span, .hero__eyebrow, .hero__sub, .hero__ctas", c);
  function animateIn(c: Element) {
    if (reduced) return;
    gsap.fromTo($$(".reveal-line>span", c), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 });
    gsap.fromTo([$(".hero__eyebrow", c), $(".hero__sub", c), $(".hero__ctas", c)], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.25 });
  }
  function peek() {
    const nx = SLIDES[(cur + 1) % SLIDES.length];
    $<HTMLImageElement>("#peekImg").src = `https://pennyappeal-caribbean.netlify.app/images/${nx.img}`;
    $("#peekName").textContent = nx.eyebrow;
  }
  function runProgress() {
    dotEls.forEach((d, i) => {
      d.classList.toggle("is-done", i < cur);
      d.setAttribute("aria-selected", String(i === cur));
      gsap.set($("span", d), { scaleX: i < cur ? 1 : 0 });
    });
    progTween?.kill();
    if (reduced) return;
    progTween = gsap.to($("span", dotEls[cur]), { scaleX: 1, duration: DUR, ease: "none", onComplete: () => go(cur + 1) });
  }
  function go(n: number, dir = 1) {
    n = (n + SLIDES.length) % SLIDES.length;
    if (n === cur || busy) return;
    busy = true;
    const from = slideEls[cur], to = slideEls[n], oldCopy = copies[cur], newCopy = copies[n];
    to.classList.add("is-entering"); to.setAttribute("aria-hidden", "false"); from.setAttribute("aria-hidden", "true");
    const img = $("img", to); img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    gsap.fromTo(to, { clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, {
      clipPath: "inset(0 0% 0 0%)", duration: reduced ? 0 : 1.25, ease: "expo.inOut",
      onComplete: () => {
        from.classList.remove("is-current"); gsap.set(from, { clearProps: "clipPath" });
        to.classList.add("is-current"); to.classList.remove("is-entering"); gsap.set(to, { clearProps: "clipPath" });
        busy = false;
      },
    });
    gsap.to($("img", from), { xPercent: dir > 0 ? -8 : 8, duration: 1.25, ease: "expo.inOut", onComplete: () => { gsap.set($("img", from), { xPercent: 0 }); } });
    gsap.to(parts(oldCopy), {
      yPercent: -60, opacity: 0, duration: 0.45, ease: "power3.in", stagger: 0.03,
      onComplete: () => {
        oldCopy.classList.remove("is-current"); gsap.set(parts(oldCopy), { clearProps: "all" });
        newCopy.classList.add("is-current"); animateIn(newCopy);
      },
    });
    cur = n; peek(); runProgress();
  }
  on($("#next"), "click", () => go(cur + 1, 1));
  on($("#peek"), "click", () => go(cur + 1, 1));
  on($("#prev"), "click", () => go(cur - 1, -1));
  dotEls.forEach((d, i) => on(d, "click", () => go(i, i > cur ? 1 : -1)));
  const dock = $("#giftDock");
  ["focusin", "pointerenter"].forEach((ev) => on(dock, ev, () => progTween?.pause()));
  ["focusout", "pointerleave"].forEach((ev) => on(dock, ev, () => { if (!dock.contains(document.activeElement)) progTween?.resume(); }));
  const hero = $(".hero");
  let sx: number | null = null;
  on(hero, "touchstart", (e: TouchEvent) => { if ((e.target as Element).closest(".gift")) return; sx = e.touches[0].clientX; }, { passive: true });
  on(hero, "touchend", (e: TouchEvent) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    sx = null;
  });

  /* gift drawer open/close (dispatched by components/gift.tsx) */
  on(window, "pa:lock", () => { closeMenu(); lenis.stop(); progTween?.pause(); });
  on(window, "pa:unlock", () => { lenis.start(); progTween?.resume(); });
  on(window, "keydown", (e: KeyboardEvent) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) closeMenu(); });
  on(document, "visibilitychange", () => { if (document.hidden) progTween?.pause(); else progTween?.resume(); });

  /* ======================================================
     Scroll reveals
     ====================================================== */
  add(() => {
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

    /* polaroid stack straightens as it passes */
    $$("#stack figure").forEach((f) => {
      const r = Number(f.dataset.r), s = Number(f.dataset.s);
      gsap.fromTo(f, { rotate: r, y: s }, { rotate: r * 0.25, y: -s * 0.4, ease: "none", scrollTrigger: { trigger: "#stack", start: "top bottom", end: "bottom top", scrub: 1 } });
    });

    if (!reduced) {
      gsap.from(".cause", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: "#cards", start: "top 85%" } });
      gsap.to("#carMap", { y: -60, ease: "none", scrollTrigger: { trigger: "#causes", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from(".part", { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".parts", start: "top 85%" } });
    }

    /* impact map pins pop in (CSS transition, staggered by --i) */
    const wm = $("#worldmap");
    ScrollTrigger.create({ trigger: wm, start: "top 75%", once: true, onEnter: () => { wm.classList.add("is-in"); later(() => wm.classList.add("is-done"), 1400); } });

    /* count-up totals and proportional bars */
    ScrollTrigger.create({
      trigger: ".raised", start: "top 80%", once: true,
      onEnter: () => {
        $$("[data-count]").forEach((el) => {
          const o = { v: 0 }, end = Number(el.dataset.count);
          gsap.to(o, { v: end, duration: reduced ? 0 : 2.2, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("en-CA"); } });
        });
        $$(".bar i").forEach((b, i) => gsap.to(b, { scaleX: Number(b.dataset.w), duration: reduced ? 0 : 1.6, delay: 0.2 + i * 0.08, ease: "expo.out" }));
      },
    });

    /* Zakat ring-fence draws around the restricted programmes */
    ScrollTrigger.create({
      trigger: "#fence", start: "top 75%", once: true,
      onEnter: () => {
        const r = $<SVGRectElement>("#fenceRect"), L = r.getTotalLength();
        if (reduced) return;
        gsap.fromTo(r, { strokeDasharray: `0 ${L}` }, { strokeDasharray: `${L} 0`, duration: 1.6, ease: "power2.inOut", onComplete: () => { r.style.strokeDasharray = ""; } });
        gsap.from(".fence .pill", { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: "expo.out", delay: 0.4 });
        gsap.from(".fence .lock", { scale: 0, rotate: -40, duration: 0.9, ease: "back.out(2.5)", delay: 1.3 });
      },
    });
  });

  /* ======================================================
     Drag-able drifting tickers (programmes + field photos)
     ====================================================== */
  function dragDrift(viewport: HTMLElement, speed: number): Ticker {
    const track = $(".ticker__track", viewport);
    const st = { x: 0, v: 0, drag: false, hover: false, lx: 0, lt: 0, moved: 0, w: 0 };
    on(viewport, "pointerdown", (e: PointerEvent) => { st.drag = true; st.moved = 0; st.lx = e.clientX; st.lt = performance.now(); st.v = 0; viewport.classList.add("is-drag"); viewport.setPointerCapture(e.pointerId); });
    on(viewport, "pointermove", (e: PointerEvent) => {
      if (!st.drag) return;
      const dx = e.clientX - st.lx, now = performance.now();
      st.x += dx; st.moved += Math.abs(dx); st.v = (dx / Math.max(1, now - st.lt)) * 16; st.lx = e.clientX; st.lt = now;
    });
    const end = () => { st.drag = false; viewport.classList.remove("is-drag"); };
    on(viewport, "pointerup", end); on(viewport, "pointercancel", end);
    on(viewport, "pointerenter", (e: PointerEvent) => { if (e.pointerType === "mouse") st.hover = true; });
    on(viewport, "pointerleave", () => { st.hover = false; });
    on(viewport, "click", (e: MouseEvent) => { if (st.moved > 6) { e.preventDefault(); e.stopPropagation(); } }, { capture: true });
    return {
      measure() { st.w = track.scrollWidth / 3; },
      tick(dt, boost) {
        if (!st.drag) { st.x += st.v; st.v *= 0.94; if (!st.hover && !reduced) st.x -= (speed + boost * Math.sign(speed || 1)) * dt; }
        if (st.w) { while (st.x > 0) st.x -= st.w; while (st.x < -st.w * 2) st.x += st.w; }
        track.style.transform = `translate3d(${st.x}px,0,0)`;
      },
    };
  }
  const tickers = $$(".ticker").map((t) => dragDrift(t, Number(t.dataset.speed || 30)));

  /* ======================================================
     Curved velocity marquee
     ====================================================== */
  const rt = $<SVGTextPathElement>("#routeText");
  let phraseLen = 0, routeX = 0, routePaused = reduced;
  function measureRoute() {
    const svg = $<SVGSVGElement>("#routeSvg");
    const tmp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tmp.textContent = MARQUEE_PHRASE;
    svg.appendChild(tmp);
    phraseLen = tmp.getComputedTextLength();
    tmp.remove();
  }
  const pauseBtn = $("#routePause");
  on(pauseBtn, "click", () => {
    routePaused = !routePaused;
    pauseBtn.setAttribute("aria-pressed", String(routePaused));
    pauseBtn.setAttribute("aria-label", routePaused ? "Play the moving text" : "Pause the moving text");
    pauseBtn.innerHTML = routePaused
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  });

  /* ======================================================
     Footer wordmark reacts to the pointer
     ====================================================== */
  const letters = $$("#giant span");
  if (!touch) on($(".footer"), "pointermove", (e: PointerEvent) => {
    letters.forEach((s) => {
      const r = s.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)), k = clamp(1 - d / 260);
      s.style.transform = `translateY(${-k * 22}px)`;
      s.classList.toggle("is-hot", k > 0.55);
    });
  });

  /* ---------- fence size ---------- */
  function sizeFence() {
    const f = $("#fence"), r = $("#fenceRect");
    r.setAttribute("width", String(f.clientWidth - 2));
    r.setAttribute("height", String(f.clientHeight - 2));
  }

  /* ======================================================
     Frame loop + boot
     ====================================================== */
  let last = performance.now(), raf = 0;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const v = Math.abs(lenis.velocity || 0);
    tickers.forEach((t) => t.tick(dt, v * 6));
    if (!routePaused && phraseLen) routeX = (routeX - (60 + v * 40) * dt) % phraseLen;
    rt.setAttribute("startOffset", String(routeX - phraseLen));
  }
  function measureAll() { tickers.forEach((t) => t.measure()); measureRoute(); sizeFence(); ScrollTrigger.refresh(); }

  let booted = false;
  const boot = () => {
    if (booted || ac.signal.aborted) return;
    booted = true;
    measureAll();
    runProgress();
    if (!reduced) {
      const c0 = copies[0];
      gsap.from($$(".reveal-line>span", c0), { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.15 });
      gsap.from([$(".hero__eyebrow", c0), $(".hero__sub", c0), $(".hero__ctas", c0), ".hero__ctrl"], { y: 18, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.4 });
      gsap.from("#giftDock .gift", { y: 40, opacity: 0, duration: 1.3, ease: "expo.out", delay: 0.7 });
      gsap.from(".header", { opacity: 0, duration: 1, ease: "power2.out", delay: 0.2 });
    }
    raf = requestAnimationFrame(frame);
  };
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(boot);
  on(window, "load", () => { if (booted) measureAll(); });
  let rw = innerWidth, rto: ReturnType<typeof setTimeout> | undefined;
  on(window, "resize", () => {
    clearTimeout(rto);
    rto = setTimeout(() => { if (innerWidth !== rw) { rw = innerWidth; measureAll(); } else sizeFence(); }, 150);
  });

  return () => {
    ac.abort();
    timers.forEach(clearTimeout);
    clearTimeout(rto);
    cancelAnimationFrame(raf);
    progTween?.kill();
    ctx.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.killTweensOf("*");
    gsap.ticker.remove(lenisRaf);
    lenis.destroy();
    document.body.classList.remove("menu-open");
  };
}
