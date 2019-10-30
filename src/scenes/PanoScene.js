// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the Phaser3d plugin
import Phaser3D from '../../plugins/phaser3D/Phaser3D'

// Get the important pieces from three.js
import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'

import PanoSprite from '../sprites/PanoSprite'

class PanoScene extends Phaser.Scene {
  init (initData) {
    // Check the init vals if not explicity told to ignore
    if (!this.ignoreInitVals && initData) {
      // Receive the name of the skybox that should be loaded
      this.skyboxName = initData.skyboxName
      this.vertFOV = initData.defaultFOV
    }

    // Ensure good default values are set for all properties
    this.skyboxName = this.skyboxName || ''
    this.vertFOV = this.vertFOV || 70
    this.panoSprites = []

    // Pre-bind the update method for orbit controls
    this.updateSpritePositions = this.updateSpritePositions.bind(this)

    this.events.on('shutdown', this.shutdown, this)
  }

  shutdown () {
    if (this.controls) {
      this.controls.removeEventListener('change', this.updateSpritePositions)
      this.controls = null
    }
  }

  create () {
    // Initialize a Phaser3D rendering system
    this.phaser3d = new Phaser3D(this, {
      fov: this.vertFOV,
      near: 0.1,
      far: 1000,
      z: 1000
    })
    this.horiFOV = this.vertFOV * this.phaser3d.camera.aspect

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

    // Setup standard orbit controls
    this.controls = new THREE.OrbitControls(this.phaser3d.camera, this.scale.parent)
    this.controls.enableZoom = false
    this.controls.enablePan = false

    // Update sprite positions when orbit controls move
    this.controls.addEventListener('change', this.updateSpritePositions)
    this.updateSpritePositions() // Call once to initialize sprite positions

    this.setupSceneChangeKeys()
  }

  addPanoSprite (textureKey, angX, angY, baseScale, zoomStrength) {
    // Make sure texture key was provided
    if (!textureKey) {
      console.warn('Error: PanoScene.addPanoSprite called without textureKey')
      return
    }

    // Set default values if undefined
    angX = angX || 0
    angY = angY || 0
    baseScale = baseScale || 1.0
    zoomStrength = zoomStrength || 1.0

    // Create PanoSprite with parameters
    const newSprite = new PanoSprite({
      scene: this,
      angX: angX,
      angY: angY,
      textureKey: textureKey,
      perspectiveStrength: zoomStrength
    })
    newSprite.setScale(baseScale)
    newSprite.setDepth(this.panoSprites.length + 1)

    // Add to scene and panosprite list
    this.add.existing(newSprite)
    this.panoSprites.push(newSprite)

    // Return the newly created sprite
    return newSprite
  }

  updateSpritePositions () {
    this.panoSprites.forEach((pSprite) => {
      pSprite.updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
        this.cameras.main.width, this.cameras.main.height)
    })
  }

  setupSceneChangeKeys () {
    this.scene1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
    this.scene2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
    this.scene3Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)

    this.scene1Key.on('up', (e) => {
      this.scene.start('Conservatory')
    }, this)

    this.scene2Key.on('up', (e) => {
      this.scene.start('TestRoom')
    }, this)

    this.scene3Key.on('up', (e) => {
      this.scene.start('ReceptionHall')
    }, this)
  }

  update (time) {
  }
}

export default PanoScene
