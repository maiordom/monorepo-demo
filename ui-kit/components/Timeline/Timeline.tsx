import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';

import 'web-animations-js/web-animations.min.js';
import './Timeline.css';

import Shapes from './Shapes';
import Driver from './Driver';

interface IProps {
  className?: string;
}

export default ({ className }: IProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const timerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const shapes = new Shapes(containerRef.current);

    new Driver(shapes, timerRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={classnames('Timeline', 'flow-artboard', className)}
    >
      <div ref={timerRef} id="timer-timeline"></div>
      <div className="flow-layer viewbox">
        <div className="flow-layer fill_1">
          <svg
            className="fill_1-svg"
            preserveAspectRatio="none"
            viewBox="0 0 14.41 12.47"
          >
            <title>Fill-1</title>
            <desc>Made with Flow.</desc>
            <path
              vectorEffect="non-scaling-stroke"
              d="M0,12.47c0,0,0,0,0,0 0,0,14.41,0,14.41,0 -0.48,-5.146,-3.218,-9.63,-7.21,-12.47 0,0,-7.2,12.47,-7.2,12.47 0,0,0,0,0,0 0,0,0,0,0,0zM0,12.47"
            ></path>
          </svg>
          <div className="flow-border fill_1-border"></div>
        </div>
        <div className="flow-layer fill_3">
          <svg
            className="fill_3-svg"
            preserveAspectRatio="none"
            viewBox="0 0 14.4 14.05"
          >
            <title>Fill-3</title>
            <desc>Made with Flow.</desc>
            <path
              vectorEffect="non-scaling-stroke"
              d="M0,12.467c2.194,1.006,4.628,1.583,7.201,1.583 2.573,0,5.005,-0.576,7.199,-1.583 0,0,-7.199,-12.467,-7.199,-12.467 0,0,0,0,0,0 0,0,-7.201,12.467,-7.201,12.467 0,0,0,0,0,0 0,0,0,0,0,0zM0,12.467"
            ></path>
          </svg>
          <div className="flow-border fill_3-border"></div>
        </div>
        <div className="flow-layer fill_5">
          <svg
            className="fill_5-svg"
            preserveAspectRatio="none"
            viewBox="0 0 14.41 12.47"
          >
            <title>Fill-5</title>
            <desc>Made with Flow.</desc>
            <path
              vectorEffect="non-scaling-stroke"
              d="M0,0c0,0,0,0,0,0 0,0,7.2,12.47,7.2,12.47 3.992,-2.842,6.73,-7.324,7.21,-12.47 0,0,-14.41,0,-14.41,0 0,0,0,0,0,0 0,0,0,0,0,0zM0,0"
            ></path>
          </svg>
          <div className="flow-border fill_5-border"></div>
        </div>
        <div className="flow-layer fill_7">
          <svg
            className="fill_7-svg"
            preserveAspectRatio="none"
            viewBox="0 0 14.4 14.05"
          >
            <title>Fill-7</title>
            <desc>Made with Flow.</desc>
            <path
              vectorEffect="non-scaling-stroke"
              d="M14.4,1.583c-2.194,-1.007,-4.628,-1.583,-7.199,-1.583 -2.574,0,-5.006,0.576,-7.201,1.583 0,0,7.201,12.467,7.201,12.467 0,0,0,0,0,0 0,0,7.199,-12.467,7.199,-12.467 0,0,0,0,0,0 0,0,0,0,0,0zM14.4,1.583"
            ></path>
          </svg>
          <div className="flow-border fill_7-border"></div>
        </div>
        <div className="flow-layer fill_10">
          <svg
            className="fill_10-svg"
            preserveAspectRatio="none"
            viewBox="0 0 14.41 12.47"
          >
            <title>Fill-10</title>
            <desc>Made with Flow.</desc>
            <path
              vectorEffect="non-scaling-stroke"
              d="M14.41,0c0,0,0,0,0,0 0,0,-14.41,0,-14.41,0 0.48,5.146,3.218,9.628,7.21,12.47 0,0,7.2,-12.47,7.2,-12.47 0,0,0,0,0,0 0,0,0,0,0,0zM14.41,0"
            ></path>
          </svg>
          <div className="flow-border fill_10-border"></div>
        </div>
        <div className="flow-layer fill_13">
          <svg
            className="fill_13-svg"
            preserveAspectRatio="none"
            viewBox="0 0 14.41 12.47"
          >
            <title>Fill-13</title>
            <desc>Made with Flow.</desc>
            <path
              vectorEffect="non-scaling-stroke"
              d="M14.41,12.47c0,0,0,0,0,0 0,0,-7.2,-12.47,-7.2,-12.47 -3.992,2.842,-6.73,7.324,-7.21,12.47 0,0,14.41,0,14.41,0 0,0,0,0,0,0 0,0,0,0,0,0zM14.41,12.47"
            ></path>
          </svg>
          <div className="flow-border fill_13-border"></div>
        </div>
        <div className="flow-border viewbox-border"></div>
      </div>
    </div>
  );
};
