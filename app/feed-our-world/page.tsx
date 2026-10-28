import type { Metadata } from "next";
import FeedSite from "@/components/feed";
import "../programme.css";
import "./feed.css";

export const metadata: Metadata = {
  title: "Feed Our World · Penny Appeal Caribbean",
  description:
    "Feed a family for a month, support refugee women and farmers, and pay Zakat al-Fitr, Fidya, Kaffarah or Aqiqa through Feed Our World.",
};

export default function FeedOurWorldPage() {
  return <FeedSite />;
}
