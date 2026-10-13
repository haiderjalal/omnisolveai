import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Sora } from "next/font/google";

import { ChapterRail } from "@/components/layout/ChapterRail";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PageEffects } from "@/components/motion/PageEffects";
import { siteConfig } from "@/content/site";
import { StoryScene } from "@/features/globe/StoryScene";
import { isIndexable } from "@/lib/environment";

import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  // only the real production deployment is indexable; previews stay private
  robots: { index: isIndexable(), follow: isIndexable() },
};

export const viewport: Viewport = {
  themeColor: "#050816",
  colorScheme: "dark",
};

/**
 * Runs before first paint. Adds `js` (enables the hidden "before reveal" states in CSS, so
 * content is never hidden when JS is off) and `rm` when the visitor prefers reduced motion.
 */
const PRE_PAINT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('rm');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-fg px-5 py-3 font-semibold text-void focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <PageEffects />
        <StoryScene />
        <Navbar />
        <ChapterRail />
        <div className="relative z-10">{children}</div>
        <FloatingContact />
      </body>
    </html>
  );
}
