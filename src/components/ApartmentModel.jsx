import { useRef, useEffect } from 'react'
import { useGLTF, useProgress } from '@react-three/drei'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

// Model URL ni preload qilish uchun
export function preloadModel(url) {
  useGLTF.preload(url)
}

export function ApartmentModel({ url, wireframe }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef()

  useEffect(() => {
    if (!scene) return

    // Model o'lchamini normalize qilib markazlashtirish
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 10 / maxDim

    scene.scale.setScalar(scale)
    scene.position.set(
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale
    )

    // Shadow + material setup
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true

      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach(mat => {
        if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
          mat.envMapIntensity = 1.0
          mat.needsUpdate = true
        }
      })
    })
  }, [scene])

  // Wireframe toggle
  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (!child.isMesh) return
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach(mat => {
        if (mat.wireframe !== undefined) mat.wireframe = wireframe
      })
    })
  }, [wireframe, scene])

  return <primitive ref={modelRef} object={scene} />
}

// Progress tracker — store ga ulaydi
export function ModelProgressTracker() {
  const { progress, active } = useProgress()
  const setModelProgress = useStore(s => s.setModelProgress)
  const setModelLoading  = useStore(s => s.setModelLoading)
  const setAppReady      = useStore(s => s.setAppReady)

  useEffect(() => {
    setModelProgress(progress)
    if (!active && progress === 100) {
      setTimeout(() => {
        setModelLoading(false)
        setAppReady()
      }, 300)
    }
  }, [progress, active])

  return null
}
