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
    this.masterSkybox = 'BossRoom'
    this.vertFOV = 90
  }

  preload () {
    super.preload()
  }

  create () {
    // Door to Boss Room
    this.createDoor(180, 2, 0.85, 1.4, 'Cave', 0)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()

    this.startBossFight()
  }
}

export default Conservatory
