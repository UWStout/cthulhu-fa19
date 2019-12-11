import PanoScene from '../PanoScene'
import Phaser, { NONE } from 'phaser'
import { doesNotReject } from 'assert'

class Conservatory extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.skyboxName = 'Cave'
    this.masterSkybox = 'Cave'
    this.vertFOV = 90
  }

  preload () {
    super.preload()
  }

  create () {
    // Create enemies for this scene

    // Door to Boss Room
    this.createDoor(135, 1, 0.5, 0.9, 'BossRoom', 0)

    // Door to Library
    this.createDoor(175, 0, 0.5, 0.75, 'Library', 0)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default Conservatory
