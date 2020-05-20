export interface IInstallmentPlan {
  id: string;
  dueDate: string;
  amountToPay: string;
  paidAmount: string;
  checked: boolean;
  toPay: boolean;
  isPaid: boolean;
  isOverdue: boolean;
}
