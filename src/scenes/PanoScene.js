// Import the entire 'phaser' namespace
import Phaser, { NONE } from 'phaser'

// Import the Phaser3d plugin
import Phaser3D from '../../plugins/phaser3D/Phaser3D'

// Get the important pieces from three.js
import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'

// Import custom sprite class to make normal phaser sprites rotate in our 3D view
import PanoSprite from '../sprites/PanoSprite'

// Import the special pixelization filter
import PixelationPipeline from '../shaders/PixelationPipeline'

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

    // Variables for health management
    if (typeof data.healthAmount !== 'undefined') {
      this.healthAmount = data.healthAmount
    }
    else {
      this.healthAmount = 100
    }

    this.mouseCheckRadius = 20
    this.withinRadius = false

    // Pre-bind the update method for orbit controls
    this.updateSpritePositions = this.updateSpritePositions.bind(this)

    this.events.on('shutdown', this.shutdown, this)

    this.infoSceneData = {
      healthAmount: 100,
      showTrace: false
    }
  }

  preload () {
    this.load.image('bar', 'assets/images/bar.png')
    this.load.image('trace', 'assets/images/TestTraceImage.png')

    this.load.image('mask', 'assets/images/mask1.png')
    this.load.image('room', 'assets/images/Black.jpg')

    this.load.audio('ambienceTones', '../../assets/audio/ambience/ambient_tones_loop.wav')

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

    // Runs the info scene to display on top of the screen
    this.infoSceneData.healthAmount = this.healthAmount
    this.infoSceneData.skyboxName = this.skyboxName
    this.scene.run('Info', this.infoSceneData)
    this.infoScene = this.scene.get('Info')

    // Mouse event to decrease health if within range of monster
    this.input.on('pointermove', (pointer) => {
      let isWithin = false
      for (let i = 0; i < this.monsterList.length; i++) {
        var rectA = this.monsterList[i].getBounds()
        var rectB = new Phaser.Geom.Rectangle(pointer.x - this.mouseCheckRadius / 2, pointer.y + this.mouseCheckRadius / 2, this.mouseCheckRadius, this.mouseCheckRadius)
        var rectC = new Phaser.Geom.Rectangle()
        Phaser.Geom.Rectangle.Intersection(rectA, rectB, rectC)
        if (!rectC.isEmpty()) {
          isWithin = true
        }
      }
      this.withinRadius = isWithin
    }, this)

    // Setup background skybox
    // Note: These assets are loaded direclty by three.js and are not in the preload() above.
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
    // Limits vertical height the player can rotate to
    this.controls.minPolarAngle = Math.PI / 2.4
    this.controls.maxPolarAngle = Math.PI / 1.6

    // Update sprite positions when orbit controls move
    this.controls.addEventListener('change', this.updateSpritePositions)
    this.updateSpritePositions() // Call once to initialize sprite positions

    this.cameras.main.fadeIn(this.fadeoutTime) // Camera fade-in for start of game

    // Pixelation effect of camera
    this.pixelationPipeline.res = {
      width: this.cameras.main.width,
      height: this.cameras.main.height
    }
    // this.cameras.main.setRenderToTexture('PixelFilter')

    // spotlight-----------------------------------------------
    var pic = this.add.image(500, 280, 'room').setScale(1.2)
    pic.setDepth(100)
    pic.alpha = 0.98

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
    this.ambience = this.sound.add('ambienceTones', { loop: true })
    this.ambience.play()
  }

  // Adds a sprite that is orientated in the 3D world
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

  // Updates the positions for the panosprites
  updateSpritePositions () {
    this.panoSprites.forEach((pSprite) => {
      pSprite.updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
        this.game.config.width, this.game.config.height)
    })
  }

  // Used to fade between the current scene and a new scene
  transitionTo (sceneName, collectedObjects, startAngle) {
    this.cameras.main.fadeOut(this.fadeoutTime)
    this.time.delayedCall(this.fadeoutTime, this.startScene, [sceneName, collectedObjects, startAngle], this)
  }

  // Starts the new scene, called by transitionTo()
  startScene (sceneName, collectedObjects, startAngle) {
    this.scene.start(sceneName, { collectedObjects: collectedObjects, startAngle: startAngle, healthAmount: this.healthAmount })
  }

  update (time) {
    // this.input.mouse.requestPointerLock()

    // Updates health bar
    if (this.withinRadius) {
      this.healthAmount -= 0.1
      if (this.healthAmount < 0) {
        this.healthAmount = 0
      }
    }

    // TODO: Increase health if it hasn't decreased for a while

    this.infoScene.updateHealth(this.healthAmount)
    // Gets rotation of camera and sends it to the minimap in Info Scene
    this.infoScene.setMapRotation(-this.controls.getAzimuthalAngle() / Math.PI * 180)
  }

  // Creates a door sprite that navigates you to a different room when clicked
  createDoor (posX, posY, scaleX, scaleY, sceneToLoad, startAngle) {
    const doorSprite = this.addPanoSprite(NONE, posX, posY, 5.0)
    doorSprite.baseScaleX *= scaleX
    doorSprite.baseScaleY *= scaleY
    // TODO: Change alpha to 0.01 when in production so the door is basically invisible
    doorSprite.alpha = 0.1
    doorSprite.setInteractive(new Phaser.Geom.Rectangle(0, 0, doorSprite.width, doorSprite.height), Phaser.Geom.Rectangle.Contains)

    // Checks if the pointer was pressed and released on the same door
    doorSprite.on('pointerdown', (pointer) => { this.downOnDoor = doorSprite })
    doorSprite.on('pointerup', (pointer) => { if (this.downOnDoor === doorSprite) { this.transitionTo(sceneToLoad, this.collectedObjects, startAngle) } this.downOnDoor = NONE }, this)
  }

  // Collectable creation function used by rooms, spawns if not already in your list
  createCollectable (posX, posY, scale, spriteName) {
    let haveObject = false
    for (let i = 0; i < this.collectedObjects.length; i++) {
      if (this.collectedObjects[i] === spriteName) {
        haveObject = true
      }
    }
    if (!haveObject) {
      const collectable = this.addPanoSprite(spriteName, posX, posY, scale)
      collectable.setInteractive(new Phaser.Geom.Rectangle(0, 0, collectable.width, collectable.height), Phaser.Geom.Rectangle.Contains)
      collectable.on('pointerdown', (pointer) => {
        this.collectedObjects.push(spriteName)
        console.log(this.collectedObjects)
        collectable.destroy()
      }, this)
    }
  }

  // Creates a monster sprite that drains sanity
  createMonster (posX, posY, scale, spriteName) {
    const monster = this.addPanoSprite(spriteName, posX, posY, scale)
    this.monsterList.push(monster)
  }

  // createMonsterPath () {
  //   monsterPath stuff
  // }
}

export default PanoScene
