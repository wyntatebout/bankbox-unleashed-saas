
import { Accessibility } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AccessibilityCompliance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Accessibility Compliance
        </CardTitle>
        <CardDescription>
          Our commitment to providing an inclusive banking experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Aurora Bank is committed to ensuring our services are accessible to all customers, including those with disabilities. 
            We strive to comply with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="keyboard">
              <AccordionTrigger>Keyboard Navigation</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Our website is designed to be fully operable using keyboard navigation for users who cannot use a mouse.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="screen-readers">
              <AccordionTrigger>Screen Reader Compatibility</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  We implement proper ARIA attributes and semantic HTML to ensure compatibility with screen readers.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="contrast">
              <AccordionTrigger>Color Contrast</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Text and interactive elements have sufficient color contrast to ensure visibility for users with visual impairments.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="alt-text">
              <AccordionTrigger>Alternative Text</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Images on our platform include alternative text descriptions for users who cannot see the images.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <p className="text-sm text-muted-foreground mt-4">
            If you encounter any accessibility issues or have suggestions for improvement, please contact our support team.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
