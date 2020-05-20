import Player from './Player';
import Shapes from './Shapes';

export default class Driver {
  player: Player;

  constructor(shapes: Shapes, timer: HTMLDivElement) {
    this.player = new Player(shapes, timer, true, 0);

    this.createControl();
    this.play();
  }

  play() {
    this.player.currentTime = 0;
    this.player.play();
  }

  createControl() {
    this.player.timingAnimation.onfinish = () => {
      this.player.currentTime = 0;
    };
  }
}
