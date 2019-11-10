import PanoScene from '../PanoScene'
import Phaser, { NONE } from 'phaser'
import { doesNotReject } from 'assert'

class ReceptionHall extends PanoScene {
  constructor (collectedObjects) {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.skyboxName = 'ReceptionHall'
    this.vertFOV = 90
  }

  preload () {
    // Load enemy sprites (might want to do this in Splash instead)
    this.load.image('tom', 'assets/images/TiredTom_FrontView.png')
    this.load.image('longarms', 'assets/images/LongArmsBoi_FrontView.png')
    super.preload()
  }

  create () {
    // Create enemies for this scene
    // this.addPanoSprite('tom', 0, 0)
    this.addPanoSprite('longarms', 180, 0)

    // Doorway to Conservatory
    this.createDoor(70, 0, 0.8, 1.4, 'Conservatory', 3)

    // Doorway to Dining Room
    this.createDoor(7, 0, 0.7, 1.4, 'DiningRoom', -1.7)

    // Doorway to Library
    this.createDoor(-78, 0, 0.7, 1.4, 'Library', 3.1)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default ReceptionHall
