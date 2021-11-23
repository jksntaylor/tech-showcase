import React, { useEffect, useRef } from "react"
import * as THREE from 'three'
import { Canvas, extend, ReactThreeFiber, useFrame } from "@react-three/fiber"
import { OrbitControls, shaderMaterial } from "@react-three/drei"
import styled from "styled-components"

const GooeyNoiseMaterial = shaderMaterial({
  uTime: 0
}, `
  varying vec2 vUv;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vUv = uv;
  }
`, `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 p = 2.*vUv - vec2(1.);

    p += 0.1 * cos(2.9 * p.yx + 1.0*uTime + vec2(1.2, 3.4));
    p += 0.2 * cos(3.7 * p.yx + 1.4*uTime + vec2(2.2, 3.4));
    p += 0.3 * cos(5.7 * p.yx + 2.6*uTime + vec2(4.2, 1.4));
    p += 0.6 * cos(6.7 * p.yx + 3.6*uTime + vec2(10.2, 3.4));

    gl_FragColor = vec4(length(p), 0., 0.2, 1.);
  }
`)

type GooeyNoiseMaterialType = {
  uTime: number;
}

declare global { namespace JSX { interface IntrinsicElements {
  gooeyNoiseMaterial: ReactThreeFiber.Object3DNode<GooeyNoiseMaterialType, typeof GooeyNoiseMaterial>
}}}

extend({ GooeyNoiseMaterial })

const Noise: React.FC<{}> = () => {

  const material = useRef<GooeyNoiseMaterialType>({ uTime: 0 })

  useEffect(() => {
    // @ts-ignore
    if (material.current) material.current.side = THREE.DoubleSide
  }, [])

  useFrame((s, delta) => {
    material.current.uTime += delta
  })

  return <mesh>
    <planeGeometry args={[5, 5, 64, 64]}/>
    <gooeyNoiseMaterial uTime={0} ref={material} attach="material"/>
  </mesh>
}

const GooeyNoise: React.FC<{}> = () => {
  return <Wrapper>
    <Canvas dpr={Math.min(window.devicePixelRatio, 2)}>
      <Noise />
      <OrbitControls />
    </Canvas>
  </Wrapper>
}

const Wrapper = styled.section`
  background: #241114;
  height: 100vh;
  width: 100vw;
  margin: auto auto;
`

export default GooeyNoise
