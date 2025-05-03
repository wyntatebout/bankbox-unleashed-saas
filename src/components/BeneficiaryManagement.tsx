
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

type Beneficiary = {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  relationship: string;
};

const DEMO_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben_1",
    name: "Sarah Johnson",
    accountNumber: "****1234",
    bankName: "First National Bank",
    relationship: "Family",
  },
  {
    id: "ben_2",
    name: "Michael Chen",
    accountNumber: "****5678",
    bankName: "Aurora Bank",
    relationship: "Friend",
  },
];

export default function BeneficiaryManagement() {
  const [beneficiaries] = useState<Beneficiary[]>(DEMO_BENEFICIARIES);

  const handleManageBeneficiaries = () => {
    toast.info("Beneficiary management feature would allow adding/editing/removing payment recipients in a production app.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Beneficiary Management
        </CardTitle>
        <CardDescription>
          Manage your payment recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{beneficiary.name}</h4>
                <p className="text-sm text-muted-foreground">Account: {beneficiary.accountNumber}</p>
                <p className="text-xs text-muted-foreground">{beneficiary.bankName} • {beneficiary.relationship}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info(`This would show details for ${beneficiary.name} in a production app.`)}>
                View
              </Button>
            </div>
          ))}
          
          {beneficiaries.length === 0 && (
            <p className="text-center text-muted-foreground py-6">No beneficiaries added yet.</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleManageBeneficiaries} className="w-full">
          Manage Beneficiaries
        </Button>
      </CardFooter>
    </Card>
  );
}
