import stringMask from 'string-mask';

const masks = {
  aed: '+$971 00-000-0000',
};

export default (phone: string, country: string) => {
  const formatter = new stringMask(masks[country]);

  return formatter.apply(phone);
};
