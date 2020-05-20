```js
const i18n = {
  pay: 'Pay',
  paymentOverdue: 'Payment Overdue',
};

<div style={{ maxWidth: 270 }}>
  <PaymentCard
    i18n={i18n}
    paymentState={{
      order: {
        number: '94e7345c-1a10-4a3b-90e2-ea89c661d520',
        shippingAddress: {
          city: 'Dubai',
          address: '123 Villa De Cyberna',
        },
      },
      loan: {
        amountToPay: '157.00',
        installments: [
          {
            dueDate: '2020-02-18T00:00:00Z',
            amountToPay: '133',
            toPay: true,
            isPaid: false,
            isOverdue: false,
            checked: true,
          },
        ],
      },
      product: {
        productType: 'pay-later',
      },
      status: 'paid',
      nextPaidDate: '2019-12-12',
      merchant: {
        logo: null,
        name: 'Noon',
      },
      currency: 'AED',
    }}
  />
</div>;
```
