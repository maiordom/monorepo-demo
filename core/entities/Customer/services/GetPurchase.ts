import { AxiosResponse } from 'axios';

import { IPaymentState } from '../types/PaymentState';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request from '../../../utils/Request';
import routes from '../../../routes';

interface IUrlParams {
  id: string;
  installmentsCountToPay: string;
}

export default (urlParams: IUrlParams) =>
  request
    .call(routes.customer.getPurchase(urlParams))
    .then(
      (res: AxiosResponse<IPaymentState>) =>
        camelcaseKeys(res.data) as IPaymentState
    )
    .then(purchase => {
      purchase.order.shippingAmount = parseFloat(
        String(purchase.order.shippingAmount)
      );
      purchase.product.installmentPeriodType = {
        monthly: purchase.product.installmentPeriod === 'P1M',
        beweekly: purchase.product.installmentPeriod === 'P2W',
      };
      purchase.loan.installments.forEach((installment, index) => {
        installment.toPay = installment.checked && !installment.isOverdue;
        installment.id = String(purchase.id + index);
      });

      return purchase;
    });
