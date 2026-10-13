import type Lenis from "lenis";

/**
 * Module-level handle to the active Lenis instance (null when smooth scrolling is off,
 * e.g. reduced motion). Lets any component scroll programmatically without prop drilling.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}

const HEADER_OFFSET = 72;

/** Scroll to a hash target (e.g. "#contact"), using Lenis when available. */
export function scrollToHash(hash: string, options: { immediate?: boolean } = {}): boolean {
  const id = hash.replace(/^#/, "");
  const element = id === "" || id === "top" ? document.documentElement : document.getElementById(id);
  if (!element) return false;

  const lenis = instance;
  if (lenis) {
    lenis.scrollTo(id === "" || id === "top" ? 0 : element, {
      offset: id === "" || id === "top" ? 0 : -HEADER_OFFSET,
      immediate: options.immediate,
      duration: 1.6,
    });
  } else {
    const top =
      id === "" || id === "top" ? 0 : element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: options.immediate ? "auto" : "smooth" });
  }
  return true;
}
