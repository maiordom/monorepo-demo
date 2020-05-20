import React, { useEffect } from 'react';

import Features from 'src/components/Features';
import BasicCheckout from 'src/components/BasicCheckout';
import Footer from 'src/components/Footer';

import analitycs from 'src/analytics';
import css from './Checkout.css';
import getInstallmentsFeatures from './utils/GetInstallmentsFeatures';

export default () => {
  useEffect(() => {
    analitycs.events.welcome.pageOpen();

    return () => {
      analitycs.events.welcome.pageClose();
    };
  }, []);

  return (
    <>
      <Features items={getInstallmentsFeatures()} />
      <div className={css.panel}>
        <BasicCheckout />
        <Footer />
      </div>
    </>
  );
};
