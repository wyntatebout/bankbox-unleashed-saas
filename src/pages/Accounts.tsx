
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard, Wallet, PiggyBank } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Accounts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("checking");

  // Mock account data
  const accounts = {
    checking: [
      { id: "ch1", name: "Primary Checking", balance: 5430.28, accountNumber: "****4567" },
      { id: "ch2", name: "Joint Checking", balance: 2150.14, accountNumber: "****7890" }
    ],
    savings: [
      { id: "sv1", name: "Emergency Fund", balance: 12500.00, accountNumber: "****2345" },
      { id: "sv2", name: "Vacation Savings", balance: 3425.50, accountNumber: "****6789" }
    ],
    credit: [
      { id: "cc1", name: "Platinum Card", balance: 1250.75, limit: 10000, accountNumber: "****3456" },
      { id: "cc2", name: "Travel Rewards", balance: 578.25, limit: 8000, accountNumber: "****9012" }
    ]
  };

  const handleAddAccount = () => {
    toast({
      title: "Coming Soon",
      description: "Account creation feature will be available soon.",
    });
  };

  const handleViewDetails = (accountId: string) => {
    toast({
      title: "Account Details",
      description: `Viewing details for account ${accountId}`,
    });
  };

  return (
    <div className="container p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Accounts</h1>
        <Button onClick={handleAddAccount}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <Tabs defaultValue="checking" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checking">Checking</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="checking">
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.checking.map(account => (
              <Card key={account.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {account.name}
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">
                    Account: {account.accountNumber}
                  </p>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => handleViewDetails(account.id)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="savings">
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.savings.map(account => (
              <Card key={account.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {account.name}
                  </CardTitle>
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">
                    Account: {account.accountNumber}
                  </p>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => handleViewDetails(account.id)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="credit">
          <div className="grid gap-4 md:grid-cols-2">
            {accounts.credit.map(account => (
              <Card key={account.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {account.name}
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">
                    Account: {account.accountNumber}
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">
                    Available Credit: ${(account.limit - account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => handleViewDetails(account.id)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounts;
