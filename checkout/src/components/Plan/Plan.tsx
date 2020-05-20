import React from 'react';
import classnames from 'classnames';

import { IPlan } from 'core/entities/Checkout/types/Configuration';

import Icon from 'ui-kit/components/Icon';

import t from 'ui-kit/utils/Interpolate';
import plural from 'ui-kit/utils/Plural';
import installmentRegularity from 'core/utils/InstallmentRegularity';

interface IProps {
  plan: IPlan;
  onClick: (plan: IPlan) => void;
  isSelected: boolean;
  currency: string;
  className?: string;
}

import css from './Plan.css';
import i18n from 'src/locales';

export default ({ plan, onClick, isSelected, currency, className }: IProps) => {
  const handleClick = () => {
    onClick(plan);
  };

  const regularity = installmentRegularity(plan.installmentPeriod);
  let period = regularity.period.months;
  let periodTitle;
  const pluralWordsDictionary = regularity.period.weeks
    ? i18n().common.plurals.week
    : i18n().common.plurals.month;
  const periodByWeek = regularity.period.months * 4 + regularity.period.weeks;
  const term = plan.installmentsCount * (periodByWeek / 4);

  if (regularity.period.weeks) {
    period = regularity.period.months * 4 + regularity.period.weeks;
  }

  if (period === 1) {
    periodTitle = t(i18n().instalmentPlan.each, {
      period: plural(period, pluralWordsDictionary),
    });
  } else {
    periodTitle = t(i18n().instalmentPlan.every, {
      regulatiry: period,
      period: plural(period, pluralWordsDictionary),
    });
  }

  return (
    <div
      className={classnames(
        css.container,
        className,
        isSelected && css.selected
      )}
      onClick={handleClick}
    >
      <div className={css.term}>
        {term} {plural(term, i18n().common.plurals.month)}
      </div>
      <div className={css.title}>
        {periodTitle}: {plan.payPerInstallment} {currency}
      </div>
      {isSelected ? (
        <Icon className={css.status} name="status-success" />
      ) : (
        <Icon className={css.status} name="status-default" />
      )}
    </div>
  );
};
