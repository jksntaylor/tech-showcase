import React, { Suspense, useEffect, useRef, useState } from "react"
import { shaderMaterial, useTexture } from "@react-three/drei"
import { extend, Canvas, ReactThreeFiber, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Noise } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from 'three'
import gsap from 'gsap'
import styled from "styled-components"
import { dpr } from "../utils/Constants"

import image1 from '../assets/pixelRivers/pixelRivers1.jpg'
import image2 from '../assets/pixelRivers/pixelRivers2.jpg'
import image3 from '../assets/pixelRivers/pixelRivers3.jpg'
import image4 from '../assets/pixelRivers/pixelRivers4.jpg'

import { PixelRiverEffect } from "../assets/pixelRivers/pixelRiverPass"


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
`)

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
  }, [texture])

  return <mesh position={new THREE.Vector3(positionX, positionY, 1)}>
    <planeGeometry args={[3.5, 5, 64, 64]}/>
    <pixelRiverImageMaterial
      ref={material}
      uTexture={texture}
    />
  </mesh>
}

const Effects: React.FC<{}> = () => {

  const progress = useRef({ value: 0.62 })
  const [realProgress, setRealProgress] = useState(0)
  const effectRef = useRef()

  const handleUp = () => gsap.to(progress.current, {
    value: 0.62,
    duration: 2,
  })

  const handleDown = () => gsap.to(progress.current, {
    value: 0.002,
    duration: 2
  })

  const { clock } = useThree()

  useFrame(() => {
    if (realProgress !== progress.current.value) setRealProgress(progress.current.value)
    // @ts-ignore
    effectRef.current.uniforms.get('time').value = clock.getElapsedTime() * 0.5
  })

  useEffect(() => {
    window.addEventListener('wheel', e => {
      e.deltaY > 0 ? handleUp() : handleDown()
    })
    return () => window.removeEventListener('wheel', e => {
      e.deltaY > 0 ? handleUp() : handleDown()
    })
  }, [])

  return <EffectComposer>
    {/* <Bloom /> */}
    <PixelRiverEffect ref={effectRef} progress={realProgress} time={0}/>
    <Noise
      premultiply
      opacity={0.5}
      blendFunction={BlendFunction.SCREEN}
    />
  </EffectComposer>
}

const PixelRivers: React.FC<{}> = () => {
  return <Wrapper>
    <Suspense fallback={<></>}>
      <Canvas dpr={dpr} camera={{ zoom: 0.5 }} linear={true}>
        <Image src={image1} positionX={6.75} positionY={-3.75}/>
        <Image src={image2} positionX={2.25} positionY={-3.75}/>
        <Image src={image3} positionX={-2.25} positionY={-3.75}/>
        <Image src={image4} positionX={-6.75} positionY={-3.75}/>
        <Effects />
      </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  width: 100vw;
  height: 100vh;
  background: black;
`

export default PixelRivers
