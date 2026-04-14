import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'

export default function Loader() {
  const modelProgress = useStore(s => s.modelProgress)
  const appReady      = useStore(s => s.appReady)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (appReady) {
      const t = setTimeout(() => setVisible(false), 800)
      return () => clearTimeout(t)
    }
  }, [appReady])

  if (!visible) return null

  const pct = Math.round(modelProgress * 100)

  return (
    <div className={`loader${appReady ? ' fade-out' : ''}`}>
      <div className="loader__inner">
        <div className="loader__brand">
          <span className="loader__brand-l">VR</span>
          <span className="loader__brand-s">net</span>
        </div>

        <div className="loader__sub">Virtual Showroom</div>

        <div className="loader__bar-wrap">
          <div className="loader__bar">
            <div className="loader__fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="loader__pct">{pct}%</span>
        </div>
      </div>
    </div>
  )
}
