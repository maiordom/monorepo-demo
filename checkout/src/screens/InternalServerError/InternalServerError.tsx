import React from 'react';

import { Belt, Logo } from 'src/components/Layout';

import Button from 'ui-kit/components/Button';

import model from 'src/model';
import i18n from 'src/locales';
import css from './InternalServerError.css';

export default () => {
  const handleCallToActionClick = () => {
    model.close({ redirectUrl: model.store.merchantUrls.cancel });
  };

  return (
    <Belt className={css.container}>
      <Logo className={css.logo} />
      <div className={css.title}>
        {i18n().internalServerError.title.map(words => (
          <div key={words}>{words}</div>
        ))}
      </div>
      <div className={css.picture} />
      <Button className={css.callToAction} onClick={handleCallToActionClick}>
        {i18n().internalServerError.callToAction}
      </Button>
    </Belt>
  );
};
