'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

type InvoiceStatusData = {
  paid: number;
  partiallyPaid: number;
  due: number;
};

type InvoiceStatusChartProps = {
  data: InvoiceStatusData;
};

export default function InvoiceStatusChart({ data }: InvoiceStatusChartProps) {
  const total = data?.paid || 0 + data?.partiallyPaid || 0 + data?.due || 0;

  const toPercent = (value: number) =>
    total === 0 ? 0 : Math.round((value / total) * 100);

  const segments = [
    { label: 'Paid', value: data?.paid || 0, color: '#00966D' },
    {
      label: 'Partially Paid',
      value: data?.partiallyPaid || 0,
      color: '#E8A33D',
    },
    { label: 'Due', value: data?.due || 0, color: '#E9524A' },
  ];

  const chartData = {
    labels: segments.map(s => s?.label || ''),
    datasets: [
      {
        data: segments.map(s => s?.value || 0),
        backgroundColor: segments.map(s => s?.color || ''),
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#162233',
        titleColor: '#e1e8f0',
        bodyColor: '#92a3b7',
        borderColor: '#00966D',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => `${ctx.label}: ${toPercent(ctx.parsed)}%`,
        },
      },
    },
  };

  return (
    <div className="w-full min-h-72 flex flex-col xl:flex-row items-center justify-center lg:justify-start gap-6 lg:gap-8">
      {/* Chart with center label */}
      <div className="relative w-36 h-36 lg:w-40 lg:h-40 shrink-0">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xl lg:text-2xl font-bold text-title m-0">
            {total}
          </p>
          <p className="text-xs text-text-muted m-0">Invoices</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full lg:w-auto">
        {segments.map(s => (
          <div key={s?.label || ''} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-sm text-text w-28 lg:w-28 truncate">
              {s?.label || ''}
            </span>
            <span className="text-sm font-medium text-title ml-auto lg:ml-0">
              {toPercent(s?.value || 0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
