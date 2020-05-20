import React from 'react';
import classnames from 'classnames';

interface IProps {
  className?: string;
  icon: string;
  title: string;
  isToggled?: boolean;
  onClick: (param: any) => any;
}

import css from './TableButton.css';

export default ({
  className,
  onClick = () => undefined,
  icon,
  title,
  isToggled = false,
}: IProps) => {
  return (
    <div className={classnames(css.container, className)}>
      <div className={css[icon]} />
      <div className={css.inner} onClick={onClick}>
        <div className={css.title}>{title}</div>
        {isToggled ? (
          <div className={css.close} />
        ) : (
          <div className={css.arrow} />
        )}
      </div>
    </div>
  );
};
