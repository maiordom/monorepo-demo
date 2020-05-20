import React from 'react';

import css from './Controls.css';
import model from 'src/model';

export default () => {
  const handleCloseClick = () => {
    model.close({ redirectUrl: model.store.merchantUrls.cancel });
  };

  return (
    <div className={css.container}>
      <div onClick={handleCloseClick} className={css.close} />
    </div>
  );
};
