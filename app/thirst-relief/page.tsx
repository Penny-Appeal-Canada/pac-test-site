import type { Metadata } from "next";
import ThirstSite from "@/components/thirst";
import "../programme.css";
import "./thirst.css";

export const metadata: Metadata = {
  title: "Thirst Relief · Penny Appeal Caribbean",
  description:
    "Build a hand-pump well, a community well, a borehole or a solar off-grid well, send emergency water to Gaza, Sudan and Yemen, or give where the need is greatest.",
};

export default function ThirstReliefPage() {
  return <ThirstSite />;
}
