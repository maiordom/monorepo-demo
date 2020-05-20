import React, { useEffect } from 'react';

import { Belt, Logo } from 'src/components/Layout';
import Button from 'ui-kit/components/Button';

import i18n from 'src/locales';
import model from 'src/model';
import analitycs from 'src/analytics';
import css from './Final.css';

export default () => {
  const handleCallToActionClick = () => {
    analitycs.events.final.getStartedWithTabby();
    model.close({
      redirectUrl: model.appLink,
    });
  };

  const handleBackClick = event => {
    analitycs.events.final.backToStore();
    model.close({ redirectUrl: model.store.merchantUrls.success });

    event.preventDefault();
  };

  useEffect(() => {
    analitycs.events.final.pageOpen();
  }, []);

  return (
    <Belt className={css.container}>
      <Logo />
      <div className={css.successIcon} />
      <div className={css.title}>{i18n().final.payLater.title}</div>
      <div className={css.description}>{i18n().final.payLater.description}</div>
      <Button className={css.callToAction} onClick={handleCallToActionClick}>
        {i18n().final.payLater.callToAction}
      </Button>
      <a className={css.back} href="#" onClick={handleBackClick}>
        {i18n().final.payLater.back}
      </a>
    </Belt>
  );
};
