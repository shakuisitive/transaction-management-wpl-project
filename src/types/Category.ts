export type IncomeCategory = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseCategory = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = IncomeCategory | ExpenseCategory;
