import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Target, Car, Home, Plane, GraduationCap, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper function to get a goal icon
const getGoalIcon = (category: string) => {
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
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalCategory, setGoalCategory] = useState("Travel");
  const [currentGoalId, setCurrentGoalId] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");

  // Mock savings goals data
  const [goals, setGoals] = useState([
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
      progress: 0
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

  const handleContributeClick = (goalId: string) => {
    setCurrentGoalId(goalId);
    setContributeOpen(true);
  };

  const handleContribute = (e: React.FormEvent) => {
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
    
    // Find the goal and update it
    const updatedGoals = goals.map(goal => {
      if (goal.id === currentGoalId) {
        const newCurrentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        const newProgress = Math.round((newCurrentAmount / goal.targetAmount) * 100);
        
        toast({
          title: "Contribution Made",
          description: `$${amount.toLocaleString()} added to your ${goal.name} goal.`
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
                <div className="rounded-full bg-muted p-1">
                  {getGoalIcon(goal.category)}
                </div>
              </div>
              <CardDescription>{goal.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span>${goal.currentAmount.toLocaleString()}</span>
                  <span>${goal.targetAmount.toLocaleString()}</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="mt-1 text-xs text-right text-muted-foreground">
                  {goal.progress}% complete
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                ${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    variant={goal.progress === 100 ? "secondary" : "default"}
                    disabled={goal.progress === 100}
                    onClick={() => handleContributeClick(goal.id)}
                  >
                    {goal.progress === 100 ? "Goal Completed!" : "Add Contribution"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Contribution to {goal.name}</DialogTitle>
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
                          Remaining: ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Contribution</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Savings;
