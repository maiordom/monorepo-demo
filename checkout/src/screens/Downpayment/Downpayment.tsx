import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';

import Timeline from 'ui-kit/components/Timeline';
import Progress from 'src/components/Progress';

import i18n from 'src/locales';
import t from 'ui-kit/utils/Interpolate';
import getDownpaymentLink from 'core/entities/Checkout/services/GetDownpaymentLink';
import model from 'src/model';
import journalModel from 'core/entities/Journal/model';
import css from './Downpayment.css';

export default observer(() => {
  const [downpaymentLink, setDownpaymentLink] = useState();
  const iframeRef = useRef<HTMLIFrameElement>();

  const handleInit = async () => {
    try {
      const { paymentUrl } = await getDownpaymentLink(
        model.store.sessionId,
        model.downPaymentRedirectUrls
      );

      setDownpaymentLink(paymentUrl);
    } catch (_) {}
  };

  const pingIframe = () => {
    setTimeout(() => {
      iframeRef?.current?.contentWindow.postMessage('ping', '*');
      pingIframe();
    }, 1000);
  };

  const handleMessage = event => {
    if (['downpaymentSuccessful', 'downpaymentCanceled'].includes(event.data)) {
      model.updateCheckout();
      window.removeEventListener('message', handleMessage, false);
    }
  };

  useEffect(() => {
    handleInit();
    pingIframe();

    window.addEventListener('message', handleMessage, false);
  }, []);

  if (journalModel.journal?.getDownpaymentLink?.isLoading) {
    return (
      <div className={css.loader}>
        <Timeline />
      </div>
    );
  }

  if (journalModel.journal?.getDownpaymentLink?.isResolved) {
    return (
      <>
        {journalModel.journal?.updateCheckout?.isLoading && (
          <div className={css.loader}>
            <Timeline />
          </div>
        )}
        <div className={css.container}>
          <Progress className={css.progress} progress={100} />
          <div className={css.title}>
            {t(i18n().downpayment.title, {
              currency: model.store.configuration.currency,
              amount: model.selectedProductOption.downpayment,
            })}
          </div>
          <iframe
            className={css.iframe}
            frameBorder="0"
            ref={iframeRef}
            src={downpaymentLink}
          />
        </div>
      </>
    );
  }

  return null;
});
