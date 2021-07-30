import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { shaderMaterial, Text } from '@react-three/drei'
import styled from 'styled-components'
import { lerp } from 'three/src/math/MathUtils'
import gsap from 'gsap'
import * as gui from 'dat.gui'

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

extend({ FrictionTextMaterial })

const FrictionText: ReactFC<{}> = () => {

}
