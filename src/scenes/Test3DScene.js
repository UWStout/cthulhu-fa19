// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the Phaser3d plugin
import Phaser3D from '../../plugins/phaser3D/Phaser3D'

// Get the important pieces from three.js
import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/controls/FlyControls'

class P3dScene extends Phaser.Scene {
  init (initData) {
    // Receive the name of the skybox that should be loaded
    if (initData) {
      this.skyboxName = initData.skyboxName || ''
      this.defaultFOV = initData.defaultFOV || 70
    }
  }

  preload () {
    // Disc sprite used to render cloud of points
    this.load.image('bigmouth', 'assets/images/BigMouth_FrontView.png')
    this.load.image('tom', 'assets/images/TiredTom_FrontView.png')
    this.load.image('longarms', 'assets/images/LongArmsBoi_FrontView.png')
  }

  create () {
    // Initialize a Phaser3D rendering system
    this.phaser3d = new Phaser3D(this, {
      fov: this.defaultFOV,
      near: 2,
      far: 100000,
      z: 1000
    })

    // Setup background skybox
    // Note: These assets are loaded direclty by three.js and are not in the preload() above.
    // This can result in a flash of an untextured background as they load.  You may want to
    // Hide this by having fade-in and fade-out transitions for these scenes.
    this.phaser3d.setCubeBackground(
      'assets/images/skybox/' + this.skyboxName + '/',
      'px.jpg', 'nx.jpg',
      'py.jpg', 'ny.jpg',
      'pz.jpg', 'nz.jpg'
    )

    // Enable fog (causes dots in the distance to be darker)
    // this.phaser3d.enableFogExp2(0x000000, 0.001)

    // Build list of random points
    const vertices = []
    for (let i = 0; i < 1; i++) {
      const x = 0
      const y = 0
      const z = 100

      vertices.push(x, y, z)
    }

    // Build geometry to hold the position of all the dots
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    // Create material from disc sprite
    // Note: while this sprite is rendered by three.js it is a Phaser image asset and WAS
    // loaded in preload() above.  This is in contrast to the skybox.
    // this.material = this.phaser3d.createMaterial('bigmouth', null, {
    //   size: 500,
    //   sizeAttenuation: false,
    //   alphaTest: 0.5,
    //   transparent: true,
    //   points: true
    // })

    this.plane = this.phaser3d.addPlane({
      width: 500,
      height: 500,
      Z: 10,
      texture: 'bigmouth',
      material: {
        size: 500,
        sizeAttenuation: true
      }
    })
    // this.plane.rotateX(-90)

    // Set default color
    // this.material.color.setHSL(1.0, 0.3, 0.7)

    // Add the points with the previously created geometry and material
    // this.phaser3d.addPoints({
    //   geometry: geometry,
    //   material: this.material
    // })

    // Setup standard orbit controls
    this.controls = new THREE.OrbitControls(this.phaser3d.camera, this.scale.parent)
    this.controls.enableZoom = false
    this.controls.enablePan = false

    this.setupSceneChangeKeys()
  }

  setupSceneChangeKeys () {
    this.scene1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
    this.scene2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
    this.scene3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)

    this.scene1Key.on('up', (e) => {
      this.scene.start('Test3D', { skyboxName: 'Conservatory', defaultFOV: 90 })
    }, this)

    this.scene2Key.on('up', (e) => {
      this.scene.start('Test3D', { skyboxName: 'NewReceptionHall' })
    }, this)

    this.scene3Key.on('up', (e) => {
      this.scene.start('Test3D', { skyboxName: 'Test', defaultFOV: 120 })
    }, this)
  }

  update (time) {
    // Slowly change color of the points over time
    // const h = (360 * (1.0 + (time * 0.00005)) % 360) / 360
    // this.material.color.setHSL(h, 0.5, 0.5)
  }
}

export default P3dScene
