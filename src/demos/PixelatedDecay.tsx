import { Canvas } from "@react-three/fiber"
import React from "react"
import styled from "styled-components"

const PixelatedDecay: React.FC<{}> = () => {
  return <mesh>

  </mesh>
}

const PixelatedDecayWrapper: React.FC<{}> = () => {
  return <Wrapper>
    <Canvas>
      <PixelatedDecay />
    </Canvas>
  </Wrapper>
}

const Wrapper = styled.section``

export default PixelatedDecayWrapper
