// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import needed functions from utils and config settings
import { centerGameObjects, centerX, centerY } from '../utils'

/**
 * The Splash game state. This game state displays a dynamic splash screen used
 * to communicate the progress of asset loading. It should ensure it is always
 * displayed some mimimum amount of time (in case the assets are already cached
 * locally) and it should have pre-loaded any assets it needs to display in Boot
 * before it is run. Generally only runs once, after Boot, and cannot be re-entered.
 *
 * See Phaser.State for more about game states.
 */
class Splash extends Phaser.Scene {
  // Initialize some local settings for this state
  init () {
  }

  preload () {
    // Add the logo to the screen and center it
    this.logo = this.add.sprite(centerX(this), centerY(this) - 100, 'logo')
    this.logo.setScale(2)
    // this.logo.setScale(0.5, 0.5)
    centerGameObjects([this.logo])

    this.setupProgressBar(200)

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
    this.load.image('arrow', 'assets/images/arrow.png')
    this.load.image('minimapBackground', 'assets/images/minimapBackground.png')

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

    // The audiosprite with all music and SFX
    this.load.audioSprite('sounds', 'assets/audio/sounds.json', [
      'assets/audio/sounds.ogg', 'assets/audio/sounds.mp3',
      'assets/audio/sounds.m4a', 'assets/audio/sounds.ac3'
    ])
  }

  setupProgressBar (yOffset) {
    // Local variables for accessing width and height
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Create graphics assets for progress bar
    const progressBar = this.add.graphics()
    const progressBkg = this.add.graphics()
    progressBkg.fillStyle(0x3ddf9a, 0.8) // #3ddf9a 0x222222
    progressBkg.fillRect(width / 2 - 160, height / 2 - 25 + yOffset, 320, 50)

    // Create loading text
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50 + yOffset,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    })
    loadingText.setOrigin(0.5, 0.5)

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 + yOffset,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    })

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50 + yOffset,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    })

    centerGameObjects([percentText, loadingText, assetText])

    // Display the progress bar
    this.load.on('progress', (percent) => {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15 + yOffset, 300 * percent, 30)
      percentText.setText(`${parseInt(percent * 100)}%`)
    })

    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`)
    })

    this.load.on('complete', () => {
      loadingText.destroy()
      percentText.destroy()
      assetText.destroy()
      progressBar.destroy()
      progressBkg.destroy()
    })
  }

  // Pre-load is done
  create () {}

  // Called repeatedly after pre-load finishes and after 'create' has run
  update () {
    this.scene.start('TitleScene')
  }
}

// Expose the Splash class for use in other modules
export default Splash
