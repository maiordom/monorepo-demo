import { AxiosResponse } from 'axios';
import snakecaseKeys from 'snakecase-keys';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request from '../../../utils/Request';
import routes from '../../../routes';

export interface IRequestParams {
  purchases: {
    [key: string]: string;
  };
  cancelUrl: string;
  redirectUrl: string;
}

interface IResponse {
  paymentUrl: string;
}

export default ({ cancelUrl, redirectUrl, purchases }: IRequestParams) =>
  request
    .call(routes.customer.getPaymentUrl(), {
      purchases,
      ...snakecaseKeys({ cancelUrl, redirectUrl } as any),
    })
    .then(
      (res: AxiosResponse<IResponse>) => camelcaseKeys(res.data) as IResponse
    );
