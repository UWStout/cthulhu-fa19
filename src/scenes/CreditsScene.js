
// Import the entire 'phaser' namespace
import Phaser from 'phaser'
class CreditsScene extends Phaser.Scene{

  create(){
    this.creditsText = this.add.text(0, 0, 'Credits', { fontSize: '32px', fill: '#fff' });
    //this.madeByText = this.add.text(0, 0, 'Created By: Placeholder', { fontSize: '26px', fill: '#fff' }); 
    this.madeByText = this.add.text(0, 0, 'Developed by:\nSeths Safari\n\nArt:\nEmily Shaffer\nWhitney Phillips\nJoseph Ceranski\n\nProgramming: \nAlex Hallee\nMichael Lee', { fontSize: '26px', fill: '#fff', align:'center' });    
 
    this.zone = this.add.zone(this.game.renderer.width / 2, this.game.renderer.height / 2, this.game.renderer.width, this.game.renderer.height);

    Phaser.Display.Align.In.Center(
      this.creditsText,
      this.zone
    );

    Phaser.Display.Align.In.Center(
      this.madeByText,
      this.zone
    );
     
    this.madeByText.setY(1000);

    this.creditsTween = this.tweens.add({
      targets: this.creditsText,
      y: -100,
      ease: 'Power1',
      duration: 3000,
      delay: 1000,
      onComplete: function () {
        this.destroy;
      }
    });
     
    this.madeByTween = this.tweens.add({
      targets: this.madeByText,
      y: -300,
      ease: 'Power1',
      duration: 13000,
      delay: 1000,
      onComplete: function () {
        this.madeByTween.destroy;
        this.scene.start('TitleScene');
      }.bind(this)
    });
  }
}

// Expose the TitleScene class for use in other modules
export default CreditsScene
