/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

export default function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/reformLogo.gltf')

  const transmissionMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.6,
    transmission: 1,
    thickness: 100,
    transparent: true
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Spline.geometry} material={transmissionMaterial} position={[-81.94, -91.83, 0]} />
    </group>
  )
}

useGLTF.preload('/reformLogo.gltf')
