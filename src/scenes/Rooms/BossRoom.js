import PanoScene from '../PanoScene'
import Phaser, { NONE } from 'phaser'
import { doesNotReject } from 'assert'

class Conservatory extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.skyboxName = 'BossRoom'
    this.vertFOV = 90
  }

  preload () {
    // Load enemy sprites (might want to do this in Splash instead)
    this.load.image('bigmouth', 'assets/images/BigMouth_FrontView.png')
    this.load.image('tom', 'assets/images/TiredTom_FrontView.png')
    this.load.image('longarms', 'assets/images/LongArmsBoi_FrontView.png')
    super.preload()
  }

  create () {
    // Create enemies for this scene
    this.addPanoSprite('bigmouth', -180, 0, 2.0)
    this.addPanoSprite('tom', -135, 0, 2.0)
    this.addPanoSprite('longarms', 135, 0, 2.0)

    // Colectable Object interaction
    const collectable = this.addPanoSprite('test', 0, 0, 2.0)
    collectable.setInteractive(new Phaser.Geom.Rectangle(0, 0, collectable.width, collectable.height), Phaser.Geom.Rectangle.Contains)
    collectable.on('pointerdown', (pointer) => {
      this.collectedObjects.push('conservatory obj')
      console.log(this.collectedObjects)
    }, this)

    // Doorway trigger
    const sprite4 = this.addPanoSprite(NONE, -75, 0, 5.0)
    sprite4.baseScaleY *= 2
    sprite4.alpha = 0.1
    sprite4.setInteractive(new Phaser.Geom.Rectangle(0, 0, sprite4.width, sprite4.height), Phaser.Geom.Rectangle.Contains)

    this.downOnDoor = NONE

    // Checks if the pointer was pressed and released on the same door
    sprite4.on('pointerdown', (pointer) => { this.downOnDoor = sprite4 })
    sprite4.on('pointerup', (pointer) => { if (this.downOnDoor === sprite4) { this.transitionTo('ReceptionHall', this.collectedObjects) } this.downOnDoor = NONE }, this)

    // Initialize parent scene (must call AFTER creating sprites)
    this.input.on('pointerup', (pointer) => { this.downOnDoor = NONE }, this)
    super.create()
  }
}

export default Conservatory
