import amplitude from 'amplitude-js';
import once from 'lodash/once';
import isMobile from 'ismobilejs/dist/isMobile.min.js';

import { IPayment } from 'core/entities/Checkout/types/Payment';

import model from 'src/model';

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

  get amp() {
    return amplitude.getInstance();
  }

  getDeviceId() {
    return this.amp.options.deviceId;
  }

  events = {
    checkout: {
      init: ({
        userLogin,
        sessionId,
        payment,
        merchant,
      }: {
        userLogin: boolean;
        sessionId: string;
        payment: IPayment;
        merchant: string;
      }) => {
        amplitude.setUserId(payment?.buyer?.phone);
        this.amp.logEvent('CHECKOUT:INIT', {
          user: {
            userLogin,
            events: {
              sessionId,
              payment,
              merchant,
            },
          },
        });
      },
    },

    tabby: {
      showMethod: () => {
        this.amp.logEvent('TABBY-METHOD:SHOW');
      },

      selectMethod: () => {
        this.amp.logEvent('TABBY-METHOD:SELECT');
      },
    },

    welcome: {
      pageOpen: () => {
        this.amp.logEvent('WELCOME-PAGE:OPEN', {
          events: {
            userType: model.store.configuration.newCustomer
              ? 'new'
              : 'existing',
            resolution: model.store.sessionStatus,
            hasEmail: Boolean(model.store.checkoutParams.payment.buyer.email),
            hasPhone: Boolean(model.store.checkoutParams.payment.buyer.phone),
            rejectedReason: model.store.rejectionReasonCode,
          },
        });
      },

      pageClose: () => {
        this.amp.logEvent('WELCOME-PAGE:CLOSE', {
          events: {
            userType: model.store.configuration.newCustomer
              ? 'new'
              : 'existing',
            resolution: model.store.sessionStatus,
            rejectedReason: model.store.rejectionReasonCode,
          },
        });
      },

      termsToggle: ({ isChecked }: { isChecked: boolean }) => {
        this.amp.logEvent('WELCOME-PAGE:PAGE:CHECKBOX:TOGGLE', {
          events: {
            cbType: 'terms',
            isChecked: isChecked,
          },
        });
      },

      phoneFirstChange: once(() => {
        this.amp.logEvent('WELCOME-PAGE:INPUTBOX:CHANGE', {
          events: {
            ibType: 'phone',
            status: 'start',
          },
        });
      }),

      phoneFilled: () => {
        this.amp.logEvent('WELCOME-PAGE:INPUTBOX:CHANGE', {
          events: {
            ibType: 'phone',
            status: 'success',
          },
        });
      },

      phoneFailure: () => {
        this.amp.logEvent('WELCOME-PAGE:INPUTBOX:CHANGE', {
          events: {
            ibType: 'phone',
            status: 'failure',
          },
        });
      },

      emailFirstChange: once(() => {
        this.amp.logEvent('WELCOME-PAGE:INPUTBOX:CHANGE', {
          events: {
            ibType: 'email',
            status: 'start',
          },
        });
      }),

      emailFilled: () => {
        this.amp.logEvent('WELCOME-PAGE:INPUTBOX:CHANGE', {
          events: {
            ibType: 'email',
            status: 'success',
          },
        });
      },

      emailFailure: () => {
        this.amp.logEvent('WELCOME-PAGE:INPUTBOX:CHANGE', {
          events: {
            ibType: 'email',
            status: 'failure',
          },
        });
      },

      signUp: () => {
        this.amp.logEvent('WELCOME-PAGE:BUTTON:CLICK', {
          events: {
            bType: 'signUp',
          },
        });
      },

      buyNow: () => {
        this.amp.logEvent('WELCOME-PAGE:BUTTON:CLICK', {
          events: {
            bType: 'buyNow',
          },
        });
      },

      logInWithDifferentAccount: () => {
        this.amp.logEvent('WELCOME-PAGE:BUTTON:CLICK', {
          events: {
            bType: 'changeAccount',
          },
        });
      },
    },

    scan: {
      pageOpen: () => {
        this.amp.logEvent('IMAGE-UPLOAD:OPEN');
      },

      takePhotoClick: () => {
        this.amp.logEvent('IMAGE-UPLOAD:BUTTON:CLICK');
      },

      imageUploaded: ({ status }: { status: string }) => {
        amplitude
          .getInstance()
          .logEvent('IMAGE-UPLOAD:UPLOADED', { events: { status } });
      },

      pageClose: () => {
        this.amp.logEvent('IMAGE-UPLOAD:CLOSE');
      },
    },

    scanConfirm: {
      pageOpen: () => {
        this.amp.logEvent('DATA-CONFIRMATION:OPEN', {
          user: {
            sex: model.store.scanData.sex,
            nationality: model.store.scanData.nationality,
            country: model.store.scanData.country,
            age: model.store.scanData.age,
          },
        });
      },

      pageClose: () => {
        this.amp.logEvent('DATA-CONFIRMATION:CLOSE');
      },

      buyNow: () => {
        this.amp.logEvent('DATA-CONFIRMATION:BUTTON:CLICK', {
          events: { bType: 'buyNow' },
        });
      },
    },

    scanError: {
      pageOpen: () => {
        this.amp.logEvent('DATA-CONFIRMATION:ERROR');
      },

      uploadAgain: () => {
        this.amp.logEvent('DATA-CONFIRMATION:BUTTON:CLICK', {
          events: { bType: 'uploadAgain' },
        });
      },
    },

    codeVerification: {
      pageOpen: () => {
        this.amp.logEvent('CODE-VERIFICATION:OPEN');
      },

      pageClose: () => {
        this.amp.logEvent('CODE-VERIFICATION:CLOSE');
      },

      firstChange: () => {
        this.amp.logEvent('CODE-VERIFICATION:VERIFICATION-CODE-INPUT:CHANGE', {
          events: {
            status: 'start',
          },
        });
      },

      codeFilled: () => {
        this.amp.logEvent('CODE-VERIFICATION:VERIFICATION-CODE-INPUT:CHANGE', {
          events: {
            status: 'success',
          },
        });
      },

      codeError: () => {
        this.amp.logEvent('CODE-VERIFICATION:VERIFICATION-CODE-INPUT:CHANGE', {
          events: {
            status: 'unsuccess',
          },
        });
      },

      sendCode: () => {
        this.amp.logEvent('CODE-VERIFICATION:BUTTON:CLICK', {
          events: { bType: 'sendCode' },
        });
      },
    },

    final: {
      pageOpen: () => {
        this.amp.logEvent('SUCCESS-PAGE:OPEN');
      },

      getStartedWithTabby: () => {
        this.amp.logEvent('SUCCESS-PAGE:BUTTON:CLICK', {
          events: { bType: 'getStarted' },
        });
      },

      backToStore: () => {
        this.amp.logEvent('SUCCESS-PAGE:LINK:CLICK', {
          events: { lType: 'backToStore' },
        });
      },
    },

    rejected: {
      pageOpen: ({ reason }: { reason: string }) => {
        this.amp.logEvent('UNSUCCESS-PAGE:OPEN', {
          events: { reason },
        });
      },

      changePaymentMethod: () => {
        this.amp.logEvent('UNSUCCESS-PAGE:LINK:CLICK', {
          events: { lType: 'changePaymentMethod' },
        });
      },

      payNow: () => {
        this.amp.logEvent('UNSUCCESS-PAGE:BUTTON:CLICK', {
          events: { bType: 'payNow' },
        });
      },
    },
  };
}

export default new Analytics();
