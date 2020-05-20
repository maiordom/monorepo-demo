import React from 'react';
import classnames from 'classnames';

interface IProps {
  name: string;
  value: string | number | React.ReactNode;
  valueClassName?: string;
  className?: string;
}

import css from './Cell.css';

export default ({ name, value, valueClassName, className }: IProps) => (
  <div className={classnames(css.container, className)}>
    <div className={css.name}>{name}</div>
    <div className={classnames(css.value, valueClassName)}>{value}</div>
  </div>
);
