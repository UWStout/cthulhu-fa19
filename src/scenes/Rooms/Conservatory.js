import PanoScene from '../PanoScene'

class Conservatory extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.skyboxName = 'Conservatory'
    this.vertFOV = 90
  }

  preload () {
    // Load enemy sprites (might want to do this in Splash instead)
    this.load.image('bigmouth', 'assets/images/BigMouth_FrontView.png')
    this.load.image('tom', 'assets/images/TiredTom_FrontView.png')
    this.load.image('longarms', 'assets/images/LongArmsBoi_FrontView.png')
  }

  create () {
    // Create enemies for this scene
    this.addPanoSprite('bigmouth', -180, 0, 2.0)
    this.addPanoSprite('tom', -135, 0, 2.0)
    this.addPanoSprite('longarms', 135, 0, 2.0)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default Conservatory
