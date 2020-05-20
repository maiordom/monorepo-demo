import { AxiosResponse } from 'axios';

import { IPayment } from '../types/Payment';
import { ICustomer } from '../types/Customer';
import { IConfiguration } from '../types/Configuration';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request, { IError as IResponseError } from '../../../utils/Request';
import routes from '../../../routes';

export interface IResponse {
  status: string;
  payment: IPayment;
  id: string;
  warnings: {
    name: string;
    code: string;
    field: string;
  }[];
  configuration: IConfiguration;
}

type IErrors = IError[];

export type IError = {
  field: string;
  code: string;
  sessionId: string;
};

export type IErrorResponse = IResponseError<{
  errors: IErrors;
}>;

export default ({
  payment,
  customer,
}: {
  payment: IPayment;
  customer?: ICustomer;
}) =>
  request
    .call(routes.checkout.createCheckout(), {
      payment,
      customer,
    })
    .then((res: AxiosResponse<IResponse>) =>
      camelcaseKeys<IResponse>(res.data, ['payment'])
    )
    .then(({ warnings, ...params }) => ({
      ...params,
      warnings: warnings || [],
    }));
