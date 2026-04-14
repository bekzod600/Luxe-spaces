export class UIManager {
  constructor(scene) {
    this.scene = scene
    this._bindNav()
    this._bindRoomBtns()
    this._bindTools()
    this._bindFullscreen()
    this._bindInfoPanel()
    this._autoHideHint()
  }

  _bindNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        if (btn.dataset.view === 'info') {
          document.getElementById('infoPanel').classList.add('open')
        } else {
          document.getElementById('infoPanel').classList.remove('open')
        }
      })
    })
  }

  _bindRoomBtns() {
    document.querySelectorAll('.room-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.room-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        this.scene.goToRoom(btn.dataset.room)
      })
    })
  }

  _bindTools() {
    document.getElementById('btnWireframe').addEventListener('click', (e) => {
      document.getElementById('btnWireframe').classList.add('active')
      document.getElementById('btnShaded').classList.remove('active')
      this.scene.setWireframe(true)
    })

    document.getElementById('btnShaded').addEventListener('click', () => {
      document.getElementById('btnShaded').classList.add('active')
      document.getElementById('btnWireframe').classList.remove('active')
      this.scene.setWireframe(false)
    })

    let rotating = false
    document.getElementById('btnAutoRotate').addEventListener('click', (e) => {
      rotating = !rotating
      e.currentTarget.classList.toggle('active', rotating)
      this.scene.setAutoRotate(rotating)
    })
  }

  _bindFullscreen() {
    document.getElementById('btnFullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    })
  }

  _bindInfoPanel() {
    document.getElementById('infoPanelClose').addEventListener('click', () => {
      document.getElementById('infoPanel').classList.remove('open')
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
      document.querySelector('.nav-btn[data-view="tour"]').classList.add('active')
    })
  }

  _autoHideHint() {
    setTimeout(() => {
      const hint = document.getElementById('controlsHint')
      if (hint) hint.classList.add('hint-hidden')
    }, 5000)
  }
}
