import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useParams, useLocation } from 'react-router';
import queryString from 'query-string';

import Price from 'ui-kit/components/Price';
import Cell from 'ui-kit/components/Cell';
import InstallmentPlan from 'ui-kit/components/InstallmentPlan';
import PaymentWidget from 'ui-kit/components/PaymentWidget';
import PaymentItem from 'ui-kit/components/PaymentItem';
import Pay from 'ui-kit/components/Pay';
import Timeline from 'ui-kit/components/Timeline';

import i18n from 'src/locales';
import clientRoutes, { getRoute } from 'src/routes/client';
import useActiveInstallments from 'ui-kit/components/PaymentState/useActiveInstallments';
import purchasesModel from 'core/entities/Customer/models/Purchases';
import analytics from 'src/analytics';
import getPurchaseService from 'core/entities/Customer/services/GetPurchase';
import getPaymentUrlService from 'core/entities/Customer/services/GetPaymentUrl';
import journalModel from 'core/entities/Journal/model';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

import css from './PayPurchase.css';

export default observer(() => {
  const { search } = useLocation();
  const { installmentsCountToPay } = queryString.parse(search) as {
    installmentsCountToPay: string;
  };
  const [status, setStatus] = useState('pending');
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentState, setPaymentState]: [
    IPaymentState,
    (payment: IPaymentState) => void
  ] = useState();
  const { id } = useParams();
  const installments = paymentState?.loan?.installments;
  const {
    activeInstallmentIds,
    setActiveInstallmentIds,
  } = useActiveInstallments(installments);

  const handlePayClick = () => {
    analytics.events.payment.pay({
      pageType: 'single',
      toPayAmount: paymentState.loan.amountToPay,
      purchaseIds: [paymentState.id],
    });
    location.href = paymentUrl;
  };

  const handleInit = async () => {
    try {
      const purchase = await getPurchaseService({ id, installmentsCountToPay });
      const { paymentUrl } = await getPaymentUrlService({
        purchases: {
          [id]: purchase.loan.amountToPay,
        },
        cancelUrl:
          __APP_URL__ + getRoute(clientRoutes.payPurchaseCancel, { id }),
        redirectUrl:
          __APP_URL__ + getRoute(clientRoutes.payPurchaseSuccess, { id }),
      });

      setPaymentState(purchase);
      analytics.events.payment.pageOpen({
        pageType: 'single',
        amount: purchase.loan.amountToPay,
        purchases: [purchase],
      });
      setPaymentUrl(paymentUrl);
      setStatus('resolved');
    } catch (_) {
      setStatus('rejected');
    }
  };

  const handleInstallmentPlanToggle = async (id: string) => {
    const activeInstallmentIds = setActiveInstallmentIds(id) || [];

    const purchase = await getPurchaseService({
      id: paymentState.id,
      installmentsCountToPay: String(activeInstallmentIds.length),
    });

    setPaymentState(purchase);
  };

  useEffect(() => {
    handleInit();
    purchasesModel.getSummary();
  }, []);

  if (status === 'pending') {
    return <Timeline className={css.spinner} />;
  }

  if (status === 'rejected') {
    return <div className={css.wrong}>{i18n().statuses.wrong}</div>;
  }

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
      <PaymentWidget
        hidePayButton
        align="center"
        i18n={i18n().paymentState}
        paymentState={paymentState}
      />
      <div className={css.installments}>
        {hasInstallments &&
          installments.map(installment => {
            const isActive = activeInstallmentIds.includes(installment.id);

            return (
              <InstallmentPlan
                onToggle={handleInstallmentPlanToggle}
                installment={installment}
                key={installment.id}
                className={css.installmentItem}
                isActive={isActive}
                i18n={i18n().paymentState.installmentPlan}
                currency={paymentState.currency}
              />
            );
          })}
      </div>

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
      <Pay
        onClick={handlePayClick}
        className={css.pay}
        disabled={journalModel.journal?.getPurchase?.isLoading}
      >
        {i18n().controls.pay} {paymentState.loan.amountToPay}{' '}
        {paymentState.currency}
      </Pay>
    </>
  );
});
