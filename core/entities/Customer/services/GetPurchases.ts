import { AxiosResponse } from 'axios';

import { IPaymentState } from '../types/PaymentState';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request from '../../../utils/Request';
import routes from '../../../routes';

export interface IUrlParams {
  status: string;
  limit: number;
  offset: number;
  sort: string;
}

interface IResponse {
  purchases: IPaymentState[];
}

export default (params: IUrlParams): Promise<IResponse> =>
  request
    .call(routes.customer.getPurchases(params))
    .then(
      (res: AxiosResponse<IResponse>) => camelcaseKeys(res.data) as IResponse
    )
    .then(res => ({
      purchases: res.purchases || [],
    }))
    .then(res => {
      res.purchases.forEach(purchase => {
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
      });

      return res;
    });
