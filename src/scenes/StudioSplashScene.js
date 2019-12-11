// Import the entire 'phaser' namespace
import Phaser from 'phaser'

import { centerX, centerY } from '../utils'

class StudioSplashScene extends Phaser.Scene {
  init (data) {
    this.cameras.main.setBackgroundColor('#000000')
    this.allowNextScene = false
    this.nextScene = 'TitleScene'
  }

  preload () {
    // Show the studio splash logo
    this.showLogo()

    // Room Assets
    this.load.image('bigmouth', 'assets/images/BigMouth_FrontView.png')
    this.load.image('tom', 'assets/images/TiredTom_FrontView.png')
    this.load.image('longarms', 'assets/images/LongArmsBoi_FrontView.png')
    this.load.image('flashlight', 'assets/images/flashlight.png')

    // Sprites
    this.load.spritesheet('tomW', 'assets/images/TT_WA_FrontFace_SPRITESHEET.png', { frameWidth: 120, frameHeight: 120 })

    // Main Pano Scene Assets
    this.load.image('trace', 'assets/images/symbol1pattern.png')

    this.load.audio('ambienceTones', 'assets/audio/ambience/ambient_tones_loop.mp3')
    this.load.audio('ambienceBitcrush', 'assets/audio/ambience/ambient_bitcrush_loop.mp3')
    this.load.audio('heartbeat', 'assets/audio/noises/heartbeat.mp3')
    this.load.audio('pickup', 'assets/audio/noises/pickup_sound.mp3')

    this.load.audio('monsterScreamPixelLeft', 'assets/audio/noises/monster_pixel_scream_left.mp3')
    this.load.audio('monsterScreamPixelRight', 'assets/audio/noises/monster_pixel_scream_right.mp3')

    this.load.image('mask', 'assets/images/spotlight/mask1.png') // spotlight stuff
    this.load.image('room', 'assets/images/spotlight/Black.jpg') // blackbackground

    // HUD info scene images
    this.load.image('bar', 'assets/images/insanityBar.png')
    this.load.image('barBorder', 'assets/images/insanity_meter_Border.png')
    this.load.image('trace', 'assets/images/TestTraceImage.png')
    this.load.image('arrow', 'assets/images/arrow.png')
    this.load.image('minimapBackground', 'assets/images/minimapBackground.png')

    // Text HUD
    this.load.image('text1', 'assets/images/text1.png')
    this.load.image('text2', 'assets/images/text1.png')
    this.load.image('text3', 'assets/images/text1.png')
    this.load.image('text4', 'assets/images/text1.png')

    // Trace images for boss fight
    this.load.image('traceOne', 'assets/images/symbol1.png')
    this.load.image('traceTwo', 'assets/images/symbol2.png')
    this.load.image('traceThree', 'assets/images/symbol3.png')
    this.load.image('traceFour', 'assets/images/symbol4.png')
    this.load.image('traceFive', 'assets/images/symbol5.png')
    this.load.image('traceOnePattern', 'assets/images/symbol1pattern.png')
    this.load.image('traceTwoPattern', 'assets/images/symbol2pattern.png')
    this.load.image('traceThreePattern', 'assets/images/symbol3pattern.png')
    this.load.image('traceFourPattern', 'assets/images/symbol4pattern.png')
    this.load.image('traceFivePattern', 'assets/images/symbol5pattern.png')

    // Load minimap images
    this.load.image('minimapConservatory', 'assets/images/skybox/Conservatory/mini.png')
    this.load.image('minimapDiningRoom', 'assets/images/skybox/DiningRoom/mini.png')
    this.load.image('minimapReceptionHall', 'assets/images/skybox/ReceptionHall/mini.png')
    this.load.image('minimapLibrary', 'assets/images/skybox/Library/mini.png')
    this.load.image('minimapCave', 'assets/images/skybox/Cave/mini.png')
    this.load.image('minimapBossRoom', 'assets/images/skybox/BossRoom/mini.png')

    // Load all the assets needed for main menu
    this.load.image('background', 'assets/images/TitleScreen/splashScreen.jpg') // background
    this.load.image('title', 'assets/images/TitleScreen/LogoTransparent.png') // title name
    this.load.image('play_button', 'assets/images/TitleScreen/play_button.png') // play button
    this.load.image('options_button', 'assets/images/TitleScreen/options_button.png') // options button

    this.load.image('checkedBox', 'assets/images/blue_boxCheckmark.png')
    this.load.image('box', 'assets/images/grey_box.png')
    this.load.image('globalMinimap', 'assets/images/MinimapWholeHouse.png')

    // creepty background music
    this.load.audio('bgMusic', 'assets/audio/ambience/ambient_drone_loop.mp3')
  }

  showLogo () {
    // Create an instance of the audiosprite to play the engine SFX
    this.bkgSfx = this.sound.addAudioSprite('sounds')
    this.bkgSfx.play('EngineStartAndRev')

    const carImage = this.add.image(centerX(this), centerY(this), 'safariCar')
    carImage.setScale(0.55)
    carImage.setAlpha(0.0)

    const logoImage = this.add.image(centerX(this), centerY(this), 'safariLogo')
    logoImage.setScale(0.6)
    logoImage.setAlpha(0.0)

    const carTween = this.add.tween({
      targets: carImage,
      alpha: 1.0,
      duration: 1000,
      paused: true
    })

    const logoTween = this.add.tween({
      targets: logoImage,
      alpha: 1.0,
      duration: 1000,
      paused: true
    })

    // Fade in car image
    setTimeout(() => {
      carTween.play()
    }, 2000)

    // Fade in logo image
    setTimeout(() => {
      logoTween.play()
    }, 6000)

    // Fade out entire scene
    const sceneCamera = this.cameras.main
    setTimeout(() => {
      sceneCamera.fadeOut(2000)
    }, 12000)

    const myScene = this
    setTimeout(() => {
      const loadingText = myScene.add.text(centerX(myScene), centerY(myScene),
        'loading', { font: '16px Arial', fill: '#FFFFFF', align: 'center' })
      loadingText.setOrigin(0.5, 0.5)
      myScene.allowNextScene = true
    }, 15000)
  }

  update () {
    if (this.allowNextScene) {
      this.scene.start(this.nextScene)
    }
  }
}

// Expose the class TestScene to other files
export default StudioSplashScene
