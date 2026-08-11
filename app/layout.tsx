import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/env";
import { organizationSchema } from "@/lib/structured-data";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Restoration Emergency Dispatch System | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.defaultDescription,
  applicationName: site.name,
  keywords: [
    "restoration answering service",
    "water damage dispatch",
    "fire damage answering",
    "after-hours emergency intake",
    "restoration call routing",
    "verified dispatch",
    "Alizane Labs",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `Restoration Emergency Dispatch System | ${site.name}`,
    description: site.defaultDescription,
    url: siteUrl,
    images: [
      {
        url: "/alizane-logo-v5.png",
        width: 400,
        height: 100,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Restoration Emergency Dispatch System | ${site.name}`,
    description: site.defaultDescription,
    images: ["/alizane-logo-v5.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-offwhite">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
