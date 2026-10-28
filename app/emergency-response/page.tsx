import type { Metadata } from "next";
import EmergencySite from "@/components/emergency";
import "../programme.css";
import "./emergency.css";

export const metadata: Metadata = {
  title: "Emergency Response · Penny Appeal Caribbean",
  description:
    "Food, water, shelter and medical care for families caught in war and disaster, in Gaza, Sudan, Syria, Afghanistan and Yemen.",
};

export default function EmergencyResponsePage() {
  return <EmergencySite />;
}
