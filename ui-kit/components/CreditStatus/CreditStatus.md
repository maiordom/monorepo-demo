```js
const i18n = {
  canSpend: "Here's what you can  spend 💰",
  overdue: 'You have overdue orders ⏰',
  pay: 'Pay',
  spentSoFar: 'Spent so far 💸',
  unlockAfterFirstPurchase: 'Unlock more shopping after your first payment💰',
};

<div style={{ maxWidth: 500 }}>
  <div style={{ marginBottom: 10, marginLeft: 20 }}>Limit is blocked:</div>
  <CreditStatus
    i18n={i18n}
    summary={{
      currency: 'AED',
      limitIsLocked: true,
      showMaximalLimit: false,
      walletBalance: 1000,
      creditLimit: {
        available: 0,
        total: 1000,
      },
      debt: {
        total: 0,
        overdue: 0,
      },
    }}
  />

  <div style={{ marginTop: 40 }}>
    <div style={{ marginBottom: 10, marginLeft: 20 }}>Show maximal limit:</div>
    <CreditStatus
      i18n={i18n}
      summary={{
        currency: 'AED',
        limitIsLocked: false,
        showMaximalLimit: true,
        walletBalance: 1000,
        creditLimit: {
          available: 720,
          total: 1000,
        },
        debt: {
          total: 0,
          overdue: 0,
        },
      }}
    />
  </div>

  <div style={{ marginTop: 40 }}>
    <div style={{ marginBottom: 10, marginLeft: 20 }}>Overdue:</div>
    <CreditStatus
      i18n={i18n}
      summary={{
        currency: 'AED',
        limitIsLocked: false,
        showMaximalLimit: false,
        walletBalance: 1000,
        creditLimit: {
          available: 720,
          total: 1000,
        },
        debt: {
          total: 235,
          overdue: 50,
        },
      }}
    />
  </div>

  <div style={{ marginTop: 40 }}>
    <div style={{ marginBottom: 10, marginLeft: 20 }}>Can spend:</div>
    <CreditStatus
      i18n={i18n}
      summary={{
        currency: 'AED',
        limitIsLocked: false,
        showMaximalLimit: false,
        walletBalance: 1000,
        creditLimit: {
          available: 720,
          total: 1000,
        },
        debt: {
          total: 0,
          overdue: 0,
        },
      }}
    />
  </div>

  <div style={{ marginTop: 40 }}>
    <div style={{ marginBottom: 10, marginLeft: 20 }}>Can spend:</div>
    <CreditStatus
      i18n={i18n}
      summary={{
        currency: 'AED',
        limitIsLocked: false,
        showMaximalLimit: false,
        walletBalance: 1000,
        creditLimit: {
          available: 500,
          total: 500,
        },
        debt: {
          total: 0,
          overdue: 0,
        },
      }}
    />
  </div>
</div>;
```
