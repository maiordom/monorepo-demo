```js
const noonUrl = require('./assets/noon.png');
const nikeUrl = require('./assets/nike.png');
const i18n = {
  biWeeklyInstallmentFee: 'Bi-weekly installment fee';
  installmentFee: 'Installment fee';
  installmentPlan: {
    overdue: 'Overdue';
    paid: 'Paid';
    toPay: 'To pay';
  };
  installmentsMethod: 'Pay in installments';
  monthlyInstallmentFee: 'Monthly installment fee';
  orderInfo: 'Order info';
  orderNumber: 'Order';
  paid: 'Paid';
  pay: 'Pay';
  payInFull: 'Pay in full';
  payLaterFee: 'Pay after delivery fee';
  payLaterMethod: 'Pay after delivery';
  paymentMethod: 'Payment method';
  paymentOverdue: 'Payment Overdue';
  shippingAddress: 'Delivery Address';
  shippingFee: 'Shipping fee';
};
const items = [
  {
    title: 'Noon ROSSI',
    description: 'Model Number: FT A088439FK098',
    unitPrice: '58.00',
    imageUrl: noonUrl,
    quantity: 1,
  },
  {
    title: 'Noon Air Hayward',
    description: 'Model Number: FT A088439FK098',
    unitPrice: '100.00',
    imageUrl: noonUrl,
    quantity: 1,
  },
];

<div>
  <div style={{ marginBottom: 20 }}>
    <PaymentState
      i18n={i18n}
      paymentState={{
        loan: {
          amountToPay: 157,
          serviceFeePerInstallment: '10.00',
          installments: [
            {
              id: 1,
              dueDate: '2020-02-18T00:00:00Z',
              amountToPay: '100',
              paidAmount: '100',
              isPaid: true,
              isOverdue: false,
            },
            {
              id: 2,
              dueDate: '2020-02-18T00:00:00Z',
              amountToPay: '120',
              paidAmount: '120',
              isPaid: true,
              isOverdue: false,
            },
            {
              id: 3,
              dueDate: '2020-02-18T00:00:00Z',
              amountToPay: '133',
              paidAmount: '133',
              isPaid: false,
              isOverdue: false,
            },
            {
              id: 4,
              dueDate: '2020-02-18T00:00:00Z',
              amountToPay: '140',
              paidAmount: '140',
              isPaid: false,
              isOverdue: false,
            },
            {
              id: 5,
              dueDate: '2020-02-18T00:00:00Z',
              amountToPay: '150',
              paidAmount: '150',
              isPaid: false,
              isOverdue: false,
            },
            {
              id: 6,
              dueDate: '2020-02-18T00:00:00Z',
              amountToPay: '100',
              paidAmount: '100',
              isPaid: false,
              isOverdue: false,
            },
          ],
        },
        currency: 'AED',
        order: {
          number: '94e7345c-1a10-4a3b-90e2-ea89c661d520',
          items,
          shippingAddress: {
            city: 'Dubai',
            raw: 'Villa De Cyberna',
            zip: '123',
          },
        },
        merchant: {
          logo: noonUrl,
          name: 'Noon',
        },
        product: {
          productType: 'installments',
        },
        paidDate: '2019-12-12',
        status: 'to_pay',
      }}
    />
  </div>
  <div>
    <PaymentState
      i18n={i18n}
      paymentState={{
        loan: {
          serviceFeePerInstallment: '10.00',
          amountToPay: 200,
          installments: [],
        },
        currency: 'AED',
        merchant: {
          logo: nikeUrl,
          name: 'Nike',
        },
        order: {
          items,
          number: '94e7345c-1a10-4a3b-90e2-ea89c661d520',
          shippingAddress: {
            city: 'Dubai',
            raw: 'Villa De Cyberna',
            zip: '123',
          },
        },
        product: {
          productType: 'pay_later',
        },
        nextPaidDate: '2019-10-12',
        status: 'to_pay',
      }}
    />
  </div>
  <div style={{ marginBottom: 20 }}>
    <PaymentState
      i18n={i18n}
      paymentState={{
        loan: {
          serviceFeePerInstallment: '10.00',
          amountToPay: 157,
          installments: [],
        },
        currency: 'AED',
        merchant: {
          logo: nikeUrl,
          name: 'Nike',
        },
        order: {
          items,
          number: '94e7345c-1a10-4a3b-90e2-ea89c661d520',
          shippingAddress: {
            city: 'Dubai',
            raw: 'Villa De Cyberna',
            zip: '123',
          },
        },
        product: {
          productType: 'pay_later',
        },
        nextPaidDate: '2019-10-12',
        paidDate: '2019-10-12',
        status: 'paid',
      }}
    />
  </div>
  <div style={{ marginBottom: 20 }}>
    <PaymentState
      i18n={i18n}
      paymentState={{
        loan: {
          serviceFeePerInstallment: '10.00',
          amountToPay: 157,
          refundedAmount: 100,
          installments: [],
        },
        currency: 'AED',
        merchant: {
          logo: nikeUrl,
          name: 'Nike',
        },
        order: {
          items,
          number: '94e7345c-1a10-4a3b-90e2-ea89c661d520',
          shippingAddress: {
            city: 'Dubai',
            raw: 'Villa De Cyberna',
            zip: '123',
          },
        },
        product: {
          productType: 'pay_later',
        },
        nextPaidDate: '2019-10-12',
        paidDate: '2019-10-12',
        status: 'paid',
      }}
    />
  </div>
  <div style={{ marginBottom: 20 }}>
    <PaymentState
      i18n={i18n}
      paymentState={{
        loan: {
          serviceFeePerInstallment: '10.00',
          amountToPay: 157,
          installments: [],
        },
        currency: 'AED',
        merchant: {
          logo: noonUrl,
          name: 'Noon',
        },
        order: {
          items,
          number: '94e7345c-1a10-4a3b-90e2-ea89c661d520',
          shippingAddress: {
            city: 'Dubai',
            raw: 'Villa De Cyberna',
            zip: '123',
          },
        },
        product: {
          productType: 'pay_later',
        },
        nextPaidDate: '2019-10-12',
        status: 'not_due_yet',
      }}
    />
  </div>
</div>;
```
