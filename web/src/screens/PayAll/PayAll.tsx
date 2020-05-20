import React, { useEffect, useState } from 'react';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

import Pay from 'ui-kit/components/Pay';
import PaymentCard from 'ui-kit/components/PaymentCard';
import Timeline from 'ui-kit/components/Timeline';

import analytics from 'src/analytics';
import getPaymentUrlService from 'core/entities/Customer/services/GetPaymentUrl';
import purchasesModel from 'core/entities/Customer/models/Purchases';
import i18n from 'src/locales';
import clientRoutes, { getRoute } from 'src/routes/client';

interface IProps {}

import css from './PayAll.css';

const renderPurchases = (purchases: IPaymentState[], headerText: string) => {
  if (!purchases.length) return null;

  return (
    <div className={css.purchasesGroup}>
      <b className={css.heading}>{headerText}</b>
      <div className={css.purchasesList}>
        {purchases.map(item => (
          <PaymentCard
            key={item.id}
            className={css.purchase}
            i18n={{
              ...i18n().controls,
              paymentOverdue: i18n().paymentState.paymentOverdue,
            }}
            paymentState={item}
          />
        ))}
      </div>
    </div>
  );
};

export default ({}: IProps) => {
  const [purchases, setPurchases] = useState([] as IPaymentState[]);
  const [status, setStatus] = useState('pending');
  const [paymentUrl, setPaymentUrl] = useState(null);

  const handlePayClick = () => {
    analytics.events.payment.pay({
      pageType: 'all',
      toPayAmount: purchasesModel.store.summary.debt.total,
      purchaseIds: purchases.map(purchase => purchase.id),
    });
    location.href = paymentUrl;
  };

  const handleInit = async () => {
    try {
      const [, toPay] = await Promise.all([
        purchasesModel.getSummary(),
        purchasesModel.getToPayPurchases(),
      ]);

      setPurchases(toPay.purchases);
      analytics.events.payment.pageOpen({
        pageType: 'all',
        amount: purchasesModel.store.summary.debt.total,
        purchases: toPay.purchases,
      });

      const purchases = toPay.purchases.reduce((result, purchase) => {
        result[purchase.id] = purchase.loan.amountToPay;
        return result;
      }, {});

      try {
        const { paymentUrl } = await getPaymentUrlService({
          purchases,
          cancelUrl:
            __APP_URL__ +
            getRoute(clientRoutes.payPurchaseCancel, { id: 'all' }),
          redirectUrl:
            __APP_URL__ +
            getRoute(clientRoutes.payPurchaseSuccess, { id: 'all' }),
        });

        setPaymentUrl(paymentUrl);
        setStatus('resolved');
      } catch (_) {
        setStatus('rejected');
      }
    } catch (_) {
      setStatus('rejected');
    }
  };

  useEffect(() => {
    handleInit();
  }, []);

  if (status === 'pending') {
    return <Timeline className={css.spinner} />;
  }

  if (status === 'rejected') {
    return <div className={css.wrong}>{i18n().statuses.wrong}</div>;
  }

  const payLaterPurchases = purchases.filter(
    item => item?.product?.productType === 'pay_later'
  );

  const installmentsPurchases = purchases.filter(
    item => item?.product?.productType === 'installments'
  );

  return (
    <div>
      <div className={css.amountCard}>
        <div className={css.amountWrapper}>
          <span className={css.amount}>
            {purchasesModel.store.summary.debt.total}
          </span>
          &nbsp;
          <span className={css.currency}>
            {purchasesModel.store.summary.currency}
          </span>
        </div>
        <Pay onClick={handlePayClick} className={css.pay}>
          {i18n().controls.pay}
        </Pay>
      </div>
      <div className={css.payLaterPurchases}>
        {renderPurchases(payLaterPurchases, i18n().payAll.payAfterDelivery)}
      </div>
      <div className={css.installmentsPurchases}>
        {renderPurchases(
          installmentsPurchases,
          i18n().payAll.payInInstallments
        )}
      </div>
    </div>
  );
};
