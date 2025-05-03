
import { Headphones } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerSupportSLA() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5" />
          Customer Support Service Level Agreement
        </CardTitle>
        <CardDescription>
          Our commitment to responsive customer service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium mb-2">General Inquiries</h4>
              <p className="text-sm text-muted-foreground">Response within 24 hours</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium mb-2">Account Issues</h4>
              <p className="text-sm text-muted-foreground">Response within 4 hours</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium mb-2">Fraud Concerns</h4>
              <p className="text-sm text-muted-foreground">Response within 1 hour</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Support Hours</h4>
            <div className="grid grid-cols-2 text-sm">
              <p>Monday - Friday:</p>
              <p>7:00 AM - 11:00 PM EST</p>
              <p>Saturday:</p>
              <p>8:00 AM - 8:00 PM EST</p>
              <p>Sunday:</p>
              <p>10:00 AM - 6:00 PM EST</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Contact Methods</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Phone: Available during support hours</li>
              <li>Email: 24/7, responses during support hours</li>
              <li>Live Chat: Available during support hours</li>
              <li>Secure Message: 24/7, responses during support hours</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Premium account holders receive priority support with expedited response times.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
