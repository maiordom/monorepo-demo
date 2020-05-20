import React from 'react';
import classnames from 'classnames';
import format from 'date-fns/format';

import Icon from '../Icon';
import InstallmentsPreview from '../InstallmentsPreview';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

interface I18n {
  pay: string;
  paymentOverdue: string;
}

interface IProps {
  paymentState: IPaymentState;
  i18n: I18n;
  className?: string;
}

import css from './PaymentCard.css';

export default ({ className, paymentState, i18n }: IProps) => {
  const hasInstallments = paymentState?.product?.productType === 'installments';
  const isOverdue = paymentState.loan.installments.find(
    installment => installment.isOverdue
  );
  const nextPaidDate = paymentState.loan.installments.find(
    installment => installment.toPay || installment.isOverdue
  )?.dueDate;

  return (
    <div
      className={classnames(
        css.container,
        className,
        hasInstallments && css.hasInstallments
      )}
    >
      {paymentState.merchant.logo ? (
        <img className={css.logo} src={paymentState.merchant.logo} />
      ) : (
        <div className={classnames(css.logo, css.empty)} />
      )}
      <Icon className={css.status} name="status-success" />
      <div className={css.title}>{paymentState.merchant.name}</div>
      {nextPaidDate && (
        <div className={css.date}>
          {format(new Date(nextPaidDate), 'MMM do')}
        </div>
      )}
      {isOverdue && (
        <div className={css.overDueText}>{i18n.paymentOverdue}</div>
      )}
      {hasInstallments && (
        <div className={css.installmentsContainer}>
          <InstallmentsPreview items={paymentState.loan.installments} />
        </div>
      )}
      <div className={css.amount}>
        {i18n.pay} {paymentState.loan.amountToPay} {paymentState.currency}
      </div>
    </div>
  );
};
