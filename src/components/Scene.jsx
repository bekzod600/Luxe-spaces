import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Grid,
  Stats,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import { useStore } from '@/store/useStore'
import { ApartmentModel, ModelProgressTracker } from './ApartmentModel'
import { WalkControls, CameraAnimator } from './Controls'

export default function Scene({ modelUrl }) {
  const orbitRef = useRef()
  const cameraMode  = useStore(s => s.cameraMode)
  const autoRotate  = useStore(s => s.autoRotate)
  const renderMode  = useStore(s => s.renderMode)

  return (
    <Canvas
      camera={{ position: [7, 5, 9], fov: 50, near: 0.1, far: 300 }}
      shadows
      gl={{
        antialias: false, // SMAA bilan almashtiradi
        powerPreference: 'high-performance',
        alpha: false,
      }}
      dpr={[1, 2]}
      style={{ background: '#0d0d12' }}
    >
      {/* Progress tracker */}
      <ModelProgressTracker />

      {/* Lights */}
      <ambientLight intensity={0.4} color="#ffeedd" />
      <directionalLight
        position={[8, 14, 6]}
        intensity={2.2}
        color="#fff5e8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-6, 8, -5]} intensity={0.7} color="#c8d8f0" />
      <hemisphereLight skyColor="#fff0d0" groundColor="#222233" intensity={0.5} />
      <pointLight position={[2, 3, 1]} intensity={1.5} color="#ffcc88" distance={8} />
      <pointLight position={[-3, 3, -2]} intensity={1.2} color="#ffcc88" distance={6} />

      {/* Environment (HDR muqobil) */}
      <Environment preset="apartment" background={false} />

      {/* Model */}
      <Suspense fallback={null}>
        <ApartmentModel
          url={modelUrl}
          wireframe={renderMode === 'wireframe'}
        />
      </Suspense>

      {/* Yer soyasi */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={10}
        color="#000000"
      />

      {/* Controls */}
      {cameraMode === 'orbit' ? (
        <>
          <OrbitControls
            ref={orbitRef}
            enableDamping
            dampingFactor={0.05}
            minDistance={1.5}
            maxDistance={30}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={0.05}
            rotateSpeed={0.7}
            zoomSpeed={0.9}
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
          />
          <CameraAnimator orbitRef={orbitRef} />
        </>
      ) : (
        <WalkControls />
      )}

      {/* Post-processing */}
      <EffectComposer multisampling={0}>
        <SMAA />
        <Bloom
          intensity={0.3}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.4} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  )
}
