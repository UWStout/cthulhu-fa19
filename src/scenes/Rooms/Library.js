import PanoScene from '../PanoScene'
import Phaser, { NONE } from 'phaser'
import { doesNotReject } from 'assert'

class Conservatory extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.skyboxName = 'Library'
    this.masterSkybox = 'Library'
    this.vertFOV = 90
  }

  preload () {
    super.preload()
  }

  create () {
    // Create enemies for this scene
    const bigmouthMonster = this.createMonster(-180, 0, 2, 'bigmouth')
    bigmouthMonster.addSound(this, 'monsterScreamPixel', 0.5)

    this.createMonster(-135, 0, 2.0, 'tom')
    this.createMonster(135, 0, 2.0, 'longarms')

    // Collectable Object interaction
    this.createCollectable(180, 0, 1, 1, 'libraryObj')

    // Doorway to Reception Hall
    this.createDoor(5, 0, 0.6, 1.4, 'ReceptionHall', 1.6)
    // Door to Cave
    this.createDoor(80, 0, 0.6, 1.4, 'Cave', 0)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()

    //bigmouthMonster.playSound()
  }
}

export default Conservatory
