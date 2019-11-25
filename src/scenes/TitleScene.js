
// Import the entire 'phaser' namespace
import Phaser from 'phaser'
class TitleScene extends Phaser.Scene {
  // Initialize some local settings for this state
  init () {
  }

  preload () {
    this.load.image('background', 'assets/images/TitleScreen/spooky-mansion.jpg') // background
    this.load.image('title', 'assets/images/TitleScreen/LogoTransparent.png') // title name
    this.load.image('play_button', 'assets/images/TitleScreen/play_button.png') // play button
    this.load.image('options_button', 'assets/images/TitleScreen/options_button.png') // options button

    this.load.audio('bgMusic', 'assets/audio/music-theme1.wav')
  }

  create () {
    this.add.image(-111, 0, 'background').setOrigin(0).setScale(0.89).setDepth(0)
    this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.4, 'title').setScale(1.5).setDepth(1)
    const playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'play_button').setDepth(1)
    const optionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 150, 'options_button').setDepth(1)
    const creditsButton = this.add.text(this.game.renderer.width / 2 - 65, this.game.renderer.height / 2 + 180, '<credits>').setScale(1.5).setDepth(1)

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
      console.log('Game started')
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
      console.log('Options menu')
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
      console.log('display credits')
    })

    // MUSIC-----------------------------------------

    this.model = this.sys.game.globals.model
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true })
      this.bgMusic.play()
      this.model.bgMusicPlaying = true
      this.sys.game.globals.bgMusic = this.bgMusic
    }
  }

  // update () {
  //   this.scene.start('Conservatory')
  //   this.scene.start('MenuScene')
  // }
}

// Expose the TitleScene class for use in other modules
export default TitleScene
