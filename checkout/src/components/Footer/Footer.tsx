import React from 'react';

import { Belt } from 'src/components/Layout';

import css from './Footer.css';

export default () => (
  <Belt className={css.container}>
    <div>
      <a className="link" href="tel:+971 4 586 8775">
        <bdi>+971 4 586 8775</bdi>
      </a>{' '}
      <a className="link" href="mailto:help@tabby.ai">
        help@tabby.ai
      </a>
    </div>
    <div>Tabby FZ-LLC, In5 Tech, Dubai Internet City</div>
  </Belt>
);
