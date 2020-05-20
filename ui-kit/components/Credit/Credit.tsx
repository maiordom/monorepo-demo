import React, { useEffect } from 'react';
import classnames from 'classnames';

import { ICustomerSummary } from 'core/entities/Customer/types/CustomerSummary';

import t from '../../utils/Interpolate';

interface IProps {
  className?: string;
  summary: ICustomerSummary;
  onPayClick: () => void;
  onToPayWidgetRender: (state: string[]) => void;
  onCreditLimitWidgetRender: (state: string[]) => void;
  i18n: {
    blocked: string;
    canSpend: string;
    nothingToPay: string;
    overdue: string;
    pay: string;
    payForAllOrders: string;
    unlockAfterFirstPurchase: string;
    walletBalance: string;
  };
}

import css from './Credit.css';

const ToPayWidget = ({
  summary,
  i18n,
  onPayClick,
  onToPayWidgetRender,
}: IProps) => {
  const { currency } = summary;
  const state = [];
  let status = null;
  let title = null;

  const handlePayClick = () => {
    if (status !== 'defaultState') {
      onPayClick();
    }
  };

  if (summary.debt.total === 0) {
    status = 'defaultState';
    title = i18n.nothingToPay;
    state.push('nothingToPay');
  } else if (summary.debt.overdue) {
    status = 'overdueState';
    title = t(i18n.overdue, {
      currency,
      overdue: summary.debt.overdue,
    });
    state.push('overduePayment');
  } else if (summary.debt.total > 0) {
    status = 'activeState';
    title = i18n.payForAllOrders;
    state.push('payAll');
  }

  useEffect(() => {
    onToPayWidgetRender && onToPayWidgetRender(state);
  }, []);

  return (
    <div className={classnames(css.toPay, css.widget, css[status])}>
      <div className={css.title}>{title}</div>
      {summary.walletBalance ? (
        <div className={css.walletBalance}>
          {t(i18n.walletBalance, {
            walletBalance: summary.walletBalance,
            currency: summary.currency,
          })}
        </div>
      ) : null}
      <div className={css.info}>
        <div className={css.debt}>
          <span className={css.amount}>{summary.debt.total}</span>
          <span>&nbsp;</span>
          <span className={css.currency}>{currency}</span>
        </div>
        <div
          onClick={handlePayClick}
          className={classnames(
            css.pay,
            status === 'defaultState' && css.blocked
          )}
        >
          {i18n.pay}
        </div>
      </div>
    </div>
  );
};

const CreditWidget = ({ summary, i18n, onCreditLimitWidgetRender }: IProps) => {
  const { currency } = summary;
  const state = [];
  let limit = null;
  let status = null;
  let title = null;

  if (summary.limitIsLocked) {
    status = 'blockedState';
    state.push('limitIsLocked');
  }

  if (summary.debt.overdue > 0) {
    limit = summary.creditLimit.available;
    state.push('overdue');
    status = 'blockedState';
    title = i18n.blocked;
  } else if (summary.debt.total > 0 || !summary.limitIsLocked) {
    limit = summary.creditLimit.available;
    state.push('canSpend');
    status = 'activeState';
    title = i18n.canSpend;
  } else if (summary.showMaximalLimit) {
    limit = summary.creditLimit.total;
    state.push('showMaximalLimit');
    title = i18n.unlockAfterFirstPurchase;
  }

  useEffect(() => {
    onCreditLimitWidgetRender && onCreditLimitWidgetRender(state);
  }, []);

  return (
    <div className={classnames(css.credit, css.widget, css[status])}>
      <div className={css.title}>{title}</div>
      <div className={css.info}>
        <div className={css.amountWrapper}>
          <div>
            <span className={css.amount}>{limit}</span>
            <span>&nbsp;</span>
            <span className={css.currency}>{currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default (props: IProps) => {
  return (
    <div className={classnames(css.container, props.className)}>
      <ToPayWidget {...props} />
      <CreditWidget {...props} />
    </div>
  );
};
