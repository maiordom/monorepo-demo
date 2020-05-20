import iso8601 from 'iso8601-js-period';

export default (period: string) => {
  const [, months, weeks] = iso8601.Period.parse(period);

  return {
    period: {
      months,
      weeks,
    },
  };
};
