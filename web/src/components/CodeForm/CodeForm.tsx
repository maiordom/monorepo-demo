import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import once from 'lodash/once';

import CodeForm from 'ui-kit/components/CodeForm';
import Timer from 'ui-kit/components/Timer';
import Spinner from 'ui-kit/components/Spinner';

import analytics from 'src/analytics';
import plural from 'ui-kit/utils/Plural';
import t from 'ui-kit/utils/Interpolate';
import authModel from 'core/entities/Auth/model';
import i18n from 'src/locales';
import journalModel from 'core/entities/Journal/model';
import config from 'src/config';
import css from './CodeForm.css';

interface IProps {
  className?: string;
  onLogin: () => void;
}

const handleCodeChange = once(() => {
  analytics.events.login.codeFirstChange();
});

export default observer(({ onLogin, className }: IProps) => {
  const isSpinnerVisible =
    journalModel.journal?.sendCode?.isLoading ||
    journalModel.journal?.login?.isLoading;

  const handleCodeFullFilled = async (code: string) => {
    try {
      await authModel.login({ code });
      onLogin();
      analytics.events.login.codeFilled();
    } catch (_) {
      analytics.events.login.codeError();
    }
  };

  const handleTimerEnd = () => {
    authModel.setSendCodeStatus(true);
  };

  const handleTimerStart = () => {
    authModel.setSendCodeStatus(false);
  };

  return (
    <div className={className}>
      <CodeForm
        onCodeChange={handleCodeChange}
        testId="code-form"
        onCodeFocus={authModel.resetCodeStatus}
        status={authModel.store.codeStatus}
        statusMessage={authModel.store.codeStatusMessage}
        onCodeFulfilled={handleCodeFullFilled}
        i18n={i18n().auth.codeForm}
      />
      {isSpinnerVisible && <Spinner className={css.spinner} />}
      {authModel.store.availableAttemptsSendCode > 0 && (
        <>
          <SendAnotherCode />
          <Timer
            key={authModel.store.availableAttemptsSendCode}
            onTimerEnd={handleTimerEnd}
            onTimerStart={handleTimerStart}
            className={classnames(css.timer, isSpinnerVisible && css.hidden)}
            units={i18n().auth.timer.units}
            maxTime={config.sendCodeTimer}
          />
          {authModel.store.attemptsSendCode >
            authModel.store.availableAttemptsSendCode && (
            <div className={css.attempts}>
              {t(i18n().auth.codeForm.attempts, {
                attempts: authModel.store.availableAttemptsSendCode,
                attemptPluralForm: plural(
                  authModel.store.availableAttemptsSendCode,
                  i18n().auth.codeForm.attemptPluralForm
                ),
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
});

const SendAnotherCode = observer(() => {
  const handleSendAnotherCode = () => {
    if (authModel.store.isAvailableSendCode) {
      authModel.resendCode();
    }
  };

  const isSpinnerVisible =
    journalModel.journal?.sendCode?.isLoading ||
    journalModel.journal?.login?.isLoading;

  return (
    <div
      onClick={handleSendAnotherCode}
      className={classnames(
        css.sendAnotherCode,
        authModel.store.isAvailableSendCode && css.active,
        isSpinnerVisible && css.hidden
      )}
    >
      {i18n().auth.codeForm.sendAnotherCode}
    </div>
  );
});
