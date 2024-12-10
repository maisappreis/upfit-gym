export interface Data {
  labels: string[];
  datasets: Dataset[];
};

interface Dataset {
  label: string;
  backgroundColor: string;
  borderColor: string;
  pointRadius: number;
  data: number[];
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