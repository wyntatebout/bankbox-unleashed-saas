
import { UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function KYCVerification() {
  const handleVerifyIdentity = () => {
    toast.info("This feature would connect to identity verification services in a production banking application.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Know Your Customer (KYC)
        </CardTitle>
        <CardDescription>
          Identity verification for regulatory compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-1">Verification Required</h4>
            <p className="text-sm text-amber-700">
              To comply with financial regulations and protect against fraud, we need to verify your identity. 
              This is a standard process required by all financial institutions.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Required Documents</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Government-issued photo ID (passport, driver's license)</li>
              <li>Proof of address (utility bill, bank statement)</li>
              <li>Social Security Number or Tax ID</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Verification Process</h4>
            <p className="text-sm text-muted-foreground">
              Our verification process is secure and typically takes 1-2 business days to complete. 
              Your information is encrypted and protected according to industry standards.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleVerifyIdentity} className="w-full">
          Begin Verification Process
        </Button>
      </CardFooter>
    </Card>
  );
}
