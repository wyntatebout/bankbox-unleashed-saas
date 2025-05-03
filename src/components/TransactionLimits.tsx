
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionLimits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Transaction Limits
        </CardTitle>
        <CardDescription>
          Daily and monthly transaction limits for your accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Electronic Transfers</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Daily transfer limit: $10,000</li>
              <li>Monthly transfer limit: $50,000</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">ATM Withdrawals</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Daily withdrawal limit: $1,000</li>
              <li>Monthly withdrawal limit: $10,000</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Point of Sale Purchases</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Daily purchase limit: $5,000</li>
              <li>Monthly purchase limit: $25,000</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Mobile Check Deposits</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Daily deposit limit: $10,000</li>
              <li>Monthly deposit limit: $50,000</li>
              <li>Per check limit: $5,000</li>
            </ul>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Note: Premium account holders may qualify for higher limits. Contact customer support for details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
