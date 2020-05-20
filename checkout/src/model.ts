import { observable, action } from 'mobx';
import NanoEvents from 'nanoevents';
import camelcase from 'camelcase';

import camelcaseKeys from 'core/utils/CamelcaseKeys';
import { IPlan } from 'core/entities/Checkout/types/Configuration';
import { IPayment } from 'core/entities/Checkout/types/Payment';
import { ICustomer } from 'core/entities/Checkout/types/Customer';
import { IConfiguration } from 'core/entities/Checkout/types/Configuration';
import { IError as IErrorResponse } from 'core/utils/Request';

import 'core/entities/Journal/model';
import getCheckoutService, {
  IResponse as IGetCheckoutResponse,
} from 'core/entities/Checkout/services/GetCheckout';
import createCheckoutService, {
  IErrorResponse as ICreateCheckoutErrorResponse,
  IError as ICreateCheckoutError,
} from 'core/entities/Checkout/services/CreateCheckout';
import sendCheckoutCodeService from 'core/entities/Checkout/services/SendCheckoutCode';
import scanService, {
  IResponse as IScanResponse,
} from 'core/entities/Checkout/services/Scan';
import updateCheckoutService, {
  IErrorResponse as IUpdateCheckoutErrorResponse,
  IErrorByField,
} from 'core/entities/Checkout/services/UpdateCheckout';

import clearPhone from 'core/utils/ClearPhone';
import config from 'src/config';
import request from 'core/utils/Request';
import i18n from 'src/locales';
import analitycs from 'src/analytics';
import clientRoutes from 'src/routes/client';

export interface IField {
  value: string;
  name: string;
  code: string;
  touched: boolean;
  type: 'pending' | 'error' | 'resolved';
}

const STATUS_MESSAGES = i18n().checkoutSessionStatuses;

type ICheckoutCodeStatus = string | 'pending' | 'fulfilled' | 'rejected';

export class Store {
  configuration: IConfiguration = {} as IConfiguration;
  @observable scanData: IScanResponse = {} as IScanResponse;

  checkoutParams: {
    payment: IPayment;
    customer: ICustomer;
    productType?: string;
    confirmationCode?: string;
    productOptionId?: number;
  } = {
    payment: {} as IPayment,
    customer: {},
  };

  selectedProductOption?: IPlan;
  productType: 'payLater' | 'installments' | string = '';
  merchantUrls: {
    success?: string;
    cancel?: string;
    failure?: string;
  } = {};
  rejectionReasonCode = 'notAvailable';

  sessionId: string = null;
  sessionStatus: string = null;
  @observable route: string = config.initialRoute;
  attemptsSendCode = 3;
  @observable availableAttemptsSendCode = 3;
  @observable isAvailableSendCode = false;
  @observable confirmationCodeStatus: ICheckoutCodeStatus =
    config.initialCheckoutCodeStatus;
  @observable confirmationCodeStatusMessage: string = null;
  isTermsAccepted = false;
  @observable isAvailableCheckout = false;

  @observable fields: { [key: string]: IField } = {
    phone: {
      value: '',
      name: 'phone',
      code: '',
      touched: false,
      type: 'pending',
    },
    email: {
      value: '',
      name: 'email',
      code: '',
      touched: false,
      type: 'pending',
    },
  };
}

class Model {
  store = new Store();
  emitter = new NanoEvents();

  prepareParams(payment: IPayment) {
    const phone = clearPhone(payment.buyer.phone);

    this.store.checkoutParams = {
      payment,
      customer: {
        phone,
      },
      productType: '',
    };
    this.store.fields.email.value = payment.buyer.email;
    this.store.fields.phone.value = phone;
  }

  initAnalytic({ payment, merchant }: { payment: IPayment; merchant: string }) {
    analitycs.events.checkout.init({
      userLogin: this.store.configuration.newCustomer,
      sessionId: this.store.sessionId,
      payment,
      merchant,
    });
  }

  @action.bound
  initBySession = async ({
    sessionId,
    apiKey,
    direction,
    merchant,
  }: {
    apiKey: string;
    direction: 'ltr' | 'rtl';
    sessionId: string;
    merchant: string;
  }) => {
    request.setHeaders({ authorization: `Bearer ${apiKey}` });

    document.body.style.direction = direction;
    document.body.classList.add(`direction-${direction}`);

    try {
      const { payment } = await this.getCheckout(sessionId);

      this.initAnalytic({ payment, merchant });
      this.prepareParams(payment);
    } catch (_) {}

    this.store.isAvailableCheckout = this.validate();
    this.showInvalidErrors();
  };

  showInvalidErrors() {
    for (const key in this.store.fields) {
      const field = this.store.fields[key];

      if (field.code === 'invalid_value') {
        field.touched = true;
      }
    }
  }

  @action.bound
  init = async ({
    apiKey,
    direction,
    payment,
    merchant,
  }: {
    apiKey: string;
    payment: IPayment;
    direction: 'ltr' | 'rtl';
    merchant: string;
  }) => {
    this.prepareParams(payment);

    document.body.style.direction = direction;
    document.body.classList.add(`direction-${direction}`);

    request.setHeaders({ authorization: `Bearer ${apiKey}` });

    try {
      await this.createCheckout();
      this.initAnalytic({ payment, merchant });

      if (this.store.sessionStatus === 'created') {
        analitycs.events.tabby.showMethod();
      }
    } catch (exx) {
      const res: ICreateCheckoutErrorResponse = exx;

      if (res.code === 400) {
        const errors = res?.data?.errors || [];

        const unavailableCodeError = errors.find(
          error => error.code === 'unavailable'
        );

        if (unavailableCodeError) {
          this.store.sessionId = camelcaseKeys<ICreateCheckoutError>(
            unavailableCodeError
          ).sessionId;
          this.initAnalytic({ payment, merchant });
        }
      }
    }

    this.store.isAvailableCheckout = this.validate();
    this.showInvalidErrors();
  };

  @action.bound
  launch({ route, product }: { route?: string; product?: string } = {}) {
    if (product) {
      this.store.productType = camelcase(product);
      this.store.checkoutParams.productType = product;
    }
    analitycs.events.tabby.selectMethod();

    if (route && __ENV__ === 'development') {
      this.pushHistory(route);
      return;
    }

    if (this.store.configuration.newCustomer) {
      this.pushHistory(clientRoutes.checkout);
    } else {
      this.pushHistory(clientRoutes.welcomeBack);
    }
  }

  @action.bound
  pushHistory(route: string) {
    this.store.route = route;
  }

  @action.bound
  scan(image: File) {
    return scanService(image).then(scan => {
      this.store.checkoutParams.customer.scan = scan.scanId;
      this.store.scanData = scan;
    });
  }

  getCheckout = async (sessionId: string) => {
    try {
      const res = await getCheckoutService({
        sessionId,
      });
      const { payment, warnings, configuration, status, merchantUrls } = res;

      this.store.sessionStatus = status;

      warnings.forEach(warning => {
        if (warning.name in this.store.fields) {
          Object.assign(this.store.fields[warning.name], {
            code: warning.code,
          });
        }
      });

      this.store.merchantUrls = merchantUrls;
      this.store.configuration = configuration;
      this.store.sessionId = sessionId;

      this.emitter.emit('checkout', {
        id: sessionId,
        status,
        payment,
        statusMessage: STATUS_MESSAGES[status],
        errors: warnings,
      });

      return res;
    } catch (_) {
      return {} as IGetCheckoutResponse;
    }
  };

  createCheckout = async () => {
    try {
      const res = await createCheckoutService({
        payment: this.store.checkoutParams.payment,
      });
      const { id, status, warnings, payment, configuration } = res;

      this.store.sessionStatus = status;

      warnings.forEach(warning => {
        if (warning.name in this.store.fields) {
          Object.assign(this.store.fields[warning.name], {
            code: warning.code,
          });
        }
      });

      this.store.configuration = configuration;
      this.store.sessionId = id;
      this.emitter.emit('checkout', {
        id,
        status,
        products: configuration.availableProducts,
        payment,
        statusMessage: STATUS_MESSAGES[status],
        errors: warnings,
      });

      return res;
    } catch (exx) {
      const res: ICreateCheckoutErrorResponse = exx;

      if (res.code === 400) {
        const { errors } = res.data;

        this.emitter.emit('checkout', {
          id: null,
          status: 'error',
          statusMessage: STATUS_MESSAGES.error,
          payment: null,
          errors,
        });
      }

      return Promise.reject(res);
    }
  };

  @action.bound
  updateCheckout = async () => {
    try {
      const {
        id,
        status,
        payment,
        rejectionReasonCode,
        configuration,
      } = await updateCheckoutService(
        { sessionId: this.store.sessionId },
        {
          ...this.store.checkoutParams,
          juicyscore: {
            sessionId: jslabApi.getCookie(),
            useragent: window.navigator.userAgent,
            referrer: document.referrer,
            timeZone: String(new Date().getTimezoneOffset() / -60),
          },
        }
      );
      this.store.configuration = configuration;
      this.store.sessionStatus = status;
      this.store.checkoutParams.payment = payment;

      if (status === 'approved') {
        switch (this.store.productType) {
          case 'payLater':
            this.pushHistory(clientRoutes.finalPayLater);
            break;
          case 'installments':
            this.pushHistory(clientRoutes.finalInstallments);
            break;
        }
      }

      if (status === 'rejected') {
        this.store.rejectionReasonCode = rejectionReasonCode;
        this.pushHistory(clientRoutes.rejected);
      }

      this.emitter.emit('checkout', {
        id,
        status,
        statusMessage: STATUS_MESSAGES[status],
        payment,
      });
    } catch (exx) {
      const res: IUpdateCheckoutErrorResponse = exx;

      if (res.code === 400) {
        const { errors = [] } = res.data;
        const errorsMap: { [key: string]: IErrorByField } = {};

        errors.forEach(error => {
          errorsMap[camelcase(error.name) as string] = error;

          if (error.name in this.store.fields) {
            Object.assign(this.store.fields[error.name], {
              code: error.code,
              type: 'error',
            });

            this.store.isAvailableCheckout = false;
          }
        });

        if (!('phone' in errorsMap) && !('email' in errorsMap)) {
          if ('scan' in errorsMap) {
            this.pushHistory(clientRoutes.upload);
          } else if ('installmentPlan' in errorsMap) {
            this.pushHistory(clientRoutes.installmentPlan);
          } else if ('confirmationCode' in errorsMap) {
            if (errorsMap.confirmationCode.code === 'invalid_value') {
              this.store.confirmationCodeStatusMessage = 'wrongCode';
              this.store.confirmationCodeStatus = 'rejected';
            }

            if (this.store.productType === 'payLater') {
              this.pushHistory(clientRoutes.authorizationCode);
            } else {
              this.pushHistory(clientRoutes.confirmationCode);
            }
          } else if ('downpayment' in errorsMap) {
            this.pushHistory(clientRoutes.downpayment);
          }
        }

        this.emitter.emit('checkout', {
          id: this.store.sessionId,
          status: 'error',
          statusMessage: STATUS_MESSAGES.error,
          payment: this.store.checkoutParams.payment,
          errors,
        });
      }

      return Promise.reject(exx);
    }
  };

  close = ({ redirectUrl }: { redirectUrl?: string } = {}) => {
    this.emitter.emit('close', { redirectUrl });
  };

  @action.bound
  resetCheckoutCodeStatus() {
    this.store.confirmationCodeStatus = 'pending';
    this.store.confirmationCodeStatusMessage = null;
  }

  @action.bound
  sendCheckoutCode = async ({ isUserAction = false }) => {
    this.resetCheckoutCodeStatus();

    try {
      await sendCheckoutCodeService({ sessionId: this.store.sessionId });
      if (isUserAction) {
        this.store.availableAttemptsSendCode--;
      }
    } catch (exx) {
      const res: IErrorResponse<any> = exx;

      if (res.code === 400) {
        this.store.confirmationCodeStatusMessage = 'wrongCode';
      } else {
        this.store.confirmationCodeStatusMessage = 'somethingWrong';
      }

      this.store.confirmationCodeStatus = 'rejected';

      return Promise.reject();
    }
  };

  @action.bound
  setTouchedField({ name }: IField) {
    const field = this.store.fields[name];

    field.touched = true;
  }

  @action.bound
  validateField({ name, value }: IField) {
    const field = this.store.fields[name];
    const isValid = config.checkout[name].isValid(value);

    if (isValid) {
      field.type = 'resolved';
    } else {
      field.type = 'error';

      if (value === '') {
        field.code = 'required';
      } else {
        field.code = 'invalid_value';
      }
    }

    return isValid;
  }

  @action.bound
  setField(value: string, field: IField) {
    if (field.name === 'phone') {
      value = clearPhone(value);
    }

    field.value = value;

    config.checkout[field.name].setValue(this.store.checkoutParams, value);
    this.store.isAvailableCheckout = this.validate();
  }

  @action.bound
  setResolvedField({ name }: IField) {
    const field = this.store.fields[name];

    field.type = 'resolved';
    field.touched = false;
  }

  validate() {
    let hasError = false;

    for (const key in this.store.fields) {
      const field = this.store.fields[key];
      const isValid = this.validateField(field);

      if (!isValid || field.type === 'error') {
        hasError = true;
      }
    }

    return this.store.isTermsAccepted && !hasError;
  }

  set confirmationCode(code: string) {
    this.store.checkoutParams.confirmationCode = code;
  }

  get downPaymentRedirectUrls() {
    return {
      redirectUrl: __CHECKOUT_IFRAME_HOST__ + '/downpayment-success.html',
      cancelUrl: __CHECKOUT_IFRAME_HOST__ + '/downpayment-cancel.html',
    };
  }

  get appLink() {
    return __APP_URL__ + `/app/?deviceId=${analitycs.getDeviceId()}`;
  }

  @action.bound
  setTerms(accepted: boolean) {
    this.store.isTermsAccepted = accepted;
    this.store.isAvailableCheckout = this.validate();
  }

  @action.bound
  setSendCodeStatus = (isAvailable: boolean) => {
    this.store.isAvailableSendCode = isAvailable;
  };

  set selectedProductOption(plan: IPlan) {
    this.store.selectedProductOption = plan;
    this.store.checkoutParams.productOptionId = plan.id;
  }

  get selectedProductOption() {
    if (!this.store.selectedProductOption) {
      this.selectedProductOption = this.store.configuration.availableProducts.installments[0];
    }

    return this.store.selectedProductOption;
  }
}

export default new Model();
