"use client";

import { MessageCircle } from "lucide-react";

import { siteConfig } from "@/content/site";
import { useStoryStore } from "@/store/storyStore";
import { cn } from "@/utils/cn";

const WHATSAPP_MESSAGE = "Hello OmniSolve, I'd like to discuss a project.";

/**
 * Persistent contact shortcut (carried over from the old site's WhatsApp button).
 * Opens WhatsApp when a number is configured; otherwise scrolls to the contact form
 * rather than pretending to be something it isn't.
 */
export function FloatingContact() {
  const activeChapter = useStoryStore((state) => state.activeChapter);
  const onContact = activeChapter === "contact";
  const whatsapp = siteConfig.whatsappNumber;

  const classes = cn(
    "fixed right-4 bottom-4 z-40 inline-flex h-12 items-center gap-2.5 rounded-full px-5 text-sm font-semibold sm:right-6 sm:bottom-6",
    "bg-[image:var(--gradient-brand)] text-void shadow-glow transition-all duration-500 ease-(--ease-expo) hover:scale-105",
    onContact && "pointer-events-none translate-y-6 opacity-0",
  );

  if (whatsapp) {
    return (
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-hidden={onContact}
        tabIndex={onContact ? -1 : undefined}
      >
        <MessageCircle aria-hidden="true" className="size-5" />
        <span>Chat on WhatsApp</span>
      </a>
    );
  }

  return (
    <a href="#contact" className={classes} aria-hidden={onContact} tabIndex={onContact ? -1 : undefined}>
      <MessageCircle aria-hidden="true" className="size-5" />
      <span>Talk to us</span>
    </a>
  );
}
