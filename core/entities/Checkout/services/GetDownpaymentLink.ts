import { AxiosResponse } from 'axios';

import snakecaseKeys from '../../../utils/SnakecaseKeys';
import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request from '../../../utils/Request';
import routes from '../../../routes';

export interface IResponse {
  paymentUrl: string;
}

export interface IUrlParams {
  redirectUrl: string;
  cancelUrl: string;
}

export default (sessionId: string, params: IUrlParams) =>
  request
    .call(routes.checkout.getDownpaymentLink(sessionId, snakecaseKeys(params)))
    .then((res: AxiosResponse<IResponse>) =>
      camelcaseKeys<IResponse>(res.data)
    );
