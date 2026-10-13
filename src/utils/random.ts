/**
 * Deterministic PRNG (mulberry32). The globe is generated procedurally; using a
 * seeded generator guarantees identical geometry on server and client and across
 * reloads — and avoids Math.random() during render, which Cache Components rejects.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
