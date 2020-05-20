import { AxiosResponse } from 'axios';

import { ICustomer } from '../types/Customer';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request from '../../../utils/Request';
import routes from '../../../routes';

export default () =>
  request
    .call(routes.customer.customer())
    .then(
      (res: AxiosResponse<ICustomer>) => camelcaseKeys(res.data) as ICustomer
    );
