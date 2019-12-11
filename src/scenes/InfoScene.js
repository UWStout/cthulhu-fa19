/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

class InfoScene extends Phaser.Scene {
  init (data) {
    // Data must be passed in when strting the scene
    if (data) {
      this.healthAmount = data.health || 100
      this.showTrace = data.showTrace || false
      this.skyboxName = data.skyboxName || ''
    } else {
      this.healthAmount = 100
      this.showTrace = false
      this.skyboxName = ''
    }
  }

  preload () {}

  create () {
    // Local variables for accessing width and height
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    // Variables for checking trace
    this.prevHue = 0
    this.hueChecking = false

    this.healthBar = this.add.image(this.width / 8, this.height / 18, 'bar')
    this.healthBarBackground = this.add.image(this.width / 8, this.height / 18, 'barBorder')
    this.healthBar.scaleX = 0.25
    this.healthBar.scaleY = 0.25
    this.healthBarBackground.scaleX = 0.25
    this.healthBarBackground.scaleY = 0.25

    this.miniMapName = 'minimap' + this.skyboxName
    if (this.miniMapName.indexOf('/') >= 0) {
      this.miniMapName = this.miniMapName.slice(0, this.miniMapName.indexOf('/'))
    }
    let arrowHoriPos = 0
    let arrowVertPos = 0
    // Sets offsets for the player pointer
    if (this.miniMapName === 'minimapConservatory') {
      arrowHoriPos = this.width * 0.939
      arrowVertPos = this.height / 5.9
    } else if (this.miniMapName === 'minimapReceptionHall') {
      arrowHoriPos = this.width * 0.938
      arrowVertPos = this.height / 8.8
    } else if (this.miniMapName === 'minimapDiningRoom') {
      arrowHoriPos = this.width * 0.9668
      arrowVertPos = this.height / 6.9
    } else if (this.miniMapName === 'minimapLibrary') {
      arrowHoriPos = this.width * 0.941
      arrowVertPos = this.height / 22
    } else if (this.miniMapName === 'minimapCave') {
      arrowHoriPos = this.width * 0.974
      arrowVertPos = this.height / 22
    } else {
      arrowHoriPos = this.width * 1.1
      arrowVertPos = -20
    }

    this.arrow = this.add.image(arrowHoriPos, arrowVertPos, 'arrow')
    this.arrow.setScale(0.8)
    console.log(this.miniMapName)
    this.minimap = this.add.image(this.width * 0.95, this.height / 9, 'globalMinimap')

    this.updateHealth(this.healthAmount)

    if (this.showTrace) {
      this.addTraceImage()
    }
  }

  updateHealth (amount) {
    if (typeof this.healthBar !== 'undefined') {
      this.healthBar.setCrop(0, 0, this.healthBar.width * amount / 100, this.healthBar.height)
    }
  }

  addTraceImage () {
    console.log('Trace image added')
    if (this.trace) {
      this.trace.destroy()
    }

    this.trace = this.add.image(this.width / 2, this.height / 2, 'trace')
    this.trace.setInteractive()
    this.trace.scale = 2

    // Checks the hue of the image to check if the image is being traced
    this.trace.on('pointermove', (pointer) => {
      let texLocX = this.trace.x - this.trace.width - pointer.x
      texLocX = -texLocX / this.trace.scale
      let texLocY = this.trace.y - this.trace.height - pointer.y
      texLocY = -texLocY / this.trace.scale
      const colorGotten = this.game.textures.getPixel(texLocX, texLocY, 'trace')
      if (this.hueChecking) {
        const hueDifference = Math.abs(this.prevHue - colorGotten.h)
        if (colorGotten.h < 0.12 && colorGotten.h !== 0) {
          this.hueChecking = false
          console.log('Trace finished!')
        }
        if (hueDifference > 0.1 || colorGotten.h === 0) {
          this.hueChecking = false
          console.log('Trace lost')
        }
      } else {
        if (colorGotten.h > 0.97) {
          this.hueChecking = true
          console.log('Starting Trace')
        }
      }
      this.prevHue = colorGotten.h
    }, this)
  }

  setMapRotation (angle) {
    if (typeof this.arrow !== 'undefined') {
      let bonusAngle = 0
      if (this.miniMapName === 'minimapDiningRoom') {
        bonusAngle = 90
      } else if (this.miniMapName === 'minimapReceptionHall') {
        bonusAngle = 90
      } else if (this.miniMapName === 'minimapLibrary') {
        bonusAngle = 180
      } else if (this.miniMapName === 'minimapCave') {
        bonusAngle = 90
      }
      this.arrow.angle = angle + bonusAngle
    }
  }
}

// Expose the class TestLevel to other files
export default InfoScene
