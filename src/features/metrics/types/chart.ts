export interface Chart {
  labels: string[];
  data: number[];
};

export interface ChartRevenueExpense {
  labels: string[];
  data: {
    revenue: number[];
    expense: number[];
  }
};

export interface Dashboard {
  active_inactive_customers: Chart;
  number_of_active_customer_per_month: Chart;
  monthly_profit: Chart;
  revenue_versus_expense: ChartRevenueExpense;
};