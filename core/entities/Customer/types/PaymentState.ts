import { IPaymentItem } from './PaymentItem';
import { IInstallmentPlan } from './InstallmentPlan';

export interface IPaymentState {
  currency: string;
  id: string;
  loan: {
    amountToPay: string;
    installments: IInstallmentPlan[];
    refundedAmount: string;
    serviceFeePerInstallment: string;
    paid: {
      amount: string;
    };
  };
  merchant: {
    logo: string;
    name: string;
  };
  nextPaidDate: string;
  order: {
    items: IPaymentItem[];
    number: string;
    shippingAddress: {
      city: string;
      raw: string;
      zip: string;
    };
    shippingAmount: number;
  };
  paidDate: string;
  product: {
    productType: 'installments' | 'pay_later';
    installmentPeriod: string;
    installmentPeriodType: {
      monthly: boolean;
      beweekly: boolean;
    };
  };
  status: 'not_due_yet' | 'to_pay' | 'paid' | 'cancelled';
}
