import PanoScene from '../PanoScene'

class ReceptionHall extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.skyboxName = 'NewReceptionHall'
  }

  preload () {
    // Load enemy sprites (might want to do this in Splash instead)
    this.load.image('tom', 'assets/images/TiredTom_FrontView.png')
    this.load.image('longarms', 'assets/images/LongArmsBoi_FrontView.png')
  }

  create () {
    // Create enemies for this scene
    this.addPanoSprite('tom', 0, 0)
    this.addPanoSprite('longarms', 180, 0)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default ReceptionHall
