import { SceneManager } from './scene.js'
import { UIManager } from './ui.js'

export function createApp() {
  const appEl = document.getElementById('app')

  appEl.innerHTML = `
    <!-- LOADING SCREEN -->
    <div id="loader" class="loader">
      <div class="loader__inner">
        <div class="loader__brand">
          <span class="loader__brand-l">LUXE</span>
          <span class="loader__brand-s">SPACES</span>
        </div>
        <div class="loader__bar-wrap">
          <div class="loader__bar">
            <div class="loader__fill" id="loaderFill"></div>
          </div>
          <span class="loader__pct" id="loaderPct">0%</span>
        </div>
        <p class="loader__sub">Preparing your virtual tour...</p>
      </div>
    </div>

    <!-- MAIN UI OVERLAY -->
    <div id="ui" class="ui hidden">

      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar__brand">
          <span class="brand-l">LUXE</span><span class="brand-s">SPACES</span>
        </div>
        <nav class="topbar__nav">
          <button class="nav-btn active" data-view="tour">Virtual Tour</button>
          <button class="nav-btn" data-view="info">Apartment Info</button>
        </nav>
        <div class="topbar__actions">
          <button class="action-btn" id="btnFullscreen" title="Fullscreen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
          <button class="action-btn cta-btn" id="btnContact">Book a Visit</button>
        </div>
      </header>

      <!-- Sidebar info panel -->
      <aside class="info-panel" id="infoPanel">
        <button class="info-panel__close" id="infoPanelClose">✕</button>
        <div class="info-panel__content">
          <p class="info-panel__tag">Premium Residence</p>
          <h2 class="info-panel__title">Penthouse<br><em>Collection</em></h2>
          <div class="info-panel__stats">
            <div class="stat"><span class="stat__val">124</span><span class="stat__lbl">m²</span></div>
            <div class="stat"><span class="stat__val">3</span><span class="stat__lbl">Rooms</span></div>
            <div class="stat"><span class="stat__val">12</span><span class="stat__lbl">Floor</span></div>
          </div>
          <p class="info-panel__desc">Experience luxury living reimagined. Floor-to-ceiling windows, premium finishes, and panoramic city views — every detail curated for the discerning resident.</p>
          <div class="info-panel__features">
            <span class="feature-tag">Smart Home</span>
            <span class="feature-tag">Panoramic View</span>
            <span class="feature-tag">Premium Finish</span>
            <span class="feature-tag">Private Terrace</span>
          </div>
          <div class="info-panel__price">
            <span class="price__label">Starting from</span>
            <span class="price__val">$485,000</span>
          </div>
          <button class="info-panel__cta">Schedule Viewing</button>
        </div>
      </aside>

      <!-- Controls hint -->
      <div class="controls-hint" id="controlsHint">
        <div class="hint-item">
          <span class="hint-icon">🖱</span>
          <span>Drag to rotate</span>
        </div>
        <div class="hint-item">
          <span class="hint-icon">⚲</span>
          <span>Scroll to zoom</span>
        </div>
        <div class="hint-item">
          <span class="hint-icon">⇧</span>
          <span>Right-drag to pan</span>
        </div>
      </div>

      <!-- Bottom toolbar -->
      <div class="bottom-bar">
        <div class="bottom-bar__rooms" id="roomBtns">
          <button class="room-btn active" data-room="overview">Overview</button>
          <button class="room-btn" data-room="living">Living Room</button>
          <button class="room-btn" data-room="bedroom">Bedroom</button>
          <button class="room-btn" data-room="kitchen">Kitchen</button>
        </div>
        <div class="bottom-bar__right">
          <button class="tool-btn" id="btnWireframe" title="Wireframe">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
            Wireframe
          </button>
          <button class="tool-btn active" id="btnShaded" title="Shaded">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18"/></svg>
            Shaded
          </button>
          <button class="tool-btn" id="btnAutoRotate" title="Auto Rotate">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.61"/><path d="M21 3v6h-6"/></svg>
            Auto Rotate
          </button>
        </div>
      </div>
    </div>

    <!-- THREE.JS CANVAS CONTAINER -->
    <div id="canvasWrap" class="canvas-wrap"></div>
  `

  const scene = new SceneManager('canvasWrap', {
    onProgress: (pct) => {
      document.getElementById('loaderFill').style.width = pct + '%'
      document.getElementById('loaderPct').textContent = Math.round(pct) + '%'
    },
    onReady: () => {
      setTimeout(() => {
        const loader = document.getElementById('loader')
        loader.classList.add('fade-out')
        setTimeout(() => {
          loader.style.display = 'none'
          document.getElementById('ui').classList.remove('hidden')
          document.getElementById('ui').classList.add('fade-in')
        }, 600)
      }, 400)
    }
  })

  new UIManager(scene)
}
