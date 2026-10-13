import Image from "next/image";

import { Mail } from "lucide-react";

import { footerColumns, siteConfig } from "@/content/site";

/**
 * The current year, resolved once and cached. Cache Components forbids reading the clock
 * directly while prerendering a page; a cached function is the sanctioned way to do it.
 */
async function getCopyrightYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

/** Closing footer with navigation, contact and an oversized wordmark that fades into the page. */
export async function Footer() {
  const year = await getCopyrightYear();
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-void/70 backdrop-blur-sm">
      <div className="container-x relative z-10 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" aria-label="OmniSolve AI, back to top" className="inline-flex items-center gap-3">
              <Image src="/brand/omnisolve-mark-dark.png" alt="" width={44} height={44} className="size-11" />
              <span className="font-display text-xl font-semibold text-fg">
                OmniSolve
                <span className="ml-1.5 align-middle font-mono text-[0.68rem] font-bold tracking-widest text-aqua">
                  AI
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-aqua"
            >
              <Mail aria-hidden="true" className="size-4 text-aqua" />
              {siteConfig.contact.email}
            </a>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">{column.title}</h2>
              <ul className="mt-5 grid gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[0.95rem] text-muted transition-colors hover:text-fg">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/8 pt-6 text-sm text-subtle sm:flex-row sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.contact.location}</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="text-gradient pointer-events-none -mt-6 pb-0 text-center font-display text-[clamp(3.2rem,16.4vw,18rem)] leading-[0.82] font-semibold tracking-tighter whitespace-nowrap opacity-[0.17] select-none [mask-image:linear-gradient(to_bottom,black_25%,transparent_92%)]"
      >
        OmniSolve
      </p>
    </footer>
  );
}
