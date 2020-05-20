import plural from 'ui-kit/utils/Plural';
import t from 'ui-kit/utils/Interpolate';
import installmentRegularity from 'core/utils/InstallmentRegularity';

import i18n from 'src/locales';
import model from 'src/model';
import termsText from 'src/utils/TermsText';

export default () => {
  if (model.store.productType === 'payLater') {
    return i18n().welcomeBack.payLater.features;
  }

  const plans = model.store.configuration.availableProducts.installments;
  const data = plans.map(plan => {
    const regularity = installmentRegularity(plan.installmentPeriod);
    const period = regularity.period.months * 4 + regularity.period.weeks;
    const amountPerWeek = parseFloat(plan.payPerInstallment) / period;

    return {
      amountPerMonth: amountPerWeek * 4,
      term: (period / 4) * plan.installmentsCount,
    };
  });
  const [buyNow, starting, link] = i18n().welcomeBack.installments.features;

  return [
    {
      type: 'text',
      value: t(buyNow.value, {
        terms: termsText(data.map(item => item.term).sort()),
        period: plural(data.length, i18n().common.plurals.month),
      }).join(''),
    },
    {
      type: 'text',
      value: t(starting.value, {
        amount: Math.min(...data.map(item => item.amountPerMonth)),
        currency: model.store.configuration.currency,
      }).join(''),
    },
    link,
  ];
};
