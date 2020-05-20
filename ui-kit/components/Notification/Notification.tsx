import React from 'react';
import classnames from 'classnames';

import Icon from '../Icon';

interface IProps {
  className?: string;
  children: React.ReactElement | string;
  onClose?: () => void;
}

import css from './Notification.css';

export default ({ children, className, onClose }: IProps) => {
  const handleCloseClick = () => {
    onClose && onClose();
  };

  return (
    <div className={classnames(css.container, className)}>
      <Icon name="warning" className={css.warning} />
      <span className={css.text}>{children}</span>
      <Icon
        name="close-small"
        onClick={handleCloseClick}
        className={css.close}
      />
    </div>
  );
};
