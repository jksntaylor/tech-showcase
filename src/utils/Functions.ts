import * as THREE from 'three'

export const hexToShaderRGB = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? new THREE.Vector4(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
    1.0
  ) : new THREE.Vector4(0, 0, 0, 1)
}
