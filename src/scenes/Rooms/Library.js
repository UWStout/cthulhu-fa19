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
    this.longarmsMonster = this.createMonster(90, -13, 2.0, 'longarmsF')
    this.longarmsMonster.anims.play('walk')
    this.longarmsMonster.addPath(270, -13, 2.0, 0.1)
    this.longarmsMonster.pathLoops = true

    // Collectable Object interaction
    this.createCollectable(250, 5, 0.8, 0.35, 'bookCandle', 'candle')
    if (!this.presentation) {
      this.createCollectable(250, 5, 0.8, 0.35, 'bookKnife', 'knife')
    }
    this.createCollectable(250, 5, 0.8, 0.35, 'book')

    // Doorway to Reception Hall
    this.createDoor(5, 0, 0.6, 1.4, 'ReceptionHall', 1.6)
    // Door to Cave
    this.createDoor(250, 5, 0.8, 0.35, 'Cave', 0, 'bookCandle')

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()

    var collectedBook = false
    var collectedBookTrace = false
    for (let i = 0; i < this.collectedObjects.length; i++) {
      if (this.collectedObjects[i] === 'book') {
        collectedBook = true
      }
      if (this.collectedObjects[i] === 'bookTrace') {
        collectedBookTrace = true
      }
    }
    if (collectedBook && !collectedBookTrace) {
      const bookTrace = ['traceOne', [0.95, 0.63, 0.54, 0.63, 0.85, 0.63, 0.54, 0.63, 0.76, 0.65]]
      this.addTraceImage(bookTrace[0], bookTrace[1], false, 'bookTrace')
    }
  }
}

export default Conservatory
