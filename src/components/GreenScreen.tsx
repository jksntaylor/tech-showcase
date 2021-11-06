import { shaderMaterial, useTexture } from "@react-three/drei"
import { extend, Canvas, ReactThreeFiber, useFrame } from "@react-three/fiber"
import * as THREE from 'three'
import React, { Suspense, useEffect, useRef } from "react"
import styled from "styled-components"
import * as dat from 'dat.gui'

import { hexToShaderRGB } from "../utils/Functions"
import { dpr } from "../utils/Constants"
import { lerp } from "three/src/math/MathUtils"

import Source7 from '../assets/greenscreen/source7.png'

const GreenScreenMaterial = shaderMaterial({
  uFullScreen: 0,
  uMouse: new THREE.Vector2(0.),
  uRadius: 0.1,
  uMap: new THREE.Texture(),
  uGreen: 0.7,
  uRed: 0.6,
  uBlue: 0.5,
  uNewColor: new THREE.Vector4(1.)
},
`
  varying vec2 vUv;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
  }
`,
`
  uniform float uFullScreen;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform sampler2D uMap;
  uniform float uGreen;
  uniform float uRed;
  uniform float uBlue;
  uniform vec4 uNewColor;

  varying vec2 vUv;

  void main() {
    vec4 textureColor = texture2D(uMap, vUv);
    float mouseDistance = 0.;
    if (uFullScreen == 1.) {
      if (textureColor.g > uGreen && textureColor.r < uRed && textureColor.b < uBlue) {
        gl_FragColor = uNewColor;
      } else {
        gl_FragColor = textureColor;
      }
    } else {
      mouseDistance = distance(vUv.xy, uMouse.xy);
      float mixStrength = smoothstep(uRadius, uRadius - 0.003, mouseDistance);
      if (textureColor.g > uGreen && textureColor.r < uRed && textureColor.b < uBlue) {
        if (mouseDistance > uRadius) {
          gl_FragColor = textureColor;
        } else {
          gl_FragColor = mix(textureColor, uNewColor, mixStrength);
        }
      } else {
        gl_FragColor = textureColor;
      }
    }
  }
`)

type GreenScreenType = {
  uFullScreen: number;
  uMouse: THREE.Vector2;
  uRadius: number;
  uMap: THREE.Texture;
  uGreen: number;
  uRed: number;
  uBlue: number;
  uNewColor: THREE.Vector4;
}

declare global { namespace JSX { interface IntrinsicElements {
  greenScreenMaterial: ReactThreeFiber.Object3DNode<GreenScreenType, typeof GreenScreenMaterial>
}}}

extend({ GreenScreenMaterial })

const GreenScreen: React.FC<{}> = () => {

  const canvas = useRef<HTMLDivElement>(null)

  const Image: React.FC<{}> = () => {

    const guiObject = useRef({
      radius: 0.1,
      greenThreshold: 0.7,
      redThreshold: 0.6,
      blueThreshold: 0.5,
      newColor: '#0000ff',
      fullscreen: false
    })

    useEffect(() => {
      const gui = new dat.GUI()

      gui.add(guiObject.current, 'radius').min(0).max(0.5).step(0.001).onChange(() => {
        if (material.current) material.current.uRadius = guiObject.current.radius
      })
      gui.add(guiObject.current, 'greenThreshold').min(0).max(1).step(0.01).name('greenThreshold(min)').onChange(() => {
        if (material.current) material.current.uGreen = guiObject.current.greenThreshold
      })
      gui.add(guiObject.current, 'redThreshold').min(0).max(1).step(0.01).name('redThreshold(min)').onChange(() => {
        if (material.current) material.current.uRed = guiObject.current.redThreshold
      })
      gui.add(guiObject.current, 'blueThreshold').min(0).max(1).step(0.01).name('blueThreshold(min)').onChange(() => {
        if (material.current) material.current.uBlue = guiObject.current.blueThreshold
      })
      gui.addColor(guiObject.current, 'newColor').onChange(() => {
        if (material.current) material.current.uNewColor = hexToShaderRGB(guiObject.current.newColor)
      })
      gui.add(guiObject.current, 'fullscreen').onChange(() => {
        if (material.current) material.current.uFullScreen = guiObject.current.fullscreen ? 1 : 0
      })

      return () => gui.destroy()
    })

    const texture = useTexture(Source7)
    const material = useRef<GreenScreenType>(null)

    const mouse = useRef(new THREE.Vector2(0, 0))
    const cursor = useRef(new THREE.Vector2(0, 0))


    useEffect(() => {
      if (material.current) material.current.uMap = texture
    }, [texture])


    const handleMouseMove = (e: MouseEvent) => {
      if (canvas.current) mouse.current = new THREE.Vector2(e.offsetX / canvas.current.clientWidth, (canvas.current.clientHeight - e.offsetY) / canvas.current.clientHeight)
    }

    useEffect(() => {
      let ref = canvas.current
      if (ref) ref.addEventListener('mousemove', handleMouseMove)
      return () => {
        if (ref) ref.removeEventListener('mousemove', handleMouseMove)
      }
    }, [])

    useFrame(() => {
      cursor.current.x = lerp(cursor.current.x, mouse.current.x, 0.05)
      cursor.current.y = lerp(cursor.current.y, mouse.current.y, 0.05)
      if (material.current) material.current.uMouse = cursor.current
    })

    return <mesh>
      <planeGeometry args={[6.22, 6.22, 64, 64]} />
      <greenScreenMaterial
        ref={material}
        uFullScreen={0}
        uMouse={new THREE.Vector2(0, 0)}
        uRadius={0.1}
        uMap={new THREE.Texture()}
        uGreen={0.7}
        uRed={0.4}
        uBlue={0.3}
        uNewColor={new THREE.Vector4(0.0, 0.0, 1.0, 1.0)}
        />
    </mesh>
  }

  return <Wrapper data-scroll-section>
    <Suspense fallback={<></>}>
      <CanvasWrapper ref={canvas}>
      <Canvas dpr={dpr} camera={{ fov: 2 * Math.atan((6.22) / (2 * 5)) * (180 / Math.PI) }}>
        <Image />
      </Canvas>
      </CanvasWrapper>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  height: 100vh;
  width: 100vw;
  padding: 5vh 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CanvasWrapper = styled.div`
  height: 77vh;
  width: 62.2vh;
  cursor: none;
`

export default GreenScreen
