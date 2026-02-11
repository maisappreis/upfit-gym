export interface Revenue {
  customer: number;
  id: number;
  month: string;
  name: string;
  notes: string;
  paid: "Pago" | "À pagar" | "Link enviado";
  payment_day: number;
  plan: string;
  start: string;
  status: "Ativo" | "Inativo",
  value: number | null;
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