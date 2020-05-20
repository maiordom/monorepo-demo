import React, { useEffect } from 'react';

import Button from 'ui-kit/components/Button';
import { Belt, Logo } from 'src/components/Layout';

import i18n from 'src/locales';
import model from 'src/model';
import css from './Rejected.css';
import analitycs from 'src/analytics';

export default () => {
  const handleChangePaymentMethod = event => {
    model.close();
    analitycs.events.rejected.changePaymentMethod();

    event.preventDefault();
  };

  const handlePayFirstPurchaseClick = () => {
    analitycs.events.rejected.payNow();
    model.close({ redirectUrl: model.appLink });
  };

  const handlePayOverdueClick = () => {
    analitycs.events.rejected.payNow();
    model.close({ redirectUrl: model.appLink });
  };

  useEffect(() => {
    analitycs.events.rejected.pageOpen({
      reason: model.store.rejectionReasonCode,
    });
  }, []);

  let content = null;

  switch (model.store.rejectionReasonCode) {
    case 'notAvailable':
      content = (
        <>
          <div className={css.title}>
            {i18n().paymentRejected.reason.notAvailable.title}
          </div>
        </>
      );
      break;

    case 'payFirstPurchase':
      content = (
        <>
          <div className={css.title}>
            {i18n().paymentRejected.reason.payFirstPurchase.title}
          </div>
          <Button className={css.button} onClick={handlePayFirstPurchaseClick}>
            {i18n().paymentRejected.reason.payFirstPurchase.button.title}
          </Button>
        </>
      );
      break;

    case 'overdue':
      content = (
        <>
          <div className={css.title}>
            {i18n().paymentRejected.reason.overdue.title}
          </div>
          <Button className={css.button} onClick={handlePayOverdueClick}>
            {i18n().paymentRejected.reason.overdue.button.title}
          </Button>
        </>
      );
      break;

    case 'notEnoughLimit':
      content = (
        <div className={css.title}>
          {i18n().paymentRejected.reason.notEnoughLimit.title}
        </div>
      );
      break;
  }

  return (
    <Belt className={css.container}>
      <Logo />
      <div className={css.picture} />
      {content}
      <a
        onClick={handleChangePaymentMethod}
        className={css.changePaymentMethod}
        href="#"
      >
        {i18n().paymentRejected.changePaymentMethod}
      </a>
    </Belt>
  );
};
