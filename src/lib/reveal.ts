/**
 * One shared IntersectionObserver for every scroll-reveal in the app.
 *
 * Elements get a `data-in` attribute when they enter the viewport; CSS (globals.css) does the
 * actual animation, so there is no per-element JS animation cost.
 *
 * Safety net: an observer never reports an element that was jumped over without ever
 * intersecting (e.g. a hash-link scroll). A throttled scroll sweep reveals anything already
 * above the viewport, so nothing is left invisible when the visitor scrolls back up.
 */
const pending = new Set<Element>();
let observer: IntersectionObserver | null = null;
let sweepQueued = false;
let sweepAttached = false;

function reveal(element: Element): void {
  element.setAttribute("data-in", "");
  pending.delete(element);
  observer?.unobserve(element);
}

function sweepAbove(): void {
  sweepQueued = false;
  pending.forEach((element) => {
    if (element.getBoundingClientRect().bottom < 0) reveal(element);
  });
}

function queueSweep(): void {
  if (sweepQueued || pending.size === 0) return;
  sweepQueued = true;
  window.requestAnimationFrame(sweepAbove);
}

/** Starts watching `element`; returns a cleanup function. */
export function observeReveal(element: Element): () => void {
  if (typeof IntersectionObserver === "undefined") {
    reveal(element);
    return () => undefined;
  }

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) reveal(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );

  if (!sweepAttached) {
    window.addEventListener("scroll", queueSweep, { passive: true });
    sweepAttached = true;
  }

  pending.add(element);
  observer.observe(element);
  return () => {
    pending.delete(element);
    observer?.unobserve(element);
  };
}
