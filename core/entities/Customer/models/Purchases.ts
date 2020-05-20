import format from 'date-fns/format';
import groupBy from 'lodash/groupBy';
import addDays from 'date-fns/addDays';
import { action, observable } from 'mobx';

import getPurchasesService from '../services/GetPurchases';
import summaryService from '../services/Summary';

import { IPaymentState } from '../types/PaymentState';
import { ICustomerSummary } from '../types/CustomerSummary';

interface IPurchases {
  offset: number;
  items: IPaymentState[];
}

interface IPurchasesGroup {
  offset: number;
  group: IDateGroup[];
}

export interface IDateGroup {
  title: string;
  isToday: boolean;
  isTomorrow: boolean;
  items: IPaymentState[];
}

class Store {
  toPay: IPurchasesGroup = { offset: 0, group: [] };
  paid: IPurchases = { offset: 0, items: [] };
  notDueYet: IPurchases = { offset: 0, items: [] };

  @observable summary: ICustomerSummary = null;
}

class Model {
  store: Store;

  constructor() {
    this.store = new Store();
  }

  groupPurchases(
    purchases: IPaymentState[]
  ): {
    title: string;
    isToday: boolean;
    isTomorrow: boolean;
    items: IPaymentState[];
  }[] {
    let grouped = groupBy(purchases, (purchase: IPaymentState) => {
      const nextPaidDate = purchase.loan.installments.find(
        installment => installment.toPay
      )?.dueDate;

      return nextPaidDate ? format(new Date(nextPaidDate), 'yyyy-MM-dd') : null;
    });
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    grouped = Object.keys(grouped).map(date => ({
      title:
        date === 'null'
          ? format(new Date(), 'MMMM do')
          : format(new Date(date), 'MMMM do'),
      isToday: date === 'null' ? true : today === date,
      isTomorrow: tomorrow === date,
      items: grouped[date],
    }));

    return grouped;
  }

  @action.bound
  getSummary = async () => {
    const summary = await summaryService();

    this.store.summary = summary;
  };

  getToPayPurchases() {
    return getPurchasesService({
      status: 'to_pay',
      limit: 100,
      offset: 0,
      sort: 'date',
    });
  }

  getPurchases = () =>
    Promise.all([
      getPurchasesService({
        status: 'to_pay',
        limit: 100,
        offset: 0,
        sort: 'date',
      }),
      getPurchasesService({
        status: 'paid',
        limit: 100,
        offset: 0,
        sort: 'date',
      }),
      getPurchasesService({
        status: 'not_due_yet',
        limit: 100,
        offset: 0,
        sort: 'date',
      }),
    ]).then(([toPay, paid, notDueYet]) => {
      this.store.toPay.group = this.groupPurchases(toPay.purchases);
      this.store.paid.items = paid.purchases;
      this.store.notDueYet.items = notDueYet.purchases;

      return {
        toPay,
        paid,
        notDueYet,
      };
    });
}

export default new Model();
