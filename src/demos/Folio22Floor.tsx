import { OrbitControls, shaderMaterial, useTexture } from '@react-three/drei'
import { Canvas, extend, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Texture } from 'three'
import image from '../assets/floor/heightmap-waterfall.png'

let map = new Texture()

const Folio22FloorMaterial = shaderMaterial({
  time: 0,
  map: map
}, `
// Vertex Shader

uniform float time;
uniform sampler2D map;

varying vec2 vUv;
varying float vHeight;

void main() {
  vec4 heightmap = texture2D(map, uv);
  vHeight = heightmap.r;
  vec3 newPosition = position + normal * 1. * vHeight;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vUv = uv;
}
`,`
// Fragment Shader

uniform float time;
uniform sampler2D map;

varying vec2 vUv;
varying float vHeight;

void main() {

  vec3 baseColor = vec3(0.0);
  vec3 peakColor = vec3(1.);

  vec3 color = mix(baseColor, peakColor, vHeight);

  gl_FragColor = vec4(color, 1.0);
}
`)

type T_Folio22Floor = {
  time: number
  map: Texture
}

declare global { namespace JSX { interface IntrinsicElements {
  folio22FloorMaterial: ReactThreeFiber.Object3DNode<T_Folio22Floor, typeof Folio22FloorMaterial>
}}}

extend({ Folio22FloorMaterial })

const Sketch = () => {

  const materialRef = useRef<T_Folio22Floor>(null!)

  const texture = useTexture(image)

  useEffect(() => {
    console.log('lights on')
    materialRef.current.map = texture
  }, [texture])

  useFrame((_state, delta) => {
    materialRef.current.time += delta
  })

  return <mesh rotation={[-1.5, 0, 0]}>
    <planeGeometry args={[4, 4, 1024, 1024]} />
    <folio22FloorMaterial
      time={0}
      map={map}
      ref={materialRef}
    />
  </mesh>
}

const Folio22Floor = () => {
  return <Wrapper>
    <Canvas>
      <Sketch />
      <OrbitControls />
    </Canvas>
  </Wrapper>
}

const Wrapper = styled.section`
  background: black;
  height: 100vh;
`

export default Folio22Floor
