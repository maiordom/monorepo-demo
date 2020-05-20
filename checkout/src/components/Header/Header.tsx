import React from 'react';
import { observer } from 'mobx-react';

import { Belt } from 'src/components/Layout';

import css from './Header.css';
import i18n from 'src/locales';
import model from 'src/model';
import t from 'ui-kit/utils/Interpolate';
import plural from 'ui-kit/utils/Plural';
import installmentRegularity from 'core/utils/InstallmentRegularity';
import termsText from 'src/utils/TermsText';

const title = () => {
  if (model.store.productType === 'payLater') {
    return i18n().header.payLater.title;
  }

  const plans = model.store.configuration.availableProducts.installments;

  const terms = plans.map(plan => {
    const regularity = installmentRegularity(plan.installmentPeriod);
    const period = regularity.period.months * 4 + regularity.period.weeks;

    return (period / 4) * plan.installmentsCount;
  });

  return t(i18n().header.installments.title, {
    terms: termsText(terms.sort()),
    period: plural(terms.length, i18n().common.plurals.month),
  });
};

const description = () => {
  if (model.store.productType === 'payLater') {
    return t(i18n().header.payLater.description, {
      amountToPay:
        model.store.configuration.availableProducts.payLater[0].amountToPay,
      currency: model.store.configuration.currency,
      serviceFee:
        model.store.configuration.availableProducts.payLater[0].serviceFee,
    });
  }

  const plans = model.store.configuration.availableProducts.installments;

  const fees = plans.map(plan => {
    const regularity = installmentRegularity(plan.installmentPeriod);
    const period = regularity.period.months * 4 + regularity.period.weeks;
    const feeByWeek = parseFloat(plan.serviceFee) / period;

    return feeByWeek * 4;
  });

  return t(i18n().header.installments.description, {
    amount: Math.max(...fees),
    currency: model.store.configuration.currency,
  });
};

export default observer(() => {
  const handleCloseClick = () => {
    model.close({ redirectUrl: model.store.merchantUrls.cancel });
  };

  return (
    <div className={css.container}>
      <Belt className={css.inner}>
        <div className={css.data}>
          <div className={css.title}>{title()}</div>
          <div className={css.description}>{description()}</div>
        </div>
        <div onClick={handleCloseClick} className={css.close} />
      </Belt>
    </div>
  );
});
