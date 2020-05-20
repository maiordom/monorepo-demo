import request from '../../../utils/Request';
import routes from '../../../routes';

export interface IRequestParams {
  phone: string;
}

export default (data: IRequestParams) =>
  request.call(routes.auth.sendCode(), data);
