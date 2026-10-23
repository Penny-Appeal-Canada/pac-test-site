"use client";

import { useEffect } from "react";
import { GiftProvider } from "@/components/gift";
import { About, Causes, FieldPhotos, Footer, Header, Hero, Impact, Important, RouteMarquee, TakeAction, Zakat } from "@/components/sections";
import { initEffects } from "@/lib/effects";

export default function Site() {
  useEffect(() => initEffects(), []);

  return (
    <GiftProvider>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Causes />
        <RouteMarquee />
        <Impact />
        <FieldPhotos />
        <TakeAction />
        <Zakat />
        <Important />
      </main>
      <Footer />
    </GiftProvider>
  );
}
