/**
 * Cached scroll position.
 *
 * Reading `window.scrollY` forces the browser to flush pending style and layout work. Our
 * per-frame animation loops (story driver, tethered tags, …) write styles every frame, so reading
 * the scroll position in the same loop causes a forced reflow — dozens of milliseconds of wasted
 * main-thread time on a busy page. Instead, scroll events (cheap, passive) refresh this cache and
 * the loops read the cache.
 */
export const scroll = {
  /** Last known `window.scrollY`. */
  y: 0,
  /** Incremented on every scroll event; lets a loop cheaply detect "nothing changed". */
  version: 0,
};

type Listener = () => void;

const listeners = new Set<Listener>();
let attached = false;

function handleScroll(): void {
  scroll.y = window.scrollY;
  scroll.version += 1;
  listeners.forEach((listener) => listener());
}

/** Subscribes to scroll changes (and starts tracking on first use). Returns an unsubscribe function. */
export function subscribeToScroll(listener?: Listener): () => void {
  if (!attached) {
    scroll.y = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    attached = true;
  }
  if (listener) listeners.add(listener);
  return () => {
    if (listener) listeners.delete(listener);
  };
}
