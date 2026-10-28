import type { Metadata } from "next";
import ZakatSite from "@/components/zakat";
import "../programme.css";
import "./zakat.css";

export const metadata: Metadata = {
  title: "Zakat · Penny Appeal Caribbean",
  description:
    "Calculate your Zakat with our AI calculator, then pay it where it's needed most. Zakat al-Fitr is CAD 15 a person. Every contribution is treated as an Amanah.",
};

export default function ZakatPage() {
  return <ZakatSite />;
}
