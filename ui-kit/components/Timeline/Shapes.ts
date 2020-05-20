export default class Shapes {
  allShapes: SVGSVGElement[];
  container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;

    this.allShapes = [
      this.container.querySelector('.fill_1-svg'),
      this.container.querySelector('.fill_3-svg'),
      this.container.querySelector('.fill_5-svg'),
      this.container.querySelector('.fill_7-svg'),
      this.container.querySelector('.fill_10-svg'),
      this.container.querySelector('.fill_13-svg'),
    ];
  }

  get duration() {
    return 2000;
  }

  artboardAnimation() {
    return this.container.animate(
      {
        backgroundPosition: ['0px', '1px'],
      },
      {
        delay: 0,
        duration: 2000,
      }
    );
  }

  viewboxTransformAnimation() {
    return this.container.querySelector('.viewbox').animate(
      [
        {
          transform: 'translate(-50%, -50%) rotate(0deg)',
          offset: 0,
          easing: 'ease-in-out',
        },
        {
          transform: 'translate(-50%, -50%) rotate(180deg)',
          offset: 0.5,
          easing: 'ease-in-out',
        },
        { transform: 'translate(-50%, -50%) rotate(360deg)', offset: 1 },
      ],
      {
        duration: this.duration,
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_1Animation0() {
    return this.container.querySelector('.fill_1').animate(
      {
        top: ['7.51px', '6.13px'],
        left: ['24.04px', '26.95px'],
      },
      {
        delay: 0,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_1Animation1() {
    return this.container.querySelector('.fill_1').animate(
      {
        top: ['6.13px', '7.51px'],
        left: ['26.95px', '24.04px'],
      },
      {
        delay: 1000,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_3Animation0() {
    return this.container.querySelector('.fill_3').animate(
      {
        top: ['24.86px', '27.61px'],
      },
      {
        delay: 0,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_3Animation1() {
    return this.container.querySelector('.fill_3').animate(
      {
        top: ['27.61px', '24.86px'],
      },
      {
        delay: 1000,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_5Animation0() {
    return this.container.querySelector('.fill_5').animate(
      {
        top: ['23.23px', '24.61px'],
        left: ['24.04px', '26.95px'],
      },
      {
        delay: 0,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_5Animation1() {
    return this.container.querySelector('.fill_5').animate(
      {
        top: ['24.61px', '23.23px'],
        left: ['26.95px', '24.04px'],
      },
      {
        delay: 1000,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_7Animation0() {
    return this.container.querySelector('.fill_7').animate(
      {
        top: ['4.3px', '1.7px'],
      },
      {
        delay: 0,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_7Animation1() {
    return this.container.querySelector('.fill_7').animate(
      {
        top: ['1.7px', '4.3px'],
      },
      {
        delay: 1000,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_10Animation0() {
    return this.container.querySelector('.fill_10').animate(
      {
        top: ['23.23px', '24.45px'],
        left: ['4px', '1.4px'],
      },
      {
        delay: 0,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_10Animation1() {
    return this.container.querySelector('.fill_10').animate(
      {
        top: ['24.45px', '23.23px'],
        left: ['1.4px', '4px'],
      },
      {
        delay: 1000,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_13Animation0() {
    return this.container.querySelector('.fill_13').animate(
      {
        top: ['7.51px', '6.13px'],
        left: ['4px', '1.09px'],
      },
      {
        delay: 0,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  fill_13Animation1() {
    return this.container.querySelector('.fill_13').animate(
      {
        top: ['6.13px', '7.51px'],
        left: ['1.09px', '4px'],
      },
      {
        delay: 1000,
        duration: 1000,
        easing: 'ease-in-out',
        composite: 'add',
        fill: 'forwards',
      }
    );
  }

  createAllAnimations() {
    return [
      this.artboardAnimation(),
      this.viewboxTransformAnimation(),
      this.fill_1Animation0(),
      this.fill_1Animation1(),
      this.fill_3Animation0(),
      this.fill_3Animation1(),
      this.fill_5Animation0(),
      this.fill_5Animation1(),
      this.fill_7Animation0(),
      this.fill_7Animation1(),
      this.fill_10Animation0(),
      this.fill_10Animation1(),
      this.fill_13Animation0(),
      this.fill_13Animation1(),
    ];
  }
}
