import { OrbitControls, shaderMaterial, useTexture } from "@react-three/drei"
import { Canvas, extend, ReactThreeFiber } from "@react-three/fiber"
import { EffectComposer, DotScreen, Bloom } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import React, { Suspense, useEffect, useRef } from "react"
import styled from "styled-components"
import * as THREE from 'three'

const BillboardMaterial = shaderMaterial({
  map: new THREE.Texture()
},
`
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
  }
`,
`
  uniform sampler2D map;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(map, vUv);
  }
`)

type BillboardMaterialType = {
  map: THREE.Texture
  side: THREE.Side
}

declare global { namespace JSX { interface IntrinsicElements {
  billboardMaterial: ReactThreeFiber.Object3DNode<BillboardMaterialType, typeof BillboardMaterial>
} }}

extend({ BillboardMaterial })

const Billboard: React.FC<{}> = () => {

  const mat = useRef<BillboardMaterialType>(null!)

  const texture = useTexture('https://images.unsplash.com/photo-1637717256696-a0204d03a8fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80')
  useEffect(() => {
    mat.current.map = texture
    mat.current.side = THREE.DoubleSide
  }, [texture])

  return <mesh>
    <planeGeometry args={[2.16, 3.84, 1, 1]} />
    <billboardMaterial ref={mat}/>
  </mesh>
}

const BillboardWrapper: React.FC<{}> = () => {
  return <Wrapper>
    <Suspense fallback={null}>
      <Canvas dpr={[1, 2]}>
        <Billboard />
        <OrbitControls />
        <EffectComposer>
          <DotScreen
            // this is the important part
            blendFunction={BlendFunction.MULTIPLY}
          />
          <Bloom
            intensity={1.35}
            luminanceThreshold={0.1}
          />
        </EffectComposer>
      </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  background: #111;
  height: 100vh;
  width: 100vw;
`

export default BillboardWrapper
