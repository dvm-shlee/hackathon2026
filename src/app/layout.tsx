import type React from "react";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hackathon Bordeaux 2026 | June 11-13",
  description:
    "Join us in Bordeaux, France for an unforgettable 3-day hackathon experience. Build, innovate, and connect with developers from around the world.",
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
      <body className={`${inter.className} antialiased snap-y snap-proximity scroll-smooth`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
