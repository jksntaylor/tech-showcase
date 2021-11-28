import React, { Suspense, useEffect, useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from 'three'
import styled from "styled-components"

import brush from '../assets/ripples/brush.png'
import hand from '../assets/ripples/hand.jpg'

const Ripples: React.FC<{}> = () => {

  // BRUSH
  let brushGeometry = useMemo(() => new THREE.PlaneGeometry(50, 50, 1, 1), [])
  let brushMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(brush),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false
  }), [])
  // END BRUSH

  // MESH LOGIC
  let max = 250;
  let meshes: any[] = []
  const meshesRef = useRef(<group></group>)
  const currentMesh = useRef(0)

  useEffect(() => {
    for(let i=0;i<max;i++) {
      let mesh = new THREE.Mesh(brushGeometry, brushMaterial.clone())
      mesh.rotation.z = Math.PI*2*Math.random()
      mesh.visible = false
      // @ts-ignore
      meshesRef.current.add(mesh)
    }
  }, [brushGeometry, brushMaterial, max])

  // END MESH LOGIC

  // MOUSE LOGIC
  const prevMouse = useRef(new THREE.Vector2(0, 0))
  const currMouse = useRef(new THREE.Vector2(0, 0))

  const mouseMove = (e: MouseEvent) => {
    currMouse.current.x = e.clientX - window.innerWidth/2
    currMouse.current.y = window.innerHeight/2 - e.clientY
  }

  const touchMove = (e: TouchEvent) => {

  }

    useEffect(() => {
      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('touchmove', touchMove)
      return () => {
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('touchmove', touchMove)
      }
    })
  // END MOUSE LOGIC

  // SHADER LOGIC
    let scene1 = new THREE.Scene()
    let fullscreenGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 1, 1)
    let fullscreenMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uDisplacement: { value: null },
        uTexture: { value: new THREE.TextureLoader().load(hand) }
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uDisplacement;
        uniform sampler2D uTexture;
        uniform vec4 resolution;
        varying vec2 vUv;

        #define PI 3.14159265

        void main() {
          vec4 displacement = texture2D(uDisplacement, vUv);
          float theta = displacement.r*2.*PI;

          vec2 dir = vec2(sin(theta), cos(theta));
          vec2 newUV = vUv + dir*displacement.r*0.1;

          gl_FragColor = texture2D(uTexture, newUV);
        }
      `
    })
    let fullscreenMesh = new THREE.Mesh(fullscreenGeometry, fullscreenMaterial)
    scene1.add(fullscreenMesh)

    let baseTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    })

  // END SHADER LOGIC

  // ANIMATION
  let { gl, camera, scene } = useThree()
  useFrame(() => {
    let delta = prevMouse.current.distanceTo(currMouse.current)
    // @ts-ignore
    let children = meshesRef.current.children

    // CREATE RIPPLE (takes oldest one and resets it)
    if (Math.abs(delta) > 4) {
      let nextMesh = children[currentMesh.current]
      nextMesh.position.x = currMouse.current.x
      nextMesh.position.y = currMouse.current.y
      nextMesh.visible = true
      nextMesh.material.opacity = 1
      nextMesh.scale.x=nextMesh.scale.y = 1
      currentMesh.current = (currentMesh.current + 1) % max
    }
    // END CREATE RIPPLE

    // RIPPLE ANIMATION
    children.forEach((mesh: any) => {
      if (mesh.visible) {
        mesh.rotation.z += 0.02
        mesh.material.opacity *= 0.98
        mesh.scale.x=mesh.scale.y=0.982*mesh.scale.x + 0.107
      }
      if (mesh.material.opacity <= 0.001) mesh.visible = false
    })
    // END RIPPLE ANIMATION

    prevMouse.current.x = currMouse.current.x
    prevMouse.current.y = currMouse.current.y

    // RENDER LOGIC
    gl.setRenderTarget(baseTexture)
    gl.render(scene, camera)
    fullscreenMaterial.uniforms.uDisplacement.value = baseTexture.texture
    gl.setRenderTarget(null)
    gl.clear()
    gl.render(scene1, camera)
    // END RENDER LOGIC

  }, 1)
  // END ANIMATION

  return <group ref={meshesRef}>
    {meshes}
  </group>
}

const RippleWrapper: React.FC<{}> = () => {
  return <Wrapper data-scroll-section>
    <Suspense fallback={<></>}>
      <Canvas orthographic dpr={Math.min(window.devicePixelRatio, 2)}>
        <Ripples />
      </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  background: radial-gradient(#2d2d2e, #0c0c0c);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`

export default RippleWrapper
