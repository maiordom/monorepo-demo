import { observable, action } from 'mobx';

import { ICustomer } from '../types/Customer';

import getCustomerService from '../services/GetCustomer';

class Model {
  @observable customer: ICustomer = {} as any;

  @action.bound
  getCustomer() {
    return getCustomerService().then(customer => {
      this.customer = customer;

      return customer;
    });
  }
}

export default new Model();
