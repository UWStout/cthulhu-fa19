// Import the entire 'phaser' namespace
import Phaser from 'phaser'
class OptionScene extends Phaser.Scene {
  preload () {}

  create () {
    const menuButton = this.add.text(this.game.renderer.width / 2 - 60, this.game.renderer.height / 2, 'Menu', { fontSize: 25 }).setDepth(1).setScale(1.5)
    menuButton.alpha = 0.5

    // this.musicOn = true
    // this.soundOn = true
    this.model = this.sys.game.globals.model

    this.text = this.add.text(this.game.renderer.width / 2 - 100, this.game.renderer.height / 2 - 270, 'Options', { fontSize: 40 })
    this.musicButton = this.add.image(350, 200, 'checkedBox')
    this.musicText = this.add.text(400, 190, 'Music Enabled', { fontSize: 24 })

    this.soundButton = this.add.image(350, 250, 'checkedBox')
    this.soundText = this.add.text(400, 240, 'Sound Enabled', { fontSize: 24 })

    this.musicButton.setInteractive()
    this.soundButton.setInteractive()

    this.musicButton.on('pointerdown', function () {
      // this.musicOn = !this.musicOn
      this.model.musicOn = !this.model.musicOn
      console.log('toggle music')
      this.updateAudio()
    }.bind(this))

    this.soundButton.on('pointerdown', function () {
      // this.soundOn = !this.soundOn
      this.model.soundOn = !this.model.soundOn
      console.log('toggle sound')
      this.updateAudio()
    }.bind(this))

    this.updateAudio()

    menuButton.setInteractive()
    menuButton.on('pointerover', () => {
      // sets button alpha to 1 on hover
      menuButton.alpha = 1
    })

    menuButton.on('pointerout', () => {
      // dims button when not hovering
      menuButton.alpha = 0.5
    })

    menuButton.on('pointerup', () => {
      // Go back to title screen
      this.scene.start('TitleScene')
      console.log('Back to menu')
    })

    this.updateAudio()
  }

  updateAudio () {
    if (this.model.musicOn === false) {
      this.musicButton.setTexture('box')
      this.sys.game.globals.bgMusic.stop()
      this.model.bgMusicPlaying = false
    } else {
      this.musicButton.setTexture('checkedBox')
      if (this.model.bgMusicPlaying === false) {
        this.sys.game.globals.bgMusic.play()
        this.model.bgMusicPlaying = true
      }
    }

    if (this.model.soundOn === false) {
      this.soundButton.setTexture('box')
    } else {
      this.soundButton.setTexture('checkedBox')
    }
  }
}

export default OptionScene
