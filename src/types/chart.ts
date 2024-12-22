export interface SumPerMonth {
  year: number;
  month: string;
  sum: number;
};

export interface Data {
  labels: string[];
  datasets: Dataset[];
};

interface Dataset {
  label: string;
  backgroundColor: string | string[];
  data: number[];
  borderColor?: string;
  pointRadius?: number;
};

export interface Options {
  responsive: boolean;
  plugins: {
    legend: {
      display: boolean;
      labels: {
        color: string;
        boxHeight: number;
        boxWidth: number;
        font: {
          size: number;
        };
      };
    };
    tooltip: {
      enabled: boolean;
      bodySpacing: number;
      padding: number;
      displayColors: boolean;
      titleFont: {
        size: number;
      };
      bodyFont: {
        size: number;
      };
    };
  };
};