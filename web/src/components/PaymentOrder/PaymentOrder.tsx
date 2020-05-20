import React from 'react';

import Price from 'ui-kit/components/Price';
import Cell from 'ui-kit/components/Cell';
import PaymentWidget from 'ui-kit/components/PaymentWidget';
import PaymentItem from 'ui-kit/components/PaymentItem';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

import i18n from 'src/locales';
import css from './PaymentOrder.css';

interface IProps {
  paymentState: IPaymentState;
}

export default ({ paymentState }: IProps) => {
  const hasInstallments = paymentState?.product?.productType === 'installments';
  const {
    product: { installmentPeriodType },
    order: { shippingAddress },
  } = paymentState;

  let paymentMethod = i18n().paymentState.payLaterMethod;

  if (hasInstallments) {
    paymentMethod = i18n().paymentState.installmentsMethod;
  }

  const installmentFeeTitle = () => {
    if (installmentPeriodType.beweekly) {
      return i18n().paymentState.biWeeklyInstallmentFee;
    } else if (installmentPeriodType.monthly) {
      return i18n().paymentState.monthlyInstallmentFee;
    } else {
      return i18n().paymentState.installmentFee;
    }
  };

  return (
    <>
      <div className={css.title}>{i18n().paymentOrder.title}</div>
      <PaymentWidget hidePayButton align="center" paymentState={paymentState} />
      <div className={css.inner}>
        <Cell name={i18n().paymentState.paymentMethod} value={paymentMethod} />
        <Cell
          valueClassName={css.order}
          name={i18n().paymentOrder.orderNumber}
          value={paymentState.order.number}
        />
        <Cell
          name={i18n().paymentState.shippingAddress}
          value={`${shippingAddress.zip} ${shippingAddress.raw}, ${shippingAddress.city}`}
        />
        {paymentState.order.items.length > 0 &&
          paymentState.order.items.map(item => (
            <PaymentItem
              key={item.title}
              item={item}
              currency={paymentState.currency}
            />
          ))}
        <Cell
          name={
            hasInstallments
              ? installmentFeeTitle()
              : i18n().paymentState.payLaterFee
          }
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
            name={i18n().paymentState.shippingFee}
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
      <div className={css.description}>{i18n().paymentOrder.description}</div>
    </>
  );
};
