// import React, { Suspense, useState, useEffect, useRef } from "react"
import React, { Suspense, useRef } from "react"
// import * as THREE from 'three'
import { Canvas, useFrame } from "@react-three/fiber"
import styled from "styled-components"
// import Model from "../assets/models/ReformLogo"
import { Environment, OrbitControls } from "@react-three/drei"
import { Mesh } from "three"

// const Image: React.FC<{}> = () => {
//   const texture1 = useTexture('https://images.unsplash.com/photo-1495069781661-dfeacdef0531?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80')

//   const texture2 = useTexture('https://images.unsplash.com/photo-1588007375246-3ee823ef4851?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80')

//   const image = useRef()

//   const [texture, setTexture] = useState(true)

//   const handleClick = () => {
//     setTexture(!texture)
//   }

//   useEffect(() => {
//     if (image.current) {
//       // @ts-ignore
//       image.current.uTexture = texture ? texture1: texture2
//       // @ts-ignore
//       image.current.side = THREE.DoubleSide
//     }
//   }, [texture, texture1, texture2])
//   return <mesh position={new THREE.Vector3(0, 0, -100)} onClick={handleClick}>
//   <planeGeometry args={[500, 500, 100, 100]}/>
//   <pixelRiverImageMaterial ref={image}/>
// </mesh>
// }

const Glass: React.FC<{}> = () => {
  const glassRef = useRef<Mesh>(null!)

  useFrame(() => {
    // console.log(glassRef.current)
    glassRef.current.rotation.set(glassRef.current.rotation.x + 0.03, glassRef.current.rotation.y + 0.01, 0)
  })

  return <mesh ref={glassRef}>
    <icosahedronGeometry args={[100, 0]} />
    <meshPhysicalMaterial
      color="white"
      transmission={1}
      roughness={0}
      thickness={350}
      clearcoat={1}
      clearcoatRoughness={0}
    />
  </mesh>
}

const Transmission: React.FC<{}> = () => {

  return <Wrapper data-scroll-section>
    <Suspense fallback={<></>}>
    <Canvas camera={{ position: [0, 0, 250]}} dpr={2}>
      <ambientLight intensity={0.5} />
      {/* <Image /> */}
      {/* <Model /> */}
      <Glass />
      <OrbitControls />
      <Environment preset="forest" background/>
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
