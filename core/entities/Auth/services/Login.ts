import snakecaseKeys from 'snakecase-keys';
import { AxiosResponse } from 'axios';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request from '../../../utils/Request';
import routes from '../../../routes';

export interface IRequestParams {
  phone: string;
  confirmationCode: string;
}

interface IResponse {
  authToken: string;
}

export default (data: IRequestParams) =>
  request
    .call(routes.auth.login(), snakecaseKeys(data as any))
    .then(
      (res: AxiosResponse<IResponse>) => camelcaseKeys(res.data) as IResponse
    );
