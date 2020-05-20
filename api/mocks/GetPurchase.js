module.exports = {
  id: '',
  status: '',
  loan: {
    amount_to_pay: '1000.00',
    refunded_amount: '10.00',
    service_fee_per_installment: '5.00',
    installments: [
      {
        due_date: '2020-02-18T00:00:00Z',
        amount_to_pay: '100',
        to_pay: false,
        is_paid: true,
        is_overdue: false,
      },
      {
        due_date: '2020-02-18T00:00:00Z',
        amount_to_pay: '120',
        to_pay: false,
        is_paid: true,
        is_overdue: false,
      },
      {
        due_date: '2020-02-18T00:00:00Z',
        amount_to_pay: '133',
        to_pay: true,
        is_paid: false,
        is_overdue: false,
        checked: true,
      },
      {
        due_date: '2020-02-18T00:00:00Z',
        amount_to_pay: '140',
        to_pay: true,
        is_paid: false,
        is_overdue: false,
        checked: true,
      },
      {
        due_date: '2020-02-18T00:00:00Z',
        amount_to_pay: '150',
        to_pay: false,
        is_paid: false,
        is_overdue: false,
      },
      {
        due_date: '2020-02-18T00:00:00Z',
        amount_to_pay: '100',
        to_pay: false,
        is_paid: false,
        is_overdue: false,
      },
    ],
  },
  order: {
    number: '94e7345c-1a10-4a3b-90e2-ea89c661d520',
    shipping_amount: '10.00',
    shipping_address: {
      city: 'city',
      raw: 'raw',
      zip: 'zip',
    },
    items: [
      {
        title: 'Title',
        description: 'desc',
        quantity: 10,
        unit_price: '100.00',
        image_url: '',
        product_url: '',
      },
    ],
  },
  merchant: {
    url: '',
    name: 'merch',
  },
  product: {
    product_type: 'installments',
    installment_period: 'P2W',
  },
  currency: 'AED',
  paid_date: '2019-11-01T00:00:00Z',
};
