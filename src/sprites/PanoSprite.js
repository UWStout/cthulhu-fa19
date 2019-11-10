
/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

class PanoSprite extends Phaser.GameObjects.Sprite {
  constructor ({ scene, angX, angY, textureKey, perspectiveStrength, isCollectable = false }) {
    // Initialize object basics
    super(scene, 0, 0, textureKey)

    // Save the longitude and latitude position
    this.angX = angX || 0
    this.angY = angY || 0

    // Set strength of perspective effect
    this.perspectiveStrength = perspectiveStrength || 1.0

    // Save base scale (defaults to 1.0)
    this.baseScaleX = 1.0
    this.baseScaleY = 1.0

    this.key = textureKey
    this.collectable = isCollectable
  }

  setScale (xVal, yVal) {
    xVal = xVal || 1.0
    yVal = yVal || xVal

    this.baseScaleX = xVal
    this.baseScaleY = yVal
    super.setScale(xVal, yVal)
  }

  updatePanoPosition (orbit, hFOV, vFOV, widthPixels, heightPixels) {
    // Grab angular values from orbit controls
    // - Returned in radians so convert to degrees
    // - Invert them so motion matches inside of spherical map
    // - Offset polar angle by 90 so equator is at 0
    const viewX = -orbit.getAzimuthalAngle() * 180 / Math.PI
    const viewY = -(orbit.getPolarAngle() * 180 / Math.PI - 90)

    // Wrap the x value to the correct range
    let xWrap = this.angX
    if (viewX > 0 && xWrap < 0) {
      xWrap += 360
    } else if (viewX < 0 && xWrap > 0) {
      xWrap -= 360
    }

    // Compute normalized world position
    const xn = (xWrap - viewX) / hFOV
    const yn = (this.angY - viewY) / vFOV

    // Change units to pixels to set world coorinates
    // - We offset by 0.5 to center on screen
    this.setPosition((xn + 0.5) * widthPixels, (yn + 0.5) * heightPixels)

    // Add scaling when near edges of view to simulate perspective
    const scaler = Math.sqrt(xn * xn + yn * yn) * this.perspectiveStrength
    super.setScale(
      this.baseScaleX + scaler * this.baseScaleX,
      this.baseScaleY + scaler * this.baseScaleY
    )
  }
}

// Expose the MainPlayer class to other files
export default PanoSprite
