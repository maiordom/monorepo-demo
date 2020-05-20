import { observable, action } from 'mobx';

import request from '../../utils/Request';
import loginService from './services/Login';
import sendCodeService, {
  IRequestParams as ISendCodeRequestParams,
} from './services/SendCode';

class Store {
  constructor() {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      this.setAuthToken(authToken);
    }
  }

  setAuthToken(authToken: string) {
    this.authToken = authToken;

    request.setHeaders({ authorization: `Bearer ${authToken}` });
    localStorage.setItem('authToken', authToken);
  }

  deleteAuthToken() {
    this.authToken = null;

    request.setHeaders({ authorization: `Bearer null` });
    localStorage.removeItem('authToken');
  }

  authToken: string = null;
  attemptsSendCode = 3;

  @observable phone = '';
  @observable isSMSSent = false;
  @observable isAvailableSendCode = false;
  @observable availableAttemptsSendCode = 3;
  @observable codeStatus: string | 'pending' | 'fulfilled' | 'rejected' =
    'pending';
  @observable codeStatusMessage: string = null;
}

class Auth {
  store: Store;

  constructor() {
    this.store = new Store();
  }

  logout() {
    this.store.deleteAuthToken();
  }

  @action.bound
  resetCodeStatus() {
    this.store.codeStatus = 'pending';
    this.store.codeStatusMessage = null;
  }

  login = async ({ code }: { code: string }) => {
    this.store.codeStatus = 'fulfilled';

    try {
      const { authToken } = await loginService({
        confirmationCode: code,
        phone: this.store.phone,
      });
      this.store.setAuthToken(authToken);
      this.resetState();
      this.resetCodeStatus();
    } catch (exx) {
      if (exx.code === 400) {
        this.store.codeStatusMessage = 'wrongCode';
      } else {
        this.store.codeStatusMessage = 'somethingWrong';
      }

      this.store.codeStatus = 'rejected';

      return Promise.reject();
    }
  };

  resetState() {
    this.store.isSMSSent = false;
    this.store.phone = '';
    this.store.availableAttemptsSendCode = 4;
  }

  resendCode = async () => {
    this.resetCodeStatus();

    try {
      await this.sendCode({ phone: this.store.phone });
      this.store.availableAttemptsSendCode--;
    } catch (exx) {
      this.store.codeStatus = 'rejected';
      this.store.codeStatusMessage = 'somethingWrong';
    }
  };

  setSendCodeStatus = (isAvailable: boolean) => {
    this.store.isAvailableSendCode = isAvailable;
  };

  sendCode = async (params: ISendCodeRequestParams) => {
    this.store.phone = params.phone;

    try {
      await sendCodeService(params);
      this.store.isSMSSent = true;
    } catch (exx) {
      return Promise.reject(exx);
    }
  };
}

export default new Auth();
