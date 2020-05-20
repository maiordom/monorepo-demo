```js
<div>
  <PaymentWidget
    i18n={{
      paid: 'Paid',
    }}
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
        installments: [],
      },
      status: 'paid',
      nextPaidDate: '2019-12-12',
      paidDate: '2019-12-12',
      merchant: {
        logo: null,
        name: 'Noon',
      },
      currency: 'AED',
    }}
  />
  <div style={{ marginTop: 20 }}>
    <PaymentWidget
      i18n={{
        paid: 'Paid',
      }}
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
          installments: [],
        },
        status: 'to_pay',
        nextPaidDate: '2019-12-12',
        paidDate: '2019-12-12',
        merchant: {
          logo: null,
          name: 'Noon',
        },
        currency: 'AED',
      }}
    />
  </div>
</div>
```
