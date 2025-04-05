import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard, Wallet, PiggyBank, FileText, ArrowDownToLine, Calendar, Filter, Settings, Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { generateBankStatement, StatementTemplate } from "../utils/statementGenerator";

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
    type: StatementTemplate;
  }[]>([]);
  
  // State for statement generator
  const [statementDate, setStatementDate] = useState<Date | undefined>(new Date());
  const [selectedAccount, setSelectedAccount] = useState("ch1");
  const [selectedTemplate, setSelectedTemplate] = useState<StatementTemplate>("modern");
  const [includeAccountNumbers, setIncludeAccountNumbers] = useState(true);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [statementPassword, setStatementPassword] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAmount, setFilterAmount] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [viewingAccountId, setViewingAccountId] = useState<string | null>(null);
  const [includeWatermark, setIncludeWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  
  // Templates for the bank statements
  const templates = [
    { id: "modern", name: "Modern (White)" },
    { id: "classic", name: "Classic (Formal)" },
    { id: "minimal", name: "Minimal (Clean)" },
    { id: "branded", name: "Branded (Full Color)" }
  ];

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
    
    const categories = ["Shopping", "Dining", "Transportation", "Utilities", "Entertainment", "Healthcare", "Income", "Transfer"];
    
    for (let i = 0; i < count; i++) {
      const isDeposit = Math.random() > 0.5;
      const randomDate = new Date(startDate.getTime() + Math.random() * dateRange);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const description = isDeposit 
        ? ["Deposit", "Transfer", "Direct Deposit", "Refund", "Interest Payment"][Math.floor(Math.random() * 5)] 
        : ["Grocery Store", "Gas Station", "Online Purchase", "Restaurant", "Utility Bill"][Math.floor(Math.random() * 5)];
      const amount = isDeposit 
        ? +(Math.random() * 1000 + 50).toFixed(2) 
        : -(Math.random() * 500 + 10).toFixed(2);
      
      transactions.push({
        id: `tx-${i}`,
        date: randomDate.toISOString().split('T')[0],
        description,
        category,
        amount,
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
    setViewingAccountId(accountId);
    
    // Set active tab to statements
    setActiveTab("statements");
    
    // Generate a sample statement for this account if one doesn't exist
    const hasExistingStatement = statements.some(s => s.accountId === accountId);
    
    if (!hasExistingStatement) {
      const account = Object.values(accounts)
        .flat()
        .find(account => account.id === accountId);
        
      if (account) {
        const newStatement = {
          id: `stmt-auto-${Date.now()}`,
          accountId: accountId,
          period: "March 2025",
          generatedDate: new Date().toLocaleDateString(),
          downloadUrl: "#",
          type: "modern"
        };
        
        setStatements(prev => [...prev, newStatement]);
        
        toast({
          title: "Statement Generated",
          description: `A sample statement for ${account.name} has been generated.`,
        });
      }
    }
  };
  
  const handleGenerateStatement = () => {
    if (!statementDate) {
      toast({
        title: "Date Required",
        description: "Please select a statement date.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingStatement(true);
    
    // Simulate generating a statement
    setTimeout(() => {
      const selectedAccountObj = Object.values(accounts)
        .flat()
        .find(account => account.id === selectedAccount);
        
      if (!selectedAccountObj) {
        toast({
          title: "Error",
          description: "Account not found.",
          variant: "destructive"
        });
        setIsGeneratingStatement(false);
        return;
      }
      
      const month = format(statementDate, 'MMMM yyyy');
      
      const newStatement = {
        id: `stmt-${Date.now()}`,
        accountId: selectedAccount,
        period: month,
        generatedDate: new Date().toLocaleDateString(),
        downloadUrl: "#",
        type: selectedTemplate
      };
      
      setStatements([...statements, newStatement]);
      setIsGeneratingStatement(false);
      
      toast({
        title: "Statement Generated",
        description: `Your ${month} statement is ready for download.`,
      });
      
      // Reset some form fields
      setPasswordProtect(false);
      setStatementPassword("");
      
      // Auto-switch to statements tab
      setActiveTab("statements");
    }, 1500);
  };
  
  const handleDownloadStatement = (statementId: string) => {
    // Find the statement
    const statement = statements.find(s => s.id === statementId);
    if (!statement) return;
    
    // Generate the statement content
    let transactions = generateTransactions(statement.accountId, 100);
    const account = Object.values(accounts).flat().find(a => a.id === statement.accountId);
    
    if (!account) {
      toast({
        title: "Error",
        description: "Account not found.",
        variant: "destructive"
      });
      return;
    }
    
    // Apply filters if we're in the preview mode
    if (filterCategory !== "all") {
      transactions = transactions.filter(tx => tx.category === filterCategory);
    }
    
    if (filterAmount && !isNaN(parseFloat(filterAmount))) {
      const amount = parseFloat(filterAmount);
      transactions = transactions.filter(tx => Math.abs(tx.amount) >= amount);
    }
    
    // Generate the PDF with our utility
    const pdfDoc = generateBankStatement({
      template: statement.type,
      account,
      period: statement.period,
      includeAccountNumbers,
      transactions,
      passwordProtect,
      password: statementPassword,
      watermark: includeWatermark ? watermarkText : undefined
    });
    
    // Save the PDF
    const filename = `${account.name.replace(/\s+/g, '_')}_statement_${statement.period.replace(/\s+/g, '_')}.pdf`;
    pdfDoc.save(filename);
    
    toast({
      title: "Statement Downloaded",
      description: `Your ${statement.period} statement has been downloaded.`,
    });
  };
  
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // Filter statements based on viewing account
  const filteredStatements = viewingAccountId
    ? statements.filter(s => s.accountId === viewingAccountId)
    : statements;

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="checking">Checking</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="generator">Statement Generator</TabsTrigger>
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
              <CardTitle>
                {viewingAccountId ? 
                  `Statements for ${Object.values(accounts).flat().find(a => a.id === viewingAccountId)?.name || 'Account'}` : 
                  'Account Statements'
                }
              </CardTitle>
              <CardDescription>
                {viewingAccountId ? 
                  `View and download statements for this account` : 
                  'View and download your account statements'
                }
              </CardDescription>
              {viewingAccountId && (
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => setViewingAccountId(null)}
                >
                  Show All Accounts
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={togglePreviewMode}
                  className="mb-4"
                >
                  {previewMode ? (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Hide Preview Options
                    </>
                  ) : (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Show Preview Options
                    </>
                  )}
                </Button>
                
                {previewMode && (
                  <div className="grid gap-4 mb-6 p-4 border rounded-md">
                    <h3 className="font-medium">Statement Preview Options</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Filter by Category</label>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Dining">Dining</SelectItem>
                            <SelectItem value="Transportation">Transportation</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Income">Income</SelectItem>
                            <SelectItem value="Transfer">Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Minimum Amount</label>
                        <Input 
                          type="number" 
                          placeholder="Minimum amount"
                          value={filterAmount}
                          onChange={(e) => setFilterAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {filteredStatements.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Generated On</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStatements.map((statement) => {
                        const account = Object.values(accounts).flat().find(a => a.id === statement.accountId);
                        return (
                          <TableRow key={statement.id}>
                            <TableCell className="font-medium">{statement.period}</TableCell>
                            <TableCell>{account?.name || 'Unknown Account'}</TableCell>
                            <TableCell>{statement.generatedDate}</TableCell>
                            <TableCell className="capitalize">{statement.type}</TableCell>
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
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-6 border rounded-md bg-muted/30">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No statements generated yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use the Statement Generator to create a statement
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Bank Statement Generator</CardTitle>
              <CardDescription>
                Generate custom-branded bank statements with your preferred layout and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statement Period</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {statementDate ? (
                            format(statementDate, "MMMM yyyy")
                          ) : (
                            <span>Select period</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={statementDate}
                          onSelect={setStatementDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                          showOutsideDays={false}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Account</label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ch1">Primary Checking</SelectItem>
                        <SelectItem value="ch2">Joint Checking</SelectItem>
                        <SelectItem value="sv1">Emergency Fund</SelectItem>
                        <SelectItem value="sv2">Vacation Savings</SelectItem>
                        <SelectItem value="cc1">Platinum Card</SelectItem>
                        <SelectItem value="cc2">Travel Rewards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Statement Template</label>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {templates.map(template => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer border-2 transition-all ${selectedTemplate === template.id ? 'border-primary' : 'border-muted hover:border-muted-foreground/50'}`}
                        onClick={() => setSelectedTemplate(template.id as StatementTemplate)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className={`mb-2 mx-auto rounded-md h-20 w-full flex items-center justify-center ${
                            template.id === 'modern' ? 'bg-white border' : 
                            template.id === 'classic' ? 'bg-muted' : 
                            template.id === 'minimal' ? 'bg-background' : 
                            'bg-gradient-to-br from-primary to-primary/60 text-white'
                          }`}>
                            <FileText className="h-8 w-8" />
                          </div>
                          <p className="text-sm font-medium">{template.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-account-numbers" 
                        checked={includeAccountNumbers}
                        onCheckedChange={(checked) => setIncludeAccountNumbers(checked === true)} 
                      />
                      <label
                        htmlFor="include-account-numbers"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include account numbers
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="include-watermark" 
                        checked={includeWatermark}
                        onCheckedChange={(checked) => setIncludeWatermark(checked === true)} 
                      />
                      <label
                        htmlFor="include-watermark"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Add watermark
                      </label>
                    </div>
                    
                    {includeWatermark && (
                      <div>
                        <Input
                          placeholder="Watermark text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="password-protect" 
                        checked={passwordProtect}
                        onCheckedChange={(checked) => setPasswordProtect(checked === true)} 
                      />
                      <label
                        htmlFor="password-protect"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Password protect PDF
                      </label>
                    </div>
                    
                    {passwordProtect && (
                      <div>
                        <Input
                          type="password"
                          placeholder="Enter password for PDF"
                          value={statementPassword}
                          onChange={(e) => setStatementPassword(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Password will be required to open the PDF
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview Statement
              </Button>
              <Button 
                onClick={handleGenerateStatement} 
                disabled={isGeneratingStatement}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Statement
                {isGeneratingStatement && <span className="ml-2">...</span>}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounts;
