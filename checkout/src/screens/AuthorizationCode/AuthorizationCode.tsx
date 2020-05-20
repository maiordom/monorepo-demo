import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Progress from 'src/components/Progress';
import Code from 'src/components/Code';

import { IError as IErrorResponse } from 'core/utils/Request';

import clearPhone from 'core/utils/ClearPhone';
import maskPhone from 'core/utils/MaskPhone';
import journalModel from 'core/entities/Journal/model';
import t from 'ui-kit/utils/Interpolate';
import i18n from 'src/locales';
import model from 'src/model';
import css from './AuthorizationCode.css';
import analytics from 'src/analytics';

export default observer(() => {
  const [phone, setPhone] = useState();
  const isSpinnerVisible =
    journalModel.journal?.updateCheckout?.isLoading ||
    journalModel.journal?.sendCheckoutCode?.isLoading;

  const handleCodeFullFilled = (code: string) => {
    try {
      model.confirmationCode = code;
      model.resetCheckoutCodeStatus();
      model.updateCheckout();
      analytics.events.codeVerification.codeFilled();
    } catch (exx) {
      const res: IErrorResponse<any> = exx;

      if (res.code !== 400) {
        model.store.confirmationCodeStatusMessage = 'somethingWrong';
      }

      analytics.events.codeVerification.codeError();
    }
  };

  const handleCodeChanged = () => {
    analytics.events.codeVerification.firstChange();
  };

  const handleResendCode = () => {
    if (model.store.isAvailableSendCode) {
      analytics.events.codeVerification.sendCode();
      model.sendCheckoutCode({ isUserAction: true });
    }
  };

  useEffect(() => {
    analytics.events.codeVerification.pageOpen();

    return () => {
      analytics.events.codeVerification.pageClose();
    };
  }, []);

  useEffect(() => {
    analytics.events.codeVerification.pageOpen();

    const phone = maskPhone(
      clearPhone(model.store.checkoutParams.customer.phone),
      'aed'
    );

    setPhone(phone);

    return () => {
      analytics.events.codeVerification.pageClose();
    };
  }, []);

  return (
    <div className={css.container}>
      {model.store.checkoutParams.customer.scan && (
        <Progress className={css.progress} progress={100} />
      )}
      <div className={css.title}>{i18n().authorizationCode.title}</div>
      <div
        className={css.description}
        dangerouslySetInnerHTML={{
          __html: t(i18n().authorizationCode.description, {
            amountToPay:
              model.store.configuration.availableProducts.payLater[0]
                .amountToPay,
            currency: model.store.configuration.currency,
            phone,
            serviceFee:
              model.store.configuration.availableProducts.payLater[0]
                .serviceFee,
          }).join(''),
        }}
      />
      <Code
        className={css.codeForm}
        onCodeFullfilled={handleCodeFullFilled}
        onCodeChanged={handleCodeChanged}
        onResendCode={handleResendCode}
        isSpinnerVisible={isSpinnerVisible}
      />
    </div>
  );
});
