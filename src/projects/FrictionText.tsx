import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ReactThreeFiber, Canvas, extend, useFrame } from '@react-three/fiber'
import { shaderMaterial, Text } from '@react-three/drei'
import styled from 'styled-components'
import { lerp } from 'three/src/math/MathUtils'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { hexToShaderRGB } from '../utils/Functions'

const FrictionTextMaterial = shaderMaterial({
  uTime: 0,
  uScrollDelta: 0,
  uFrequency: 6,
  uAmplitude: 1,
  uSpeedMultiplier: 1,
  uDirection: 1,
  uBackColor: new THREE.Vector4(0.0),
  uFrontColor: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
},
`
  #define PI 3.14159265
  uniform float uTime;
  uniform float uScrollDelta;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeedMultiplier;
  uniform float uDirection;

  void main() {
    vec3 pos = position;
    pos.x += uTime * uSpeedMultiplier;
    pos.y = position.y + 0.239 + sin(pos.x * uFrequency) * uScrollDelta * uAmplitude;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,`
  uniform float uDirection;
  uniform vec4 uBackColor;
  uniform vec4 uFrontColor;

  void main() {
    if (uDirection == 0.0) gl_FragColor = uBackColor;
    else gl_FragColor = uFrontColor;
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
  uBackColor: THREE.Vector4;
  uFrontColor: THREE.Vector4;
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
        scrub: 1.75
      }
    })
    tl.to(scrubProgress.current, {
      value: 100,
      duration: 1,
      ease: 'none'
    })
  }, [])
  // END GSAP TIMELINE

  const guiObject = useRef({
    frequency: 1.75,
    amplitude: 0.45,
    speedMultiplier: 0.17,
    scrollMultiplier: 28.7,
    vertical: true,
    background: '#020307',
    textColor: '#FFFFFF'
  })

  const FrictionText: React.FC<{}> = () => {
    const filledText = useRef()
    // GUI
    useEffect(() => {
      const gui = new dat.GUI()
      gui.add(guiObject.current, 'amplitude').min(0).max(5).step(0.01).onFinishChange(() => {
        if (mat1.current && mat2.current) {
          mat1.current.uAmplitude = guiObject.current.amplitude
          mat2.current.uAmplitude = guiObject.current.amplitude
        }
      })
      gui.add(guiObject.current, 'frequency').min(0).max(3).step(0.001).onFinishChange(() => {
        if (mat1.current && mat2.current) {
          mat1.current.uFrequency = guiObject.current.frequency
          mat2.current.uFrequency = guiObject.current.frequency
        }
      })
      gui.add(guiObject.current, 'speedMultiplier').min(0).max(3).step(0.001).onChange(() => {
        if (mat1.current && mat2.current) {
          mat1.current.uSpeedMultiplier = guiObject.current.speedMultiplier
          mat2.current.uSpeedMultiplier = guiObject.current.speedMultiplier
        }
      })
      gui.add(guiObject.current, 'scrollMultiplier').min(0).max(50).step(0.1)
      // gui.add(guiObject.current, 'vertical').onChange(() => {
      //   console.log('change')
      // })
      gui.addColor(guiObject.current, 'background').onChange(() => {
        if (wrapper.current && mat1.current && mat2.current) {
          let shaderRGB = hexToShaderRGB(guiObject.current.background)
          wrapper.current.style.backgroundColor = guiObject.current.background
          mat1.current.uBackColor = shaderRGB
          mat2.current.uBackColor = shaderRGB
        }
      })
      gui.addColor(guiObject.current, 'textColor').onChange(() => {
        if (filledText.current && mat1.current && mat2.current) {
          let shaderRGB = hexToShaderRGB(guiObject.current.textColor)
          // @ts-ignore
          filledText.current.strokeColor = guiObject.current.textColor
          mat1.current.uFrontColor = shaderRGB
          mat2.current.uFrontColor = shaderRGB
        }
      })
    }, [])
    // END GUI

    const clock = new THREE.Clock()

    useFrame(() => {
      if (mat1.current && mat2.current) {
        const newScrollY = scrubProgress.current.value
        const newScrollDelta = lerp(scrollDelta.current, newScrollY - scrollY.current, 0.1)
        scrollY.current = newScrollY
        scrollDelta.current = newScrollDelta
        mat1.current.uScrollDelta = scrollDelta.current
        mat2.current.uScrollDelta = -scrollDelta.current

        let newTime = clock.getElapsedTime()
        let timeDelta = newTime - time.current
        time.current = newTime
        mat1.current.uTime += (timeDelta * Math.max(guiObject.current.speedMultiplier + Math.abs(newScrollDelta * guiObject.current.scrollMultiplier), 0))
        mat2.current.uTime -= (timeDelta * Math.max(guiObject.current.speedMultiplier + Math.abs(newScrollDelta * guiObject.current.scrollMultiplier), 0))
        mat1.current.uTime %= (4.35 / guiObject.current.speedMultiplier)
        mat2.current.uTime %= (4.35 / guiObject.current.speedMultiplier)
      }
    })

    return <>
      <Text
        ref={filledText}
        fontSize={ 0.7 }
        letterSpacing={ -0.07 }
        strokeWidth='0.5%'
        strokeColor={guiObject.current.textColor}
        rotation={ new THREE.Euler(0, Math.PI, -Math.PI * 0.5) }
      >FRICTION TEXT FRICTION TEXT FRICTION TEXT FRICTION TEXT
        <frictionTextMaterial
          ref={ mat1 }
          uTime={ 0 }
          uScrollDelta={ 0 }
          uFrequency={ guiObject.current.frequency }
          uAmplitude={ guiObject.current.amplitude }
          uSpeedMultiplier={ guiObject.current.speedMultiplier }
          uDirection={ 0 }
          side={ THREE.BackSide }
        />
      </Text>
      <Text
        fontSize={ 0.7 }
        letterSpacing={ -0.07 }
        rotation={ new THREE.Euler(0, 0, -Math.PI * 0.5) }
      >FRICTION TEXT FRICTION TEXT FRICTION TEXT FRICTION TEXT
        <frictionTextMaterial
          ref={ mat2 }
          uTime={ 0 }
          uScrollDelta={ 0 }
          uFrequency={ guiObject.current.frequency }
          uAmplitude={ guiObject.current.amplitude }
          uSpeedMultiplier={ guiObject.current.speedMultiplier }
          uDirection={ 1 }
        />
      </Text>
    </>
  }
  return (
    <>
    <Wrapper ref={wrapper} background={guiObject.current.background}>
      <CanvasWrapper>
        <Canvas dpr={Math.min(2, window.devicePixelRatio)}>
          <FrictionText />
        </Canvas>
      </CanvasWrapper>
    </Wrapper>
    <Cover />
    <ScrollDown>Scroll Down!</ScrollDown>
    </>
  )

}

const Wrapper = styled.section<{ background: string }>`
  height: 200vw;
  background-color: ${props => props.background};
`

const CanvasWrapper = styled.div`
  height: 200vw;
  width: 100%;
  position: fixed;
  top: 0;
`

const Cover = styled.div`
  height: 90vw;
  background: #e6e1cf;
  position: relative;
`

const ScrollDown = styled.p`
  position: fixed;
  top: 20px;
  left: 50px;
  color: white;
  border: 1px solid white;
  border-radius: 20px;
  padding: 10px 20px;
`

export default FrictionTextWrapper
