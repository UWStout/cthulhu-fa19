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

  preload () {}

  create () {
    // Local variables for accessing width and height
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.healthBar = this.add.image(width / 7, height / 20, 'bar')
    this.updateHealth(this.healthAmount)
  }

  updateHealth (amount) {
    this.healthBar.setCrop(0, 0, this.healthBar.width * amount / 100, this.healthBar.height)
  }
}

// Expose the class TestLevel to other files
export default InfoScene
