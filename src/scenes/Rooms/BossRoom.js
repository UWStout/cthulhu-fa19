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
    this.bossMonster = this.createCollectable(5, 20, 0.2, 0.2, 'bossF', 'uncollectable')
    this.bossMonster.addSound(this, 'bossScream', 0.75)

    // Door to Cave
    this.createDoor(180, 2, 0.85, 1.4, 'Cave', 0)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()

    this.startBossFight()

    this.bossMonster.anims.play('walk4')
    this.bossMonster.addPath(5, 35, 4.5, 0.02 / (this.healthAmount / 100))
    this.bossMonster.alpha = 0.1
    this.bossAlpha = 0.1
    this.bossAlphaIncrease = 1 / (this.healthAmount / 100)

    this.bossMonster.playSound()
    this.bossSoundTimer = 4.5
  }

  update () {
    super.update()
    this.bossMonster.updatePaths()
    // Makes the boss less transparent over time
    if (this.bossAlpha < 1) {
      this.bossAlpha += 0.9 * 0.00005 * this.bossAlphaIncrease
      if (this.bossAlpha > 1) {
        this.bossAlpha = 1
      }
    }
    this.bossMonster.alpha = this.bossAlpha

    if (this.bossSoundTimer > 0) {
      this.bossSoundTimer -= 0.005
      if (this.bossSoundTimer < 0) {
        this.bossMonster.playSound()
        this.bossSoundTimer += 2 + Phaser.Math.Between(2, 5)
      }
    }
  }
}

export default Conservatory
