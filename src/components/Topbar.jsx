import { useStore } from '@/store/useStore'

const ROOMS = [
  { id: 'overview',  label: 'Umumiy' },
  { id: 'living',    label: 'Yashash xonasi' },
  { id: 'bedroom',   label: 'Yotoqxona' },
  { id: 'kitchen',   label: 'Oshxona' },
  { id: 'bathroom',  label: 'Hammom' },
]

export default function Topbar() {
  const cameraMode    = useStore(s => s.cameraMode)
  const setCameraMode = useStore(s => s.setCameraMode)
  const activeRoom    = useStore(s => s.activeRoom)
  const setActiveRoom = useStore(s => s.setActiveRoom)
  const showInfoPanel = useStore(s => s.showInfoPanel)
  const toggleInfoPanel = useStore(s => s.toggleInfoPanel)

  return (
    <div className="topbar">
      {/* Logo */}
      <div className="topbar__brand">
        <span className="brand-l">VR</span>
        <span className="brand-s">net</span>
      </div>

      {/* Room tabs */}
      <nav className="topbar__nav">
        {ROOMS.map(r => (
          <button
            key={r.id}
            className={`nav-btn${activeRoom === r.id ? ' active' : ''}`}
            onClick={() => setActiveRoom(r.id)}
          >
            {r.label}
          </button>
        ))}
      </nav>

      {/* Right controls */}
      <div className="topbar__actions">
        <button
          className={`action-btn${cameraMode === 'walk' ? ' active' : ''}`}
          onClick={() => setCameraMode(cameraMode === 'orbit' ? 'walk' : 'orbit')}
          title={cameraMode === 'walk' ? 'Orbit rejimi' : 'Yurish rejimi'}
        >
          {cameraMode === 'walk' ? '🚶' : '🔄'}
        </button>

        <button
          className={`action-btn cta-btn`}
          onClick={toggleInfoPanel}
        >
          Ma'lumot
        </button>
      </div>
    </div>
  )
}
