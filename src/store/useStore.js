import { create } from 'zustand'
import { modelApi } from '@/services/api'

export const useStore = create((set, get) => ({
  // ─── LOADING ────────────────────────────────────────────────
  appReady: false,
  modelLoading: true,
  modelProgress: 0,
  setModelProgress: (p) => set({ modelProgress: p }),
  setModelLoading: (v) => set({ modelLoading: v }),
  setAppReady: () => set({ appReady: true }),

  // ─── MODELS (API) ───────────────────────────────────────────
  models: [],
  currentModel: null,
  fetchModels: async () => {
    try {
      const models = await modelApi.getModels()
      set({ models, currentModel: models[0] })
    } catch (e) {
      console.error('Model API error:', e)
    }
  },
  setCurrentModel: (model) => set({ currentModel: model, modelLoading: true, modelProgress: 0 }),

  // ─── CAMERA MODE ────────────────────────────────────────────
  // 'orbit' = aylanish (OrbitControls)
  // 'walk'  = ichida yurish (PointerLockControls)
  cameraMode: 'orbit',
  setCameraMode: (mode) => set({ cameraMode: mode }),

  // ─── UI ─────────────────────────────────────────────────────
  showInfoPanel: false,
  toggleInfoPanel: () => set(s => ({ showInfoPanel: !s.showInfoPanel })),

  activeRoom: 'overview',
  setActiveRoom: (room) => set({ activeRoom: room }),

  renderMode: 'shaded', // 'shaded' | 'wireframe'
  setRenderMode: (mode) => set({ renderMode: mode }),

  autoRotate: false,
  toggleAutoRotate: () => set(s => ({ autoRotate: !s.autoRotate })),

  showControls: true,
  hideControls: () => set({ showControls: false }),
}))
