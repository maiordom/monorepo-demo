import React from 'react';
import classnames from 'classnames';

interface IProps {
  name: string;
  className?: string;
  style?: Record<string, string | number>;
  onClick?: () => void;
}

import css from './Icon.css';

export default ({
  name,
  className,
  style,
  onClick = () => undefined,
}: IProps) => {
  const iconSrc = require(`./assets/${name}.svg`);

  return (
    <span
      onClick={onClick}
      style={style}
      className={classnames(className, css[name], css.container)}
    >
      <span
        className={css.inner}
        dangerouslySetInnerHTML={{ __html: iconSrc.default }}
      />
    </span>
  );
};
