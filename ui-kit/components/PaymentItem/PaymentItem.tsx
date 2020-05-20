import React from 'react';
import classnames from 'classnames';

import { IPaymentItem } from 'core/entities/Customer/types/PaymentItem';

import Price from '../Price';

import css from './PaymentItem.css';

interface IProps {
  item: IPaymentItem;
  currency: string;
}

export default ({
  item: { imageUrl, unitPrice, title, quantity },
  currency,
}: IProps) => (
  <div className={css.container}>
    {imageUrl ? (
      <img className={css.image} src={imageUrl} />
    ) : (
      <div className={classnames(css.image, css.empty)} />
    )}
    <div className={css.title}>{title}</div>
    {quantity > 1 ? (
      <div className={css.quantity}>&nbsp;X{quantity}</div>
    ) : null}
    <Price
      theme="small"
      className={css.price}
      amount={parseFloat(unitPrice) * quantity}
      currency={currency}
    />
  </div>
);
