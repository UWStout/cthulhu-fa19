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
    // Different room layouts if in presentation mode or not
    if (this.presentation) {
      // Makes the room start lit and with the flashlight disabled (hard coded to only work if you don't have the key)
      let haveObject = false
      for (let i = 0; i < this.collectedObjects.length; i++) {
        if (this.collectedObjects[i] === 'key') {
          haveObject = true
        }
      }
      if (!haveObject) {
        this.presentationLighting()
      }
    } else {
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

      // Makes animation for tom walking
      tomAnimated.anims.play('front')
      bigmouthMonster.anims.play('front3')
    }

    // Collectable Object interaction
    this.createCollectable(-135, -27, 0.7, 0.5, 'key')

    // Doorway to Dining Room
    this.createDoor(105, 0, 1, 2, 'DiningRoom', 0.0)

    // Doorway to Reception Hall
    this.createDoor(-13, 0, 1, 2, 'ReceptionHall', -1.7)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default Conservatory
