
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function RegulatoryDisclosures() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Regulatory Disclosures
        </CardTitle>
        <CardDescription>
          Important legal and regulatory information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="fdic">
            <AccordionTrigger>FDIC Insurance</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Aurora Bank accounts are insured by the Federal Deposit Insurance Corporation up to the maximum allowed by law. The standard insurance amount is $250,000 per depositor, per insured bank, for each ownership category.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="equal-housing">
            <AccordionTrigger>Equal Housing Lender</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Aurora Bank is an Equal Housing Lender. We do business in accordance with the Fair Housing Act and Equal Credit Opportunity Act.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="privacy">
            <AccordionTrigger>Privacy Policy</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Aurora Bank respects your privacy and is committed to protecting your personal data. Our Privacy Policy explains how we collect, use, disclose, and safeguard your information.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="terms">
            <AccordionTrigger>Terms of Service</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                By using Aurora Bank services, you agree to comply with and be bound by our Terms of Service. Please review them carefully.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
