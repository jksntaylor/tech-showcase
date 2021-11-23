import React from "react"
import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei"
import styled from "styled-components"
import { extend, ReactThreeFiber } from "@react-three/fiber"

const ArcCarouselMaterial = shaderMaterial({
  map: new THREE.Texture(),
  delta: 0,
  alpha: 0.6
},`
  #define PI 3.14159
  uniform float delta;
  varying vec2 vUv;

  void main() {
    vec3 pos = position;
    pos.x -= abs(sin(uv.y * PI) * 0.125) * delta * 2.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
  }
`,`
  uniform sampler2D map;
  uniform float delta;
  uniform float alpha;

  varying vec2 vUv;

  void main() {
    float angle = 0.5;
    vec2 offset = delta / 4.0 * vec2(cos(angle), sin(angle));
    float r = texture2D(map, vUv + offset).r;
    vec2 gb = texture2D(map, vUv).gb;
    vec4 image = vec4(r, gb, 1.0);
    gl_FragColor = mix(vec4(vec3(0.), 1.), image, alpha);
  }
`)

type ArcCarouselMaterialType = {
  map: THREE.Texture
  delta: number
  alpha: number
}

declare global { namespace JSX { interface IntrinsicElements {
  arcCarouselMaterial: ReactThreeFiber.Object3DNode<ArcCarouselMaterialType, typeof ArcCarouselMaterial>
}}}

extend({ ArcCarouselMaterial })

const ArcCarousel: React.FC<{}> = () => {
  return <Wrapper>

  </Wrapper>
}

const Wrapper = styled.section``

export default ArcCarousel
