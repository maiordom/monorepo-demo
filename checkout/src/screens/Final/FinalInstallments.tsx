import React, { useEffect } from 'react';
import format from 'date-fns/format';

import { Belt, Logo } from 'src/components/Layout';
import Button from 'ui-kit/components/Button';

import t from 'ui-kit/utils/Interpolate';
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
      <div className={css.title}>{i18n().final.installments.title}</div>
      <div className={css.description}>
        {t(i18n().final.installments.description, {
          nextPaymentDate: format(
            new Date(model.selectedProductOption.nextPaymentDate),
            'MMMM do'
          ),
        })}
      </div>
      <Button className={css.callToAction} onClick={handleCallToActionClick}>
        {i18n().final.installments.callToAction}
      </Button>
      <a className={css.back} href="#" onClick={handleBackClick}>
        {i18n().final.installments.back}
      </a>
    </Belt>
  );
};
