import { AxiosResponse } from 'axios';

import { ICustomerSummary } from '../types/CustomerSummary';

import request from '../../../utils/Request';
import camelcaseKeys from '../../../utils/CamelcaseKeys';
import routes from '../../../routes';

interface IResponse extends ICustomerSummary {}

export default () =>
  request
    .call(routes.customer.summary())
    .then((res: AxiosResponse<IResponse>) => {
      const result = camelcaseKeys(res.data) as ICustomerSummary;

      result.debt.overdue = parseFloat(String(result.debt.overdue));
      result.debt.total = parseFloat(String(result.debt.total));
      result.creditLimit.available = parseFloat(
        String(result.creditLimit.available)
      );
      result.creditLimit.total = parseFloat(String(result.creditLimit.total));
      result.walletBalance = parseFloat(String(result.walletBalance));

      return result;
    });
