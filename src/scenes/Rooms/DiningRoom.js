import PanoScene from '../PanoScene'
import Phaser, { NONE } from 'phaser'
import { doesNotReject } from 'assert'

class Conservatory extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.masterSkybox = 'DiningRoom'
    this.vertFOV = 70
  }

  preload () {
    // Setup the skybox view
    const knifeCollected = this.checkRequirement('knife')
    const candleCollected = this.checkRequirement('candle')
    if (knifeCollected && candleCollected) {
      this.skyboxName = 'DiningRoom'
    } else if (knifeCollected) {
      this.skyboxName = 'DiningRoom/Candle'
    } else if (candleCollected) {
      this.skyboxName = 'DiningRoom/Knife'
    } else {
      this.skyboxName = 'DiningRoom/Both'
    }

    super.preload()
  }

  create () {
    // Collectable Object interaction
    this.createCollectable(35, -10, 0.8, 1, 'knife', 'book')
    this.createCollectable(-168, 5, 0.7, 0.7, 'candle', 'book')

    // Doorway to Conservatory
    this.createDoor(150, -5, 0.7, 1.2, 'Conservatory', -1.6)

    // Doorway to Reception Hall
    this.createDoor(210, -5, 0.7, 1.2, 'ReceptionHall', 3.14)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default Conservatory
