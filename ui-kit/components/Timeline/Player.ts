import Shapes from './Shapes';

export default class Player {
  shapes: Shapes;
  timer: HTMLDivElement;
  loop: boolean;
  delay: number;
  timingAnimation: Animation;
  animations: Animation[];

  constructor(
    shapes: Shapes,
    timer: HTMLDivElement,
    loop: boolean,
    delay: number
  ) {
    this.loop = loop;
    this.delay = delay;
    this.timer = timer;

    this.setTimeline(shapes);
    this.createOnFinishCallback();
  }

  setTimeline(shapes) {
    this.shapes = shapes;

    this.timingAnimation = this.timer.animate(
      {},
      this.shapes.duration + this.delay
    );
    this.timingAnimation.currentTime = 0;
    this.timingAnimation.pause();

    this.animations = this.shapes.createAllAnimations();
  }

  get duration() {
    return this.shapes === null ? 0 : this.shapes.duration;
  }

  get currentTime() {
    return this.timingAnimation === null ? 0 : this.timingAnimation.currentTime;
  }

  set currentTime(time) {
    for (const animation of this.animations) {
      animation.currentTime = time;
    }

    for (const shape of this.shapes.allShapes) {
      shape.setCurrentTime(time / 1000);
    }

    this.timingAnimation.currentTime = time;
  }

  play() {
    this.timingAnimation.play();

    for (const animation of this.animations) {
      animation.play();
      animation.currentTime = this.currentTime % this.duration;
    }

    for (const shape of this.shapes.allShapes) {
      const t = shape.getCurrentTime() % this.shapes.duration;

      shape.setCurrentTime(t);
      shape.unpauseAnimations();
    }
  }

  createOnFinishCallback() {
    this.timingAnimation.onfinish = () => {
      this.currentTime = 0;
    };
  }
}
