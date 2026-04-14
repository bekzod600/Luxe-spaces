import { useStore } from '@/store/useStore'

export default function WalkModeOverlay() {
  const cameraMode    = useStore(s => s.cameraMode)
  const setCameraMode = useStore(s => s.setCameraMode)

  if (cameraMode !== 'walk') return null

  return (
    <div className="walk-overlay">
      {/* Crosshair */}
      <div className="walk-overlay__crosshair" />

      {/* Walk mode badge */}
      <div className="walk-overlay__badge">
        <span style={{ color: 'var(--gold)' }}>W A S D</span> — yurish
        &nbsp;·&nbsp;
        <span style={{ color: 'var(--gold)' }}>Sichqoncha</span> — qarash
        &nbsp;·&nbsp;
        <span style={{ color: 'var(--gold)' }}>ESC</span> — chiqish
      </div>

      {/* Exit button */}
      <button
        onClick={() => setCameraMode('orbit')}
        style={{ pointerEvents: 'all' }}
        className="action-btn"
        title="Walk rejimdan chiqish"
      >
        ✕
      </button>
    </div>
  )
}
