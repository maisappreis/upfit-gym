export interface Customer {
  id: number;
  name: string;
  frequency: "1x" | "2x" | "3x" | "4x" | "5x";
  plan: "Mensal" | "Trimestral" | "Semestral" | "Anual";
  value: number;
  start: string;
  status: "Ativo" | "Inativo";
  notes: string;
};