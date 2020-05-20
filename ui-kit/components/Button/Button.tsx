import React from 'react';
import classnames from 'classnames';

import Spinner from '../Spinner';

export interface IProps {
  type?: 'submit';
  theme?: 'primary' | 'gray' | 'noBorder' | 'white';
  testId?: string;
  onClick: (event) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

import css from './Button.css';

export default ({
  type,
  theme = 'primary',
  children,
  className,
  disabled,
  onClick,
  isLoading,
  testId,
}: IProps) => (
  <button
    type={type}
    test-id={testId}
    onClick={onClick}
    disabled={disabled}
    className={classnames(
      css.container,
      className,
      css[theme],
      (disabled || isLoading) && css.disabled
    )}
  >
    {isLoading ? (
      <Spinner
        className={css.spinner}
        theme={['white', 'primary'].includes(theme) ? 'black' : null}
      />
    ) : (
      children
    )}
  </button>
);
