import React from 'react';
import classnames from 'classnames';

import css from './Pay.css';

interface IProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const Pay = ({ children, className, disabled, onClick }: IProps) => (
  <div
    onClick={onClick}
    className={classnames(css.pay, className, disabled && css.disabled)}
  >
    {children}
  </div>
);

export default Pay;
