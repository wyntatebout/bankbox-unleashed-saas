import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Target, Car, Home, Plane, GraduationCap, Gift, Pencil, Trash2, ArrowRightLeft, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock accounts data
const mockAccounts = [
  { id: "checking", name: "Checking Account", balance: 12500.00 },
  { id: "savings", name: "Savings Account", balance: 34200.00 },
  { id: "investment", name: "Investment Account", balance: 87500.00 },
];

const getGoalIcon = (category: string) => {
  switch (category) {
    case "Travel": return <Plane className="h-5 w-5" />;
    case "Home": return <Home className="h-5 w-5" />;
    case "Car": return <Car className="h-5 w-5" />;
    case "Education": return <GraduationCap className="h-5 w-5" />;
    case "Gift": return <Gift className="h-5 w-5" />;
    default: return <Target className="h-5 w-5" />;
  }
};

type Goal = {
  id: string;
  name: string;
  category: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  autoTransfer?: {
    amount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    sourceAccount: string;
  };
};

const Savings = () => {
  const { toast } = useToast();
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [autoTransferOpen, setAutoTransferOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalCategory, setGoalCategory] = useState("Travel");
  const [contributionAmount, setContributionAmount] = useState("");
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [sourceAccount, setSourceAccount] = useState("checking");
  const [autoTransferAmount, setAutoTransferAmount] = useState("");
  const [autoTransferFrequency, setAutoTransferFrequency] = useState<"weekly" | "biweekly" | "monthly">("monthly");

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "goal1",
      name: "New Car",
      category: "Car",
      currentAmount: 5000,
      targetAmount: 20000,
      progress: 25
    },
    {
      id: "goal2",
      name: "Summer Vacation",
      category: "Travel",
      currentAmount: 2500,
      targetAmount: 5000,
      progress: 50
    },
    {
      id: "goal3",
      name: "Emergency Fund",
      category: "Other",
      currentAmount: 8000,
      targetAmount: 10000,
      progress: 80
    }
  ]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goalName || !goalAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for your savings goal.",
        variant: "destructive"
      });
      return;
    }

    const targetAmount = parseFloat(goalAmount);
    if (targetAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid target amount.",
        variant: "destructive"
      });
      return;
    }

    const newGoal: Goal = {
      id: `goal${goals.length + 1}`,
      name: goalName,
      category: goalCategory,
      currentAmount: 0,
      targetAmount,
      progress: 0
    };

    setGoals([...goals, newGoal]);
    toast({
      title: "Savings Goal Created",
      description: `Your ${goalName} savings goal has been set up.`
    });

    setGoalName("");
    setGoalAmount("");
    setNewGoalOpen(false);
  };

  const handleEditGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGoal) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoal.id) {
        return {
          ...goal,
          name: goalName,
          category: goalCategory,
          targetAmount: parseFloat(goalAmount),
          progress: Math.round((goal.currentAmount / parseFloat(goalAmount)) * 100)
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    toast({
      title: "Goal Updated",
      description: `Your ${goalName} goal has been updated.`
    });
    setEditGoalOpen(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal Deleted",
      description: "Your savings goal has been removed."
    });
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGoal || !contributionAmount) return;

    const amount = parseFloat(contributionAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoal.id) {
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
    setContributeOpen(false);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGoal || !transferAmount) return;

    const amount = parseFloat(transferAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid transfer amount.",
        variant: "destructive"
      });
      return;
    }

    const source = mockAccounts.find(acc => acc.id === sourceAccount);
    if (!source || source.balance < amount) {
      toast({
        title: "Insufficient Funds",
        description: "Not enough money in the selected account.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoal.id) {
        const newCurrentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        const newProgress = Math.round((newCurrentAmount / goal.targetAmount) * 100);
        
        toast({
          title: "Transfer Successful",
          description: `$${amount.toFixed(2)} transferred from ${source?.name} to your ${goal.name} goal.`
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
    setTransferAmount("");
    setTransferOpen(false);
  };

  const handleAutoTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGoal || !autoTransferAmount) return;

    const amount = parseFloat(autoTransferAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid transfer amount.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoal.id) {
        toast({
          title: "Auto Transfer Set Up",
          description: `Auto transfer of $${amount.toFixed(2)} ${autoTransferFrequency} from ${mockAccounts.find(a => a.id === sourceAccount)?.name} to your ${goal.name} goal.`
        });
        
        return {
          ...goal,
          autoTransfer: {
            amount,
            frequency: autoTransferFrequency,
            sourceAccount
          }
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    setAutoTransferAmount("");
    setAutoTransferOpen(false);
  };

  const openEditDialog = (goal: Goal) => {
    setCurrentGoal(goal);
    setGoalName(goal.name);
    setGoalAmount(goal.targetAmount.toString());
    setGoalCategory(goal.category);
    setEditGoalOpen(true);
  };

  const openContributeDialog = (goal: Goal) => {
    setCurrentGoal(goal);
    setContributionAmount("");
    setContributeOpen(true);
  };

  const openTransferDialog = (goal: Goal) => {
    setCurrentGoal(goal);
    setTransferAmount("");
    setTransferOpen(true);
  };

  const openAutoTransferDialog = (goal: Goal) => {
    setCurrentGoal(goal);
    setAutoTransferAmount(goal.autoTransfer?.amount.toString() || "");
    setAutoTransferFrequency(goal.autoTransfer?.frequency || "monthly");
    setSourceAccount(goal.autoTransfer?.sourceAccount || "checking");
    setAutoTransferOpen(true);
  };

  return (
    <div className="container p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Savings Goals</h1>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-md font-medium">
                  {goal.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted p-1">
                    {getGoalIcon(goal.category)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => openEditDialog(goal)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{goal.category}</CardDescription>
              {goal.autoTransfer && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CalendarClock className="h-3 w-3" />
                  <span>
                    Auto: ${goal.autoTransfer.amount} {goal.autoTransfer.frequency}
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>${goal.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span>${goal.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="mt-1 text-xs text-right text-muted-foreground">
                  {goal.progress}% complete
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                ${(goal.targetAmount - goal.currentAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} remaining
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => openContributeDialog(goal)}
                    >
                      Add Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Funds to {goal.name}</DialogTitle>
                      <DialogDescription>
                        How much would you like to contribute to this savings goal?
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleContribute}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="contribution-amount">Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              id="contribution-amount"
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              value={contributionAmount}
                              onChange={(e) => setContributionAmount(e.target.value)}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Remaining: ${(goal.targetAmount - goal.currentAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Contribution</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openTransferDialog(goal)}
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Transfer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Transfer Funds to {goal.name}</DialogTitle>
                      <DialogDescription>
                        Transfer money from one of your accounts to this savings goal.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleTransfer}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>From Account</Label>
                          <Select value={sourceAccount} onValueChange={setSourceAccount}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockAccounts.map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.name} (${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 
