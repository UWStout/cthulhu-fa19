/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// IMport the update plugin
import PhaserUpdatePlugin from 'phaser-plugin-update'
import PhaserDebugDrawPlugin from 'phaser-plugin-debug-draw'
import UIPlugin from '../plugins/rexrainbow/rexuiplugin.min'

// Import the scenes used in our game
import BootScene from './scenes/Boot' // A bootstraping loader that loads the assets need by ... the loader!
import SplashScene from './scenes/Splash' // A fancy loading splash screen for loading more assets
import TestScene from './scenes/TestScene' // The main game level for testing
import TitleScene from './scenes/TitleScene' // Title Screen for game
import InfoScene from './scenes/InfoScene' // Some static info locked to the camera (like a HUD)
import PauseMenuScene from './scenes/PauseMenuScene' // A menu displayed while the game is paused

import ConservatoryScene from './scenes/Rooms/Conservatory'
import TestRoomScene from './scenes/Rooms/TestRoom'
import ReceptionHallScene from './scenes/Rooms/ReceptionHall'
import DiningRoomScene from './scenes/Rooms/DiningRoom'
import LibraryScene from './scenes/Rooms/Library'
import CaveScene from './scenes/Rooms/Cave'
import BossRoomScene from './scenes/Rooms/BossRoom'

// Import our general configuration file
import config from './config'

// Setup the plugins
const scenePlugins = [{
  key: 'updatePlugin',
  plugin: PhaserUpdatePlugin,
  mapping: 'updates'
}, {
  key: 'rexUI',
  plugin: UIPlugin,
  mapping: 'rexUI'
}]

if (__DEV__) {
  // WARNING! This does not work with Phaser3D
  // scenePlugins.push({
  //   key: 'DebugDrawPlugin',
  //   plugin: PhaserDebugDrawPlugin,
  //   mapping: 'debugDraw'
  // })
}

/**
 * The main class that encapsulates the entirity of our game including all the game states,
 * all the loaded and cached assets, and any reusable logic needed in any state.
 * NOTE: See the parent class, Phaser.Game, for more details.
 */
class Game extends Phaser.Game {
  // Function automatically called upon class creation
  constructor () {
    // Pass configuration details to Phaser.Game
    super({
      pixelArt: true, // TODO: Turn this off if you aren't doing pixel art!!
      type: Phaser.WEBGL,
      title: 'Example Game for UW Stout\'s GDD325',
      backgroundColor: '#000000', //#7f7f7f
      scale: {
        parent: 'content',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTAL,
        width: config.gameWidth,
        height: config.gameHeight
      },
      plugins: {
        scene: scenePlugins
      },
      physics: {
        default: 'matter',
        matter: {
          debug: __DEV__,
          gravity: {
            y: 0.8
          }
        }
      }
    })

    // Name and load ALL needed game scenes (add more scenes here as you make them)
    this.scene.add('Boot', BootScene, false)
    this.scene.add('Splash', SplashScene, false)
    this.scene.add('TitleScene', TitleScene, false)
    this.scene.add('Test', TestScene, false)

    this.scene.add('Conservatory', ConservatoryScene, false)
    this.scene.add('TestRoom', TestRoomScene, false)
    this.scene.add('ReceptionHall', ReceptionHallScene, false)
    this.scene.add('DiningRoom', DiningRoomScene, false)
    this.scene.add('Library', LibraryScene, false)
    this.scene.add('Cave', CaveScene, false)
    this.scene.add('BossRoom', BossRoomScene, false)

    // Extra scenes showing how you can layer scenes together
    this.scene.add('Info', InfoScene, false)
    this.scene.add('PauseMenu', PauseMenuScene, false)

    // Start with the bootstrap scene that will load assets needed for the splash scene
    this.scene.start('Boot')
  }
}

// This code executes once every time the containing webpage (index.html) is loaded.
// It creates a single instace of the Game class (defined above) and attaches it to
// the global object 'window.'  It also causes Game's constructor to run, kicking
// off the logic of the ENTIRE game.
window.game = new Game()
