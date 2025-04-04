
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, CalendarClock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Transfers = () => {
  const { toast } = useToast();
  const [transferType, setTransferType] = useState("between");
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [date, setDate] = useState("");

  // Mock accounts data
  const accounts = [
    { id: "ch1", name: "Primary Checking", balance: 5430.28 },
    { id: "ch2", name: "Joint Checking", balance: 2150.14 },
    { id: "sv1", name: "Emergency Fund", balance: 12500.00 },
    { id: "sv2", name: "Vacation Savings", balance: 3425.50 },
  ];

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !fromAccount || !toAccount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid transfer amount.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Transfer Initiated",
      description: `$${amount} will be transferred from ${fromAccount} to ${toAccount}${date ? ` on ${date}` : ' now'}.`,
    });

    // Reset form
    setAmount("");
    setDate("");
  };

  return (
    <div className="container p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Money Transfers</h1>

      <Tabs defaultValue="between" value={transferType} onValueChange={setTransferType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="between">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Between Accounts
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <CalendarClock className="mr-2 h-4 w-4" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="external">
            <Users className="mr-2 h-4 w-4" />
            Send to Others
          </TabsTrigger>
        </TabsList>

        <TabsContent value="between">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Between Your Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="from-account">From Account</Label>
                    <Select value={fromAccount} onValueChange={setFromAccount}>
                      <SelectTrigger id="from-account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.name}>
                            {account.name} (${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-account">To Account</Label>
                    <Select value={toAccount} onValueChange={setToAccount}>
                      <SelectTrigger id="to-account">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.name}>
                            {account.name} (${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date (Optional)</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">Transfer Funds</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Scheduled Transfers</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any upcoming transfers scheduled.</p>
                <Button onClick={() => setTransferType("between")}>Schedule a Transfer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="external">
          <Card>
            <CardHeader>
              <CardTitle>Send Money to Others</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">External Transfer Feature</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send money to friends, family, or pay bills directly from your account.
                </p>
                <Button onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "External transfers will be available in the next update."
                  });
                }}>
                  Set Up External Transfers
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transfers;
