import React, { useState } from 'react';
import classnames from 'classnames';

import PaymentWidget from '../PaymentWidget';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

interface IProps {
  className?: string;
  paymentState: IPaymentState;
  onClick: (paymentState: IPaymentState) => void;
}

import css from './PaymentStateShort.css';

export default ({ className, paymentState, onClick }: IProps) => {
  const [isToggled, toggle] = useState(false);

  const handleClick = () => {
    toggle(!isToggled);

    onClick(paymentState);
  };

  return (
    <div className={classnames(css.container, className)}>
      <PaymentWidget
        hidePayButton
        className={css.widget}
        align="center"
        paymentState={paymentState}
        onClick={handleClick}
      />
    </div>
  );
};
