
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard, Wallet, PiggyBank, FileText, ArrowDownToLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Accounts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("checking");
  const [isGeneratingStatement, setIsGeneratingStatement] = useState(false);
  const [statements, setStatements] = useState<{
    id: string;
    accountId: string;
    period: string;
    generatedDate: string;
    downloadUrl: string;
  }[]>([]);

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

  // Generate mock transactions for statement
  const generateTransactions = (accountId: string, count: number) => {
    const transactions = [];
    const startDate = new Date(2025, 2, 1); // March 1, 2025
    const endDate = new Date(2025, 2, 31); // March 31, 2025
    
    const dateRange = endDate.getTime() - startDate.getTime();
    
    for (let i = 0; i < count; i++) {
      const isDeposit = Math.random() > 0.5;
      const randomDate = new Date(startDate.getTime() + Math.random() * dateRange);
      
      transactions.push({
        id: `tx-${i}`,
        date: randomDate.toISOString().split('T')[0],
        description: isDeposit 
          ? ["Deposit", "Transfer", "Direct Deposit", "Refund", "Interest Payment"][Math.floor(Math.random() * 5)] 
          : ["Grocery Store", "Gas Station", "Online Purchase", "Restaurant", "Utility Bill"][Math.floor(Math.random() * 5)],
        amount: isDeposit 
          ? +(Math.random() * 1000 + 50).toFixed(2) 
          : -(Math.random() * 500 + 10).toFixed(2),
        balance: 0, // Will be calculated later
      });
    }
    
    // Sort by date
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate running balance
    let balance = accountId.startsWith("ch") 
      ? 4000 + Math.random() * 1000 
      : accountId.startsWith("sv") 
      ? 10000 + Math.random() * 5000 
      : 0;
      
    for (let tx of transactions) {
      balance += tx.amount;
      tx.balance = +balance.toFixed(2);
    }
    
    return transactions;
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
  
  const handleGenerateStatement = () => {
    setIsGeneratingStatement(true);
    
    // Simulate generating a statement
    setTimeout(() => {
      const newStatement = {
        id: `stmt-${Date.now()}`,
        accountId: "ch1",
        period: "March 2025",
        generatedDate: new Date().toLocaleDateString(),
        downloadUrl: "#" // In a real app, this would be a URL to download the statement
      };
      
      setStatements([...statements, newStatement]);
      setIsGeneratingStatement(false);
      
      toast({
        title: "Statement Generated",
        description: "Your March 2025 statement is ready for download.",
      });
    }, 1500);
  };
  
  const handleDownloadStatement = (statementId: string) => {
    // Find the statement
    const statement = statements.find(s => s.id === statementId);
    if (!statement) return;
    
    // Generate the statement content
    const transactions = generateTransactions(statement.accountId, 100);
    const account = Object.values(accounts).flat().find(a => a.id === statement.accountId);
    
    // Create CSV content
    let csvContent = "Date,Description,Amount,Balance\n";
    transactions.forEach(tx => {
      csvContent += `${tx.date},"${tx.description}",${tx.amount.toFixed(2)},${tx.balance.toFixed(2)}\n`;
    });
    
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${account?.name.replace(/\s+/g, '_')}_statement_March_2025.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Statement Downloaded",
      description: `Your ${statement.period} statement has been downloaded.`,
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checking">Checking</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
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
        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle>Account Statements</CardTitle>
              <CardDescription>View and download your account statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Button 
                      onClick={handleGenerateStatement} 
                      disabled={isGeneratingStatement}
                      className="w-full"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Generate March 2025 Statement
                      {isGeneratingStatement && <span className="ml-2">...</span>}
                    </Button>
                  </div>
                </div>
                
                {statements.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Generated On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statements.map((statement) => (
                        <TableRow key={statement.id}>
                          <TableCell className="font-medium">{statement.period}</TableCell>
                          <TableCell>{statement.generatedDate}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownloadStatement(statement.id)}
                            >
                              <ArrowDownToLine className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-6 border rounded-md bg-muted/30">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No statements generated yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generate a statement to see it here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounts;
