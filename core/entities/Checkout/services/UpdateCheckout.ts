import { AxiosResponse } from 'axios';
import snakecaseKeys from 'snakecase-keys';
import camelcase from 'camelcase';

import { ICustomer } from '../types/Customer';
import { IPayment } from '../types/Payment';
import { IConfiguration } from '../types/Configuration';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request, { IError as IRequestError } from '../../../utils/Request';
import routes from '../../../routes';

export interface IUrlParams {
  sessionId: string;
}

interface IResponse {
  id: string;
  status: string;
  payment: IPayment;
  rejectionReasonCode: string;
  configuration: IConfiguration;
}

interface IJuicyscore {
  useragent: string;
  timeZone: string;
  referrer: string;
  sessionId: string;
}

export type IErrorByField = {
  name: string;
  field: string;
  code: string;
};

type IErrors = IErrorByField[];

export type IErrorResponse = IRequestError<{
  errors: IErrors;
}>;

interface IParams {
  customer: ICustomer;
  payment: IPayment;
  juicyscore: IJuicyscore;
  productType?: string;
  confirmationCode?: string;
  productOptionId?: number;
}

export default (urlParams: IUrlParams, params: IParams) =>
  request
    .call(
      routes.checkout.updateCheckout(urlParams),
      snakecaseKeys(params as any)
    )
    .then((res: AxiosResponse<IResponse>) => {
      const data = camelcaseKeys<IResponse>(res.data, ['payment']);

      if (data.rejectionReasonCode) {
        data.rejectionReasonCode = camelcase(data.rejectionReasonCode);
      }

      return data;
    });
