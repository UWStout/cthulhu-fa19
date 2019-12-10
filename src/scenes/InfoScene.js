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

    this.add.image(this.width * 0.95, this.height / 13, 'minimapBackground')
    this.arrow = this.add.image(this.width * 0.95, this.height / 13, 'arrow')

    let miniMapName = 'minimap' + this.skyboxName
    if (miniMapName.indexOf('/') >= 0) {
      miniMapName = miniMapName.slice(0, miniMapName.indexOf('/'))
    }
    console.log(miniMapName)
    this.minimap = this.add.image(this.width * 0.95, this.height / 13, miniMapName)

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
      if (this.skyboxName === 'DiningRoom') {
        bonusAngle = 90
      } else if (this.skyboxName === 'ReceptionHall') {
        bonusAngle = 90
      } else if (this.skyboxName === 'Library') {
        bonusAngle = 180
      }
      this.arrow.angle = angle + bonusAngle
    }
  }
}

// Expose the class TestLevel to other files
export default InfoScene
