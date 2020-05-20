import React from 'react';
import classnames from 'classnames';

import css from './Progress.css';

interface IProps {
  progress: number;
  className?: string;
}

export default ({ progress, className }: IProps) => (
  <div className={classnames(css.container, className)}>
    <div style={{ width: progress + '%' }} className={css.progress} />
  </div>
);
