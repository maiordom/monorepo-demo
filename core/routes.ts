import qs from 'qs';
import snakecaseKeys from 'snakecase-keys';

import { IUrlParams as IGetDownpaymentLinkUrlParams } from './entities/Checkout/services/GetDownpaymentLink';
import { IUrlParams as IUpdateCheckoutUrlParams } from './entities/Checkout/services/UpdateCheckout';
import { IUrlParams as ISendCheckoutCodeUrlParams } from './entities/Checkout/services/SendCheckoutCode';
import { IUrlParams as IGetPurchasesUrlParams } from './entities/Customer/services/GetPurchases';
import { IRequestParams as IGetCheckoutRequestParams } from './entities/Checkout/services/GetCheckout';

import { IRequestConfig as IRoute } from './utils/Request';

type TRouteHandlerOriginal = (params: any) => IRoute;
export type TRouteHandler = TRouteHandlerOriginal & { routeName?: string };

export const routes = {
  checkout: {
    getDownpaymentLink: (
      sessionId: string,
      params: IGetDownpaymentLinkUrlParams
    ) => ({
      method: 'GET',
      url: `/v2/checkout/${sessionId}/downpayment?${qs.stringify(params)}`,
    }),
    getCheckout: ({ sessionId }: IGetCheckoutRequestParams) => ({
      method: 'GET',
      url: `/v2/checkout/${sessionId}`,
    }),
    createCheckout: () => ({
      method: 'POST',
      url: '/v2/checkout',
    }),
    updateCheckout: ({ sessionId }: IUpdateCheckoutUrlParams) => ({
      method: 'PUT',
      url: `/v2/checkout/${sessionId}`,
    }),
    sendCheckoutCode: ({ sessionId }: ISendCheckoutCodeUrlParams) => ({
      method: 'POST',
      url: `/v2/checkout/${sessionId}/send_code`,
    }),
    scan: () => ({
      method: 'POST',
      url: '/v1/checkout/identity/scan',
    }),
  },
  customer: {
    getPurchases: (params: IGetPurchasesUrlParams) => ({
      method: 'GET',
      url: `/v2/customer/purchases?${qs.stringify(params)}`,
    }),
    getPaymentUrl: () => ({
      method: 'POST',
      url: `/v2/customer/repayment`,
    }),
    getPurchase: ({ id, installmentsCountToPay }) => ({
      method: 'GET',
      url: `/v2/customer/purchases/${id}?${qs.stringify(
        snakecaseKeys({ installmentsCountToPay })
      )}`,
    }),
    summary: () => ({
      method: 'GET',
      url: '/v1/customer/summary',
    }),
    customer: () => ({
      method: 'GET',
      url: '/v1/customer',
    }),
  },
  auth: {
    login: () => ({
      url: '/v1/auth/login',
      method: 'POST',
    }),
    sendCode: () => ({
      url: '/v1/auth/send_code',
      method: 'POST',
    }),
  },
};

for (const routesGroupKey in routes) {
  for (const routeName in routes[routesGroupKey]) {
    const route = routes[routesGroupKey][routeName];

    const routeHandler: TRouteHandler = function(...args) {
      const newRoute = Object.assign({
        routeName,
        urlParams: args[0],
        ...route(...args),
      });

      return newRoute;
    };

    routeHandler.routeName = routeName;
    routes[routesGroupKey][routeName] = routeHandler;

    route.routeName = routeName;
  }
}

export default routes;
