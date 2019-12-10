
// Import the entire 'phaser' namespace
import Phaser from 'phaser'
class CreditsScene extends Phaser.Scene {
  preload () {}

  create () {
    this.creditsText = this.add.text(0, 0, 'Credits', { fontSize: '32px', fill: '#fff' })
    // this.madeByText = this.add.text(0, 0, 'Created By: Placeholder', { fontSize: '26px', fill: '#fff' }); 
    this.madeByText = this.add.text(0, 0, 'Developed by:\nSeth\'s Safari\n\nArt:\nEmily Shaffer\nJoseph Ceranski\nWhitney Phillips\n\nProgramming:\nAlex Hallee\nMichael Lee', { fontSize: '26px', fill: '#fff', align:'center' })    
    this.tom = this.add.image(0, 0, 'tom').setScale(2)

    this.zone = this.add.zone(this.game.renderer.width / 2, this.game.renderer.height / 2, this.game.renderer.width, this.game.renderer.height)

    Phaser.Display.Align.In.Center(
      this.creditsText,
      this.zone
    )

    Phaser.Display.Align.In.Center(
      this.madeByText,
      this.zone
    )

    Phaser.Display.Align.In.Center(
      this.tom,
      this.zone
    )

    this.madeByText.setY(1000)
    this.tom.setY(850)

    this.creditsTween = this.tweens.add({
      targets: this.creditsText,
      y: -100,
      ease: 'Power1',
      duration: 3000,
      delay: 950
    })

    this.tomTween = this.tweens.add({
      targets: this.tom,
      y: -550,
      ease: 'Power1',
      duration: 13000,
      delay: 500
    })

    this.madeByTween = this.tweens.add({
      targets: this.madeByText,
      y: -350,
      ease: 'Power1',
      duration: 13000,
      delay: 500,
      onComplete: function () {
        this.scene.start('TitleScene')
      }.bind(this)
    })

    this.input.on('pointerdown', function () {
      // Allows you to exit to title screen if you don't wanna watch credits
      this.scene.start('TitleScene')
    }, this)
  }
}

// Expose the TitleScene class for use in other modules
export default CreditsScene
