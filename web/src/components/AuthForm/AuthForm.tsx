import React, { useState } from 'react';
import { observer } from 'mobx-react';
import once from 'lodash/once';

import Input from 'ui-kit/components/Input';
import Button from 'ui-kit/components/Button';

import clearPhone from 'core/utils/ClearPhone';
import analytics from 'src/analytics';
import journalModel from 'core/entities/Journal/model';
import authModel from 'core/entities/Auth/model';
import i18n from 'src/locales';
import css from './AuthForm.css';

interface IProps {
  className?: string;
}

const loginOptions = {
  regex: String.raw`\+971 [1-9]\d-\d\d\d-\d\d\d\d`,
  placeholder: '_',
  autoUnmask: true,
};

const validatePhone = (value: string) =>
  value ? value.length === 9 && value[0] === '5' : false;

const handleLoginFirstChange = once(() => {
  analytics.events.login.loginFirstChange();
});

export default observer(({ className }: IProps) => {
  const [phone, setPhone] = useState();
  const [error, setError] = useState();
  const [isPhoneValid, setPhoneValidation] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    setError(null);

    try {
      await authModel.sendCode({ phone });
    } catch (exx) {
      if (exx.code === 400) {
        setError(i18n().auth.form.errors.incorrectPhone);
      } else {
        setError(i18n().auth.form.errors.somethingWrong);
      }
    }
  };

  const handlePhoneChange = (phone: string) => {
    handleLoginFirstChange();
    setError(null);
    setPhoneValidation(validatePhone(clearPhone(phone)));
    setPhone(phone);
  };

  const handleBlur = () => {
    if (!isPhoneValid && phone && phone.length) {
      setError(i18n().auth.form.errors.invalidPhone);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <Input
        type="tel"
        formatOptions={loginOptions}
        className={css.login}
        placeholder={i18n().auth.form.loginPlaceholder}
        onChange={phone => handlePhoneChange(phone)}
        onBlur={handleBlur}
      />
      <Button
        type="submit"
        isLoading={journalModel.journal?.sendCode?.isLoading}
        disabled={!isPhoneValid}
        className={css.submit}
        onClick={handleSubmit}
      >
        {i18n().auth.form.submit}
      </Button>
      {error && <div className={css.error}>{error}</div>}
    </form>
  );
});
