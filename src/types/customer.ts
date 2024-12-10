export interface Customer {
  id: number;
  name: string;
  frequency: string;
  plan: string;
  value: number;
  start: string;
  status: string;
  notes: string;
};

export interface CustomerPerMonth {
  month: string;
  sum: number;
  year: number;
};