import { observable } from 'mobx';

import { IPayment } from 'core/entities/Checkout/types/Payment';
import { ICustomer } from 'core/entities/Checkout/types/Customer';
import { IConfiguration } from 'core/entities/Checkout/types/Configuration';

import { IResponse as IScanResponse } from 'core/entities/Checkout/services/Scan';

import config from 'src/config';

export interface IField {
  value: string;
  name: string;
  code: string;
  touched: boolean;
  type: 'pending' | 'error' | 'resolved';
}

type ICheckoutCodeStatus = string | 'pending' | 'fulfilled' | 'rejected';

export class Store {
  @observable configuration: IConfiguration = {} as any;
  @observable scanData: IScanResponse = {} as IScanResponse;

  checkoutParams: {
    payment: IPayment;
    customer: ICustomer;
  } = {
    payment: {} as null,
    customer: {},
  };

  product: 'payLater' | 'installments' | string = 'payLater';
  merchantUrls: {
    success?: string;
    cancel?: string;
    failure?: string;
  } = {};
  rejectionReasonCode = 'notAvailable';

  sessionId: string = null;
  sessionStatus: string = null;
  @observable route: string = config.initialRoute as any;
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
