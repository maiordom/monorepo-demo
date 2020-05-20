import request from '../../../utils/Request';
import routes from '../../../routes';

export interface IUrlParams {
  sessionId: string;
}

export default (urlParams: IUrlParams) =>
  request.call(routes.checkout.sendCheckoutCode(urlParams));
