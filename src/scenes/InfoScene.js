/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

class InfoScene extends Phaser.Scene {
  init (data) {
    // Data must be passed in when strting the scene
    if (data) {
      this.healthAmount = data.health || 100
    } else {
      this.healthAmount = 100
    }
  }

  preload () {
    this.load.image('trace', 'assets/images/TestTraceImage.png')
  }

  create () {
    // Local variables for accessing width and height
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    // Variables for checking trace
    this.prevHue = 0
    this.hueChecking = false

    this.healthBar = this.add.image(this.width / 7, this.height / 20, 'bar')
    this.updateHealth(this.healthAmount)
  }

  updateHealth (amount) {
    if (typeof this.healthBar !== 'undefined') {
      this.healthBar.setCrop(0, 0, this.healthBar.width * amount / 100, this.healthBar.height)
    }
  }

  addTraceImage () {
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
}

// Expose the class TestLevel to other files
export default InfoScene
