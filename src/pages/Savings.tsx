
The error you're encountering suggests there's a syntax issue in your JSX code. Let me provide a clean, working version of the Savings component that includes all the requested features:

```tsx
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

  const [accounts] = useState([
    { id: "checking", name: "Checking Account", balance: 12500.00 },
    { id: "savings", name: "Savings Account", balance: 34200.00 },
  ]);

  // Form states
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [autoTransferOpen, setAutoTransferOpen] = useState(false);
  
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalCategory, setGoalCategory] = useState("Travel");
  const [contributionAmount, setContributionAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [sourceAccount, setSourceAccount] = useState("checking");
  const [autoTransferAmount, setAutoTransferAmount] = useState("");
  const [autoTransferFrequency, setAutoTransferFrequency] = useState<"weekly" | "biweekly" | "monthly">("monthly");
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);

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

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goalName || !goalAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
      title: "Goal Created",
      description: `Your ${goalName} goal has been created.`
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
          progress: Math.round((goal.currentAmount / parseFloat(goalAmount)) * 100
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
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoal.id) {
        const newCurrentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        const newProgress = Math.round((newCurrentAmount / goal.targetAmount) * 100);
        
        toast({
          title: "Contribution Added",
          description: `$${amount.toFixed(2)} added to ${goal.name}.`
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
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const source = accounts.find(acc => acc.id === sourceAccount);
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
          description: `$${amount.toFixed(2)} transferred to ${goal.name}.`
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
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoal.id) {
        toast({
          title: "Auto Transfer Set Up",
          description: `$${amount.toFixed(2)} will be transferred ${autoTransferFrequency} to ${goal.name}.`
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
    <div className="container mx-auto p-6 max-w-6xl">
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
              <DialogTitle>New Savings Goal</DialogTitle>
              <DialogDescription>
                Create a new savings goal to track your progress.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddGoal}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Vacation Fund"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Target Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={goalCategory} onValueChange={setGoalCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Gift">Gift</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{goal.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted p-2">
                    {getGoalIcon(goal.category)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(goal)}
                  >
                    <Pencil className="h-4 w-4" />
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
                  <span>${goal.currentAmount.toFixed(2)}</span>
                  <span>${goal.targetAmount.toFixed(2)}</span>
                </div>
                <Progress value={goal.progress} />
                <div className="text-right text-xs text-muted-foreground mt-1">
                  {goal.progress}% complete
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                ${(goal.targetAmount - goal.currentAmount).toFixed(2)} remaining
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Button
                  className="flex-1"
                  onClick={() => openContributeDialog(goal)}
                >
                  Add Funds
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openTransferDialog(goal)}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Transfer
                </Button>
              </div>
              <Button
                variant={goal.autoTransfer ? "destructive" : "outline"}
                size="sm"
                onClick={() => goal.autoTransfer 
                  ? setGoals(goals.map(g => 
                      g.id === goal.id ? {...g, autoTransfer: undefined} : g
                    )
                  : openAutoTransferDialog(goal)
                }
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                {goal.autoTransfer ? "Cancel Auto Transfer" : "Setup Auto Transfer"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Contribution Dialog */}
      <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds to {currentGoal?.name}</DialogTitle>
            <DialogDescription>
              Add money to your savings goal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContribute}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Funds</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={editGoalOpen} onOpenChange={setEditGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {currentGoal?.name}</DialogTitle>
            <DialogDescription>
              Update your savings goal details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditGoal}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  placeholder="Goal name"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={goalCategory} onValueChange={setGoalCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <Select
