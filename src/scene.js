import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

// Camera presets for each room
const CAMERA_PRESETS = {
  overview: {
    position: new THREE.Vector3(8, 6, 10),
    target: new THREE.Vector3(0, 1, 0)
  },
  living: {
    position: new THREE.Vector3(3, 2.5, 5),
    target: new THREE.Vector3(0, 1.2, 0)
  },
  bedroom: {
    position: new THREE.Vector3(-4, 2.5, 4),
    target: new THREE.Vector3(-2, 1, 0)
  },
  kitchen: {
    position: new THREE.Vector3(4, 2.5, -3),
    target: new THREE.Vector3(1, 1, -1)
  }
}

export class SceneManager {
  constructor(containerId, callbacks = {}) {
    this.container = document.getElementById(containerId)
    this.callbacks = callbacks
    this.wireframeMode = false
    this.autoRotate = false
    this.model = null
    this.originalMaterials = new Map()
    this.clock = new THREE.Clock()
    this.animationId = null

    this._initRenderer()
    this._initScene()
    this._initCamera()
    this._initLights()
    this._initControls()
    this._loadModel()
    this._animate()

    window.addEventListener('resize', () => this._onResize())
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2
    this.container.appendChild(this.renderer.domElement)
  }

  _initScene() {
    this.scene = new THREE.Scene()
    // Elegant dark gradient background
    this.scene.background = new THREE.Color(0x0d0d12)
    this.scene.fog = new THREE.FogExp2(0x0d0d12, 0.018)
  }

  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    )
    this.camera.position.set(8, 6, 10)
  }

  _initLights() {
    // Ambient
    const ambient = new THREE.AmbientLight(0xffeedd, 0.4)
    this.scene.add(ambient)

    // Main warm key light (sun-like)
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.5)
    keyLight.position.set(8, 14, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.setScalar(2048)
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 80
    keyLight.shadow.camera.left = -15
    keyLight.shadow.camera.right = 15
    keyLight.shadow.camera.top = 15
    keyLight.shadow.camera.bottom = -15
    keyLight.shadow.bias = -0.001
    this.scene.add(keyLight)

    // Cool fill light (sky)
    const fillLight = new THREE.DirectionalLight(0xc8d8f0, 0.8)
    fillLight.position.set(-6, 8, -5)
    this.scene.add(fillLight)

    // Subtle warm bounce from floor
    const bounceLight = new THREE.HemisphereLight(0xfff0d0, 0x222233, 0.5)
    this.scene.add(bounceLight)

    // Interior point lights (warm glows)
    const warmGlow1 = new THREE.PointLight(0xffcc88, 1.5, 8)
    warmGlow1.position.set(2, 3, 1)
    this.scene.add(warmGlow1)

    const warmGlow2 = new THREE.PointLight(0xffcc88, 1.2, 6)
    warmGlow2.position.set(-3, 3, -2)
    this.scene.add(warmGlow2)
  }

  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 1, 0)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 2
    this.controls.maxDistance = 25
    this.controls.maxPolarAngle = Math.PI * 0.85
    this.controls.minPolarAngle = 0.1
    this.controls.rotateSpeed = 0.7
    this.controls.zoomSpeed = 0.9
    this.controls.update()
  }

  _loadModel() {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/apartamento.glb',
      (gltf) => {
        this.model = gltf.scene

        // Center and scale model
        const box = new THREE.Box3().setFromObject(this.model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 10 / maxDim
        this.model.scale.setScalar(scale)
        this.model.position.sub(center.multiplyScalar(scale))
        this.model.position.y += size.y * scale * 0.5 - 0.5

        // Apply shadows + save materials
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            this.originalMaterials.set(child.uuid, child.material)

            // Enhance materials
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material]
              mats.forEach(mat => {
                if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
                  mat.envMapIntensity = 1.2
                }
              })
            }
          }
        })

        // Ground plane (shadow catcher)
        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(40, 40),
          new THREE.ShadowMaterial({ opacity: 0.25 })
        )
        ground.rotation.x = -Math.PI / 2
        ground.position.y = this.model.position.y - 0.01
        ground.receiveShadow = true
        this.scene.add(ground)

        this.scene.add(this.model)
        this._updateCameraFitToModel(box, scale)

        if (this.callbacks.onReady) this.callbacks.onReady()
      },
      (progress) => {
        if (progress.total > 0) {
          const pct = (progress.loaded / progress.total) * 100
          if (this.callbacks.onProgress) this.callbacks.onProgress(pct)
        }
      },
      (error) => {
        console.error('GLB load error:', error)
        // Show fallback demo scene
        this._createFallbackScene()
        if (this.callbacks.onReady) this.callbacks.onReady()
      }
    )
  }

  _updateCameraFitToModel(box, scale) {
    const size = box.getSize(new THREE.Vector3()).multiplyScalar(scale)
    const maxDim = Math.max(size.x, size.y, size.z)
    const fitDist = maxDim * 1.8

    this.camera.position.set(fitDist * 0.8, fitDist * 0.6, fitDist)
    this.controls.maxDistance = fitDist * 3
    this.controls.minDistance = maxDim * 0.15
    this.controls.update()

    // Update presets relative to model size
    const s = maxDim / 10
    CAMERA_PRESETS.overview.position.set(fitDist * 0.8, fitDist * 0.6, fitDist)
    CAMERA_PRESETS.living.position.set(s * 2.5, s * 2, s * 4)
    CAMERA_PRESETS.bedroom.position.set(-s * 3, s * 2, s * 3)
    CAMERA_PRESETS.kitchen.position.set(s * 3, s * 2, -s * 2.5)
  }

  _createFallbackScene() {
    // Fallback: procedural apartment-like scene
    const matFloor = new THREE.MeshStandardMaterial({ color: 0xd4c5a9, roughness: 0.8 })
    const matWall = new THREE.MeshStandardMaterial({ color: 0xf0ebe2, roughness: 0.9 })
    const matWood = new THREE.MeshStandardMaterial({ color: 0x8b6e4e, roughness: 0.6 })
    const matGlass = new THREE.MeshPhysicalMaterial({ color: 0x88aacc, roughness: 0, transmission: 0.8, transparent: true, opacity: 0.3 })

    // Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 10), matFloor)
    floor.receiveShadow = true
    this.scene.add(floor)

    // Walls
    [[0, 2, -5, 12, 4, 0.1], [0, 2, 5, 12, 4, 0.1], [-6, 2, 0, 0.1, 4, 10], [6, 2, 0, 0.1, 4, 10]].forEach(([x, y, z, w, h, d]) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matWall)
      wall.position.set(x, y, z)
      wall.castShadow = true
      wall.receiveShadow = true
      this.scene.add(wall)
    })

    // Ceiling
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 10), matWall)
    ceil.position.y = 4
    this.scene.add(ceil)

    // Sofa
    const sofa = new THREE.Group()
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 1), matWood)
    sofaBase.position.y = 0.3
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 0.2), matWood)
    sofaBack.position.set(0, 0.8, -0.4)
    sofa.add(sofaBase, sofaBack)
    sofa.position.set(-1, 0.05, -1.5)
    sofa.castShadow = true
    this.scene.add(sofa)

    // Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.8), matWood)
    table.position.set(-1, 0.6, 0.5)
    this.scene.add(table)

    // Window frames
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(3, 2.5, 0.1), matWood)
    winFrame.position.set(0, 1.5, -4.95)
    this.scene.add(winFrame)
    const win = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 0.05), matGlass)
    win.position.set(0, 1.5, -4.9)
    this.scene.add(win)

    this.model = { position: new THREE.Vector3(0, 0, 0) }
  }

  goToRoom(roomName) {
    const preset = CAMERA_PRESETS[roomName]
    if (!preset) return
    this._animateCamera(preset.position, preset.target)
  }

  _animateCamera(targetPos, targetLook) {
    const startPos = this.camera.position.clone()
    const startTarget = this.controls.target.clone()
    const duration = 1200
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      this.camera.position.lerpVectors(startPos, targetPos, ease)
      this.controls.target.lerpVectors(startTarget, targetLook, ease)
      this.controls.update()

      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  setWireframe(enabled) {
    this.wireframeMode = enabled
    if (!this.model || !this.model.traverse) return
    this.model.traverse((child) => {
      if (child.isMesh) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach(mat => {
          if (mat.wireframe !== undefined) mat.wireframe = enabled
        })
      }
    })
  }

  setAutoRotate(enabled) {
    this.autoRotate = enabled
    this.controls.autoRotate = enabled
    this.controls.autoRotateSpeed = 0.8
  }

  _animate() {
    this.animationId = requestAnimationFrame(() => this._animate())
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
