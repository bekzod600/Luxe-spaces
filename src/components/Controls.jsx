import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { useStore } from '@/store/useStore'
import { useWalkControls } from '@/hooks/useWalkControls'

// Xona presetlari
export const ROOM_PRESETS = {
  overview: { position: [7, 5, 9],  target: [0, 1, 0] },
  living:   { position: [2, 1.7, 4], target: [0, 1.5, 0] },
  bedroom:  { position: [-3, 1.7, 3], target: [-1, 1.5, 0] },
  kitchen:  { position: [3, 1.7, -2], target: [1, 1.5, -1] },
}

export function WalkControls() {
  const ref = useRef()
  const cameraMode = useStore(s => s.cameraMode)
  const setCameraMode = useStore(s => s.setCameraMode)
  const { camera } = useThree()

  useWalkControls(cameraMode === 'walk', ref)

  useEffect(() => {
    if (!ref.current) return

    const onLock   = () => {}
    const onUnlock = () => {
      // ESC bosilganda orbit ga qaytadi
      setCameraMode('orbit')
    }

    ref.current.addEventListener('lock', onLock)
    ref.current.addEventListener('unlock', onUnlock)
    return () => {
      ref.current?.removeEventListener('lock', onLock)
      ref.current?.removeEventListener('unlock', onUnlock)
    }
  }, [setCameraMode])

  // Walk mode yoqilganda kamera balandligini 1.7m ga o'rnatamiz (odam ko'zi)
  useEffect(() => {
    if (cameraMode === 'walk') {
      camera.position.y = 1.7
      ref.current?.lock()
    }
  }, [cameraMode, camera])

  if (cameraMode !== 'walk') return null

  return (
    <PointerLockControls
      ref={ref}
      minPolarAngle={Math.PI * 0.1}
      maxPolarAngle={Math.PI * 0.9}
    />
  )
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
