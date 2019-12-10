import PanoScene from '../PanoScene'

class TestRoom extends PanoScene {
  constructor () {
    super()

    // Make sure the parent doesn't override our values
    this.ignoreInitVals = true

    // Setup the skybox view
    this.skyboxName = 'Test'
    this.vertFOV = 120
  }

  preload () {
    super.preload()
  }

  create () {
    // Create enemies for this scene
    this.addPanoSprite('tom', -90, 0, 1.0, 3.0)
    this.addPanoSprite('longarms', 90, 0, 1.0, 3.0)

    // Initialize parent scene (must call AFTER creating sprites)
    super.create()
  }
}

export default TestRoom
