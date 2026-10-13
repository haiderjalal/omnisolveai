import { BufferAttribute, BufferGeometry } from "three";

/** name → [typed array, components per vertex] */
type AttributeMap = Record<string, readonly [Float32Array, number]>;

/**
 * Builds a BufferGeometry from raw typed arrays. Point/line clouds animated in the vertex
 * shader would be wrongly frustum-culled by a bounding sphere computed from rest positions,
 * so callers also set `frustumCulled={false}` on the object.
 */
export function createGeometry(attributes: AttributeMap): BufferGeometry {
  const geometry = new BufferGeometry();
  for (const [name, [array, itemSize]] of Object.entries(attributes)) {
    geometry.setAttribute(name, new BufferAttribute(array, itemSize));
  }
  return geometry;
}
