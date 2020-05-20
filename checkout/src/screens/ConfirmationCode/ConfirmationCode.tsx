import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Code from 'src/components/Code';
import { Belt } from 'src/components/Layout';
import Progress from 'src/components/Progress';

import { IError as IErrorResponse } from 'core/utils/Request';

import clearPhone from 'core/utils/ClearPhone';
import maskPhone from 'core/utils/MaskPhone';
import journalModel from 'core/entities/Journal/model';
import t from 'ui-kit/utils/Interpolate';
import i18n from 'src/locales';
import model from 'src/model';
import css from './ConfirmationCode.css';
import analytics from 'src/analytics';

export default observer(() => {
  const [phone, setPhone] = useState();
  const isSpinnerVisible =
    journalModel.journal?.updateCheckout?.isLoading ||
    journalModel.journal?.sendCheckoutCode?.isLoading;

  const handleCodeFullfilled = (code: string) => {
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

  const getProgress = () => {
    if (model.store.configuration.newCustomer) {
      return 100 / 4;
    } else {
      return 100 / 2;
    }
  };

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
      <Progress className={css.progress} progress={getProgress()} />
      <Belt>
        <div className={css.title}>{i18n().confirmationCode.title}</div>
        <div className={css.description}>
          {t(i18n().confirmationCode.description, { phone })}
        </div>
        <Code
          className={css.codeForm}
          onCodeChanged={handleCodeChanged}
          isSpinnerVisible={isSpinnerVisible}
          onCodeFullfilled={handleCodeFullfilled}
          onResendCode={handleResendCode}
        />
      </Belt>
    </div>
  );
});
