import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react"
import { Canvas, extend, ReactThreeFiber, useFrame, useThree } from "@react-three/fiber"
import { shaderMaterial, useTexture } from "@react-three/drei"
import { Texture, PlaneGeometry, Vector2 } from 'three'
import { lerp } from "three/src/math/MathUtils"
import styled from "styled-components"


const HexPixelMaterial = shaderMaterial({
  map: new Texture(),
  velocity: new Vector2(0, 0),
  color: 0
},
`
  #define PI 3.14159
  uniform vec2 velocity;
  varying vec2 vUv;

  void main() {
    vec3 pos = position;
    pos.x -= abs(sin(uv.y * PI) * 0.125) * velocity.x;
    pos.y -= abs(sin(uv.x * PI) * 0.125) * velocity.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    vUv = uv;
  }
`,`
  uniform sampler2D map;
  uniform float color;
  varying vec2 vUv;

  void main() {
    vec4 bw = texture2D(map, vUv);
    float lum = (bw.r * 0.3 + bw.g * 0.59 + bw.b * 0.11);
    vec4 blackAndWhite = vec4(vec3(lum), 1.0);
    vec4 colored = texture2D(map, vUv);
    gl_FragColor = mix(blackAndWhite, colored, color);
  }
`)

type HexPixelType = {
  map: Texture
  velocity: Vector2
  color: number
}

declare global { namespace JSX { interface IntrinsicElements {
  hexPixelMaterial: ReactThreeFiber.Object3DNode<HexPixelType, typeof HexPixelMaterial>
}}}

extend({ HexPixelMaterial })

// START GridImageComponent
type GridImageProps = {
  image: string
  geometry: PlaneGeometry
  positionX: number
  positionY: number
  velocity: Vector2
}

const GridImage: React.FC<GridImageProps> = ({ image, geometry, positionX, positionY, velocity }) => {

  const material = useRef<HexPixelType>(null)

  const imageTexture = useTexture(image)

  useEffect(() => {
    if (material.current) material.current.map = imageTexture
  }, [imageTexture])

  useFrame(() => {
    if (material.current) {
      material.current.velocity.x = velocity.x
      material.current.velocity.y = velocity.y
    }
  })

  const saturate = () => {
    if (material.current) material.current.color = 1
  }

  const desaturate = () => {
    if (material.current) material.current.color = 0
  }

  return <mesh geometry={geometry} position={[positionX, positionY, 0]} onPointerEnter={saturate} onPointerLeave={desaturate}>
    <hexPixelMaterial ref={material} />
  </mesh>
}
// END GridImage Component

// START Grid Component
const Grid: React.FC<{}> = () => {

  let debugObj = {
    totalCompanies: 91,
    imageHeight: 5,
    imageWidth: 3,
    horizontalGap: 1.5,
    verticalGap: 1,
  }

  const generateGrid = ( totalCompanies: number ) => {
    let x = 0
    let y = 0
    let grid: any[] = []
    // center square
    grid.push({x: x, y: y})

    let tiers = 0
    for (let j = totalCompanies - 1; j > 0; tiers++) { j -= (6 * tiers) }

    let horizontalSpacing = debugObj.imageWidth + debugObj.horizontalGap
    let verticalSpacing = debugObj.imageHeight + debugObj.verticalGap

    for( let i = 1; i < tiers; i++ ) {
      // move up 1
      y += verticalSpacing
      grid.push({x: x, y: y, tier: i})

      // move down & right i times
      for ( let j = 0; j < i; j++ ) {
        if (grid.length !== totalCompanies) {
          x += horizontalSpacing
          y -= (verticalSpacing / 2)
          grid.push({x: x, y: y, tier: i})
        }
      }

      // move down i times
      for ( let j = 0; j < i; j++ )   {
        if (grid.length !== totalCompanies) {
          y -= verticalSpacing
          grid.push({x: x, y: y, tier: i})
        }
      }

      // move left & down i times
      for ( let j = 0; j < i; j++ )   {
        if (grid.length !== totalCompanies) {
          x -= horizontalSpacing
          y -= (verticalSpacing / 2)
          grid.push({x: x, y: y, tier: i})
        }
      }

      // move left & up i times
      for ( let j = 0; j < i; j++ )   {
        if (grid.length !== totalCompanies) {
          x -= horizontalSpacing
          y += (verticalSpacing / 2)
          grid.push({x: x, y: y, tier: i})
        }
      }

      // move up i times
      for ( let j = 0; j < i; j++ )   {
        if (grid.length !== totalCompanies) {
          y += verticalSpacing
          grid.push({x: x, y: y, tier: i})
        }
      }

      // move right & up i - 1 times
      for ( let j = 0; j < i - 1; j++ )   {
        if (grid.length !== totalCompanies) {
          x += horizontalSpacing
          y += (verticalSpacing / 2)
          grid.push({x: x, y: y, tier: i})
        }
      }

      // move x and y to first position in tier
      x += horizontalSpacing
      y += (verticalSpacing / 2)
    }

    let verticalBound = (tiers - 1.75) * verticalSpacing + (debugObj.imageHeight * 0.5)
    let horizontalBound = (tiers - 2.2) * horizontalSpacing + (debugObj.imageWidth * 0.5)

    let returnVals = {
      grid: grid,
      verticalBound,
      horizontalBound
    }

    return returnVals
  }

  const { grid, verticalBound, horizontalBound } = generateGrid(debugObj.totalCompanies)

  const groupRef: MutableRefObject<any> = useRef(null)

  const currentPosition = useRef(new Vector2(0, 0))
  const targetPosition = useRef(new Vector2(0, 0))

  const [velocity, setVelocity] = useState(new Vector2(0, 0))

  // START mouse logic
  const handleMouseMove = (e: MouseEvent) => {
    let newX = (e.clientX / window.innerWidth - 0.5) * 2
    let newY = (e.clientY / window.innerHeight - 0.5) * 2

    // let velocityX = (newX - mouseObj.x)
    // let velocityY = (newY - mouseObj.y)

    // let newMouseObj = new Vector2(newX, newY)

    // setMouseObj(newMouseObj)
    targetPosition.current.x = newX
    targetPosition.current.y = newY
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  })
  // END mouse logic

  // START lerp logic
  const { camera } = useThree()
  useFrame(() => {

    let targetX = targetPosition.current.x * -horizontalBound
    let targetY = targetPosition.current.y * verticalBound

    let actualX = lerp(currentPosition.current.x, targetX, 0.05)
    let actualY = lerp(currentPosition.current.y, targetY, 0.05)
    groupRef.current.position.set(actualX, actualY, 0)

    currentPosition.current = new Vector2(actualX, actualY)

    let diffX = Math.min(Math.max(targetX - actualX, -3), 3)
    let diffY = Math.min(Math.max(targetY - actualY, -3), 3)

    setVelocity(new Vector2(diffX, diffY))

    let zoom = Math.abs(Math.max(diffX, diffY)) + 5
    camera.position.setZ(zoom)
  })
  // END lerp logic

  let meshGeometry = new PlaneGeometry(debugObj.imageWidth, debugObj.imageHeight, 2, 2)
  let meshes = grid.map((cell, index) => <GridImage
    key={index}
    geometry={meshGeometry}
    velocity={velocity}
    positionX={cell.x}
    positionY={cell.y}
    image="https://images.unsplash.com/photo-1639927072187-3cbf34d12f27?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" // will be cell.img
    // add company data here later
  />)

  return <group ref={groupRef} >
    {meshes}
  </group>
}
// END Grid Component

const HexGallery: React.FC<{}> = () => {
  return <Wrapper >
    <Suspense fallback={<></>}>
      <Canvas dpr={Math.min(window.devicePixelRatio, 2)}>
        <Grid />
      </Canvas>
    </Suspense>
  </Wrapper>
}

const Wrapper = styled.section`
  canvas {
    min-height: 100vh;
    width: 100vw;
    background: black;
  }
`

export default HexGallery
