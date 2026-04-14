# LUXE SPACES — Virtual 3D Apartment Tour

VRNET.IO kabi professional 3D ko'chmas mulk ko'rsatish platformasi.

## Ishga tushirish

```bash
cd D:\Vue\vrnet-demo
npm install
npm run dev
```

Brauzer avtomatik http://localhost:3000 da ochiladi.

## Stack
- **Vite** — ultra-tez dev server
- **Three.js** — WebGL 3D render
- **OrbitControls** — kamera boshqaruvi
- **GLTFLoader + DRACOLoader** — GLB model yuklash

## Funksiyalar
- ✅ GLB model real-time render
- ✅ Kamera animatsiyasi (room presets)
- ✅ Wireframe / Shaded rejim
- ✅ Auto-rotate
- ✅ Info panel (narx, xonalar)
- ✅ Fullscreen
- ✅ Progress loader
- ✅ Responsive dizayn
- ✅ Fallback scene (agar GLB yuklanmasa)

## Fayl joylashuvi
```
vrnet-demo/
├── public/
│   └── apartamento.glb     ← 3D model
├── src/
│   ├── main.js             ← kirish nuqta
│   ├── app.js              ← HTML template + bootstrap
│   ├── scene.js            ← Three.js scene manager
│   ├── ui.js               ← UI events
│   └── style.css           ← dizayn
├── index.html
├── package.json
└── vite.config.js
```
