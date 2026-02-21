export interface Revenue {
  customer: number | null;
  id: number;
  month: string;
  name: string;
  notes: string;
  paid: "Pago" | "À pagar" | "Link enviado";
  payment_day: number | null;
  plan: "Mensal" | "Trimestral" | "Semestral" | "Anual",
  start: string;
  status: "Ativo" | "Inativo",
  value: number | null;
  year: number | null;
};

export type CreateRevenueDTO = Omit<
  Revenue,
  "id" | "name" | "plan" | "start" | "status"
>;

export type UpdateRevenueDTO = Partial<CreateRevenueDTO>;