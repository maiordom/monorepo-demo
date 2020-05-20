import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import CodeForm from 'ui-kit/components/CodeForm';
import Timer from 'ui-kit/components/Timer';
import Timeline from 'ui-kit/components/Timeline';

import plural from 'ui-kit/utils/Plural';
import t from 'ui-kit/utils/Interpolate';
import i18n from 'src/locales';
import model from 'src/model';
import config from 'src/config';
import css from './Code.css';

interface IProps {
  className?: string;
  onCodeFullfilled: (code: string) => void;
  onResendCode: () => void;
  onCodeChanged: () => void;
  isSpinnerVisible: boolean;
}

export default observer(
  ({
    onCodeFullfilled,
    onResendCode,
    onCodeChanged,
    isSpinnerVisible,
    className,
  }: IProps) => {
    const handleTimerEnd = () => {
      model.setSendCodeStatus(true);
    };

    const handleTimerStart = () => {
      model.setSendCodeStatus(false);
    };

    return (
      <div className={className}>
        <CodeForm
          onCodeFocus={model.resetCheckoutCodeStatus}
          status={model.store.confirmationCodeStatus}
          statusMessage={model.store.confirmationCodeStatusMessage}
          onCodeFulfilled={onCodeFullfilled}
          onCodeChange={onCodeChanged}
          className={css.codeForm}
          i18n={i18n().codeForm}
        />
        {isSpinnerVisible && <Timeline className={css.spinner} />}
        {model.store.availableAttemptsSendCode > 0 && (
          <>
            {!isSpinnerVisible && (
              <>
                <div
                  onClick={onResendCode}
                  className={classnames(
                    css.sendAnotherCode,
                    model.store.isAvailableSendCode && css.active
                  )}
                >
                  {i18n().codeForm.sendAnotherCode}
                </div>
                <Timer
                  key={model.store.availableAttemptsSendCode}
                  onTimerStart={handleTimerStart}
                  onTimerEnd={handleTimerEnd}
                  className={css.timer}
                  units={i18n().timer.units}
                  maxTime={config.sendCheckoutCodeTimer}
                />
              </>
            )}
            {model.store.attemptsSendCode >
              model.store.availableAttemptsSendCode && (
              <div className={css.attempts}>
                {t(i18n().codeForm.attempts, {
                  attempts: model.store.availableAttemptsSendCode,
                  attemptPluralForm: plural(
                    model.store.availableAttemptsSendCode,
                    i18n().codeForm.attemptPluralForm
                  ),
                })}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
