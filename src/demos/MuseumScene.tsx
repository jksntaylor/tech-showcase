import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import styled from "styled-components"

import Pedestals from "../assets/models/Pedestals"
import { Environment, OrbitControls } from "@react-three/drei"

const MuseumScene: React.FC<{}> = () => {
  return <Wrapper>
    <Suspense fallback={<></>}>
      <Canvas>
        <Pedestals />
        <OrbitControls />
        <Environment preset="studio" />
      </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  background: black;
  canvas {
    height: 100vh;
    width: 100vw;
  }
`

export default MuseumScene
