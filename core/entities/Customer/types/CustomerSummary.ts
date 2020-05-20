export interface ICustomerSummary {
  debt: {
    total: number;
    overdue: number;
  };
  creditLimit: {
    available: number;
    total: number;
  };
  currency: string;
  walletBalance: number;
  limitIsLocked: boolean;
  showMaximalLimit: boolean;
}
