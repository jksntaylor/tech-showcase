import { shaderMaterial } from "@react-three/drei"
import { Canvas, extend, ReactThreeFiber, useThree } from "@react-three/fiber"
import React, { Suspense } from "react"
import styled from "styled-components"

const DecayMaterial = shaderMaterial({
  time: 0
},`
  varying vec2 vUv;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vUv = uv;
  }
`,`
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(vUv.x, 0., vUv.y, 1.);
  }
`)

type decayMaterialType = {
  time: number
}

declare global { namespace JSX { interface IntrinsicElements {
  decayMaterial: ReactThreeFiber.Object3DNode<decayMaterialType, typeof DecayMaterial>
}}}

extend({ DecayMaterial })

const PixelatedDecay: React.FC<{}> = () => {

  const { gl } = useThree()
  gl.setClearColor('black')

  return <mesh>
    <planeGeometry args={[3, 5, 20, 20]} />
    <decayMaterial />
  </mesh>
}

const PixelatedDecayWrapper: React.FC<{}> = () => {
  return <Wrapper>
    <Suspense fallback={null}>
      <Canvas>
        <PixelatedDecay />
      </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  canvas {
    height: 100vh;
    width: 100vw;
  }
`

export default PixelatedDecayWrapper
