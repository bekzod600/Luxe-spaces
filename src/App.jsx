import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import Scene from '@/components/Scene'
import Loader from '@/components/Loader'
import Topbar from '@/components/Topbar'
import InfoPanel from '@/components/InfoPanel'
import BottomBar from '@/components/BottomBar'
import WalkModeOverlay from '@/components/WalkModeOverlay'

export default function App() {
  const fetchModels  = useStore(s => s.fetchModels)
  const currentModel = useStore(s => s.currentModel)

  // API dan modellarni yuklab olish
  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  const modelUrl = currentModel?.url || '/apartamento.glb'

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Loading ekrani */}
      <Loader />

      {/* 3D Canvas */}
      <Scene modelUrl={modelUrl} />

      {/* UI qatlami */}
      <Topbar />
      <InfoPanel />
      <WalkModeOverlay />
      <BottomBar />
    </div>
  )
}
