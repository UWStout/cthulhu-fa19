// Import the entire 'phaser' namespace
import Phaser, { NONE } from 'phaser'

// Import the Phaser3d plugin
import Phaser3D from '../../plugins/phaser3D/Phaser3D'

// Get the important pieces from three.js
import * as THREE from 'three'
import '../../plugins/phaser3D/OrbitControls'

// Import custom sprite class to make normal phaser sprites rotate in our 3D view
import PanoSprite from '../sprites/PanoSprite'

// Import the special pixelization filter
// import PixelationPipeline from '../shaders/PixelationPipeline'
import BlurPipeline from '../shaders/BlurPipeline'

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
    } else {
      this.healthAmount = 100
    }

    this.mouseCheckRadius = 240
    this.withinRadius = false
    this.radiusStrength = 0.0

    // Pre-bind the update method for orbit controls
    this.updateSpritePositions = this.updateSpritePositions.bind(this)

    this.events.on('shutdown', this.shutdown, this)

    this.infoSceneData = {
      healthAmount: 100,
      showTrace: false
    }
  }

  preload () {
    if (!this.game.renderer.hasPipeline('BlurFilter')) {
      this.blurPipeline = this.game.renderer.addPipeline('BlurFilter', new BlurPipeline(this.game))
    }
    else {
      this.blurPipeline = this.game.renderer.getPipeline('BlurFilter')
    }
    this.downOnDoor = NONE
    this.monsterList = []
    this.traceNumber = 0
    this.input.on('pointerup', (pointer) => { this.downOnDoor = NONE }, this)

    // List of collectable objects
    this.collectableList = []
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

    // Time variables
    this.t = 0
    this.tIncrement = 0.005

    // Game over variables
    this.gameover = false
    this.gameoverHandled = false

    // Graphics for drawing the flashlight and monster collision
    this.graphics = this.add.graphics()

    this.keys = this.input.keyboard.addKeys('Q,LEFT,RIGHT,A,D')

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

    // this.cameras.main.setRenderToTexture('PixelFilter')
    this.cameras.main.setRenderToTexture('BlurFilter')

    // spotlight-----------------------------------------------
    var pic = this.add.image(500, 280, 'room').setScale(1.2)
    pic.setDepth(300)
    var spotlight = this.make.sprite({
      x: 400,
      y: 400,
      key: 'mask',
      add: false
    }).setScale(3)

    this.spotlight = spotlight

    pic.mask = new Phaser.Display.Masks.BitmapMask(this, spotlight)
    pic.mask.invertAlpha = true
    // Make sure spotlight starts at the mouse
    const ourPointer = this.game.input.activePointer
    spotlight.x = ourPointer.x
    spotlight.y = ourPointer.y
    this.input.on('pointermove', function (pointer) {
      spotlight.x = pointer.x
      spotlight.y = pointer.y
    })
    // --------------------------------------------------------

    // Audio related stuff
    this.model = this.sys.game.globals.model
    if (this.model.musicName !== 'ambienceTones') {
      this.model.bgMusicPlaying = false
      this.sys.game.globals.bgMusic.stop()
    }
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.ambience = this.sound.add('ambienceTones', { loop: true, volume: 0.3 })
      this.ambience.play()
      this.model.bgMusicPlaying = true
      this.sys.game.globals.bgMusic = this.ambience
      this.model.musicName = 'ambienceTones'
    }
    this.closeAudio = this.sound.add('ambienceBitcrush', { loop: true, volume: 0.0 })
    this.closeAudio.play()

    this.heartbeatAudio = this.sound.add('heartbeat', { loop: true, volume: 0.0 })
    this.heartbeatAudio.play()

    this.pickupSound = this.sound.add('pickup')

    // Creates a walking animation for tomW
    const config = {
      key: 'walk',
      frames: this.anims.generateFrameNumbers('tomW'),
      frameRate: 5,
      yoyo: false,
      repeat: -1
    }

    this.anims.create(config)
  }

  // Adds a sprite that is orientated in the 3D world
  addPanoSprite (textureKey, angX, angY, baseScale, canScale) {
    // Make sure texture key was provided
    if (!textureKey) {
      console.warn('Error: PanoScene.addPanoSprite called without textureKey')
      return
    }

    // Set default values if undefined
    angX = angX || 0
    angY = angY || 0
    baseScale = baseScale || 1.0
    const zoomStrength = 1.0
    if(canScale !== false) {
      canScale = true
    }

    // Create PanoSprite with parameters
    const newSprite = new PanoSprite({
      scene: this,
      angX: angX,
      angY: angY,
      textureKey: textureKey,
      perspectiveStrength: zoomStrength,
      canScale: canScale
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
    this.closeAudio.stop()
    this.heartbeatAudio.stop()
    if (this.gameover) {
      this.healthAmount = 100
    }
    this.scene.start(sceneName, { collectedObjects: collectedObjects, startAngle: startAngle, healthAmount: this.healthAmount })
  }

  update (time) {
    // Updates every monster position so they can travel on paths
    for (let i = 0; i < this.monsterList.length; i++) {
      this.monsterList[i].updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
        this.game.config.width, this.game.config.height)
    }
    // this.input.mouse.requestPointerLock()

    // Adds the time variable to the blur shader
    this.t += this.tIncrement
    this.blurPipeline.setFloat1('time', this.t)

    // Updates the heartbeat audio strength based on closeness to monster
    if (this.withinRadius) {
      this.heartbeatAudio.volume = this.radiusStrength * 0.5 + 0.5
      this.heartbeatAudio.rate = this.radiusStrength * 0.5 + 0.5
    } else {
      this.heartbeatAudio.volume = 0.0
    }
    // Updates health bar and shader strength
    if (this.withinRadius && !this.keys.Q.isDown) {
      this.closeAudio.volume = this.radiusStrength * 0.7
      this.blurPipeline.setFloat1('magnitudeAmount', this.radiusStrength)
      this.healthAmount -= 0.3 * Math.abs(this.radiusStrength)
      if (this.healthAmount < 0) {
        this.healthAmount = 0
        this.gameover = true
      }
    } else { // Turns the blur effect off if not near a monster
      this.blurPipeline.setFloat1('magnitudeAmount', 0.0)
      this.closeAudio.volume = 0.0
    }
    // Game over case
    if (this.gameover && !this.gameoverHandled) {
      console.log('Game over')
      this.transitionTo('Conservatory', [], 0.0)
      this.gameoverHandled = true
    }
    // Turns off the flashlight if Q is held down
    if (this.keys.Q.isDown) {
      this.spotlight.scale = 0.0
    } else {
      this.spotlight.scale = 3.0
    }
    // Rotates the camera using the left button
    if (this.keys.LEFT.isDown || this.keys.A.isDown) {
      this.controls.setRotation(-0.05)
    }
    // Rotates the camera using the right button
    if (this.keys.RIGHT.isDown || this.keys.D.isDown) {
      this.controls.setRotation(0.05)
    }

    // Updates if the  monster and flashlight are overlapping
    this.updateOverlap()

    // TODO: Increase health if it hasn't decreased for a while

    // Updates the visual portion of the health bar
    this.infoScene.updateHealth(this.healthAmount)
    // Gets rotation of camera and sends it to the minimap in Info Scene
    this.infoScene.setMapRotation(-this.controls.getAzimuthalAngle() / Math.PI * 180)
  }

  // Creates a door sprite that navigates you to a different room when clicked
  createDoor (posX, posY, scaleX, scaleY, sceneToLoad, startAngle, unlockItem = '') {
    const doorSprite = this.addPanoSprite(NONE, posX, posY, 5.0)
    doorSprite.baseScaleX *= scaleX
    doorSprite.baseScaleY *= scaleY
    // TODO: Change alpha to 0.01 when in production so the door is basically invisible
    doorSprite.alpha = 0.001
    doorSprite.setInteractive(new Phaser.Geom.Rectangle(0, 0, doorSprite.width, doorSprite.height), Phaser.Geom.Rectangle.Contains)

    // Checks if the pointer was pressed and released on the same door
    doorSprite.on('pointerdown', (pointer) => { this.downOnDoor = doorSprite })
    doorSprite.on('pointerup', (pointer) => {
      // Controls if the door is unlocked or not
      const canOpen = this.checkRequirement(unlockItem)

      if (this.downOnDoor === doorSprite && canOpen) {
        this.transitionTo(sceneToLoad, this.collectedObjects, startAngle)
      }
      this.downOnDoor = NONE
    }, this)
  }

  // Collectable creation function used by rooms, spawns if not already in your list
  createCollectable (posX, posY, scaleX, scaleY, spriteName, requirementObject = '') {
    let haveObject = false
    for (let i = 0; i < this.collectedObjects.length; i++) {
      if (this.collectedObjects[i] === spriteName) {
        haveObject = true
      }
    }
    if (!haveObject) { // Spawns the object if not already in inventory
      const collectable = this.addPanoSprite(spriteName, posX, posY, 5.0)
      collectable.baseScaleX *= scaleX
      collectable.baseScaleY *= scaleY
      collectable.depth = collectable.depth + 10
      collectable.setInteractive(new Phaser.Geom.Rectangle(0, 0, collectable.width, collectable.height), Phaser.Geom.Rectangle.Contains)
      collectable.requirement = requirementObject
      collectable.input.enabled = this.checkRequirement(requirementObject)
      collectable.alpha = 0.1
      this.collectableList.push(collectable)
      collectable.on('pointerdown', (pointer) => {
        this.addCollectedObject(spriteName)
        console.log(this.collectedObjects)
        collectable.destroy()
        this.pickupSound.play()
        this.transitionTo(this.masterSkybox, this.collectedObjects, -this.controls.getAzimuthalAngle())
      }, this)
    }
  }

  checkRequirement (requirementName) {
    let haveRequirement = false
    for (let i = 0; i < this.collectedObjects.length; i++) {
      if (this.collectedObjects[i] === requirementName) {
        haveRequirement = true
      }
    }
    if (requirementName === '') {
      haveRequirement = true
      console.log('No requirement for collectable')
    }
    return haveRequirement
  }

  addCollectedObject (spriteName) {
    this.collectedObjects.push(spriteName)
    for (let i = 0; i < this.collectableList.length; i++) {
      if (this.collectableList[i].requirement === spriteName) {
        this.collectableList[i].input.enabled = true
      }
    }
  }

  // Creates a monster sprite that drains sanity
  createMonster (posX, posY, scale, spriteName) {
    const monster = this.addPanoSprite(spriteName, posX, posY, scale)
    this.monsterList.push(monster)
    return monster
  }

  // Updates the flashlight and checks if colliding with a monster
  updateOverlap () {
    const pointer = this.game.input.activePointer
    let isWithin = false
    this.graphics.clear()
    for (let i = 0; i < this.monsterList.length; i++) {
      var rectA = this.monsterList[i].getBounds()
      var rectB = new Phaser.Geom.Rectangle(pointer.x - this.mouseCheckRadius / 2, pointer.y - this.mouseCheckRadius / 2, this.mouseCheckRadius, this.mouseCheckRadius)

      // Draws the boxes
      // this.graphics.lineStyle(1, 0xff0000)
      // this.graphics.strokeRectShape(rectB)
      // this.graphics.strokeRectShape(rectA)

      var rectC = new Phaser.Geom.Rectangle()
      Phaser.Geom.Rectangle.Intersection(rectA, rectB, rectC)
      if (!rectC.isEmpty()) {
        isWithin = true
        // Does not factor in size of creature yet
        this.radiusStrength = (1.0 - Math.sqrt(Math.pow(pointer.x - this.monsterList[i].x, 2) + Math.pow(pointer.y - this.monsterList[i].y, 2)) / 340.0) * 2.0
        if (this.radiusStrength > 1.5) {
          this.radiusStrength = 1.5
        }
      }
    }
    this.withinRadius = isWithin
  }

  startBossFight () {
    const traceOne = ['traceOne', [0.95, 0.63, 0.54, 0.63, 0.85, 0.63, 0.54, 0.63, 0.76, 0.65]]
    const traceTwo = ['traceTwo', [0.97, 0.2]]
    const traceThree = ['traceThree', [0.97, 0.2]]
    const traceFour = ['traceFour', [0.97, 0.17]]
    const traceFive = ['traceFive', [0.97, 0.17]]
    this.traceList = [traceOne, traceTwo, traceThree, traceFour, traceFive]
    this.sendTrace()
  }

  sendTrace () {
    if (this.traceNumber >= this.traceList.length) {
      console.log('Boss beat')
    } else {
      this.addTraceImage(this.traceList[this.traceNumber][0], this.traceList[this.traceNumber][1])
    }
  }

  addTraceImage (traceImage, traceWaypoints) {
    console.log('Trace image added')
    this.trace = this.addPanoSprite(traceImage.concat('Pattern'), 5, 0, 2, false)
    this.traceMaster = this.addPanoSprite(traceImage, 5, 0, 2, false)
    this.trace.setInteractive()
    this.trace.alpha = 0.01
    let waypointNum = 0
    this.traceMaster.setTint(0x0d7442)

    // Initilaizes the sprite position
    this.trace.updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
      this.game.config.width, this.game.config.height)
    this.traceMaster.updatePanoPosition(this.controls, this.horiFOV, this.vertFOV,
      this.game.config.width, this.game.config.height)

    // Checks the hue of the image to check if the image is being traced
    this.trace.on('pointermove', (pointer) => {
      // Gets the color of the pixel color based off pointer position
      let texLocX = this.trace.x - this.trace.width - pointer.x
      texLocX = -texLocX / this.trace.scale
      let texLocY = this.trace.y - this.trace.height - pointer.y
      texLocY = -texLocY / this.trace.scale
      const colorGotten = this.game.textures.getPixel(texLocX, texLocY, traceImage.concat('Pattern'))
      if (this.hueChecking) {
        const hueDifference = Math.abs(this.prevHue - colorGotten.h) // Gets the color difference between previous and current
        if (Math.abs(traceWaypoints[waypointNum] - colorGotten.h) <= 0.04) { // Waypoint matched case
          waypointNum++
          console.log('Waypoint Reached')
          if (waypointNum >= traceWaypoints.length) { // Finish trace case
            this.hueChecking = false
            this.trace.destroy()
            this.traceMaster.destroy()
            this.traceNumber++
            this.sendTrace()
            // Play sound
            console.log('Trace finished!')
          }
        }
        if (hueDifference > 0.1 || colorGotten.h === 0) { // Fail trace case
          this.hueChecking = false
          waypointNum = 0
          this.traceMaster.setTint(0x0d7442)
          console.log('Trace lost')
        }
      } else {
        if (colorGotten.h > traceWaypoints[0]) { // Start trace case
          waypointNum++
          this.hueChecking = true
          this.traceMaster.setTint(0xffffff)
          console.log('Starting Trace')
        }
      }
      this.prevHue = colorGotten.h
    }, this)
  }
}

export default PanoScene
