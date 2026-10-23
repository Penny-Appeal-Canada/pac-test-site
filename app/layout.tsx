import type { Metadata, Viewport } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "Penny Appeal Caribbean",
  description:
    "Penny Appeal Caribbean is a Muslim charity working across the region: clean water, food, child sponsorship and emergency response. Zakat kept restricted.",
};

export const viewport: Viewport = {
  themeColor: "#231f20",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
