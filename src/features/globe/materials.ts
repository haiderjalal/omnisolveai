import { useEffect } from "react";

import { ShaderMaterial, type ShaderMaterialParameters } from "three";

/**
 * Builds a ShaderMaterial that keeps the exact uniform objects it is given.
 *
 * react-three-fiber copies the `uniforms` prop of a <shaderMaterial> into the material's own
 * objects, which would silently break our design of sharing one set of uniforms between every
 * layer of the globe (update once per frame, all layers follow). Constructing the material
 * ourselves preserves the references.
 */
export function createGlobeMaterial(parameters: ShaderMaterialParameters): ShaderMaterial {
  return new ShaderMaterial({ toneMapped: false, ...parameters });
}

/** Frees the GPU program when the owning component unmounts. */
export function useDisposeMaterial(material: ShaderMaterial): void {
  useEffect(() => () => material.dispose(), [material]);
}
