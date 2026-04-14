import { useStore } from '@/store/useStore'

export default function BottomBar() {
  const renderMode    = useStore(s => s.renderMode)
  const setRenderMode = useStore(s => s.setRenderMode)
  const autoRotate    = useStore(s => s.autoRotate)
  const toggleAutoRotate = useStore(s => s.toggleAutoRotate)

  return (
    <div className="bottom-bar">
      {/* Hint */}
      <div className="bottom-bar__hint">
        Sichqoncha: aylanish · Scroll: zum
      </div>

      {/* Controls */}
      <div className="bottom-bar__right">
        <button
          className={`tool-btn${renderMode === 'wireframe' ? ' active' : ''}`}
          onClick={() => setRenderMode(renderMode === 'shaded' ? 'wireframe' : 'shaded')}
        >
          Wireframe
        </button>
        <button
          className={`tool-btn${autoRotate ? ' active' : ''}`}
          onClick={toggleAutoRotate}
        >
          Auto aylanis
        </button>
        <button
          className="tool-btn"
          onClick={() => document.documentElement.requestFullscreen?.()}
        >
          ⛶ To'liq ekran
        </button>
      </div>
    </div>
  )
}
