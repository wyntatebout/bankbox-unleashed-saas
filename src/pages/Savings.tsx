import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Target, Car, Home, Plane, GraduationCap, Gift, Edit, Trash2, ArrowRightLeft, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

// Helper function to get a goal icon
const getGoalIcon = (category) => {
  switch (category) {
    case "Travel":
      return <Plane className="h-5 w-5" />;
    case "Home":
      return <Home className="h-5 w-5" />;
    case "Car":
      return <Car className="h-5 w-5" />;
    case "Education":
      return <GraduationCap className="h-5 w-5" />;
    case "Gift":
      return <Gift className="h-5 w-5" />;
    default:
      return <Target className="h-5 w-5" />;
  }
};

const Savings = () => {
  const { toast } = useToast();
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [autoTransferOpen, setAutoTransferOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalCategory, setGoalCategory] = useState("Travel");
  const [contributionAmount, setContributionAmount] = useState("");
  const [currentGoalId, setCurrentGoalId] = useState(null);
  const [transferFromGoalId, setTransferFromGoalId] = useState(null);
  const [transferToGoalId, setTransferToGoalId] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [autoTransferGoalId, setAutoTransferGoalId] = useState(null);
  const [autoTransferAmount, setAutoTransferAmount] = useState("");
  const [autoTransferFrequency, setAutoTransferFrequency] = useState("weekly");

  // Mock bank accounts data
  const [accounts, setAccounts] = useState([
    { id: "account1", name: "Checking Account", balance: 5423.65 },
    { id: "account2", name: "Savings Account", balance: 12750.42 },
  ]);

  // Mock auto-transfers data
  const [autoTransfers, setAutoTransfers] = useState([]);

  // Mock savings goals data
  const [goals, setGoals] = useState([
    {
      id: "goal1",
      name: "New Car",
      category: "Car",
      currentAmount: 5000,
      targetAmount: 20000,
      progress: 25,
      autoTransfer: null
    },
    {
      id: "goal2",
      name: "Summer Vacation",
      category: "Travel",
      currentAmount: 2500,
      targetAmount: 5000,
      progress: 50,
      autoTransfer: null
    },
    {
      id: "goal3",
      name: "Emergency Fund",
      category: "Other",
      currentAmount: 8000,
      targetAmount: 10000,
      progress: 80,
      autoTransfer: null
    }
  ]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    
    if (!goalName || !goalAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for your savings goal.",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(goalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid target amount.",
        variant: "destructive"
      });
      return;
    }

    // Create new goal
    const newGoal = {
      id: `goal${goals.length + 1}`,
      name: goalName,
      category: goalCategory,
      currentAmount: 0,
      targetAmount: parseFloat(goalAmount),
      progress: 0,
      autoTransfer: null
    };

    setGoals([...goals, newGoal]);
    
    toast({
      title: "Savings Goal Created",
      description: `Your ${goalName} savings goal has been set up.`
    });

    // Reset form and close dialog
    setGoalName("");
    setGoalAmount("");
    setNewGoalOpen(false);
  };

  const handleEditGoal = (e) => {
    e.preventDefault();
    
    if (!goalName || !goalAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for your savings goal.",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(goalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid target amount.",
        variant: "destructive"
      });
      return;
    }

    // Update the goal
    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoalId) {
        const newTargetAmount = parseFloat(goalAmount);
        const newProgress = Math.round((goal.currentAmount / newTargetAmount) * 100);
        
        return {
          ...goal,
          name: goalName,
          category: goalCategory,
          targetAmount: newTargetAmount,
          progress: newProgress
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    
    toast({
      title: "Savings Goal Updated",
      description: `Your ${goalName} savings goal has been updated.`
    });

    // Reset form and close dialog
    setGoalName("");
    setGoalAmount("");
    setCurrentGoalId(null);
    setEditGoalOpen(false);
  };

  const handleDeleteGoal = (goalId) => {
    // Filter out the goal to delete
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    
    // Also remove any auto-transfers for this goal
    const updatedAutoTransfers = autoTransfers.filter(transfer => transfer.goalId !== goalId);
    setAutoTransfers(updatedAutoTransfers);
    
    toast({
      title: "Savings Goal Deleted",
      description: "Your savings goal has been deleted."
    });
  };

  const handleEditClick = (goalId) => {
    const goalToEdit = goals.find(goal => goal.id === goalId);
    if (goalToEdit) {
      setCurrentGoalId(goalId);
      setGoalName(goalToEdit.name);
      setGoalAmount(goalToEdit.targetAmount.toString());
      setGoalCategory(goalToEdit.category);
      setEditGoalOpen(true);
    }
  };

  const handleContributeClick = (goalId) => {
    setCurrentGoalId(goalId);
    setContributionAmount("");
    setContributeOpen(true);
  };

  const handleContribute = (e) => {
    e.preventDefault();
    
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount.",
        variant: "destructive"
      });
      return;
    }

    // Find the goal and update it
    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoalId) {
        const amount = parseFloat(contributionAmount);
        const newCurrentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        const newProgress = Math.round((newCurrentAmount / goal.targetAmount) * 100);
        
        toast({
          title: "Contribution Made",
          description: `$${amount.toFixed(2)} added to your ${goal.name} goal.`
        });
        
        return {
          ...goal,
          currentAmount: newCurrentAmount,
          progress: newProgress
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    setContributionAmount("");
    setCurrentGoalId(null);
    setContributeOpen(false);
  };

  const handleTransferClick = () => {
    setTransferFromGoalId(null);
    setTransferToGoalId(null);
    setTransferAmount("");
    setTransferOpen(true);
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    
    if (!transferFromGoalId || !transferToGoalId) {
      toast({
        title: "Missing Selection",
        description: "Please select goals to transfer from and to.",
        variant: "destructive"
      });
      return;
    }

    if (transferFromGoalId === transferToGoalId) {
      toast({
        title: "Invalid Selection",
        description: "You cannot transfer to the same goal.",
        variant: "destructive"
      });
      return;
    }

    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid transfer amount.",
        variant: "destructive"
      });
      return;
    }

    const fromGoal = goals.find(goal => goal.id === transferFromGoalId);
    const amount = parseFloat(transferAmount);

    if (amount > fromGoal.currentAmount) {
      toast({
        title: "Insufficient Funds",
        description: `The maximum amount you can transfer is $${fromGoal.currentAmount.toFixed(2)}.`,
        variant: "destructive"
      });
      return;
    }

    // Update both goals
    const updatedGoals = goals.map(goal => {
      if (goal.id === transferFromGoalId) {
        const newCurrentAmount = goal.currentAmount - amount;
        const newProgress = Math.round((newCurrentAmount / goal.targetAmount) * 100);
        
        return {
          ...goal,
          currentAmount: newCurrentAmount,
          progress: newProgress
        };
      }
      
      if (goal.id === transferToGoalId) {
        const newCurrentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        const newProgress = Math.round((newCurrentAmount / goal.targetAmount) * 100);
        
        return {
          ...goal,
          currentAmount: newCurrentAmount,
          progress: newProgress
        };
      }
      
      return goal;
    });
    
    setGoals(updatedGoals);
    
    const fromGoalName = goals.find(goal => goal.id === transferFromGoalId).name;
    const toGoalName = goals.find(goal => goal.id === transferToGoalId).name;
    
    toast({
      title: "Transfer Complete",
      description: `$${amount.toFixed(2)} transferred from ${fromGoalName} to ${toGoalName}.`
    });

    setTransferFromGoalId(null);
    setTransferToGoalId(null);
    setTransferAmount("");
    setTransferOpen(false);
  };

  const handleAccountContribute = (e, accountId, goalId) => {
    e.preventDefault();
    
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(contributionAmount);
    const account = accounts.find(acc => acc.id === accountId);
    
    if (amount > account.balance) {
      toast({
        title: "Insufficient Funds",
        description: `Your ${account.name} has insufficient funds for this transfer.`,
        variant: "destructive"
      });
      return;
    }

    // Update the account balance
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          balance: acc.balance - amount
        };
      }
      return acc;
    });
    
    setAccounts(updatedAccounts);

    // Update the goal
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        const newProgress = Math.round((newCurrentAmount / goal.targetAmount) * 100);
        
        return {
          ...goal,
          currentAmount: newCurrentAmount,
          progress: newProgress
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    
    const goalName = goals.find(goal => goal.id === goalId).name;
    const accountName = account.name;
    
    toast({
      title: "Contribution Made",
      description: `$${amount.toFixed(2)} transferred from ${accountName} to ${goalName}.`
    });

    setContributionAmount("");
    setCurrentGoalId(null);
    setContributeOpen(false);
  };

  const handleAutoTransferClick = (goalId) => {
    setAutoTransferGoalId(goalId);
    setAutoTransferAmount("");
    setAutoTransferFrequency("weekly");
    setAutoTransferOpen(true);
  };

  const handleSetupAutoTransfer = (e) => {
    e.preventDefault();
    
    if (!autoTransferAmount || parseFloat(autoTransferAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid transfer amount.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(autoTransferAmount);
    const goal = goals.find(g => g.id === autoTransferGoalId);
    
    // Create new auto-transfer
    const newAutoTransfer = {
      id: `transfer${autoTransfers.length + 1}`,
      goalId: autoTransferGoalId,
      amount: amount,
      frequency: autoTransferFrequency,
      nextTransferDate: getNextTransferDate(autoTransferFrequency),
      accountId: "account1" // Default to checking account
    };

    setAutoTransfers([...autoTransfers, newAutoTransfer]);
    
    // Update the goal with auto-transfer info
    const updatedGoals = goals.map(g => {
      if (g.id === autoTransferGoalId) {
        return {
          ...g,
          autoTransfer: newAutoTransfer.id
        };
      }
      return g;
    });
    
    setGoals(updatedGoals);
    
    toast({
      title: "Auto-Transfer Set Up",
      description: `$${amount.toFixed(2)} will be automatically transferred ${autoTransferFrequency} to your ${goal.name} goal.`
    });

    setAutoTransferGoalId(null);
    setAutoTransferAmount("");
    setAutoTransferOpen(false);
  };

  const handleCancelAutoTransfer = (goalId) => {
    // Find the goal and its auto-transfer
    const goal = goals.find(g => g.id === goalId);
    
    if (!goal.autoTransfer) return;
    
    // Remove the auto-transfer
    const updatedAutoTransfers = autoTransfers.filter(transfer => transfer.id !== goal.autoTransfer);
    setAutoTransfers(updatedAutoTransfers);
    
    // Update the goal
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          autoTransfer: null
        };
      }
      return g;
    });
    
    setGoals(updatedGoals);
    
    toast({
      title: "Auto-Transfer Cancelled",
      description: `Auto-transfer for ${goal.name} has been cancelled.`
    });
  };

  // Helper function to get next transfer date based on frequency
  const getNextTransferDate = (frequency) => {
    const date = new Date();
    switch (frequency) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        date.setDate(date.getDate() + 7);
    }
    return date.toISOString().split('T')[0];
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Savings Goals</h1>
        <div className="flex space-x-2">
          <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleTransferClick}>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transfer Between Goals
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Between Goals</DialogTitle>
                <DialogDescription>
                  Move money from one savings goal to another.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTransfer}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-goal">From Goal</Label>
                    <select
                      id="from-goal"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={transferFromGoalId || ""}
                      onChange={(e) => setTransferFromGoalId(e.target.value)}
                    >
                      <option value="">Select a goal</option>
                      {goals.filter(goal => goal.currentAmount > 0).map(goal => (
                        <option key={goal.id} value={goal.id}>
                          {goal.name} ({formatCurrency(goal.currentAmount)} available)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-goal">To Goal</Label>
                    <select
                      id="to-goal"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={transferToGoalId || ""}
                      onChange={(e) => setTransferToGoalId(e.target.value)}
                    >
                      <option value="">Select a goal</option>
                      {goals.filter(goal => goal.progress < 100).map(goal => (
                        <option key={goal.id} value={goal.id}>
                          {goal.name} ({formatCurrency(goal.targetAmount - goal.currentAmount)} needed)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transfer-amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="transfer-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Transfer Funds</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Savings Goal</DialogTitle>
                <DialogDescription>
                  Set up a new savings goal to help you save for something special.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGoal}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input
                      id="goal-name"
                      placeholder="e.g., Dream Vacation, New Car"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-amount">Target Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="goal-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-category">Category</Label>
                    <select
                      id="goal-category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={goalCategory}
                      onChange={(e) => setGoalCategory(e.target.value)}
                    >
                      <option value="Travel">Travel</option>
                      <option value="Home">Home</option>
                      <option value="Car">Car</option>
                      <option value="Education">Education</option>
                      <option value="Gift">Gift</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={editGoalOpen} onOpenChange={setEditGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Savings Goal</DialogTitle>
            <DialogDescription>
              Update your savings goal details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditGoal}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-goal-name">Goal Name</Label>
                <Input
                  id="edit-goal-name"
                  placeholder="e.g., Dream Vacation, New Car"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-goal-amount">Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="edit-goal-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-goal-category">Category</Label>
                <select
                  id="edit-goal-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                >
                  <option value="Travel">Travel</option>
                  <option value="Home">Home</option>
                  <option value="Car">Car</option>
                  <option value="Education">Education</option>
                  <option value="Gift">Gift</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleDeleteGoal(currentGoalId)}
                className="mr-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Goal
              </Button>
              <Button type="submit">Update Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contribute Dialog */}
      <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contribution</DialogTitle>
            <DialogDescription>
              Add money to your savings goal from an account or external source.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="accounts">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="accounts">From Account</TabsTrigger>
              <TabsTrigger value="external">External Source</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accounts">
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="contribution-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="contribution-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Select Account</Label>
                  <div className="space-y-2">
                    {accounts.map(account => (
                      <Card key={account.id} className="p-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(account.balance)} available</p>
                          </div>
                          <Button 
                            onClick={(e) => handleAccountContribute(e, account.id, currentGoalId)}
                            disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
                          >
                            Transfer
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="external">
              <form onSubmit={handleContribute}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="external-contribution-amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="external-contribution-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Contribution</Button>
                  </DialogFooter>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Auto-Transfer Dialog */}
      <Dialog open={autoTransferOpen} onOpenChange={setAutoTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Automatic Transfers</DialogTitle>
            <DialogDescription>
              Configure a recurring transfer to this savings goal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSetupAutoTransfer}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="auto-transfer-amount">Transfer Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="auto-transfer-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={autoTransferAmount}
