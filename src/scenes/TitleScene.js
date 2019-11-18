
// Import the entire 'phaser' namespace
import Phaser from 'phaser'
class TitleScene extends Phaser.Scene{
  // Initialize some local settings for this state
  init () {
  }

  preload () {
    this.load.image('background2', 'assets/images/TitleScreen/image/title_bg.jpg') //background
    this.load.image('background', 'assets/images/TitleScreen/image/spooky-mansion.jpg') //background
    this.load.image('play_button', 'assets/images/TitleScreen/image/play_button.png') //play button
    this.load.image('options_button', 'assets/images/TitleScreen/image/options_button.png') //options button
    this.load.image('title', 'assets/images/TitleScreen/image/LogoTransparent.png') //title name
  }

  create(){
    this.add.image(-110,0, 'background').setOrigin(0).setScale(0.89).setDepth(0);
    this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.4, 'title').setScale(1.5).setDepth(1);
    let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'play_button').setDepth(1);
    let optionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 170, 'options_button').setDepth(1);

    playButton.alpha = 0.5;
    optionButton.alpha = 0.5;

    /*
      PointerEvents:
        pointerover - hovering
        pointerout - not hovering
        pointerup - click and release
        pointerdown - click
    */

    // PLAY----------------------------------------------------------------
    playButton.setInteractive();

    playButton.on("pointerover",()=>{ //sets playbutton alpha to 1 on hover
      playButton.alpha = 1;
      console.log("Hover")
    })

    playButton.on("pointerout",()=>{ //dims play button when not hovering
      playButton.alpha = 0.5;
      console.log("pointer off")
    })

    playButton.on("pointerup",()=>{ //starts scene
      console.log("click")
      this.scene.start('Conservatory')
    })

    // OPTIONS--------------------------------------
    optionButton.setInteractive();

    optionButton.on("pointerover",()=>{ //sets playbutton alpha to 1 on hover
      optionButton.alpha = 1;
    })

    optionButton.on("pointerout",()=>{ //dims play button when not hovering
      optionButton.alpha = 0.5;
    })

    optionButton.on("pointerup",()=>{ //starts scene
      console.log("Options menu")
      //this.scene.start('Conservatory')
    })

    // CREDITS--------------------------------------
    //creditsButton = game.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 205, 'Credits', { font: '24px Arial', fill: '#fff' });
  }

  update () {
    //this.scene.start('Conservatory')
    //this.scene.start('MenuScene')

    //Play button lights up when pointer is over
    /*
    if (playButton.input.pointerOver())
    {
        playButton.alpha = 1;
    }
    else
    {
        playButton.alpha = 0.5;
    }
    */
  }

 
}

// Expose the TitleScene class for use in other modules
export default TitleScene
