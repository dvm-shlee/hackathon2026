import type React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "OHBM Brainhack Bordeaux 2026 | June 11-13",
  description:
    "Join us in Bordeaux, France for OHBM Brainhack 2026, a 3-day collaborative event for building, learning, and connecting around open neuroimaging tools.",
  icons: {
    icon: [
      {
        url: "/ossig_logo.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/ossig_logo.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/ossig_logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/ossig_logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased snap-y snap-proximity scroll-smooth">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
