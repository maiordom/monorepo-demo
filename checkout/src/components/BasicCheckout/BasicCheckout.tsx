import React from 'react';
import { observer } from 'mobx-react';

import Input from 'ui-kit/components/Input';
import Button from 'ui-kit/components/Button';
import Terms from 'src/components/Terms';
import { Belt, Logo } from 'src/components/Layout';

import journalModel from 'core/entities/Journal/model';
import model, { IField } from 'src/model';
import config from 'src/config';
import css from './BasicCheckout.css';
import i18n from 'src/locales';
import analytics from 'src/analytics';

export default observer(() => {
  const handleFieldChange = (value: string, field: IField) => {
    model.setField(value, field);

    if (field.name === 'phone') {
      analytics.events.welcome.phoneFirstChange();
    } else if (field.name === 'email') {
      analytics.events.welcome.emailFirstChange();
    }
  };

  const handleTermsChange = (checked: boolean) => {
    model.setTerms(checked);
    analytics.events.welcome.termsToggle({ isChecked: checked });
  };

  const handlePayClick = () => {
    model.updateCheckout();
    analytics.events.welcome.signUp();
  };

  const handleFieldFocus = (field: IField) => {
    model.setResolvedField(field);
  };

  const handleFieldBlur = (field: IField) => {
    model.setTouchedField(field);

    const isValid = model.validateField(field);

    if (field.name === 'phone') {
      if (isValid) {
        analytics.events.welcome.phoneFilled();
      } else {
        analytics.events.welcome.phoneFailure();
      }
    } else if (field.name === 'email') {
      if (isValid) {
        analytics.events.welcome.emailFilled();
      } else {
        analytics.events.welcome.emailFailure();
      }
    }
  };

  return (
    <Belt>
      <Logo className={css.logo} />
      <>
        {Object.keys(model.store.fields).map(key => {
          const item = model.store.fields[key];

          return (
            <Field
              onFocus={() => {
                handleFieldFocus(item);
              }}
              inputType={
                config.checkout[item.name] &&
                config.checkout[item.name].inputType
              }
              {...item}
              key={key}
              onChange={(value: string) => {
                handleFieldChange(value, item);
              }}
              touched={item.touched}
              onBlur={() => handleFieldBlur(item)}
            />
          );
        })}
      </>
      <Terms onChange={handleTermsChange} className={css.terms} />
      <Button
        testId="sign-up-with-tabby"
        isLoading={journalModel.journal?.updateCheckout?.isLoading}
        onClick={handlePayClick}
        disabled={!model.store.isAvailableCheckout}
        className={css.submit}
      >
        {i18n().checkout.submit}
      </Button>
    </Belt>
  );
});

const Field = ({
  type,
  name,
  onChange,
  code,
  value,
  onFocus,
  onBlur,
  touched,
  inputType,
}: {
  type: string;
  name: string;
  onChange: (value: string) => void;
  code?: string;
  value?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  touched?: boolean;
  inputType?: string;
}) => (
  <div test-id="checkout-field" test-name={name} className={css.fieldWrapper}>
    <Input
      title={i18n().checkout.fields[name].title}
      onFocus={onFocus}
      value={value}
      onBlur={onBlur}
      type={inputType}
      onChange={(value: string) => {
        onChange(value);
      }}
      status={
        type === 'accepted'
          ? type
          : touched && ['error', 'pending'].includes(type)
          ? type
          : 'pending'
      }
      errorMessage={
        type === 'error' ? i18n().checkout.fields[name].status[code] : null
      }
      className={css.field}
      placeholder={i18n().checkout.fields[name].placeholder}
      formatOptions={
        config.checkout[name] && config.checkout[name].formatOptions
      }
    />
  </div>
);
