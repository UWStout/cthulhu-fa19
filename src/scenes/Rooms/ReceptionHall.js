import PanoScene from '../PanoScene'
import Phaser, { NONE } from 'phaser'
import { doesNotReject } from 'assert'

class ReceptionHall extends PanoScene {
  constructor (collectedObjects) {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    this.masterSkybox = 'ReceptionHall'
    this.vertFOV = 90
  }

  preload () {
    // Setup the skybox view
    if (this.checkRequirement('receptionDoor')) {
      this.skyboxName = 'ReceptionHall'
    } else {
      this.skyboxName = 'ReceptionHall/DoorClosed'
    }

    super.preload()
  }

  create () {
    // Create enemies for this scene
    this.createMonster(180, 0, 1, 'longarms')

    // Collectable Object interaction
    this.createCollectable(-72, 0, 0.7, 1.4, 'receptionDoor', 'key')

    // Doorway to Conservatory
    this.createDoor(75, 0, 0.8, 1.4, 'Conservatory', 3)

    // Doorway to Dining Room
    this.createDoor(10, 0, 0.7, 1.4, 'DiningRoom', 0.0)

    // Doorway to Library
    this.createDoor(-72, 0, 0.7, 1.4, 'Library', 3.1, 'receptionDoor')

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default ReceptionHall
