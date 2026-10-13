import { describe, expect, it } from "vitest";

import { clamp, damp, easeInOutCubic, lerp, lerpAngle, smoothstep, steppedIndex } from "./math";

describe("clamp / lerp", () => {
  it("clamps into range", () => {
    expect(clamp(-3)).toBe(0);
    expect(clamp(7)).toBe(1);
    expect(clamp(0.4)).toBe(0.4);
    expect(clamp(15, 10, 20)).toBe(15);
  });

  it("interpolates linearly", () => {
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
    expect(lerp(10, 20, 0.25)).toBe(12.5);
  });
});

describe("smoothstep / easing", () => {
  it("is 0 below, 1 above and monotonic between the edges", () => {
    expect(smoothstep(0.2, 0.8, 0)).toBe(0);
    expect(smoothstep(0.2, 0.8, 1)).toBe(1);
    let previous = -1;
    for (let value = 0; value <= 1; value += 0.05) {
      const current = smoothstep(0.2, 0.8, value);
      expect(current).toBeGreaterThanOrEqual(previous);
      previous = current;
    }
  });

  it("easeInOutCubic hits its endpoints and midpoint", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });
});

describe("damp", () => {
  it("moves towards the target without overshooting", () => {
    const next = damp(0, 10, 4, 0.1);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
  });

  it("is frame-rate independent: two half steps equal one full step", () => {
    const oneStep = damp(0, 10, 3, 0.2);
    const twoSteps = damp(damp(0, 10, 3, 0.1), 10, 3, 0.1);
    expect(twoSteps).toBeCloseTo(oneStep, 10);
  });
});

describe("lerpAngle", () => {
  it("takes the short way round the circle", () => {
    const from = (350 * Math.PI) / 180;
    const to = (10 * Math.PI) / 180;
    const halfway = lerpAngle(from, to, 0.5);
    // halfway between 350° and 10° is 0° (or 360°), never 180°
    expect(Math.cos(halfway)).toBeCloseTo(1, 5);
  });
});

describe("steppedIndex", () => {
  it("covers 0 … count-1 and holds on each stop", () => {
    expect(steppedIndex(0, 5)).toBe(0);
    expect(steppedIndex(1, 5)).toBe(4);
    // inside the "hold" part of the first segment the index has not started moving
    expect(steppedIndex(0.1, 5, 0.62)).toBe(0);
  });

  it("never decreases as progress increases", () => {
    let previous = -1;
    for (let progress = 0; progress <= 1; progress += 0.01) {
      const index = steppedIndex(progress, 6);
      expect(index).toBeGreaterThanOrEqual(previous);
      expect(index).toBeLessThanOrEqual(5);
      previous = index;
    }
  });
});
