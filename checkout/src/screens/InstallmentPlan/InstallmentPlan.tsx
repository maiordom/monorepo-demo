import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import { IPlan } from 'core/entities/Checkout/types/Configuration';

import Timeline from 'ui-kit/components/Timeline';
import Button from 'ui-kit/components/Button';
import { Belt } from 'src/components/Layout';
import Plan from 'src/components/Plan';
import Progress from 'src/components/Progress';

import installmentRegularity from 'core/utils/InstallmentRegularity';
import journalModel from 'core/entities/Journal/model';
import plural from 'ui-kit/utils/Plural';
import model from 'src/model';
import i18n from 'src/locales';
import t from 'ui-kit/utils/Interpolate';
import css from './InstallmentPlan.css';

const getTerm = (plan: IPlan) => {
  const regularity = installmentRegularity(plan.installmentPeriod);
  const period = regularity.period.months * 4 + regularity.period.weeks;

  return (period / 4) * plan.installmentsCount;
};

export default observer(() => {
  const [selectedPlan, selectPlan] = useState<IPlan>();
  const [plans, setPlans] = useState<IPlan[]>();

  useEffect(() => {
    const plans = model.store.configuration.availableProducts.installments;

    plans.sort((a, b) => {
      return getTerm(a) < getTerm(b) ? -1 : 1;
    });

    const plan = plans[0];

    model.getCheckout(model.store.sessionId);
    setPlans(plans);
    selectPlan(plan);
    model.selectedProductOption = plan;
  }, []);

  const getProgress = () => {
    if (model.store.configuration.newCustomer) {
      return 100 * (2 / 4);
    } else {
      return 100;
    }
  };

  const handleCallToActionClick = () => {
    model.updateCheckout();
  };

  const handlePlanSelect = (plan: IPlan) => {
    selectPlan(plan);
    model.selectedProductOption = plan;
  };

  if (!plans) {
    return null;
  }

  if (journalModel.journal?.getCheckout?.isLoading) {
    return (
      <div className={css.loader}>
        <Timeline />
      </div>
    );
  }

  const regularity = installmentRegularity(selectedPlan.installmentPeriod);
  const period = regularity.period.months * 4 + regularity.period.weeks;
  const feeByWeek = parseFloat(selectedPlan.serviceFee) / period;
  const term = (period / 4) * selectedPlan.installmentsCount;

  if (journalModel.journal?.getCheckout?.isResolved) {
    return (
      <div className={css.container}>
        <Progress className={css.progress} progress={getProgress()} />
        <Belt className={css.container}>
          <div className={css.title}>
            {i18n().instalmentPlan.title}
            {parseFloat(selectedPlan.downpayment) > 0 &&
              t(i18n().instalmentPlan.downpayment, {
                amount: selectedPlan.downpayment,
                currency: model.store.configuration.currency,
              })}
          </div>
          <div className={css.description}>
            {t(i18n().instalmentPlan.desctiption, {
              amount: feeByWeek * 4,
              currency: model.store.configuration.currency,
            })}
          </div>
          <div className={css.plans}>
            {plans.map(plan => (
              <Plan
                key={plan.installmentsCount}
                className={css.plan}
                plan={plan}
                onClick={handlePlanSelect}
                isSelected={selectedPlan === plan}
                currency={model.store.configuration.currency}
              />
            ))}
          </div>
          <Button
            isLoading={journalModel.journal?.updateCheckout?.isLoading}
            className={css.callToAction}
            onClick={handleCallToActionClick}
          >
            {term}{' '}
            {plural(
              selectedPlan.installmentsCount,
              i18n().common.plurals.month
            )}
          </Button>
        </Belt>
      </div>
    );
  }
});
