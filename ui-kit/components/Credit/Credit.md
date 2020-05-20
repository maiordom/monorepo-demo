```js
const i18n = {
  blocked: 'Your account is currently locked 🔒',
  canSpend: "Here's what you can spend with Tabby💰",
  nothingToPay: 'Relax, you have nothing to pay now 🛋',
  overdue:
    'You have an overdue payment of {{overdue}} {{currency}}, please pay immediately ⏰',
  pay: 'Pay',
  payForAllOrders: 'Pay for all my orders in one go 💸',
  unlockAfterFirstPurchase: 'Unlock more shopping after your first payment💰',
  walletBalance: 'You have {{walletBalance}} {{currency}} in your wallet',
};

<div>
  <Credit
    i18n={i18n}
    summary={{
      currency: 'AED',
      limitIsLocked: true,
      showMaximalLimit: true,
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

  <div style={{ marginTop: 20 }}>
    <Credit
      i18n={i18n}
      summary={{
        currency: 'AED',
        limitIsLocked: false,
        showMaximalLimit: false,
        walletBalance: 1000,
        creditLimit: {
          available: 638,
          total: 1000,
        },
        debt: {
          total: 0,
          overdue: 0,
        },
      }}
    />
  </div>

  <div style={{ marginTop: 20 }}>
    <Credit
      i18n={i18n}
      summary={{
        currency: 'AED',
        limitIsLocked: false,
        showMaximalLimit: false,
        walletBalance: 1000,
        creditLimit: {
          available: 638,
          total: 1000,
        },
        debt: {
          total: 235,
          overdue: 0,
        },
      }}
    />
  </div>

  <div style={{ marginTop: 20 }}>
    <Credit
      i18n={i18n}
      summary={{
        currency: 'AED',
        limitIsLocked: false,
        showMaximalLimit: false,
        walletBalance: 0,
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
</div>;
```
