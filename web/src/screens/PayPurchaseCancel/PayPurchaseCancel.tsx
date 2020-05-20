import React from 'react';
import { useLocation, useHistory, useParams } from 'react-router';
import queryString from 'query-string';
import { useMediaPredicate } from 'react-media-hook';
import classnames from 'classnames';

import Button from 'ui-kit/components/Button';
import Footer from 'ui-kit/components/Footer';

import { MIN_WIDTH } from 'src/constants';
import css from './PayPurchaseCancel.css';
import t from 'ui-kit/utils/Interpolate';
import i18n from 'src/locales';
import clientRoutes, { getRoute } from 'src/routes/client';

export default () => {
  const { search } = useLocation();
  const history = useHistory();
  const { id } = useParams();
  const { amount, currency } = queryString.parse(search);
  const isMinWidth = useMediaPredicate(`(max-width: ${MIN_WIDTH - 1}px)`);

  const handleCallToActionClick = () => {
    if (id === 'all') {
      history.push(clientRoutes.payAll);
    } else {
      history.push(getRoute(clientRoutes.payPurchase, { id }));
    }
  };

  return (
    <div className={css.container}>
      <div className={css.inner}>
        <div className={css.statusRejected} />
        <div className={css.title}>
          {t(i18n().paymentCancel.title, {
            amount: String(amount),
            currency: String(currency),
          })}
        </div>
        <div className={css.description}>
          {i18n().paymentCancel.description}
        </div>
        <Button onClick={handleCallToActionClick} className={css.callToAction}>
          {i18n().paymentCancel.callToAction}
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
