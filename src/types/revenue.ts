export interface Revenue {
  customer: number;
  id: number;
  month: string;
  name: string;
  notes: string;
  paid: string;
  payment_day: number;
  plan: string;
  start: string;
  status: string;
  value: number;
  year: number;
};

export interface UpdatedRevenue {
  id: number;
  month: string;
  year: number;
  name: string;
  currentValue: number;
  updatedValue: number;
};

export interface Message {
  name: string;
  date: string;
};