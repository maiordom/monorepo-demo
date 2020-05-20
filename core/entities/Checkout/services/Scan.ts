import { AxiosResponse } from 'axios';

import camelcaseKeys from '../../../utils/CamelcaseKeys';
import request from '../../../utils/Request';
import routes from '../../../routes';

export interface IResponse {
  sex: string;
  scanId: string;
  country: string;
  age: number;
  name: string;
  nationality: string;
  nationalId: string;
}

export default (image: File) => {
  const data = new FormData();

  data.append('scan', image);

  return request
    .call(routes.checkout.scan(), data)
    .then((res: AxiosResponse<IResponse>) =>
      camelcaseKeys<IResponse>(res.data)
    );
};
