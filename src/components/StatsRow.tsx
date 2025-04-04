
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, isPositive, icon }: StatCardProps) => (
  <Card className="stat-card">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-2 rounded-full bg-muted/50">
        {icon}
      </div>
    </div>
    {change && (
      <div className="flex items-center mt-4">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change} from last month
        </span>
      </div>
    )}
  </Card>
);

const StatsRow = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Balance"
        value="$12,560.50"
        change="↑ 12.5%"
        isPositive={true}
        icon={<DollarSign className="w-4 h-4 text-primary" />}
      />
      <StatCard
        title="Monthly Spending"
        value="$2,150.25"
        change="↓ 3.2%"
        isPositive={false}
        icon={<CreditCard className="w-4 h-4 text-blue-500" />}
      />
      <StatCard
        title="Monthly Income"
        value="$4,250.00"
        change="↑ 8.1%"
        isPositive={true}
        icon={<TrendingUp className="w-4 h-4 text-green-500" />}
      />
      <StatCard
        title="Savings Rate"
        value="24.5%"
        change="↑ 5.3%"
        isPositive={true}
        icon={<TrendingUp className="w-4 h-4 text-purple-500" />}
      />
    </div>
  );
};

export default StatsRow;
