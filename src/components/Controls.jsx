import { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

// Xona presetlari
export const ROOM_PRESETS = {
  overview: { position: [7, 5, 9],    target: [0, 1, 0] },
  living:   { position: [0, 1.7, 2],  target: [0, 1.7, 0] },
  bedroom:  { position: [-3, 1.7, 3], target: [-1, 1.7, 0] },
  kitchen:  { position: [3, 1.7, -2], target: [1, 1.7, -1] },
  bathroom: { position: [4, 1.7, 2],  target: [3, 1.7, 0] },
}

// Walk mode boshlanish pozitsiyasi
const WALK_START = { x: 0, y: 1.7, z: 1 }

export function WalkControls() {
  const ref = useRef()
  const cameraMode    = useStore(s => s.cameraMode)
  const setCameraMode = useStore(s => s.setCameraMode)
  const { camera, scene } = useThree()

  const keys     = useRef({})
  const velocity = useRef(new THREE.Vector3())
  const yaw      = useRef(0)
  const pitch    = useRef(0)

  const EYE_HEIGHT    = 1.7
  const PLAYER_RADIUS = 0.3
  const SPEED         = 3.5
  const DAMPING       = 8.0

  // Collision detection
  const checkCollision = useCallback((origin, dir, dist) => {
    const ray = new THREE.Raycaster(origin.clone(), dir.clone().normalize(), 0, dist)
    const meshes = []
    scene.traverse(obj => { if (obj.isMesh) meshes.push(obj) })
    return ray.intersectObjects(meshes, false).length > 0
  }, [scene])

  // Keyboard
  useEffect(() => {
    if (cameraMode !== 'walk') return
    const down = e => { keys.current[e.code] = true }
    const up   = e => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup',   up)
      keys.current = {}
    }
  }, [cameraMode])

  // Walk mode start — uy ichida boshlanish
  useEffect(() => {
    if (cameraMode !== 'walk') {
      velocity.current.set(0, 0, 0)
      return
    }
    camera.position.set(WALK_START.x, WALK_START.y, WALK_START.z)
    camera.rotation.order = 'YXZ'
    camera.rotation.set(0, 0, 0)
    yaw.current   = 0
    pitch.current = 0
    ref.current?.lock()
  }, [cameraMode, camera])

  // ESC => orbit
  useEffect(() => {
    if (!ref.current) return
    const onUnlock = () => setCameraMode('orbit')
    ref.current.addEventListener('unlock', onUnlock)
    return () => ref.current?.removeEventListener('unlock', onUnlock)
  }, [setCameraMode])

  // Mouse look
  useEffect(() => {
    if (cameraMode !== 'walk') return
    const onMove = e => {
      if (!ref.current?.isLocked) return
      yaw.current   -= e.movementX * 0.002
      pitch.current  = Math.max(-Math.PI * 0.35, Math.min(Math.PI * 0.35,
        pitch.current - e.movementY * 0.002
      ))
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [cameraMode])

  useFrame((state, delta) => {
    if (cameraMode !== 'walk' || !ref.current?.isLocked) return
    const cam = state.camera
    const dt  = Math.min(delta, 0.05)

    // Kamera yo'nalishi
    cam.rotation.order = 'YXZ'
    cam.rotation.y = yaw.current
    cam.rotation.x = pitch.current

    // Harakat vektorlari (faqat gorizontal)
    const fw = new THREE.Vector3(
      -Math.sin(yaw.current), 0, -Math.cos(yaw.current)
    )
    const right = new THREE.Vector3().crossVectors(fw, new THREE.Vector3(0, 1, 0)).normalize()

    const moveDir = new THREE.Vector3()
    if (keys.current['KeyW'] || keys.current['ArrowUp'])    moveDir.addScaledVector(fw, 1)
    if (keys.current['KeyS'] || keys.current['ArrowDown'])  moveDir.addScaledVector(fw, -1)
    if (keys.current['KeyA'] || keys.current['ArrowLeft'])  moveDir.addScaledVector(right, -1)
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveDir.addScaledVector(right, 1)
    if (moveDir.lengthSq() > 0) moveDir.normalize()

    velocity.current.lerp(
      moveDir.clone().multiplyScalar(SPEED),
      1 - Math.exp(-DAMPING * dt)
    )

    // Collision: harakatlanish yo'nalishini tekshiramiz
    const origin = cam.position.clone()
    origin.y = EYE_HEIGHT - 0.5 // qorin balandligida tekshiruv

    let dx = velocity.current.x * dt
    let dz = velocity.current.z * dt

    // X
    if (Math.abs(dx) > 0.001) {
      const dirX = new THREE.Vector3(Math.sign(dx), 0, 0)
      if (!checkCollision(origin, dirX, PLAYER_RADIUS)) cam.position.x += dx
    }
    // Z
    if (Math.abs(dz) > 0.001) {
      const dirZ = new THREE.Vector3(0, 0, Math.sign(dz))
      if (!checkCollision(origin, dirZ, PLAYER_RADIUS)) cam.position.z += dz
    }

    // Y doim 1.7m
    cam.position.y = EYE_HEIGHT
  })

  if (cameraMode !== 'walk') return null

  return <PointerLockControls ref={ref} enabled={false} />
}

// Smooth camera animation (orbit mode uchun)
export function CameraAnimator({ orbitRef }) {
  const activeRoom = useStore(s => s.activeRoom)
  const cameraMode = useStore(s => s.cameraMode)
  const { camera } = useThree()
  const targetPos = useRef([7, 5, 9])
  const targetLook = useRef([0, 1, 0])

  useEffect(() => {
    if (cameraMode !== 'orbit') return
    const p = ROOM_PRESETS[activeRoom]
    if (!p) return
    targetPos.current = p.position
    targetLook.current = p.target
  }, [activeRoom, cameraMode])

  useFrame(() => {
    if (cameraMode !== 'orbit' || !orbitRef?.current) return

    camera.position.lerp(
      { x: targetPos.current[0], y: targetPos.current[1], z: targetPos.current[2] },
      0.04
    )
    orbitRef.current.target.lerp(
      { x: targetLook.current[0], y: targetLook.current[1], z: targetLook.current[2] },
      0.04
    )
  })

  return null
}
