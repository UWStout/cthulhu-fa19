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
    const bigmouthMonster = this.createMonster(-180, 0, 2, 'bigmouthF')
    bigmouthMonster.addSound(this, 'monsterScreamPixel', 0.5)
    bigmouthMonster.addPath(-200, -8, 2.0, 0.5, 8.0)
    bigmouthMonster.addPath(200, -8, 2.0, 0.1, 2.0)
    bigmouthMonster.pathLoops = true

    const tomMonster = this.createMonster(-200, 0, 2.0, 'tomF')
    const longarmsMonster = this.createMonster(135, 0, 2.0, 'longarmsF')

    // Collectable Object interaction
    this.createCollectable(250, 5, 0.8, 0.35, 'bookCandle', 'candle')
    this.createCollectable(250, 5, 0.8, 0.35, 'bookKnife', 'knife')
    this.createCollectable(250, 5, 0.8, 0.35, 'book')

    // Doorway to Reception Hall
    this.createDoor(5, 0, 0.6, 1.4, 'ReceptionHall', 1.6)
    // Door to Cave
    this.createDoor(250, 5, 0.8, 0.35, 'Cave', 0, 'bookCandle')

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()

    bigmouthMonster.playSound()
    bigmouthMonster.anims.play('front3')
    tomMonster.anims.play('front')
    longarmsMonster.anims.play('front2')
  }
}

export default Conservatory
