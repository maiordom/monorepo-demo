import qs from 'qs';

const root = `/app`;

const clientRoutes = {
  common: `${root}/`,
  somethingWentWrong: `${root}/500`,
  auth: `${root}/auth`,
  profile: `${root}/profile`,
  support: `${root}/support`,
  payAll: `${root}/pay/all`,
  payPurchase: `${root}/pay/purchase/:id`,
  payPurchaseSuccess: `${root}/pay/purchase/:id/success`,
  payPurchaseCancel: `${root}/pay/purchase/:id/cancel`,
};

export const getRoute = (
  route: string,
  params: { [key: string]: string | number },
  queryParams: { [key: string]: string | number } = {}
) => {
  let url = Object.keys(params).reduce(
    (clientRoute, key) => clientRoute.replace(`:${key}`, String(params[key])),
    route
  );

  if (Object.keys(queryParams).length) {
    url += `?${qs.stringify(queryParams)}`;
  }

  return url;
};

export default clientRoutes;
