/** Unit-sphere helpers shared by the network, land and tag placement. */

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Evenly distributed points on the unit sphere (Fibonacci lattice) with optional jitter.
 * Returns a flat xyz array of length `count * 3`.
 */
export function fibonacciSphere(count: number, jitter: number, random: () => number): Float32Array {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const y = 1 - ((i + 0.5) / count) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    let x = Math.cos(theta) * radius;
    let z = Math.sin(theta) * radius;
    let yy = y;
    if (jitter > 0) {
      x += (random() - 0.5) * jitter;
      yy += (random() - 0.5) * jitter;
      z += (random() - 0.5) * jitter;
      const length = Math.hypot(x, yy, z) || 1;
      x /= length;
      yy /= length;
      z /= length;
    }
    points[i * 3] = x;
    points[i * 3 + 1] = yy;
    points[i * 3 + 2] = z;
  }
  return points;
}

/**
 * Longitude / latitude (radians) → unit vector. Longitude 0 faces the camera at rotation 0,
 * east is +x — so rotating the globe by `-lon` brings that meridian to the front.
 */
export function lonLatToVector(lon: number, lat: number): [number, number, number] {
  const cosLat = Math.cos(lat);
  return [cosLat * Math.sin(lon), Math.sin(lat), cosLat * Math.cos(lon)];
}

/** Random unit vector. */
export function randomDirection(random: () => number): [number, number, number] {
  const u = random() * 2 - 1;
  const theta = random() * Math.PI * 2;
  const radius = Math.sqrt(1 - u * u);
  return [radius * Math.cos(theta), u, radius * Math.sin(theta)];
}
