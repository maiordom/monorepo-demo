module.exports = {
  status: 'approved',
  rejection_reason_code: 'not_available',
  configuration: {
    currency: 'AED',
    new_customer: true,
    available_products: {
      installments: [
        {
          installments_count: 1,
          installment_period: 'P1M',
          downpayment: '20.00',
          amount_to_pay: '100.50',
          service_fee: '10.30',
          next_payment_date: '2020-04-10T00:00:00Z',
          pay_per_installment: '100.50',
        },
        {
          installments_count: 6,
          installment_period: 'P2W',
          downpayment: '50.00',
          amount_to_pay: '200.50',
          service_fee: '20.00',
          next_payment_date: '2020-04-10T00:00:00Z',
          pay_per_installment: '23.55',
        },
      ],
      pay_later: [
        {
          installments_count: 1,
          installment_period: 'P1M',
          downpayment: '20.00',
          amount_to_pay: '100.50',
          service_fee: '10.30',
          next_payment_date: '2020-04-10T00:00:00Z',
        },
      ],
    },
  },
  errors: [
    {
      field: '$.customer.scan',
      name: 'scan',
      code: 'required',
    },
  ],
  payment: {
    amount: 1000,
    buyer: {
      dob: '1987-10-20',
      email: '',
      name: 'John Doe',
      phone: '123456789',
    },
    buyer_history: {
      loyalty_level: 10,
      registered_since: '2019-10-05T17:45:17+00:00',
      wishlist_count: 421,
    },
    currency: 'AED',
    description: 'Tabby Store Order #3',
    order: {
      items: [
        {
          description: 'To be displayed in Tabby order information',
          product_url: 'https://tabby.store/p/SKU123',
          quantity: 1,
          reference_id: 'SKU123',
          title: 'Sample Item #1',
          unit_price: '300',
        },
        {
          description: 'To be displayed in Tabby order information',
          product_url: 'https://tabby.store/p/SKU124',
          quantity: 1,
          reference_id: 'SKU124',
          title: 'Sample Item #2',
          unit_price: '9000',
        },
      ],
      reference_id: '#xxxx-xxxxxx-xxxx',
      shipping_amount: '50',
      tax_amount: '500',
    },
    order_history: [
      {
        amount: '1000',
        buyer: {
          name: 'John Doe',
          phone: '+971-505-5566-33',
        },
        items: [
          {
            quantity: 4,
            title: 'Sample Item #3',
            unit_price: '250',
          },
        ],
        payment_method: 'CoD',
        purchased_at: '2019-10-05T18:45:17+00:00',
        shipping_address: {
          address: 'Sample Address #1',
          city: 'Dubai',
        },
        status: 'CAPTURED',
      },
    ],
    shipping_address: {
      address: 'Sample Address #2',
      city: 'Dubai',
    },
  },
};
