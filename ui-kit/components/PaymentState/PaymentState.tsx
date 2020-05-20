import React, { useState } from 'react';
import classnames from 'classnames';

import Price from '../Price';
import Slider from '../Slider';
import PaymentItem from '../PaymentItem';
import PaymentWidget from '../PaymentWidget';
import Cell from '../Cell';
import InstallmentPlan from '../InstallmentPlan';
import InstallmentsPreview from '../InstallmentsPreview';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

import useActiveInstallments from './useActiveInstallments';

interface I18n {
  biWeeklyInstallmentFee: string;
  installmentFee: string;
  installmentPlan: {
    overdue: string;
    paid: string;
    toPay: string;
  };
  installmentsMethod: string;
  monthlyInstallmentFee: string;
  orderInfo: string;
  orderNumber: string;
  paid: string;
  pay: string;
  payInFull: string;
  payLaterFee: string;
  payLaterMethod: string;
  paymentMethod: string;
  paymentOverdue: string;
  shippingAddress: string;
  shippingFee: string;
}

interface IProps {
  isLoading?: boolean;
  className?: string;
  paymentState: IPaymentState;
  i18n: I18n;
  onPayClick?: (paymentState: IPaymentState) => void;
  onToggle?: (isToggled: boolean, paymentState: IPaymentState) => void;
  onInstallmentPlanSelect?: (
    paymentState: IPaymentState,
    count: number
  ) => void;
}

import css from './PaymentState.css';

export default ({
  isLoading,
  onPayClick,
  onInstallmentPlanSelect,
  onToggle,
  className,
  paymentState,
  i18n,
}: IProps) => {
  const [isToggled, toggle] = useState(false);
  const installments = paymentState?.loan?.installments;
  const {
    product: { installmentPeriodType },
    order: { shippingAddress },
  } = paymentState;
  const hasInstallments = paymentState?.product?.productType === 'installments';

  const {
    activeInstallmentIds,
    setActiveInstallmentIds,
  } = useActiveInstallments(installments);

  const handleClick = () => {
    toggle(!isToggled);
    onToggle && onToggle(!isToggled, paymentState);
  };

  const handleCloseClick = () => {
    toggle(!isToggled);
  };

  const handleInstallmentPlanToggle = (id: string) => {
    const activeInstallmentIds = setActiveInstallmentIds(id) || [];

    onInstallmentPlanSelect &&
      onInstallmentPlanSelect(paymentState, activeInstallmentIds.length);
  };

  const isOverdue = installments.find(installment => installment.isOverdue);
  const installmentFeeTitle = () => {
    if (installmentPeriodType.beweekly) {
      return i18n.biWeeklyInstallmentFee;
    } else if (installmentPeriodType.monthly) {
      return i18n.monthlyInstallmentFee;
    } else {
      return i18n.installmentFee;
    }
  };
  let paymentMethod = i18n.payLaterMethod;

  if (hasInstallments) {
    paymentMethod = i18n.installmentsMethod;
  }

  return (
    <div
      className={classnames(
        Number(paymentState.loan.refundedAmount) > 0 && css.refunded,
        className,
        css.container,
        hasInstallments && css.hasInstallments,
        isOverdue && css.overdue,
        isToggled && css.toggled
      )}
    >
      <PaymentWidget
        isLoading={isLoading}
        i18n={i18n}
        className={classnames(css.border, css.widget)}
        onPayClick={onPayClick}
        paymentState={paymentState}
        onClick={handleClick}
      />
      {!isToggled && hasInstallments && (
        <InstallmentsPreview
          items={installments}
          className={css.installments}
        />
      )}
      {isToggled && (
        <div className={css.info}>
          {hasInstallments && (
            <Slider
              sliderOptions={{
                spaceBetween: 18,
                slidesPerView: 'auto',
                grabCursor: true,
                watchOverflow: true,
                slidesOffsetAfter: 10,
              }}
              className={css.slider}
            >
              {installments.map(installment => {
                const isActive = activeInstallmentIds.includes(installment.id);

                return (
                  <InstallmentPlan
                    installment={installment}
                    key={installment.id}
                    isActive={isActive}
                    onToggle={handleInstallmentPlanToggle}
                    i18n={i18n.installmentPlan}
                    currency={paymentState.currency}
                  />
                );
              })}
            </Slider>
          )}
          <div className={css.closeWrapper}>
            <span className={css.header}>{i18n.orderInfo}</span>
            <div className={css.close} onClick={handleCloseClick} />
          </div>
          <Cell name={i18n.paymentMethod} value={paymentMethod} />
          <Cell
            valueClassName={css.orderNumber}
            name={i18n.orderNumber}
            value={paymentState.order.number}
          />
          <Cell
            name={i18n.shippingAddress}
            value={`${shippingAddress.zip} ${shippingAddress.raw}, ${shippingAddress.city}`}
          />
          <PaymentItems paymentState={paymentState} />
          <Cell
            name={hasInstallments ? installmentFeeTitle() : i18n.payLaterFee}
            value={
              <Price
                theme="small"
                currency={paymentState.currency}
                amount={paymentState.loan.serviceFeePerInstallment}
              />
            }
          />
          {paymentState.order.shippingAmount ? (
            <Cell
              name={i18n.shippingFee}
              value={
                <Price
                  theme="small"
                  currency={paymentState.currency}
                  amount={paymentState.order.shippingAmount}
                />
              }
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

const PaymentItems = ({
  paymentState: {
    order: { items },
    currency,
  },
}: {
  paymentState: IPaymentState;
}) => (
  <div>
    {items.map(item => (
      <PaymentItem
        key={item.title + item.description}
        item={item}
        currency={currency}
      />
    ))}
  </div>
);
