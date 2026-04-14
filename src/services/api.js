import { create } from 'zustand'

// ─── API SERVICE (kelajakda backend dan keladi) ──────────────
// Hozir local fallback, kelajakda BASE_URL o'zgartiriladi
const API_BASE = import.meta.env.VITE_API_BASE || ''

export const modelApi = {
  // Barcha modellar ro'yxatini olish
  async getModels() {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/models`)
      return res.json()
    }
    // Local fallback — API ulanganda bu o'chadi
    return [
      {
        id: 1,
        name: 'Luxury Penthouse',
        description: '3-xonali, 124 m², 12-qavat',
        price: '$485,000',
        area: 124,
        rooms: 3,
        floor: 12,
        url: '/apartamento.glb',
        thumbnail: null,
      }
    ]
  },

  // Bitta modelni olish
  async getModel(id) {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/models/${id}`)
      return res.json()
    }
    const models = await modelApi.getModels()
    return models.find(m => m.id === id)
  }
}
