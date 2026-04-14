import { useStore } from '@/store/useStore'

export default function InfoPanel() {
  const showInfoPanel   = useStore(s => s.showInfoPanel)
  const toggleInfoPanel = useStore(s => s.toggleInfoPanel)

  return (
    <div className={`info-panel${showInfoPanel ? ' open' : ''}`}>
      {/* Close */}
      <button className="info-panel__close" onClick={toggleInfoPanel}>
        ×
      </button>

      {/* Tag */}
      <div className="info-panel__tag">Premium kvartira</div>

      {/* Title */}
      <h2 className="info-panel__title">
        Zamonaviy <em>Apartament</em>
      </h2>

      {/* Stats */}
      <div className="info-panel__stats">
        <div className="stat">
          <span className="stat__val">120</span>
          <span className="stat__lbl">m² Maydon</span>
        </div>
        <div className="stat">
          <span className="stat__val">3</span>
          <span className="stat__lbl">Xonalar</span>
        </div>
        <div className="stat">
          <span className="stat__val">12</span>
          <span className="stat__lbl">Qavat</span>
        </div>
      </div>

      {/* Description */}
      <p className="info-panel__desc">
        Toshkent shahri, Yunusobod tumani. Zamonaviy dizayn va yuqori sifatli materiallar bilan qurilgan premium kvartira.
      </p>

      {/* Features */}
      <div className="info-panel__features">
        {['Smart home', 'Konditsioner', 'Parkovka', 'Qoʻriqlash'].map(f => (
          <span key={f} className="feature-tag">{f}</span>
        ))}
      </div>

      {/* Price */}
      <div className="info-panel__price">
        <span className="price__label">Narx</span>
        <div className="price__val">$185,000</div>
      </div>

      {/* CTA */}
      <button className="info-panel__cta">Bogʻlanish</button>
    </div>
  )
}
