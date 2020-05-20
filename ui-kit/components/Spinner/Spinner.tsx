import React from 'react';
import classnames from 'classnames';

import css from './Spinner.css';

export interface IProps {
  className?: string;
  theme?: string;
}

export default ({ className, theme }: IProps) => (
  <div className={classnames(css.container, className, css[theme])}>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
    <div aria-hidden="true"></div>
  </div>
);
