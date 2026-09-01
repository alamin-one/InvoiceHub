import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/card';

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  amount: string;
  changePercent?: number;
  iconColor?: string;
  iconBg?: string;
};

export default function StatCard({
  icon: Icon,
  label,
  amount,
  changePercent,
  iconColor = '#00966D',
  iconBg = 'rgba(0, 150, 109, 0.12)',
}: StatCardProps) {
  const isPositive = (changePercent || 0) >= 0;

  return (
    <Card className="">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center`}
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} color={iconColor} strokeWidth={2} />
        </div>

        {changePercent !== undefined && (
          <span
            className={`text-xs font-medium flex items-center gap-1 ${
              isPositive ? 'text-success' : 'text-danger'
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}
            {changePercent}%
          </span>
        )}
      </div>

      <p className="text-sm text-text m-0 mb-1">{label}</p>
      <p className="text-xl md:text-2x font-bold text-title">{amount}</p>
    </Card>
  );
}
