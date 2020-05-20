import React from 'react';
import classnames from 'classnames';

import css from './Price.css';

interface IProps {
  theme?: string;
  amount: number | string;
  currency: string;
  className?: string;
}

export default ({ amount, currency, className, theme = 'default' }: IProps) => (
  <div className={classnames(className, css[theme])}>
    <span className={css.amount}>{amount}</span>
    <span>&nbsp;</span>
    <span className={css.currency}>{currency}</span>
  </div>
);
