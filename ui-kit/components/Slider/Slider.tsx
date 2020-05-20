import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import classnames from 'classnames';

import Icon from '../Icon';

import css from './Slider.css';

interface IProps {
  children: React.ReactNode[];
  className?: string;
  sliderOptions?: Record<string, string | number | boolean | object>;
}

export default ({ children, className, sliderOptions }: IProps) => {
  const sliderRef = useRef();

  useEffect(() => {
    const slider = new Swiper(sliderRef.current, {
      ...sliderOptions,
      navigation: {
        nextEl: `.${css.nextArrow}`,
        prevEl: `.${css.prevArrow}`,
      },
    });

    return () => {
      slider.destroy();
    };
  }, []);

  return (
    <div className={classnames(css.container, className)}>
      <Icon
        name="arrow-right"
        className={classnames(css.nextArrow, css.arrow)}
      />
      <Icon
        name="arrow-left"
        className={classnames(css.prevArrow, css.arrow)}
      />
      <div ref={sliderRef} className={css.slider}>
        <div className={classnames(css.inner, 'swiper-wrapper')}>
          {React.Children.map(children, child => (
            <div className={`${css.item} swiper-slide`}>{child}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
