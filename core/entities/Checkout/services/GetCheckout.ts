import { AxiosResponse } from 'axios';

import { IPayment } from '../types/Payment';
import { IConfiguration } from '../types/Configuration';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request, { IError } from '../../../utils/Request';
import routes from '../../../routes';

export interface IResponse {
  status: string;
  payment: IPayment;
  warnings: {
    name: string;
    code: string;
    field: string;
  }[];
  configuration: IConfiguration;
  merchantUrls: {
    success: string;
    cancel: string;
    failure: string;
  };
}

type IErrors = {
  field: string;
  code: string;
}[];

export interface IRequestParams {
  sessionId: string;
}

export type IErrorResponse = IError<{
  errors: IErrors;
}>;

export default ({ sessionId }: IRequestParams) =>
  request
    .call(routes.checkout.getCheckout({ sessionId }))
    .then((res: AxiosResponse<IResponse>) =>
      camelcaseKeys<IResponse>(res.data, ['payment'])
    )
    .then(({ warnings, ...params }) => ({
      ...params,
      warnings: warnings || [],
    }));
