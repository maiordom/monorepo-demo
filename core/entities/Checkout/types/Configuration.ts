export interface IPlan {
  id: number;
  installmentsCount: number;
  installmentPeriod: string;
  downpayment: string;
  amountToPay: string;
  serviceFee: string;
  nextPaymentDate: string;
  payPerInstallment: string;
}

export interface IConfiguration {
  currency: string;
  newCustomer: boolean;
  availableProducts: {
    installments: IPlan[];
    payLater: IPlan[];
  };
}
