import React from 'react';
import classnames from 'classnames';

import css from './Footer.css';

interface IProps {
  className?: string;
}

export default ({ className }: IProps) => (
  <div className={classnames(css.container, className)}>
    <div>
      <bdi>+971 800 626755</bdi>,{' '}
      <a className="link" href="mailto:help@tabby.ai">
        help@tabby.ai
      </a>
    </div>
    <div>Tabby FZ-LLC, In5 Tech, Dubai Internet City</div>
  </div>
);
