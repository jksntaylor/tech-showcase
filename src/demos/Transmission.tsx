import React, { Suspense, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { Canvas, ReactThreeFiber, extend } from "@react-three/fiber"
import styled from "styled-components"
import Model from "../assets/models/ReformLogo"
import { OrbitControls, shaderMaterial, useTexture } from "@react-three/drei"

const ImageMaterial = shaderMaterial({
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

type ImageMaterialType = {
  uTexture: THREE.Texture
}

declare global { namespace JSX { interface IntrinsicElements {
  imageMaterial: ReactThreeFiber.Object3DNode<ImageMaterialType, typeof ImageMaterial>
}}}

extend({ ImageMaterial })

const Image: React.FC<{ texture: boolean }> = ({ texture }) => {
  const texture1 = useTexture('https://images.unsplash.com/photo-1637419980533-1119de04312f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80')

  const texture2 = useTexture('https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80')

  const image = useRef()

  useEffect(() => {
    if (image.current) {
      // @ts-ignore
      image.current.uTexture = texture ? texture1: texture2
      // @ts-ignore
      image.current.side = THREE.DoubleSide
    }
  }, [texture, texture1, texture2])
  return <mesh position={new THREE.Vector3(0, 0, -100)}>
  <planeGeometry args={[500, 500, 100, 100]}/>
  <imageMaterial ref={image}/>
</mesh>
}

const Transmission: React.FC<{}> = () => {

  const [texture, setTexture] = useState(true)

  const handleClick = () => {
    setTexture(!texture)
  }
  return <Wrapper data-scroll-section>
    <Suspense fallback={<></>}>
    <Canvas>
      <ambientLight intensity={0.5} />
      <Image texture={texture}/>
      <Model onClick={handleClick}/>
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
