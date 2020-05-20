import React from 'react';
import classnames from 'classnames';

import { IInstallmentPlan } from 'core/entities/Customer/types/InstallmentPlan';

interface IProps {
  items: IInstallmentPlan[];
  className?: string;
}

import css from './InstallmentsPreview.css';

export default ({ items, className }: IProps) => (
  <div className={classnames(css.installments, className)}>
    {items.map(installment => {
      const { id, toPay, isPaid, isOverdue } = installment;
      const statuses = { toPay, isPaid, isOverdue };
      const status =
        Object.keys(statuses).find(status => statuses[status]) || 'default';

      return <div key={id} className={classnames(css.item, css[status])}></div>;
    })}
  </div>
);
