import PanoScene from '../PanoScene'
import Phaser, { NONE } from 'phaser'
import { doesNotReject } from 'assert'
class Conservatory extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    this.vertFOV = 90

    this.masterSkybox = 'Conservatory'
  }

  preload () {
    // Setup the skybox view
    if (this.checkRequirement('key')) {
      this.skyboxName = 'Conservatory'
    } else {
      this.skyboxName = 'Conservatory/Key'
    }

    super.preload()
  }

  create () {
    // Create enemies for this scene
    const bigmouthMonster = this.createMonster(-180, -8, 2.0, 'bigmouthF')
    bigmouthMonster.addPath(-300, -8, 2.0, 0.5, 10.0)
    bigmouthMonster.addPath(300, -8, 2.0, 0.1, 'key')
    bigmouthMonster.pathLoops = true
    const tomAnimated = this.createMonster(-135, -8, 2.0, 'tomF')
    tomAnimated.addPath(-100, -8, 2.0, 0.5, 3.0)
    tomAnimated.addPath(100, -8, 7.0, 8.0, 2.0)
    tomAnimated.pathLoops = true
    this.createMonster(135, 90, 2.0, 'longarms')

    // Collectable Object interaction
    this.createCollectable(-135, -27, 0.7, 0.5, 'key')

    // Doorway to Dining Room
    this.createDoor(105, 0, 1, 2, 'DiningRoom', 0.0)

    // Doorway to Reception Hall
    this.createDoor(-13, 0, 1, 2, 'ReceptionHall', -1.7)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
    // Makes animation for tom walking
    tomAnimated.anims.play('front')
    bigmouthMonster.anims.play('front3')
  }
}

export default Conservatory
