
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccountCard from "./AccountCard";
import { Plus, CreditCard, Wallet, PiggyBank } from "lucide-react";

const accountsData = [
  {
    id: "1",
    type: "Checking",
    name: "Premium Checking",
    balance: 5650.32,
    accountNumber: "Acct. ending in 4589",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    id: "2",
    type: "Savings",
    name: "High-Yield Savings",
    balance: 12750.18,
    accountNumber: "Acct. ending in 7123",
    icon: <PiggyBank className="h-4 w-4" />,
  },
  {
    id: "3",
    type: "Credit",
    name: "Rewards Credit Card",
    balance: 1250.82,
    accountNumber: "Card ending in 9012",
    lastFour: "9012",
    limit: 5000,
    icon: <CreditCard className="h-4 w-4" />,
  },
];

const AccountsList = () => {
  return (
    <Card className="bank-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>My Accounts</CardTitle>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Account
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountsData.map((account) => (
          <AccountCard key={account.id} {...account} />
        ))}
      </CardContent>
    </Card>
  );
};

export default AccountsList;
