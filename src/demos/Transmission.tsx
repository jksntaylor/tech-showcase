import React, { Suspense, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import Model from "../assets/models/ReformLogo"
import { OrbitControls, useTexture } from "@react-three/drei"

const Image: React.FC<{}> = () => {
  const texture1 = useTexture('https://images.unsplash.com/photo-1612520557101-48a83a15d1e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80')

  const texture2 = useTexture('https://images.unsplash.com/photo-1627148745533-1d945408b6d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80')

  const image = useRef()

  const [texture, setTexture] = useState(true)

  const handleClick = () => {
    setTexture(!texture)
  }

  useEffect(() => {
    if (image.current) {
      // @ts-ignore
      image.current.uTexture = texture ? texture1: texture2
      // @ts-ignore
      image.current.side = THREE.DoubleSide
    }
  }, [texture, texture1, texture2])
  return <mesh position={new THREE.Vector3(0, 0, -100)} onClick={handleClick}>
  <planeGeometry args={[500, 500, 100, 100]}/>
  <pixelRiverImageMaterial ref={image}/>
</mesh>
}

const Transmission: React.FC<{}> = () => {


  return <Wrapper data-scroll-section>
    <Suspense fallback={<></>}>
    <Canvas camera={{ position: [0, 0, 250]}} dpr={2}>
      <ambientLight intensity={0.5} />
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
