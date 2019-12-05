// Import the entire 'phaser' namespace
import Phaser, { NONE } from 'phaser'

// Import the Phaser3d plugin
import Phaser3D from '../../plugins/phaser3D/Phaser3D'

// Get the important pieces from three.js
import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'

import PanoSprite from '../sprites/PanoSprite'

// Import the special pixelization filter
import PixelationPipeline from '../shaders/PixelationPipeline'

// HEALTH VARIABLES
var healthAmount = 100
var mouseCheckRadius = 20
var withinRadius = false

class PanoScene extends Phaser.Scene {
  init (data) {
    this.startAngle = 0
    if (typeof data.startAngle !== 'undefined') {
      this.startAngle = data.startAngle
    }
    // List of collected items
    this.collectedObjects = []
    if (Array.isArray(data.collectedObjects)) {
      this.collectedObjects = data.collectedObjects
    }

    // Ensure good default values are set for all properties
    this.skyboxName = this.skyboxName || ''
    this.vertFOV = this.vertFOV || 70
    this.panoSprites = []
    this.overSprite = null

    // Pre-bind the update method for orbit controls
    this.updateSpritePositions = this.updateSpritePositions.bind(this)

    this.events.on('shutdown', this.shutdown, this)
  }

  preload () {
    this.load.image('bar', 'assets/images/bar.png')
    this.load.image('trace', 'assets/images/TestTraceImage.png')

    this.load.image('mask', 'assets/images/spotlight/mask1.png')//spotlight stuff
    this.load.image('room', 'assets/images/spotlight/Black.jpg')//blackbackground

    this.load,Audio('music', 'assets/audio/music-bridge.wav')

    this.pixelationPipeline = this.game.renderer.addPipeline('PixelFilter', new PixelationPipeline(this.game))
    this.downOnDoor = NONE
    this.monsterList = []
    this.input.on('pointerup', (pointer) => { this.downOnDoor = NONE }, this)
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

    this.scene.run('Info')
    this.infoScene = this.scene.get('Info')
    this.infoScene.create()

    // HEALTH FUNCTION
    this.input.on('pointermove', (pointer) => {
      let isWithin = false
      for (let i = 0; i < this.monsterList.length; i++) {
        var rectA = this.monsterList[i].getBounds()
        var rectB = new Phaser.Geom.Rectangle(pointer.x - mouseCheckRadius / 2, pointer.y + mouseCheckRadius / 2, mouseCheckRadius, mouseCheckRadius)
        var rectC = new Phaser.Geom.Rectangle()
        Phaser.Geom.Rectangle.Intersection(rectA, rectB, rectC)
        if (!rectC.isEmpty()) {
          isWithin = true
        }
      }
      withinRadius = isWithin
    }, this)

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
    this.controls.initialRotate(this.startAngle)
    this.controls.minPolarAngle = Math.PI / 2.4
    this.controls.maxPolarAngle = Math.PI / 1.6

    // Update sprite positions when orbit controls move
    this.controls.addEventListener('change', this.updateSpritePositions)
    this.updateSpritePositions() // Call once to initialize sprite positions

    this.setupSceneChangeKeys()

    this.cameras.main.fadeIn(this.fadeoutTime) // Camera fade-in for start of game

    // Pixelation of camera
    this.pixelationPipeline.res = {
      width: this.cameras.main.width,
      height: this.cameras.main.height
    }
    // this.cameras.main.setRenderToTexture('PixelFilter')

    // theImage.texture.getPixel() // Use to get pixel of image

    // spotlight-----------------------------------------------
    var pic = this.add.image(500, 280, 'room').setScale(1.2)
    pic.setDepth(100)

    var spotlight = this.make.sprite({
      x: 400,
      y: 400,
      key: 'mask',
      add: false
    }).setScale(3)

    pic.mask = new Phaser.Display.Masks.BitmapMask(this, spotlight)
    pic.mask.invertAlpha = true
    this.input.on('pointermove', function (pointer) {
      spotlight.x = pointer.x
      spotlight.y = pointer.y

    })
    // --------------------------------------------------------
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
        this.game.config.width, this.game.config.height)
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

  transitionTo (sceneName, collectedObjects, startAngle) {
    this.cameras.main.fadeOut(this.fadeoutTime)
    this.time.delayedCall(this.fadeoutTime, this.startScene, [sceneName, collectedObjects, startAngle], this)
  }

  startScene (sceneName, collectedObjects, startAngle) {
    this.scene.start(sceneName, { collectedObjects: collectedObjects, startAngle: startAngle })
  }

  update (time) {
    // this.input.mouse.requestPointerLock()

    if (withinRadius) {
      healthAmount -= 0.1
      if (healthAmount < 0) {
        healthAmount = 0
      }
    }

    this.infoScene.updateHealth(healthAmount)
  }

  // Door creation function used by the rooms
  createDoor (posX, posY, scaleX, scaleY, sceneToLoad, startAngle) {
    const doorSprite = this.addPanoSprite(NONE, posX, posY, 5.0)
    doorSprite.baseScaleX *= scaleX
    doorSprite.baseScaleY *= scaleY
    doorSprite.alpha = 0.1
    doorSprite.setInteractive(new Phaser.Geom.Rectangle(0, 0, doorSprite.width, doorSprite.height), Phaser.Geom.Rectangle.Contains)

    // Checks if the pointer was pressed and released on the same door
    doorSprite.on('pointerdown', (pointer) => { this.downOnDoor = doorSprite })
    doorSprite.on('pointerup', (pointer) => { if (this.downOnDoor === doorSprite) { this.transitionTo(sceneToLoad, this.collectedObjects, startAngle) } this.downOnDoor = NONE }, this)
  }

  // Collectable creation function used by rooms
  createCollectable (posX, posY, scale, spriteName) {
    const collectable = this.addPanoSprite(spriteName, posX, posY, scale)
    collectable.setInteractive(new Phaser.Geom.Rectangle(0, 0, collectable.width, collectable.height), Phaser.Geom.Rectangle.Contains)
    collectable.on('pointerdown', (pointer) => {
      this.collectedObjects.push(spriteName)
      console.log(this.collectedObjects)
      collectable.destroy()
    }, this)
  }

  createMonster (posX, posY, scale, spriteName) {
    const monster = this.addPanoSprite(spriteName, posX, posY, scale)
    this.monsterList.push(monster)
  }
}

export default PanoScene
