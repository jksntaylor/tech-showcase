/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

export default function Model({ ...props }) {
  const mesh = useRef()
  const group = useRef()
  const { nodes } = useGLTF('/reformLogo.gltf')

  const transmissionMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    roughness: 0.05,
    transmission: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.5,
    thickness: 100
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh ref={mesh} geometry={nodes.Spline.geometry} material={transmissionMaterial} position={[-81.94, -91.83, 0]} />
    </group>
  )
}

useGLTF.preload('/reformLogo.gltf')
