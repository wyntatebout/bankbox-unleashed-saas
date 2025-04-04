
import { ShoppingBag, Coffee, Home, CreditCard, ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

export interface TransactionProps {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  merchant?: {
    name: string;
    logo?: string;
  };
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "shopping":
      return <ShoppingBag className="h-4 w-4" />;
    case "food":
      return <Coffee className="h-4 w-4" />;
    case "housing":
      return <Home className="h-4 w-4" />;
    case "bills":
      return <Zap className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

const TransactionItem = ({ 
  date, 
  description, 
  amount, 
  type, 
  category,
  merchant 
}: TransactionProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="transaction-item">
      <div className="flex items-center space-x-3">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          type === "income" ? "bg-green-100" : "bg-blue-100"
        )}>
          {merchant?.logo ? (
            <img src={merchant.logo} alt={merchant.name} className="h-6 w-6" />
          ) : (
            <div className={cn(
              type === "income" ? "text-green-600" : "text-blue-600"
            )}>
              {getCategoryIcon(category)}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{description}</span>
          <span className="text-xs text-muted-foreground">{formattedDate} • {category}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={cn(
          "font-medium",
          type === "income" ? "text-green-600" : "text-foreground"
        )}>
          {type === "income" ? "+" : "-"}{formatCurrency(amount)}
        </span>
        <div className={cn(
          "rounded-full p-1",
          type === "income" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
        )}>
          {type === "income" ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
