"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Single place where GSAP is configured, so every module imports the same instance.
 *
 * Deliberately minimal: ScrollTrigger is not used (scroll progress comes from our own
 * StoryDriver), Flip is loaded on demand (see features/team/StackExplorer), and text splitting
 * happens on the server. Keeping the initial bundle small matters more than convenience here.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export { gsap, useGSAP };
