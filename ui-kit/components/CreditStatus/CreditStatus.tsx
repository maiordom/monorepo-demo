import React from 'react';
import classnames from 'classnames';

import { ICustomerSummary } from 'core/entities/Customer/types/CustomerSummary';

interface IProps {
  className?: string;
  summary: ICustomerSummary;
  i18n: {
    canSpend: string;
    overdue: string;
    pay: string;
    spentSoFar: string;
    unlockAfterFirstPurchase: string;
  };
}

import css from './CreditStatus.css';

export default ({ summary, i18n, className }: IProps) => {
  if (summary.debt.overdue) {
    return (
      <div className={classnames(css.container, css.overdue, className)}>
        <div className={css.title}>{i18n.overdue}</div>
        <div className={css.amountWrapper}>
          <span className={css.amount}>{summary.creditLimit.available}</span>
          &nbsp;
          <span className={css.currency}>{summary.currency}</span>
        </div>
      </div>
    );
  }

  if (summary.limitIsLocked) {
    return (
      <div className={classnames(css.container, css.blocked, className)}>
        <div className={css.title}>{i18n.unlockAfterFirstPurchase}</div>
        <div className={css.amountWrapper}>
          <span className={css.amount}>{summary.creditLimit.total}</span>
          &nbsp;
          <span className={css.currency}>{summary.currency}</span>
        </div>
      </div>
    );
  }

  if (summary.showMaximalLimit) {
    return (
      <div
        className={classnames(css.container, css.showMaximalLimit, className)}
      >
        <div className={css.title}>{i18n.canSpend}</div>
        <div className={css.amountWrapper}>
          <span className={css.amount}>{summary.creditLimit.total}</span>
          &nbsp;
          <span className={css.currency}>{summary.currency}</span>
        </div>
      </div>
    );
  }

  if (summary.creditLimit.total - summary.creditLimit.available === 0) {
    return (
      <div className={classnames(css.container, css.canSpend, className)}>
        <div className={css.title}>{i18n.canSpend}</div>
        <div className={css.amountWrapper}>
          <span className={css.amount}>{summary.creditLimit.available}</span>
          &nbsp;
          <span className={css.currency}>{summary.currency}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classnames(css.container, css.default, className)}>
      <div className={css.spent}>
        <div className={css.title}>{i18n.spentSoFar}</div>
        <div className={css.amountWrapper}>
          <span className={css.amount}>
            {(
              summary.creditLimit.total - summary.creditLimit.available
            ).toFixed(2)}
          </span>
          &nbsp;
          <span className={css.currency}>{summary.currency}</span>
        </div>
      </div>
      <div className={css.canSpend}>
        <div className={css.title}>{i18n.canSpend}</div>
        <div className={css.amountWrapper}>
          <span className={css.amount}>{summary.creditLimit.available}</span>
          &nbsp;
          <span className={css.currency}>{summary.currency}</span>
        </div>
      </div>
    </div>
  );
};
