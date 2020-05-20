import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react';

import analytics from 'src/analytics';
import i18n from 'src/locales';
import getPurchaseService from 'core/entities/Customer/services/GetPurchase';
import clientRoutes, { getRoute } from 'src/routes/client';
import journalModel from 'core/entities/Journal/model';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

import PaymentState from 'ui-kit/components/PaymentState';

interface IProps {
  paymentState: IPaymentState;
  className?: string;
}

export default observer(({ paymentState, className }: IProps) => {
  const history = useHistory();
  const [updatedPaymentState, updatePaymentState] = useState();

  const handlePaymentSnippetClick = (
    isToggled: boolean,
    paymentState: IPaymentState
  ) => {
    if (isToggled) {
      analytics.events.main.clickOnToPayPurchaseSnippet(paymentState);
    } else {
      updatePaymentState(null);
    }
  };

  const handlePayClick = (paymentState: IPaymentState) => {
    analytics.events.main.clickOnToPayButton(paymentState);
    history.push(
      getRoute(
        clientRoutes.payPurchase,
        {
          id: paymentState.id,
        },
        {
          installmentsCountToPay: paymentState.loan.installments.filter(
            installment => installment.checked
          ).length,
        }
      )
    );
  };

  const handleInstallmentPlanSelect = async (
    paymentState: IPaymentState,
    count: number
  ) => {
    const purchase = await getPurchaseService({
      id: paymentState.id,
      installmentsCountToPay: String(count),
    });

    updatePaymentState(purchase);
  };

  return (
    <PaymentState
      isLoading={
        journalModel.journal?.getPurchase?.isLoading &&
        journalModel.journal?.getPurchase?.params?.id === paymentState.id
      }
      key={paymentState.id}
      onToggle={handlePaymentSnippetClick}
      onInstallmentPlanSelect={handleInstallmentPlanSelect}
      onPayClick={handlePayClick}
      className={className}
      i18n={i18n().paymentState}
      paymentState={updatedPaymentState || paymentState}
    />
  );
});
