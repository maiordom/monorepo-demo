import React from 'react';
import format from 'date-fns/format';
import classnames from 'classnames';

import Price from '../Price';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

interface I18n {
  paid: string;
}

interface IProps {
  isLoading?: boolean;
  i18n?: I18n;
  hidePayButton?: boolean;
  align?: 'top' | 'center';
  className?: string;
  paymentState: IPaymentState;
  amount?: number;
  onClick?: () => void;
  onPayClick?: (paymentState: IPaymentState) => void;
}

import css from './PaymentWidget.css';

export default ({
  isLoading,
  i18n,
  hidePayButton,
  paymentState,
  onClick = () => undefined,
  className,
  align = 'top',
  onPayClick = () => undefined,
}: IProps) => {
  const handlePayClick = () => {
    onPayClick(paymentState);
  };

  return (
    <div
      className={classnames(css.container, className, css[align])}
      onClick={onClick}
    >
      {paymentState.merchant.logo ? (
        <img className={css.logo} src={paymentState.merchant.logo} />
      ) : (
        <div className={classnames(css.logo, css.empty)} />
      )}
      <div className={css.space}>
        <div>
          <div className={css.name}>{paymentState.merchant.name}</div>
          <PaymentStatus i18n={i18n} paymentState={paymentState} />
        </div>
        {paymentState.status === 'to_pay' && !hidePayButton ? (
          <div className={css.pay}>
            <PayButton
              disabled={isLoading}
              onClick={handlePayClick}
              {...paymentState}
            />
          </div>
        ) : (
          <Price
            className={css.price}
            amount={parseFloat(paymentState.loan.paid.amount)}
            currency={paymentState.currency}
          />
        )}
      </div>
    </div>
  );
};

const PaymentStatus = ({
  paymentState: {
    status,
    loan: { installments, refundedAmount },
    paidDate,
    currency,
  },
  i18n,
}: {
  paymentState: IPaymentState;
  i18n: I18n;
}) => {
  let content = null;

  const isOverdue = installments.find(installment => installment.isOverdue);

  if (isOverdue) {
    content = <div className={css.paymentOverdue}>Payment overdue</div>;
  } else if (parseFloat(refundedAmount)) {
    content = (
      <div className={css.refunded}>
        Refunded {refundedAmount} {currency}
      </div>
    );
  } else if (status === 'paid') {
    content = (
      <div className={css.paid}>
        {i18n.paid} {format(new Date(paidDate), 'MMM do')}
      </div>
    );
  }

  if (content) {
    return <div className={css.paymentStatus}>{content}</div>;
  }

  return null;
};

const PayButton = ({
  onClick,
  disabled,
  loan: { amountToPay },
  currency,
}: IPaymentState & { onClick: () => void; disabled?: boolean }) => (
  <div
    className={classnames(css.payButton, disabled && css.disabled)}
    onClick={onClick}
  >
    <span className={css.payButtonText}>
      Pay {amountToPay} {currency}
    </span>
  </div>
);
