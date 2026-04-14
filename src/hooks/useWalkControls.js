import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// WASD + arrow keys bilan yurish
const SPEED = 4.0
const keys = {}

export function useWalkControls(enabled, controlsRef) {
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())

  useEffect(() => {
    if (!enabled) return

    const down = (e) => { keys[e.code] = true }
    const up   = (e) => { keys[e.code] = false }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [enabled])

  useFrame((state, delta) => {
    if (!enabled || !controlsRef.current) return
    if (!controlsRef.current.isLocked) return

    const cam = state.camera
    velocity.current.x -= velocity.current.x * 10 * delta
    velocity.current.z -= velocity.current.z * 10 * delta

    direction.current.set(0, 0, 0)

    if (keys['KeyW'] || keys['ArrowUp'])    direction.current.z -= 1
    if (keys['KeyS'] || keys['ArrowDown'])  direction.current.z += 1
    if (keys['KeyA'] || keys['ArrowLeft'])  direction.current.x -= 1
    if (keys['KeyD'] || keys['ArrowRight']) direction.current.x += 1

    direction.current.normalize()

    if (direction.current.z !== 0) velocity.current.z -= direction.current.z * SPEED * delta * 60
    if (direction.current.x !== 0) velocity.current.x -= direction.current.x * SPEED * delta * 60

    // Camera yo'nalishi bo'yicha harakat
    const frontVector = new THREE.Vector3()
    const sideVector  = new THREE.Vector3()

    cam.getWorldDirection(frontVector)
    frontVector.y = 0
    frontVector.normalize()

    sideVector.crossVectors(frontVector, cam.up).normalize()

    const move = new THREE.Vector3()
    move.addScaledVector(frontVector, -velocity.current.z * delta)
    move.addScaledVector(sideVector,  -velocity.current.x * delta)

    cam.position.add(move)

    // Yerdan pastga tushmaydi
    if (cam.position.y < 1.7) cam.position.y = 1.7
  })
}
