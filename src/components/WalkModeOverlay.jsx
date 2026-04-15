import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'

export default function WalkModeOverlay() {
  const cameraMode    = useStore(s => s.cameraMode)
  const setCameraMode = useStore(s => s.setCameraMode)
  const [locked, setLocked]     = useState(false)
  const [showHint, setShowHint] = useState(true)

  // Pointer lock holatini kuzatamiz
  useEffect(() => {
    if (cameraMode !== 'walk') {
      setLocked(false)
      setShowHint(true)
      return
    }
    const onLock   = () => setLocked(true)
    const onUnlock = () => setLocked(false)
    document.addEventListener('pointerlockchange', onLock)
    document.addEventListener('pointerlockchange', onUnlock)
    return () => {
      document.removeEventListener('pointerlockchange', onLock)
      document.removeEventListener('pointerlockchange', onUnlock)
    }
  }, [cameraMode])

  // 4 soniyadan so'ng hint yashiriladi
  useEffect(() => {
    if (cameraMode !== 'walk') return
    setShowHint(true)
    const t = setTimeout(() => setShowHint(false), 4000)
    return () => clearTimeout(t)
  }, [cameraMode])

  if (cameraMode !== 'walk') return null

  return (
    <div className="walk-overlay">

      {/* === CROSSHAIR === */}
      <div className="walk-crosshair" style={{ pointerEvents: 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="2" x2="12" y2="8"  stroke="rgba(201,169,110,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="16" x2="12" y2="22" stroke="rgba(201,169,110,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="2" y1="12" x2="8" y2="12"  stroke="rgba(201,169,110,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="16" y1="12" x2="22" y2="12" stroke="rgba(201,169,110,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="1.5" fill="rgba(201,169,110,0.9)"/>
        </svg>
      </div>

      {/* === TOP LEFT BADGE === */}
      <div className="walk-badge">
        <span className="walk-badge__dot" />
        <span className="walk-badge__text">YURISH REJIMI</span>
      </div>

      {/* === CONTROLS HINT (pastda, auto-hide) === */}
      <div className={`walk-hint${showHint ? '' : ' walk-hint--hidden'}`}>
        <div className="walk-hint__inner">
          <div className="walk-hint__group">
            <div className="walk-hint__keys">
              <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
            </div>
            <span className="walk-hint__label">Yurish</span>
          </div>
          <div className="walk-hint__sep" />
          <div className="walk-hint__group">
            <div className="walk-hint__keys">
              <kbd className="walk-hint__key--wide">Mouse</kbd>
            </div>
            <span className="walk-hint__label">Qarash</span>
          </div>
          <div className="walk-hint__sep" />
          <div className="walk-hint__group">
            <div className="walk-hint__keys">
              <kbd className="walk-hint__key--wide">ESC</kbd>
            </div>
            <span className="walk-hint__label">Chiqish</span>
          </div>
        </div>
      </div>

      {/* === EXIT BUTTON === */}
      <button
        className="walk-exit-btn"
        style={{ pointerEvents: 'all' }}
        onClick={() => setCameraMode('orbit')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Chiqish
      </button>

    </div>
  )
}
