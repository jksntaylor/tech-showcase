import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ReactThreeFiber, Canvas, extend, useFrame } from '@react-three/fiber'
import { shaderMaterial, Text } from '@react-three/drei'
import styled from 'styled-components'
import { lerp } from 'three/src/math/MathUtils'
import gsap from 'gsap'
import * as dat from 'dat.gui'

const FrictionTextMaterial = shaderMaterial({
  uTime: 0,
  uScrollDelta: 0,
  uFrequency: 6,
  uAmplitude: 1,
  uSpeedMultiplier: 1,
  uDirection: 1
},
`
  #define PI 3.14159265
  uniform float uTime;
  uniform float uScrollDelta;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeedMultiplier;
  uniform float uDirection;

  varying vec2 vUv;

  void main() {
    vec3 pos = position;
    pos.x += uTime * uSpeedMultiplier;
    pos.y = position.y + 0.57 + abs(sin(pox.x * uFrequency)) * uScrollDelta * uAmplitude;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,`
  uniform float uDirection;
  void main() {
    if (uDirection === 0.0) gl_FragColor = vec4(0.008, 0.012, 0.027, 1.0);
    else gl_FragColor = vec4(1.0);
  }
`)

type FrictionMaterial = {
  uAmplitude: number;
  uFrequency: number;
  uScrollDelta: number;
  uSpeedMultiplier: number;
  uScrollMultiplier: number;
  uTime: number;
  uDirection: number;
  side: THREE.Side;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      frictionTextMaterial: ReactThreeFiber.Object3DNode<FrictionMaterial, typeof FrictionTextMaterial>
    }
  }
}

extend({ FrictionTextMaterial })

const FrictionTextWrapper: React.FC<{}> = () => {
  // REFS
  const wrapper = useRef<HTMLDivElement>(null)
  const scrollY = useRef(0)
  const scrollDelta = useRef(0)
  const scrubProgress = useRef({ value: 0 })
  const time = useRef(0)
  const mat1 = useRef<FrictionMaterial>(null)
  const mat2 = useRef<FrictionMaterial>(null)
  // END REFS

  // GSAP TIMELINE
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper.current,
        scroller: '.smooth-scroll',
        scrub: 0.2
      }
    })
    tl.to(scrubProgress.current, {
      value: 100,
      duration: 1,
      ease: 'none'
    })
  }, [])
  // END GSAP TIMELINE


  const FrictionText: React.FC<{}> = () => {
    // GUI
    const guiObject = {
      frequency: 0.75,
      amplitude: 0.35,
      speedMultiplier: 0.17,
      scrollMultiplier: 19.45,
      modulus: 12.1
    }
    useEffect(() => {
      const gui = new dat.GUI()
        gui.add(guiObject, 'amplitude').min(0).max(20).step(0.01).onFinishChange(() => {
          if (mat1.current && mat2.current) {
            mat1.current.uAmplitude = guiObject.amplitude
            mat2.current.uAmplitude = guiObject.amplitude
          }
        })
        gui.add(guiObject, 'frequency').min(0).max(3).step(0.001).onFinishChange(() => {
          if (mat1.current && mat2.current) {
            mat1.current.uFrequency = guiObject.frequency
            mat2.current.uFrequency = guiObject.frequency
          }
        })
        gui.add(guiObject, 'speedMultiplier').min(0).max(5).step(0.001).onFinishChange(() => {
          if (mat1.current && mat2.current) {
            mat1.current.uSpeedMultiplier = guiObject.speedMultiplier
            mat2.current.uSpeedMultiplier = guiObject.speedMultiplier
          }
        })
        gui.add(guiObject, 'scrollMultiplier').min(0).max(30).step(0.01)
        gui.add(guiObject, 'modulus').min(0).max(100).step(0.1)
    }, [])
    // END GUI

    const clock = new THREE.Clock()


    useFrame(() => {
      scrollDelta.current = lerp(scrollDelta.current, scrubProgress.current.value - scrollY.current, 0.1)
      scrollY.current = scrubProgress.current.value
      let elapsed = clock.getElapsedTime()
      let tDelta = elapsed - time.current
      time.current = elapsed

      let addedTime = (tDelta + Math.max(guiObject.speedMultiplier + Math.abs(scrollDelta.current * guiObject.scrollMultiplier), 0));
      let modTime = (guiObject.modulus / guiObject.speedMultiplier);

      if(mat1.current && mat2.current) {
        mat1.current.uScrollDelta = scrollDelta.current
        mat2.current.uScrollDelta = -scrollDelta.current
        mat1.current.uTime += addedTime
        mat2.current.uTime += addedTime
        mat1.current.uTime %= modTime
        mat2.current.uTime %= modTime
      }
    })
    return (
      <>
        <Text
          font="/Roobert-Regular.woff"
          fontSize={ 1.4 }
          letterSpacing={ -0.07 }
          strokeWidth='0.5%'
          strokeColor='white'
          rotation={ new THREE.Euler(0, Math.PI, -Math.PI * 0.5) }
        >
          FRICTION TEXT FRICTION TEXT FRICTION TEXT
          <frictionTextMaterial
            ref={ mat1 }
            uTime={ 0 }
            uScrollDelta={ 0 }
            uFrequency={ guiObject.frequency }
            uAmplitude={ guiObject.amplitude }
            uSpeedMultiplier={ guiObject.speedMultiplier }
            uDirection={ 0 }
            side={ THREE.BackSide }
          />
        </Text>
        <Text
          font="/Roobert-Regular.woff"
          fontSize={ 1.4 }
          letterSpacing={ -0.07 }
          rotation={ new THREE.Euler(0, 0, -Math.PI * 0.5) }
        >
          FRICTION TEXT FRICTION TEXT FRICTION TEXT
          <frictionTextMaterial
            ref={ mat2 }
            uTime={ 0 }
            uScrollDelta={ 0 }
            uFrequency={ guiObject.frequency }
            uAmplitude={ guiObject.amplitude }
            uSpeedMultiplier={ guiObject.speedMultiplier }
            uDirection={ 0 }
          />
        </Text>
      </>
    )
  }
  return (
    <Wrapper>
      <CanvasWrapper ref={wrapper}>
        <Canvas dpr={Math.min(2, window.devicePixelRatio)}>
          <FrictionText />
        </Canvas>
      </CanvasWrapper>
    </Wrapper>
  )

}

const Wrapper = styled.section`
  height: 75vw;
`

const CanvasWrapper = styled.div`
  height: 90vw;
  width: 100%;
  position: fixed;
  top: 0;
`

export default FrictionTextWrapper
