import React from 'react';
import classnames from 'classnames';

interface IProps {
  className?: string;
  children: React.ReactNode;
}

import css from './List.css';

export default ({ className, children }: IProps) => (
  <ul className={classnames(css.container, className)}>{children}</ul>
);
