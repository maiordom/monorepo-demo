import React, { useEffect } from 'react';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

import Slider from 'ui-kit/components/Slider';
import PaymentStateShort from 'ui-kit/components/PaymentStateShort';

import analytics from 'src/analytics';
import { MIN_WIDTH } from 'src/constants';
import customerPurchasesModel from 'core/entities/Customer/models/Purchases';

interface IProps {
  onClick: (paymentState: IPaymentState) => void;
}

import css from './NotDueYet.css';

export default ({ onClick }: IProps) => {
  useEffect(() => {
    customerPurchasesModel.store.notDueYet.items.forEach(purchase => {
      analytics.events.main.showNotDueYetPurchaseSnippet(purchase);
    });
  }, []);

  return (
    <Slider
      sliderOptions={{
        spaceBetween: 14,
        slidesPerView: 'auto',
        grabCursor: true,
        watchOverflow: true,
        breakpoints: {
          [MIN_WIDTH]: {
            spaceBetween: 27,
          },
        },
      }}
      className={css.container}
    >
      {customerPurchasesModel.store.notDueYet.items.map(item => (
        <PaymentStateShort
          onClick={onClick}
          key={item.id}
          paymentState={item}
        />
      ))}
    </Slider>
  );
};
