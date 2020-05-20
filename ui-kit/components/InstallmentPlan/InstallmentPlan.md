```jsx
<div style={{ display: 'flex' }}>
  <InstallmentPlan
    installment={{
      dueDate: '2019-12-12',
      amountToPay: '0',
      paidAmount: '100.05',
      isPaid: true,
    }}
    currency="AED"
    i18n={{
      toPay: 'To pay',
      paid: 'Paid',
      overdue: 'Overdue',
    }}
  />
  <div
    style={{
      marginLeft: 20,
      marginRight: document.body.classList.contains('direction-rtl') ? 20 : 0,
    }}
  >
    <InstallmentPlan
      installment={{
        dueDate: '2019-12-12',
        amountToPay: '100.05',
        isOverdue: true,
      }}
      currency="AED"
      i18n={{
        toPay: 'To pay',
        paid: 'Paid',
        overdue: 'Overdue',
      }}
    />
  </div>
  <div style={{ marginLeft: 20 }}>
    <InstallmentPlan
      installment={{
        dueDate: '2019-12-12',
        amountToPay: '100.05',
      }}
      currency="AED"
      i18n={{
        toPay: 'To pay',
        paid: 'Paid',
        overdue: 'Overdue',
      }}
    />
  </div>
  <div style={{ marginLeft: 20 }}>
    <InstallmentPlan
      installment={{
        dueDate: '2019-12-12',
        amountToPay: '100.05',
      }}
      currency="AED"
      i18n={{
        toPay: 'To pay',
        paid: 'Paid',
        overdue: 'Overdue',
      }}
    />
  </div>
</div>
```
