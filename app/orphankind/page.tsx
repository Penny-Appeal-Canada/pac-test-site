import type { Metadata } from "next";
import OrphanSite from "@/components/orphan";
import "../programme.css";
import "./orphankind.css";

export const metadata: Metadata = {
  title: "OrphanKind · Penny Appeal Caribbean",
  description:
    "Sponsor an orphan in Pakistan or Palestine for CAD 70 a month, or a whole year for CAD 840: school, meals, clothes, healthcare and care.",
};

export default function OrphanKindPage() {
  return <OrphanSite />;
}
