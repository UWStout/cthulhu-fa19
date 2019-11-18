// Import the entire 'phaser' namespace
import Phaser from 'phaser'
class OptionScene extends Phaser.Scene{

  preload(){

  }

  create(){

    let menuButton = this.add.text(this.game.renderer.width / 2 - 100, this.game.renderer.height / 2 + 180, 'Menu' , { fontSize: 25 , align:'center' }).setDepth(1)
    menuButton.alpha = 0.5

    this.musicOn = true;
    this.soundOn = true;
    
    this.text = this.add.text(this.game.renderer.width / 2 - 100, this.game.renderer.height / 2 - 270, 'Options', { fontSize: 40, align:'center' });
    this.musicButton = this.add.image(300, 200, 'checkedBox');
    this.musicText = this.add.text(350, 190, 'Music Enabled', { fontSize: 24 });
    
    this.soundButton = this.add.image(300, 300, 'checkedBox');
    this.soundText = this.add.text(350, 290, 'Sound Enabled', { fontSize: 24 });
    
    this.musicButton.setInteractive();
    this.soundButton.setInteractive();
    
    this.musicButton.on('pointerdown', function () {
      this.musicOn = !this.musicOn;
      this.updateAudio();
    }.bind(this));
    
    this.soundButton.on('pointerdown', function () {
      this.soundOn = !this.soundOn;
      this.updateAudio();
    }.bind(this));
    
    this.updateAudio();

    menuButton.setInteractive();
  
    menuButton.on("pointerover",()=>{ //sets button alpha to 1 on hover
      menuButton.alpha = 1
    })

    menuButton.on("pointerout",()=>{ //dims button when not hovering
      menuButton.alpha = 0.5
    })

    menuButton.on("pointerup",()=>{ // Go back to title screen
      this.scene.start('TitleScene')
      console.log("Back to menu")
    })
    
  }

  updateAudio() {
    if (this.musicOn === false) {
      this.musicButton.setTexture('box');
    } else {
      this.musicButton.setTexture('checkedBox');
    }
   
    if (this.soundOn === false) {
      this.soundButton.setTexture('box');
    } else {
      this.soundButton.setTexture('checkedBox');
    }
  }

}

export default OptionScene
