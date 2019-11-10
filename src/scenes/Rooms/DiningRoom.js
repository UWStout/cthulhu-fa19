import PanoScene from '../PanoScene'
import Phaser, { NONE } from 'phaser'
import { doesNotReject } from 'assert'

class Conservatory extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.skyboxName = 'DiningRoom'
    this.vertFOV = 70
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

    // Doorway to Conservatory
    this.createDoor(50, 5, 0.7, 1.2, 'Conservatory', -1.6)

    // Doorway to Reception Hall
    this.createDoor(110, 5, 0.7, 1.2, 'ReceptionHall', 3)

    // Doorway to kitchen WIP

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default Conservatory
