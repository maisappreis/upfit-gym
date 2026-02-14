export interface Expense {
  id: number;
  name: string;
  month: string;
  date: string;
  paid: "Pago" | "À pagar";
  value: number | null;
  year: number;
  installments: string;
  notes: string;
};

export type CreateExpenseDTO = Omit<Expense, "id">;

export type UpdateExpenseDTO = Partial<CreateExpenseDTO>;

export interface Message {
  name: string;
  date: string;
  view: string;
};