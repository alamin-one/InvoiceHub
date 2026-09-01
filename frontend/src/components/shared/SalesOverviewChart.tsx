'use client';

import type { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type MonthlySales = {
  month: string;
  total: number;
};

type SalesOverviewChartProps = {
  data: MonthlySales[];
};

export default function SalesOverviewChart({ data }: SalesOverviewChartProps) {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Sales',
        data: data.map(item => item.total),
        backgroundColor: '#00966D',
        hoverBackgroundColor: '#007D5B',
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#162233',
        titleColor: '#e1e8f0',
        bodyColor: '#92a3b7',
        borderColor: '#00966D',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => `৳ ${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#62748a' },
      },
      y: {
        grid: { color: 'rgba(98, 116, 138, 0.15)' },
        ticks: {
          color: '#62748a',
          callback: (value: string | number) =>
            `৳${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="w-full min-h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
}
