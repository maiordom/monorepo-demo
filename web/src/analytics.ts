import amplitude from 'amplitude-js';
import isMobile from 'ismobilejs/dist/isMobile.min.js';

import { IPaymentState } from 'core/entities/Customer/types/PaymentState';

import customerPurchasesModel from 'core/entities/Customer/models/Purchases';

class Analytics {
  constructor() {
    this.amp.init(__ANALITYCS_KEY__);

    if (isMobile.phone) {
      amplitude.setUserProperties({ deviceType: 'mobile' });
    } else if (isMobile.tablet) {
      amplitude.setUserProperties({ deviceType: 'tablet' });
    } else {
      amplitude.setUserProperties({ deviceType: 'desktop' });
    }
  }

  logout() {
    amplitude.getInstance().setUserId(null);
    amplitude.getInstance().regenerateDeviceId();
  }

  setDeviceId(deviceId: string) {
    this.amp.setDeviceId(deviceId);
  }

  get amp() {
    return amplitude.getInstance();
  }

  events = {
    login: {
      pageOpen: () => {
        this.amp.logEvent('LOGIN:OPEN');
      },

      loginFirstChange: () => {
        this.amp.logEvent('LOGIN:INPUTBOX:CHANGE', {
          events: { ibType: 'phone', status: 'start' },
        });
      },

      codeFirstChange: () => {
        this.amp.logEvent('LOGIN:VERIFICATION-CODE-INPUT:CHANGE', {
          events: { status: 'start' },
        });
      },

      codeFilled: () => {
        this.amp.logEvent('LOGIN:VERIFICATION-CODE-INPUT:CHANGE', {
          events: { status: 'success' },
        });
      },

      codeError: () => {
        this.amp.logEvent('LOGIN:VERIFICATION-CODE-INPUT:CHANGE', {
          events: { status: 'failure' },
        });
      },
    },

    main: {
      pageOpen: () => {
        this.amp.logEvent('MAIN:OPEN');
      },

      showPaymentSnippet: (state: string[]) => {
        this.amp.logEvent('MAIN:CURRENT-STATE:DUE-PAYMENT-SNIPPET:SHOW', {
          events: {
            message: state,
            summary: customerPurchasesModel.store.summary,
          },
        });
      },

      showCreditLimitSnippet: (state: string[]) => {
        this.amp.logEvent('MAIN:CURRENT-STATE:LIMIT-SNIPPET:SHOW', {
          events: {
            message: state,
            summary: customerPurchasesModel.store.summary,
          },
        });
      },

      showNotDueYetPurchaseSnippet: (paymentState: IPaymentState) => {
        this.amp.logEvent('MAIN:NOT-DUE-YET:PAYMENT-SNIPPET:SHOW', {
          events: {
            ...paymentState,
          },
        });
      },

      showToPayPurchaseSnippet: (paymentState: IPaymentState) => {
        this.amp.logEvent('MAIN:TO-PAY:PAYMENT-SNIPPET:SHOW', {
          events: {
            ...paymentState,
          },
        });
      },

      showPaidPurchaseList: (paymentStates: IPaymentState[]) => {
        this.amp.logEvent('MAIN:PAID:LIST:SHOW', {
          events: {
            list: paymentStates.map(paymentState => ({
              id: paymentState.id,
              amount: paymentState.loan.amountToPay,
              merchant: paymentState.merchant,
            })),
          },
        });
      },

      clickOnToPayButton: (paymentState: IPaymentState) => {
        this.amp.logEvent('MAIN:TO-PAY:BUTTON:CLICK', {
          events: {
            bType: 'pay',
            ...paymentState,
          },
        });
      },

      clickOnNotDueYetPurchaseSnippet: (paymentState: IPaymentState) => {
        this.amp.logEvent('MAIN:NOT-DUE-YET:PAYMENT-SNIPPET:CLICK', {
          events: {
            ...paymentState,
          },
        });
      },

      clickOnToPayPurchaseSnippet: (paymentState: IPaymentState) => {
        this.amp.logEvent('MAIN:TO-PAY:PAYMENT-SNIPPET:CLICK', {
          events: {
            ...paymentState,
          },
        });
      },

      clickOnPaidPurchaseSnippet: (paymentState: IPaymentState) => {
        this.amp.logEvent('MAIN:PAID:PAYMENT-SNIPPET:CLICK', {
          events: {
            ...paymentState,
          },
        });
      },
    },

    menu: {
      open: () => {
        this.amp.logEvent('MENU:OPEN');
      },

      clickOnItem: (type: string) => {
        this.amp.logEvent('MENU:ICON:CLICK', {
          events: {
            iconType: type,
          },
        });
      },
    },

    payment: {
      pageOpen: ({
        pageType,
        amount,
        purchases,
      }: {
        pageType: string;
        amount: string | number;
        purchases: IPaymentState[];
      }) => {
        this.amp.logEvent('DEPOSIT:OPEN', {
          events: {
            pageType,
            amount,
            summary: customerPurchasesModel.store.summary,
            purchases,
          },
        });
      },

      pay: ({
        pageType,
        toPayAmount,
        purchaseIds,
      }: {
        pageType: string;
        toPayAmount: string | number;
        purchaseIds: string[];
      }) => {
        this.amp.logEvent('DEPOSIT:BUTTON:CLICK', {
          events: {
            pageType,
            purchaseIds,
            toPayAmount,
            currency: customerPurchasesModel.store.summary?.currency,
            bType: 'pay',
          },
        });
      },
    },

    profile: {
      pageOpen: () => {
        this.amp.logEvent('PROFILE:OPEN');
      },

      clickOnPayAll: () => {
        this.amp.logEvent('PROFILE:PAY-ALL:CLICK', {
          events: {
            bType: 'pay',
          },
        });
      },

      showSummarySnippet: () => {
        this.amp.logEvent('PROFILE:CURRENT-STATE-SNIPPET:SHOW', {
          events: {
            summary: customerPurchasesModel.store.summary,
          },
        });
      },

      clickOnPersonalInformation: (status: string) => {
        this.amp.logEvent('PROFILE:ICON:CLICK', {
          events: {
            iconType: 'personalInfo',
            status,
          },
        });
      },

      logout: () => {
        this.amp.logEvent('PROFILE:BUTTON:CLICK', {
          events: { bType: 'logout' },
        });
      },
    },
  };
}

export default new Analytics();
