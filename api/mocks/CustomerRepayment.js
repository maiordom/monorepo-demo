module.exports = {
  purchases: [
    {
      id: '10',
      status: 'paid',
      order_number: 'string',
      merchant: {
        url: null,
        name: 'string',
      },
      shipping_address: {
        city: 'string',
        address: 'string',
        zip: 'string',
      },
      currency: 'AED',
      amount: '1000.00',
      discount: '1000.00',
      shipping_amount: '10.00',
      service_fee: '5.00',
      late_fee: '0.00',
      refund_amount: '0.00',
      tax_amount: '0.00',
      is_overdue: false,
      paid_date: '2019-12-25T06:16:30Z',
      next_paid_date: '2019-12-25T06:16:30Z',
      items: [
        {
          title: 'string',
          description: 'string',
          unit_price: '0.00',
          quantity: 0,
          image_url: null,
          product_url: null,
        },
      ],
    },
  ],
  payment_url:
    'https://paypage-uat.ngenius-payments.com/?code=8ad2daf8bc86d0a9',
};
