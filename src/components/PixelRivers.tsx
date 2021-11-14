import React, { Suspense, useEffect, useRef } from "react"
import { shaderMaterial, useTexture } from "@react-three/drei"
import { extend, Canvas, ReactThreeFiber } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import * as THREE from 'three'
import styled from "styled-components"
import { dpr } from "../utils/Constants"

import image1 from '../assets/pixelRivers/pixelRivers1.jpg'
import image2 from '../assets/pixelRivers/pixelRivers2.jpg'
import image3 from '../assets/pixelRivers/pixelRivers3.jpg'
import image4 from '../assets/pixelRivers/pixelRivers4.jpg'

import { MyCustomEffect } from "../assets/pixelRivers/pixelRiverPass"

const PixelRiverImageMaterial = shaderMaterial({
  uTexture: new THREE.Texture()
},
`
  varying vec2 vUv;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vUv = uv;
  }
`,`
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(uTexture, vUv);
  }
`
)

type PixelRiverImageMaterialType = {
  uTexture: THREE.Texture
}

declare global { namespace JSX { interface IntrinsicElements {
  pixelRiverImageMaterial: ReactThreeFiber.Object3DNode<PixelRiverImageMaterialType, typeof PixelRiverImageMaterial>
}}}

extend({ PixelRiverImageMaterial })

type ImageProps = {
  src: string;
  positionX: number;
  positionY: number;
}
const Image: React.FC<ImageProps> = ({ src, positionX, positionY }) => {

  const material = useRef<PixelRiverImageMaterialType>(null)

  const texture = useTexture(src)

  useEffect(() => {
    if (material.current) material.current.uTexture = texture
    texture.encoding = THREE.sRGBEncoding
  }, [texture])

  return <mesh position={new THREE.Vector3(positionX, positionY, 1)}>
    <planeGeometry args={[5, 3.5, 64, 64]}/>
    <pixelRiverImageMaterial
      ref={material}
      uTexture={texture}
    />
  </mesh>
}

const PixelRivers: React.FC<{}> = () => {

  // use this to trigger transition based on up/down
  // useEffect(() => {
  //   window.addEventListener('wheel', e => {
  //     console.log(e.deltaY > 0 ? 'down' : 'up')
  //   })
  //   return () => window.removeEventListener('wheel', e => {
  //     console.log(e.deltaY > 0 ? 'down' : 'up')
  //   })
  // }, [])

  return <Wrapper>
    <Suspense fallback={<></>}>
      <Canvas dpr={dpr} camera={{ zoom: 0.7 }} linear={true}>
        <Image src={image1} positionX={3} positionY={2.25}/>
        <Image src={image2} positionX={-3} positionY={2.25}/>
        <Image src={image3} positionX={3} positionY={-2.25}/>
        <Image src={image4} positionX={-3} positionY={-2.25}/>
        <EffectComposer>
          <MyCustomEffect />
        </EffectComposer>
      </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  width: 100vw;
  height: 100vh;
  background: #212226;
`

export default PixelRivers
