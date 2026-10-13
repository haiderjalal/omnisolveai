import { createRandom } from "@/utils/random";

import { LAND_MASK_HEIGHT, LAND_MASK_ROWS, LAND_MASK_WIDTH } from "../data/landMask";

import { fibonacciSphere, randomDirection } from "./sphere";

export const LAND_RADIUS = 1.004;

export interface LandPoints {
  count: number;
  positions: Float32Array;
  scatter: Float32Array;
  random: Float32Array;
  sizes: Float32Array;
}

/** Decodes the run-length encoded 1° land mask into one byte per cell (1 = land). */
function decodeLandMask(): Uint8Array {
  const mask = new Uint8Array(LAND_MASK_WIDTH * LAND_MASK_HEIGHT);
  LAND_MASK_ROWS.forEach((row, rowIndex) => {
    let column = 0;
    let isLand = false; // rows start with a run of water
    for (const run of row.split(",")) {
      const length = Number(run);
      if (isLand)
        mask.fill(1, rowIndex * LAND_MASK_WIDTH + column, rowIndex * LAND_MASK_WIDTH + column + length);
      column += length;
      isLand = !isLand;
    }
  });
  return mask;
}

/** Evenly spread dots covering the continents, ready to upload as GPU attributes. */
export function buildLandPoints(targetCount: number, seed = 21): LandPoints {
  const random = createRandom(seed);
  const mask = decodeLandMask();

  // land covers ~24% of the sphere, so oversample candidates to hit the target count
  const candidates = fibonacciSphere(Math.ceil(targetCount / 0.2), 0.0, random);
  const kept: number[] = [];

  for (let i = 0; i < candidates.length / 3; i++) {
    const x = candidates[i * 3];
    const y = candidates[i * 3 + 1];
    const z = candidates[i * 3 + 2];
    const lat = Math.asin(y);
    const lon = Math.atan2(x, z);
    const row = Math.min(LAND_MASK_HEIGHT - 1, Math.floor(90 - (lat * 180) / Math.PI));
    const column = Math.min(LAND_MASK_WIDTH - 1, Math.floor((lon * 180) / Math.PI + 180));
    if (mask[row * LAND_MASK_WIDTH + column] === 1) kept.push(i);
  }

  const count = Math.min(kept.length, targetCount);
  const stride = kept.length / count;
  const positions = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const randomValues = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let n = 0; n < count; n++) {
    const source = kept[Math.floor(n * stride)];
    positions[n * 3] = candidates[source * 3] * LAND_RADIUS;
    positions[n * 3 + 1] = candidates[source * 3 + 1] * LAND_RADIUS;
    positions[n * 3 + 2] = candidates[source * 3 + 2] * LAND_RADIUS;

    const away = randomDirection(random);
    const distance = 2.4 + random() * 6;
    scatter[n * 3] = away[0] * distance;
    scatter[n * 3 + 1] = away[1] * distance * 0.8;
    scatter[n * 3 + 2] = away[2] * distance - 1.5;

    randomValues[n] = random();
    sizes[n] = 0.0085 + random() * 0.0075;
  }

  return { count, positions, scatter, random: randomValues, sizes };
}
