import React from 'react';
import format from 'date-fns/format';
import classnames from 'classnames';

import { IInstallmentPlan } from 'core/entities/Customer/types/InstallmentPlan';

import Icon from '../Icon';

interface IProps {
  installment: IInstallmentPlan;
  isActive: boolean;
  currency: string;
  className?: string;
  onToggle: (id: string) => void;
  i18n: {
    toPay: string;
    paid: string;
    overdue: string;
  };
}

import css from './InstallmentPlan.css';

export default ({
  currency,
  className,
  i18n,
  isActive,
  onToggle,
  installment: {
    amountToPay,
    dueDate,
    id,
    isOverdue,
    isPaid,
    paidAmount,
    toPay,
  },
}: IProps) => {
  let statusText;
  let statusClass = css.default;
  let iconStatus = 'status-default';

  const handleClick = () => {
    if (isPaid) {
      return;
    }

    onToggle && onToggle(id);
  };

  if (isPaid) {
    iconStatus = 'status-paid';
    statusText = i18n.paid;
    statusClass = css.paid;
  } else if (toPay) {
    statusText = i18n.toPay;
    statusClass = css.toPay;
  } else if (isOverdue) {
    statusText = i18n.overdue;
    statusClass = css.overdue;
  }

  let amount = amountToPay;

  if (isPaid) {
    amount = paidAmount;
  }

  return (
    <div
      onClick={handleClick}
      className={classnames(
        className,
        css.container,
        statusClass,
        isActive && css.active
      )}
    >
      <Icon
        className={css.icon}
        name={isActive ? 'status-success' : iconStatus}
      />
      <div className={css.date}>{format(new Date(dueDate), 'MMM d')}</div>
      {statusText && <div className={css.status}>{statusText}</div>}
      <div className={css.amount}>
        {amount} {currency}
      </div>
    </div>
  );
};
