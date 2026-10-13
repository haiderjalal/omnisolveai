import { describe, expect, it } from "vitest";

import { CHAPTER_IDS, INDUSTRY_STOPS, computeTarget } from "./chapters";
import { BASE_TARGET, TARGET_KEYS, type SceneTarget } from "./sceneState";

const solve = (index: number, progress: number): SceneTarget => {
  const out: SceneTarget = { ...BASE_TARGET };
  computeTarget(index, progress, out);
  return out;
};

describe("story chapters", () => {
  it("has a definition for every chapter id", () => {
    CHAPTER_IDS.forEach((_, index) => {
      expect(() => solve(index, 0.5)).not.toThrow();
    });
  });

  it("always produces finite numbers", () => {
    CHAPTER_IDS.forEach((_, index) => {
      for (const progress of [0, 0.01, 0.25, 0.5, 0.75, 0.99, 1]) {
        const state = solve(index, progress);
        for (const key of TARGET_KEYS)
          expect(Number.isFinite(state[key]), `${CHAPTER_IDS[index]}.${key} @${progress}`).toBe(true);
      }
    });
  });

  it("never jumps: each chapter ends exactly where the next one begins", () => {
    for (let index = 0; index < CHAPTER_IDS.length - 1; index++) {
      const end = solve(index, 1);
      const start = solve(index + 1, 0);
      for (const key of TARGET_KEYS) {
        expect(start[key], `${CHAPTER_IDS[index]} → ${CHAPTER_IDS[index + 1]}: ${key}`).toBeCloseTo(
          end[key],
          6,
        );
      }
    }
  });

  it("the industries tour rests on each stop's longitude, so the cluster faces the camera", () => {
    const industries = CHAPTER_IDS.indexOf("industries");
    // sample the middle of each segment, where the tour is holding still on a stop
    // (past the first 10% of the chapter, which eases in from the previous chapter's pose)
    INDUSTRY_STOPS.forEach((stop, stopIndex) => {
      const progress = 0.04 + ((stopIndex + 0.5) / INDUSTRY_STOPS.length) * 0.94;
      const state = solve(industries, progress);
      expect(state.rotY).toBeCloseTo((-stop.lon * Math.PI) / 180, 2);
    });
  });

  it("the gap chapter breaks the network and the industries chapter rebuilds it", () => {
    const gap = CHAPTER_IDS.indexOf("gap");
    const industries = CHAPTER_IDS.indexOf("industries");
    expect(solve(gap, 0).integrity).toBe(1);
    expect(solve(gap, 1).integrity).toBeLessThan(0.2);
    expect(solve(industries, 1).integrity).toBe(1);
  });
});
