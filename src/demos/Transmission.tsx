import React, { Suspense, useEffect, useRef } from "react"
import * as THREE from 'three'
import { Canvas, useThree } from "@react-three/fiber"
import styled from "styled-components"
import Model from "../assets/models/ReformLogo"
import { OrbitControls, useTexture, Environment, Billboard } from "@react-three/drei"
import demoBG from '../assets/transmission/demoBackground.png'

const Image: React.FC<{}> = () => {
  const texture = useTexture(demoBG)

  const image = useRef()

  const { gl } = useThree()
  gl.setClearColor(new THREE.Color('#2d2d2e'))

  useEffect(() => {
    if (image.current) {
      // @ts-ignore
      image.current.uTexture = texture
    }
  }, [texture])
  return <Billboard>
    <mesh position={new THREE.Vector3(0, 0, -200)}>
      <planeGeometry args={[1440, 1024, 100, 100]}/>
      <pixelRiverImageMaterial ref={image}/>
    </mesh>
  </Billboard>
}

const Transmission: React.FC<{}> = () => {


  return <Wrapper data-scroll-section>
    <Suspense fallback={<></>}>
    <Canvas camera={{ position: [0, 0, 250]}} dpr={Math.min(window.devicePixelRatio, 2)}>
      <Environment preset="warehouse" />
      <Image />
      <Model />
      <OrbitControls />
    </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  background: radial-gradient(#2d2d2e, #0c0c0c);
  height: 100vh;
  width: 100vw;
  margin: auto auto;
`

export default Transmission
