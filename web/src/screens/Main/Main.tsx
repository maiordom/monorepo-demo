import React, { useEffect, useState, Fragment } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

import Credit from 'ui-kit/components/Credit';
import PaymentState from 'ui-kit/components/PaymentState';
import PaymentOrder from 'src/components/PaymentOrder';
import Overlay from 'src/components/Overlay';
import NotDueYet from 'src/components/NotDueYet';
import Timeline from 'ui-kit/components/Timeline';
import ToPaySnippet from 'src/components/ToPaySnippet';

import analytics from 'src/analytics';
import i18n from 'src/locales';
import customerPurchasesModel, {
  IDateGroup,
} from 'core/entities/Customer/models/Purchases';
import commonModel from 'src/entities/Common/model';
import css from './Main.css';
import clientRoutes from 'src/routes/client';

export default observer(() => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPaymentState, setPaymentState] = useState(null);
  const history = useHistory();

  const handleNotDueYetSnippetClick = (paymentState: IPaymentState) => {
    setPaymentState(paymentState);
    analytics.events.main.clickOnNotDueYetPurchaseSnippet(paymentState);
    commonModel.toggleOverlay();
  };

  const handlePaidSnippetClick = (
    isToggled: boolean,
    paymentState: IPaymentState
  ) => {
    if (isToggled) {
      analytics.events.main.clickOnPaidPurchaseSnippet(paymentState);
    }
  };

  const handlePayAllClick = () => {
    history.push(clientRoutes.payAll);
  };

  const handleToPayWidgetRender = (state: string[]) => {
    analytics.events.main.showPaymentSnippet(state);
  };

  const handleCreditLimitWidgetRender = (state: string[]) => {
    analytics.events.main.showCreditLimitSnippet(state);
  };

  useEffect(() => {
    analytics.events.main.pageOpen();

    Promise.all([
      customerPurchasesModel.getPurchases(),
      customerPurchasesModel.getSummary(),
    ])
      .then(([{ toPay, paid }]) => {
        toPay.purchases.forEach(purchase => {
          analytics.events.main.showToPayPurchaseSnippet(purchase);
        });
        analytics.events.main.showPaidPurchaseList(paid.purchases);
        setIsLoaded(true);
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, []);

  if (!isLoaded) {
    return (
      <div className={css.timeline}>
        <Timeline />
      </div>
    );
  }

  const getGroupTitle = (group: IDateGroup) => {
    if (group.isToday) {
      return i18n().dates.today;
    }

    if (group.isTomorrow) {
      return i18n().dates.tomorrow;
    }

    return group.title;
  };

  return (
    <>
      <Overlay>
        {selectedPaymentState && (
          <PaymentOrder paymentState={selectedPaymentState} />
        )}
      </Overlay>
      <div className={css.container}>
        <Credit
          onCreditLimitWidgetRender={handleCreditLimitWidgetRender}
          onToPayWidgetRender={handleToPayWidgetRender}
          onPayClick={handlePayAllClick}
          i18n={i18n().credit}
          summary={customerPurchasesModel.store.summary}
        />
        {customerPurchasesModel.store.notDueYet.items.length > 0 && (
          <div className={css.group}>
            <div className={css.title}>{i18n().main.notDueYet}</div>
            <NotDueYet onClick={handleNotDueYetSnippetClick} />
          </div>
        )}
        {customerPurchasesModel.store.toPay.group.length > 0 && (
          <div className={css.group}>
            <div className={css.title}>{i18n().main.toPay}</div>
            {customerPurchasesModel.store.toPay.group.map(group => (
              <Fragment key={group.title}>
                <div className={css.date}>{getGroupTitle(group)}</div>
                <div>
                  {group.items.map(item => (
                    <ToPaySnippet
                      key={item.id}
                      paymentState={item}
                      className={css.paymentState}
                    />
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        )}
        {customerPurchasesModel.store.paid.items.length > 0 && (
          <div className={css.group}>
            <div className={css.title}>{i18n().main.paid}</div>
            {customerPurchasesModel.store.paid.items.map(item => (
              <PaymentState
                key={item.id}
                onToggle={handlePaidSnippetClick}
                className={css.paymentState}
                i18n={i18n().paymentState}
                paymentState={item}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
});
