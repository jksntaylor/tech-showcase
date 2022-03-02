import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { CubeCamera, DoubleSide, LinearMipmapLinearFilter, RGBAFormat, sRGBEncoding, Vector3, WebGLCubeRenderTarget } from 'three'

import noise from '../assets/wavySunrise/noise.png'

const WavySunriseOuterMaterial = shaderMaterial({
  time: 0
}, `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vUv = uv;
    vPosition = position;
  }
`,`
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

  float noise(vec3 p){
      vec3 a = floor(p);
      vec3 d = p - a;
      d = d * d * (3.0 - 2.0 * d);

      vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
      vec4 k1 = perm(b.xyxy);
      vec4 k2 = perm(k1.xyxy + b.zzww);

      vec4 c = k2 + a.zzzz;
      vec4 k3 = perm(c);
      vec4 k4 = perm(c + 1.0);

      vec4 o1 = fract(k3 * (1.0 / 41.0));
      vec4 o2 = fract(k4 * (1.0 / 41.0));

      vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
      vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

      return o4.y * d.y + o4.x * (1.0 - d.y);
  }

  float lines(vec2 uv, float offset) {
    return smoothstep(0.0, 0.5 + offset * 0.5, abs(0.5*(sin(uv.x*50.) + offset*2.)));
  }

  mat2 rotate2D(float angle) {
    return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
  }

  void main() {
    float n = noise(vPosition + (time * 0.4)) * 1.3;
    vec3 colorOne = vec3(255./255., 230./255., 242./255.);
    vec3 colorThree = vec3(140./255., 140./255., 255./255.);
    vec3 colorTwo = vec3(157./255., 214./255., 255./255.);

    vec2 base = rotate2D(n + 0.5)*vPosition.xy*0.05;
    float basePattern = lines(base, 0.7);
    float secondPattern = lines(base, 0.1);

    vec3 baseColor = mix(colorThree, colorOne, basePattern);
    vec3 secondBaseColor = mix(baseColor, colorTwo, secondPattern);

    gl_FragColor = vec4(vec3(secondBaseColor), 1.);
  }
`)

type WavySunriseOuterType = {
  time: 0
  side: any
}

const WavySunriseInnerMaterial = shaderMaterial({
  tCube: 0
},
`
  varying vec3 vReflect;
  varying vec3 vRefract[3];
  varying float vReflectionFactor;

  void main() {
    float mRefractionRatio = 1.02;
    float mFresnelBias = 0.1;
    float mFresnelScale = 2.;
    float mFresnelPower = 1.;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    vec4 worldPosition = modelMatrix * vec4(position, 1.);

    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    vec3 I = worldNormal.xyz - cameraPosition;

    vReflect = reflect( I, worldNormal );
    vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
    vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * .99 );
    vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * .98 );

    vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1. + dot( normalize( I ), worldNormal ), mFresnelPower );

    gl_Position = projectionMatrix * mvPosition;
  }
`,`
  uniform samplerCube tCube;

  varying vec3 vReflect;
  varying vec3 vRefract[3];
  varying float vReflectionFactor;

  void main() {
    vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
    vec4 refractedColor = vec4(1.);

    refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
    refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
    refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

    gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );
  }
`)

type WavySunriseInnerType = {
  tCube: any
}

declare global { namespace JSX { interface IntrinsicElements {
  wavySunriseOuterMaterial: ReactThreeFiber.Object3DNode<WavySunriseOuterType, typeof WavySunriseOuterMaterial>
  wavySunriseInnerMaterial: ReactThreeFiber.Object3DNode<WavySunriseInnerType, typeof WavySunriseInnerMaterial>
}}}

extend({ WavySunriseOuterMaterial, WavySunriseInnerMaterial })

const WavySunriseScene: React.FC<{}> = () => {

  const rOuterMaterial = useRef<WavySunriseOuterType>(null!)
  const rInnerMaterial = useRef<WavySunriseInnerType>(null!)

  const [renderTarget, setRenderTarget]: any = useState(new WebGLCubeRenderTarget(256, {
    format: RGBAFormat,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
    encoding: sRGBEncoding
  }))

  const [cubeCamera, setCubeCamera]: any = useState(new CubeCamera(0.1, 10, renderTarget))

  useEffect(() => {
    if (rOuterMaterial.current) rOuterMaterial.current.side = DoubleSide

    setCubeCamera(new CubeCamera(0.1, 10, renderTarget))

  }, [])

  useFrame(({gl, scene}, delta) => {
    if (!gl.clearColor) gl.setClearColor('0x000000')
    cubeCamera.update(gl, scene)
    rInnerMaterial.current.tCube = renderTarget.texture

    rOuterMaterial.current.time += delta
  })

  return <group>
    <mesh>
      <sphereBufferGeometry args={[1.5, 64, 64]} />
      <wavySunriseOuterMaterial time={0} ref={rOuterMaterial} attach="material"/>
    </mesh>
    <mesh position={ new Vector3(0.4, 0.1, 0) }>
      <sphereBufferGeometry args={[1, 64, 64]} />
      <wavySunriseInnerMaterial tCube={0} ref={rInnerMaterial} attach="material" />
    </mesh>
  </group>
}

const WavySunrise: React.FC<{}> = () => {
  return <Wrapper>
    <Canvas camera={{ position: new Vector3(0, 0, 1.3) }}>
      <WavySunriseScene />
      <OrbitControls />
    </Canvas>
    <Noise />
  </Wrapper>
}

const Wrapper = styled.section`
  background: black;
  canvas {
    height: 100vh;
  }
`

const grain = keyframes`
  0%, 100% {transform: translate(0,0)}
  10% {transform: translate(-5rem,-5rem)}
  30% {transform: translate(3rem,-8)}
  50% {transform: translate(10rem,10rem)}
  70% {transform: translate(9rem,3rem)}
  90% {transform: translate(-1rem,7rem)}
`;

const Noise = styled.div`
  animation: ${grain} 3s steps(6) infinite;
  width: calc(100% + 20rem);
  height: calc(100% + 20rem);
  background-position: 50%;
  position: absolute;
  left: -10rem;
  top: -10rem;
  background-image: url(${noise});
`;


export default WavySunrise
