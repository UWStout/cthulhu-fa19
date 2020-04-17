/* global __DEV__ */
// Import the entire 'phaser' namespace
import Phaser from 'phaser'
class TitleScene extends Phaser.Scene {
  // Initialize some local settings for this state
  init () {
  }

  preload () {
  }

  create () {
    // Animation for title rain
    var frames = this.anims.generateFrameNumbers('backgroundRain').slice(0, 29)
    var backgroundRainImage = {
      key: 'rain',
      frames: frames,
      frameRate: 100,
      yoyo: false,
      repeat: -1
    }
    this.anims.create(backgroundRainImage)
    // Title Objects
    this.scene.stop('Info')
    this.add.sprite(this.cameras.main.width / 2.0, this.cameras.main.height / 2.0, 'background').setOrigin(0.5).setScale(5.7).setDepth(0).play('rain')
    this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.4, 'title').setScale(1.5).setDepth(1)
    const playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'play_button').setDepth(1)
    const optionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 150, 'options_button').setDepth(1)
    const creditsButton = this.add.text(this.game.renderer.width / 2 - 65, this.game.renderer.height / 2 + 180, '<credits>').setScale(1.5).setDepth(1)
    // Lightnig variables
    this.lightning = this.add.image(this.cameras.main.width / 2.0, this.cameras.main.height / 2.0, 'light').setOrigin(0.5).setScale(5.7).setDepth(20)
    this.lightning.alpha = 0.0
    this.lightningAudio = this.sound.add('thunder', { loop: false, volume: 0.8 })
    this.lightningTimer = Phaser.Math.Between(3, 5)
    this.flashedOnce = false
    this.brightnessPeak = false
    this.flashSpeed = 0

    playButton.alpha = 0.5
    optionButton.alpha = 0.5
    creditsButton.alpha = 0.5

    /*
      PointerEvents:
        pointerover - hovering
        pointerout - not hovering
        pointerup - click and release
        pointerdown - click
    */

    // PLAY----------------------------------------------------------------
    playButton.setInteractive()

    playButton.on('pointerover', () => { // sets button alpha to 1 on hover
      playButton.alpha = 1
    })

    playButton.on('pointerout', () => { // dims button when not hovering
      playButton.alpha = 0.5
    })

    playButton.on('pointerup', () => { // starts scene
      this.scene.start('Conservatory')
      if (__DEV__) console.log('Game started')
    })

    // OPTIONS--------------------------------------
    optionButton.setInteractive()

    optionButton.on('pointerover', () => { // sets button alpha to 1 on hover
      optionButton.alpha = 1
    })

    optionButton.on('pointerout', () => { // dims button when not hovering
      optionButton.alpha = 0.5
    })

    optionButton.on('pointerup', () => { // starts scene
      this.scene.start('Options')
      if (__DEV__) console.log('Options menu')
    })

    // CREDITS--------------------------------------
    creditsButton.setInteractive()

    creditsButton.on('pointerover', () => { // sets button alpha to 1 on hover
      creditsButton.alpha = 1
    })

    creditsButton.on('pointerout', () => { // dims button when not hovering
      creditsButton.alpha = 0.5
    })

    creditsButton.on('pointerup', () => { // starts scene
      this.scene.start('Credits')
      if (__DEV__) console.log('display credits')
    })

    // MUSIC-----------------------------------------

    this.model = this.sys.game.globals.model
    if (this.model.musicName !== 'bgMusic' && this.sys.game.globals.bgMusic !== null) {
      this.model.bgMusicPlaying = false
      this.sys.game.globals.bgMusic.stop()
    }
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true })
      this.bgMusic.play()
      this.model.bgMusicPlaying = true
      this.sys.game.globals.bgMusic = this.bgMusic
      this.model.musicName = 'bgMusic'
    }
    this.ambience = this.sound.add('rainLoop', { loop: true, volume: 0.8 })
    this.ambience.play()
  }

  update () {
    var timerTriggered = false
    if (this.lightningTimer <= 0.0) {
      timerTriggered = true
      if (this.flashedOnce) {
        this.flashSpeed = 10
      } else {
        this.flashSpeed = 8
      }
      // Controls the flashing of the lightning
      if (!this.brightnessPeak) {
        this.lightning.alpha = this.lightning.alpha - 0.01 * this.flashSpeed
        if (this.lightning.alpha <= 0.0) {
          this.brightnessPeak = true
          this.lightning.alpha = 0.0
        }
      } else {
        this.lightning.alpha = this.lightning.alpha + 0.01 * this.flashSpeed
        if (this.lightning.alpha >= 1.0) {
          this.brightnessPeak = false
          this.lightning.alpha = 0.0
          // Check if to flash again or restart the timer
          if (!this.flashedOnce) {
            this.flashedOnce = true
          } else {
            this.lightningTimer = Phaser.Math.Between(20, 40)
            this.flashedOnce = false
          }
        }
      }
    }
    this.lightningTimer -= 0.01
    // Triggers the lightning audio if flashing is about to begin
    if (!timerTriggered & this.lightningTimer <= 0.0) {
      if (__DEV__) console.log('Audio set to play')
      this.lightningAudio.play()
    }
  }
}

// Expose the TitleScene class for use in other modules
export default TitleScene
