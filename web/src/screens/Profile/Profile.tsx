import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react';

import Toggler from 'src/components/Toggler';
import Pay from 'ui-kit/components/Pay';
import CreditStatus from 'ui-kit/components/CreditStatus';
import Button from 'ui-kit/components/Button';
import Timeline from 'ui-kit/components/Timeline';

import analytics from 'src/analytics';
import t from 'ui-kit/utils/Interpolate';
import i18n from 'src/locales';
import customerModel from 'core/entities/Customer/models/Customer';
import customerPurchasesModel from 'core/entities/Customer/models/Purchases';
import authModel from 'core/entities/Auth/model';
import clientRoutes from 'src/routes/client';

import css from './Profile.css';

const personalInformation = i18n().profile.personalInformation;

export default observer(() => {
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();

  const handleInit = async () => {
    try {
      await Promise.all([
        customerPurchasesModel.getSummary(),
        customerModel.getCustomer(),
      ]);
      setIsLoaded(true);
      analytics.events.profile.showSummarySnippet();
    } catch (_) {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    analytics.events.profile.pageOpen();

    handleInit();
  }, []);

  const handleLogout = () => {
    analytics.events.profile.logout();
    analytics.logout();
    authModel.logout();
    history.push(clientRoutes.auth);
  };

  const handlePayAllClick = () => {
    history.push(clientRoutes.payAll);
    analytics.events.profile.clickOnPayAll();
  };

  const handleTogglePersonalInfo = (isToggled: boolean) => {
    analytics.events.profile.clickOnPersonalInformation(
      isToggled ? 'open' : 'close'
    );
  };

  if (!isLoaded) {
    return (
      <div className={css.timeline}>
        <Timeline />
      </div>
    );
  }

  const { summary } = customerPurchasesModel.store;
  const showPayAllButton = summary.debt.total > 0;

  return (
    <div className={css.container}>
      <div className={css.row}>
        <div className={css.title}>
          {t(i18n().profile.title, {
            name: customerModel.customer.name,
          })}
        </div>
        <div className={css.avatar} />
      </div>
      <CreditStatus
        className={css.creditStatus}
        summary={customerPurchasesModel.store.summary}
        i18n={i18n().creditStatus}
      />
      {showPayAllButton ? (
        <div className={css.callToAction}>
          {i18n().profile.callToAction}
          <Pay onClick={handlePayAllClick} className={css.pay}>
            {i18n().profile.pay}
          </Pay>
        </div>
      ) : null}
      <Toggler
        onToggle={handleTogglePersonalInfo}
        className={css.info}
        title={personalInformation.title}
        icon="personal"
        items={[
          {
            name: personalInformation.items.name,
            value: customerModel.customer.name,
          },
          {
            name: personalInformation.items.emiratesID,
            value: customerModel.customer.nationalId,
          },
          {
            name: personalInformation.items.phoneNumber,
            value: customerModel.customer.phone,
          },
          {
            name: personalInformation.items.email,
            value: customerModel.customer.email,
          },
        ]}
      />
      <Button className={css.logout} onClick={handleLogout} theme="noBorder">
        {i18n().profile.logout}
      </Button>
    </div>
  );
});
