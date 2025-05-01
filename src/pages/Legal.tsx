
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, FileText, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Legal = () => {
  const { toast } = useToast();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const handleDownload = (documentType: string) => {
    toast({
      title: `${documentType} Downloaded`,
      description: `The ${documentType.toLowerCase()} document has been downloaded.`,
    });
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    toast({
      title: "Terms Accepted",
      description: "You have accepted the terms and conditions.",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
      
      <Tabs defaultValue="terms">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="disclosures">Regulatory Disclosures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Terms & Conditions
              </CardTitle>
              <CardDescription>
                Last updated: May 1, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-4 max-h-96 overflow-y-auto border rounded-md p-4">
                <h3 className="font-semibold text-base">1. Introduction</h3>
                <p>Welcome to Aurora Bank. By accessing our services, you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                
                <h3 className="font-semibold text-base">2. Account Registration</h3>
                <p>To access certain features of the platform, you will be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
                
                <h3 className="font-semibold text-base">3. Electronic Fund Transfers</h3>
                <p>Under Regulation E (Electronic Fund Transfer Act), you have certain rights and responsibilities regarding electronic transfers. This includes rights to dispute unauthorized transactions within 60 days and limitations on your liability for unauthorized transfers.</p>
                
                <h3 className="font-semibold text-base">4. Truth in Savings</h3>
                <p>In accordance with the Truth in Savings Act, we disclose all fees, minimum balance requirements, and interest rates associated with your accounts. Interest rates may change at any time unless specified as fixed-rate.</p>
                
                <h3 className="font-semibold text-base">5. Service Availability</h3>
                <p>We do not guarantee the Service will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance, resulting in interruptions, delays, or errors.</p>
                
                <h3 className="font-semibold text-base">6. Account Termination</h3>
                <p>We reserve the right to terminate your account and access to our services for violations of these terms or for any other reason at our sole discretion.</p>
                
                <h3 className="font-semibold text-base">7. Governing Law</h3>
                <p>These Terms shall be governed by the laws of the jurisdiction in which the bank is headquartered, without regard to its conflict of law provisions.</p>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={() => handleDownload("Terms & Conditions")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                
                <Button 
                  onClick={handleAcceptTerms}
                  disabled={acceptedTerms}
                >
                  {acceptedTerms ? "Terms Accepted" : "Accept Terms"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy Policy
              </CardTitle>
              <CardDescription>
                Last updated: May 1, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-4 max-h-96 overflow-y-auto border rounded-md p-4">
                <h3 className="font-semibold text-base">1. Information We Collect</h3>
                <p>We collect personal information that you provide directly to us, such as your name, email address, phone number, financial information, and any other information you choose to provide.</p>
                
                <h3 className="font-semibold text-base">2. How We Use Your Information</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and as otherwise permitted by law.</p>
                
                <h3 className="font-semibold text-base">3. Information Sharing and Disclosure</h3>
                <p>We may share your information with third-party vendors and service providers, with your consent, or as required by law. We implement measures designed to protect your information.</p>
                
                <h3 className="font-semibold text-base">4. Your Rights Under GDPR and CCPA</h3>
                <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your personal information.</p>
                
                <h3 className="font-semibold text-base">5. Data Retention</h3>
                <p>We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data subject to legal retention requirements.</p>
                
                <h3 className="font-semibold text-base">6. Security</h3>
                <p>We implement reasonable security measures to protect against unauthorized access or disclosure of your information. However, no method of transmission over the internet is 100% secure.</p>
                
                <h3 className="font-semibold text-base">7. Changes to This Privacy Policy</h3>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
              </div>
              
              <div className="flex items-center justify-end pt-4">
                <Button variant="outline" onClick={() => handleDownload("Privacy Policy")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="disclosures">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Disclosures</CardTitle>
              <CardDescription>
                Important regulatory information about your banking relationship
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-base">FDIC Insurance</h3>
                <p className="text-sm text-muted-foreground">
                  Aurora Bank is an FDIC-insured institution. Your deposits are insured up to $250,000 per depositor, for each account ownership category.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2 text-base">Equal Housing Lender</h3>
                <p className="text-sm text-muted-foreground">
                  Aurora Bank is an Equal Housing Lender. We do business in accordance with the Fair Housing Act.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2 text-base">Electronic Fund Transfer Act (Regulation E)</h3>
                <p className="text-sm text-muted-foreground">
                  Under Regulation E, you have certain rights regarding electronic fund transfers. If you notice unauthorized transactions, you must notify us within 60 days of the statement date.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2 text-base">Truth in Savings Act (Regulation DD)</h3>
                <p className="text-sm text-muted-foreground">
                  The Truth in Savings Act requires us to disclose terms and conditions for all deposit accounts. These include interest rates, fees, and minimum balance requirements.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2 text-base">Anti-Money Laundering Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Aurora Bank complies with the Bank Secrecy Act and other AML regulations. We may require additional verification or information for certain transactions.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2 text-base">Transaction Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Daily Transaction Limits: $10,000 for withdrawals and $25,000 for transfers. Monthly limits are $50,000 for withdrawals and $100,000 for transfers between accounts.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Legal;
