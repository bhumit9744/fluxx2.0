import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLUXX — Autonomous VTOL Agricultural Ecosystem",
  description:
    "An interactive cinematic 3D journey through the lifecycle of FLUXX, the world's most advanced autonomous VTOL platform engineering tomorrow's agriculture.",
  keywords: [
    "FLUXX",
    "VTOL",
    "Autonomous Drone",
    "Precision Agriculture",
    "Biomass Hydrogen",
    "Nano-Urea",
    "NDVI AI Scanning",
    "Three.js 3D Web",
  ],
  authors: [{ name: "FLUXX Aerospace & Robotics" }],
  openGraph: {
    title: "FLUXX — Autonomous VTOL Agricultural Ecosystem",
    description: "Experience the continuous cinematic scroll mission of sovereign autonomous agriculture.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 text-slate-900 antialiased overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-900 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
