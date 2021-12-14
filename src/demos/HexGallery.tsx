import { MapControls, OrbitControls, Text } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import * as THREE from 'three'

const Grid: React.FC<{}> = () => {

  let totalCompanies = 100
  let imageHeight = 5
  let imageWidth = 3.5
  let horizontalGap = 5
  let verticalGap = 3

  const generateGrid = ( totalCompanies: number ) => {
    let x = 0
    let y = 0
    let grid: any[] = []
    // center square
    grid.push({x: x, y: y})

    let tiers = 1
    for (let j = totalCompanies - 1; j > 0; tiers++) { j -= (6 * tiers) }

    let horizontalSpacing = imageWidth + horizontalGap
    let verticalSpacing = imageHeight + verticalGap

    for( let i = 1; i < tiers; i++ ) {
      // move up 1
      y += verticalSpacing
      grid.push({x: x, y: y, tier: i})

      // move down & right i times
      for ( let j = 0; j < i; j++ ) {
        x += horizontalSpacing
        y -= (verticalSpacing / 2)
        grid.push({x: x, y: y, tier: i})
      }

      // move down i times
      for ( let j = 0; j < i; j++ )   {
        y -= verticalSpacing
        grid.push({x: x, y: y, tier: i})
      }

      // move left & down i times
      for ( let j = 0; j < i; j++ )   {
        x -= horizontalSpacing
        y -= (verticalSpacing / 2)
        grid.push({x: x, y: y, tier: i})
      }

      // move left & up i times
      for ( let j = 0; j < i; j++ )   {
        x -= horizontalSpacing
        y += (verticalSpacing / 2)
        grid.push({x: x, y: y, tier: i})
      }

      // move up i times
      for ( let j = 0; j < i; j++ )   {
        y += verticalSpacing
        grid.push({x: x, y: y, tier: i})
      }

      // move right & up i - 1 times
      for ( let j = 0; j < i - 1; j++ )   {
        x += horizontalSpacing
        y += (verticalSpacing / 2)
        grid.push({x: x, y: y, tier: i})
      }

      // move x and y to first position in tier
      x += horizontalSpacing
      y += (verticalSpacing / 2)
    }
    return grid
  }

  const grid = generateGrid(totalCompanies)

  let meshGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight, 10, 10)
  let meshes = grid.map((mesh, index) => <mesh
    position={[mesh.x, mesh.y, 0]}
    geometry={meshGeometry}
  ></mesh>)

  return <group>
    {meshes}
  </group>
}

const HexGallery: React.FC<{}> = () => {

  // TEMP
  let [arr, setArr] = useState([0])
  for (let i=0;i>61;i++) {
    arr.push(i)
    setArr(arr)
  }

  return <Wrapper>
    <Canvas>
      <MapControls />
      <Grid/>
    </Canvas>
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
