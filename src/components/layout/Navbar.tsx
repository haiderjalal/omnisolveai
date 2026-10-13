"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Menu, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { navLinks } from "@/content/site";
import type { ChapterId } from "@/features/story/chapters";
import { useStoryStore } from "@/store/storyStore";
import { cn } from "@/utils/cn";

/** Which story chapters light up each nav link. */
const LINK_CHAPTERS: Record<string, readonly ChapterId[]> = {
  "#industries": ["industries"],
  "#services": ["services"],
  "#proof": ["proof"],
  "#team": ["team", "trust"],
  "#pricing": ["plans"],
};

const HIDE_AFTER_PX = 240;

function BrandMark() {
  return (
    <a
      href="#top"
      aria-label="OmniSolve AI, back to top"
      className="flex items-center gap-2.5 rounded-full py-1 pr-3"
    >
      <Image
        src="/brand/omnisolve-mark-dark.png"
        alt=""
        width={36}
        height={36}
        priority
        className="size-9 object-contain"
      />
      <span className="font-display text-[1.08rem] font-semibold tracking-tight text-fg">
        OmniSolve
        <span className="ml-1.5 align-middle font-mono text-[0.62rem] font-bold tracking-widest text-aqua">
          AI
        </span>
      </span>
    </a>
  );
}

/** Floating glass navigation: hides while reading, returns on scroll-up, highlights the current chapter. */
export function Navbar() {
  const activeChapter = useStoryStore((state) => state.activeChapter);
  const [hidden, setHidden] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = (): void => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) > 6) {
          setHidden(y > HIDE_AFTER_PX && delta > 0);
          lastY = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = (): void => dialogRef.current?.close();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-transform duration-500 ease-(--ease-expo) sm:px-5 sm:pt-4",
        hidden && "-translate-y-[130%]",
      )}
    >
      <nav
        aria-label="Primary"
        className="glass flex h-14 w-full max-w-6xl items-center justify-between rounded-full pr-2 pl-3"
      >
        <BrandMark />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = LINK_CHAPTERS[link.href]?.includes(activeChapter) ?? false;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm text-muted transition-colors duration-300 hover:text-fg",
                    active && "text-fg",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-[image:var(--gradient-brand)] transition-transform duration-500 ease-(--ease-expo)",
                      active && "scale-x-100",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink href="#proof" variant="ghost" arrow={false} className="hidden md:inline-flex">
            See our work
          </ButtonLink>
          <ButtonLink href="#contact" className="hidden sm:inline-flex">
            Start a project
          </ButtonLink>
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => dialogRef.current?.showModal()}
            className="glass grid size-10 place-items-center rounded-full text-fg lg:hidden"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </nav>

      {/* Native modal dialog: free focus trap, Escape to close and inert background */}
      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="menu-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-fg backdrop:bg-transparent"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="glass-strong mx-3 mt-3 rounded-[2rem] p-6 sm:mx-5">
          <div className="flex items-center justify-between">
            <BrandMark />
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="glass grid size-10 place-items-center rounded-full"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <ul className="mt-8 flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href} className="border-t border-white/10 first:border-t-0">
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block py-4 font-display text-2xl font-semibold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div onClick={closeMenu} className="mt-6">
            <ButtonLink href="#contact" size="lg" className="w-full">
              Start a project
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </header>
  );
}
