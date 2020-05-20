import React from 'react';
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';
import { useMediaPredicate } from 'react-media-hook';
import classnames from 'classnames';

import Button from 'ui-kit/components/Button';
import Footer from 'ui-kit/components/Footer';

import { MIN_WIDTH } from 'src/constants';
import css from './PayPurchaseSuccess.css';
import t from 'ui-kit/utils/Interpolate';
import i18n from 'src/locales';
import clientRoutes from 'src/routes/client';

export default () => {
  const { search } = useLocation();
  const history = useHistory();
  const { amount, currency } = queryString.parse(search);
  const isMinWidth = useMediaPredicate(`(max-width: ${MIN_WIDTH - 1}px)`);

  const handleCallToActionClick = () => {
    history.push(clientRoutes.common);
  };

  return (
    <div className={css.container}>
      <div className={css.inner}>
        <div className={css.statusSuccess} />
        <div className={css.title}>
          {t(i18n().paymentSuccessful.title, {
            amount: String(amount),
            currency: String(currency),
          })}
        </div>
        <div className={css.description}>
          {i18n().paymentSuccessful.description}
        </div>
        <Button onClick={handleCallToActionClick} className={css.callToAction}>
          {i18n().paymentSuccessful.callToAction}
        </Button>
        <Footer
          className={classnames(
            css.footer,
            css[isMinWidth ? 'fixed' : 'default']
          )}
        />
      </div>
    </div>
  );
};
