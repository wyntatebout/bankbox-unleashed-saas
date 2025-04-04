
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Send, ChevronRight } from "lucide-react";

interface AccountCardProps {
  type: string;
  name: string;
  balance: number;
  accountNumber: string;
  lastFour?: string;
  limit?: number;
  icon?: React.ReactNode;
}

const AccountCard = ({
  type,
  name,
  balance,
  accountNumber,
  lastFour,
  limit,
  icon,
}: AccountCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getUsagePercentage = () => {
    if (type === "Credit" && limit) {
      return (balance / limit) * 100;
    }
    return 0;
  };

  return (
    <Card className="bank-card hover:border-bank-primary transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
        <div className="rounded-full bg-muted p-2">
          {icon || (type === "Credit" ? <CreditCard className="h-4 w-4" /> : <Send className="h-4 w-4" />)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Available Balance</span>
            <span className="text-2xl font-bold">{formatCurrency(balance)}</span>
          </div>
          
          {type === "Credit" && limit && (
            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Credit Used</span>
                <span>{formatCurrency(balance)} of {formatCurrency(limit)}</span>
              </div>
              <Progress value={getUsagePercentage()} className="h-2" />
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              {lastFour ? `•••• ${lastFour}` : accountNumber}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
