import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import { Logo } from 'src/components/Layout';
import Terms from 'src/components/Terms';
import Button from 'ui-kit/components/Button';
import { Belt } from 'src/components/Layout';
import Features from 'src/components/Features';
import Footer from 'src/components/Footer';

import getInstallmentsFeatures from './utils/GetInstallmentsFeatures';
import journalModel from 'core/entities/Journal/model';
import model from 'src/model';
import i18n from 'src/locales';
import analitycs from 'src/analytics';
import css from './WelcomeBack.css';

export default observer(() => {
  const [termsAccepted, setTerms] = useState(false);

  useEffect(() => {
    analitycs.events.welcome.pageOpen();

    return () => {
      analitycs.events.welcome.pageClose();
    };
  }, []);

  const handleCallToActionClick = () => {
    model.updateCheckout();
    analitycs.events.welcome.buyNow();
  };

  const handleBackClick = () => {
    model.pushHistory('checkout');
    analitycs.events.welcome.logInWithDifferentAccount();
  };

  const handleTermsChange = (checked: boolean) => {
    setTerms(checked);
  };

  return (
    <>
      <Features items={getInstallmentsFeatures()} />
      <Belt className={css.container}>
        <Logo className={css.logo} />
        <div className={css.title}>{i18n().welcomeBack.title}</div>
        <div className={css.helloCat} />
        <Terms onChange={handleTermsChange} className={css.terms} />
        <Button
          disabled={!termsAccepted}
          isLoading={journalModel.journal?.updateCheckout?.isLoading}
          className={css.callToAction}
          onClick={handleCallToActionClick}
        >
          {i18n().welcomeBack.callToAction}
        </Button>
        <Button className={css.back} theme="gray" onClick={handleBackClick}>
          {i18n().welcomeBack.back}
        </Button>
        <Footer />
      </Belt>
    </>
  );
});
