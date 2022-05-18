import { shaderMaterial } from '@react-three/drei'
import { Canvas, extend, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const MaterialName = shaderMaterial({
  time: 0
}, `
// Vertex Shader

varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
vUv = uv;
}
`,`
// Fragment Shader
uniform float time;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv.x, abs(sin(time)), vUv.y, 1.);
}
`)

type MaterialType = {
  time: number
}

declare global { namespace JSX { interface IntrinsicElements {
  materialName: ReactThreeFiber.Object3DNode<MaterialType, typeof MaterialName>
}}}

extend({ MaterialName })

const Sketch = () => {

  const materialRef = useRef<MaterialType>(null!)

  useEffect(() => {
    console.log('lights on')
  }, [])

  useFrame((_state, delta) => {
    materialRef.current.time += delta
  })

  return <mesh>
    <planeGeometry args={[4, 4, 20, 20]} />
    <materialName time={0} ref={materialRef}/>
  </mesh>
}

const MerchStore = () => {
  return <Wrapper>
    <Canvas>
      <Sketch />
    </Canvas>
  </Wrapper>
}

const Wrapper = styled.section`
  height: 100vh;
`

export default MerchStore
