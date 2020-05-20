```js
const PaymentStateShort = require('../PaymentStateShort').default;
const item = (
  <PaymentStateShort
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
        refundedAmount: 0,
        installments: [],
      },
      status: 'not_due_yet',
      nextPaidDate: '2019-12-12',
      merchant: {
        logo: null,
        name: 'Noon',
      },
      currency: 'AED',
    }}
  />
);

<Slider
  sliderOptions={{
    500: {
      spaceBetween: 27,
    },
    spaceBetween: 14,
    slidesPerView: 'auto',
    grabCursor: true,
    watchOverflow: true,
  }}
  className="notDueYet"
>
  {item}
  {item}
  {item}
  {item}
  {item}
</Slider>;
```
