
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Phone, MessageSquare, Mail, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HelpCenter = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search Results",
        description: `Searching for "${searchQuery}"...`,
      });
    }
  };

  const handleContactSupport = () => {
    toast({
      title: "Support Request Sent",
      description: "A support representative will get back to you shortly.",
    });
  };

  // FAQs data
  const faqCategories = {
    accounts: [
      {
        question: "How do I open a new account?",
        answer: "To open a new account, log in to your dashboard and click on 'Add Account' from the Accounts page. Follow the prompts to select the type of account you want to open and complete the necessary information."
      },
      {
        question: "What is the minimum balance requirement?",
        answer: "Minimum balance requirements vary by account type. Basic checking accounts require $100, savings accounts require $300, and premium accounts require $1,000. Check the specific account details for exact requirements."
      },
      {
        question: "How do I close an account?",
        answer: "To close an account, please contact our customer support at 1-800-555-1234. You can also visit any branch with valid ID to close your account in person."
      }
    ],
    transfers: [
      {
        question: "How long do transfers take?",
        answer: "Internal transfers between your accounts are typically instant. External transfers to other banks usually take 1-3 business days, depending on the receiving institution and the time of day the transfer was initiated."
      },
      {
        question: "Is there a limit on transfers?",
        answer: "Yes, daily transfer limits apply. Standard accounts have a $5,000 daily limit for external transfers and $25,000 for internal transfers. Premium accounts have higher limits. You can view your specific limits in the Settings section."
      },
      {
        question: "Can I cancel a scheduled transfer?",
        answer: "Yes, you can cancel a scheduled transfer up until 11:59 PM the day before it's set to process. Go to 'Transfers' > 'Scheduled' and select the transfer you wish to cancel."
      }
    ],
    security: [
      {
        question: "How do I reset my password?",
        answer: "To reset your password, click on 'Forgot Password' on the login page. You'll be prompted to enter your email address, and we'll send you a secure link to reset your password."
      },
      {
        question: "What security measures are in place to protect my account?",
        answer: "We use industry-standard encryption, multi-factor authentication, and continuous monitoring for suspicious activity. We also have a dedicated security team and regular security audits to ensure your information remains protected."
      },
      {
        question: "What should I do if I notice unauthorized transactions?",
        answer: "If you notice any unauthorized activity, please contact our fraud department immediately at 1-800-555-9876. It's available 24/7. Also, go to the 'Security' tab in your Settings and temporarily freeze your account."
      }
    ]
  };

  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex w-full max-w-3xl mx-auto items-center space-x-2">
            <Input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">
            <BookOpen className="mr-2 h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="mr-2 h-4 w-4" />
            Contact Us
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Live Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to the most common questions about our banking services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="accounts" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="accounts">Accounts</TabsTrigger>
                  <TabsTrigger value="transfers">Transfers</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="accounts" className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    {faqCategories.accounts.map((faq, index) => (
                      <AccordionItem key={index} value={`accounts-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="transfers" className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    {faqCategories.transfers.map((faq, index) => (
                      <AccordionItem key={index} value={`transfers-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="security" className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    {faqCategories.security.map((faq, index) => (
                      <AccordionItem key={index} value={`security-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Customer Support</CardTitle>
              <CardDescription>
                Get in touch with our customer support team for personalized assistance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <CardTitle className="text-md">Phone Support</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Call us at:</p>
                    <p className="text-lg font-bold">1-800-555-1234</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Available 24/7 for urgent matters
                    </p>
                    <Button className="w-full mt-4" onClick={handleContactSupport}>
                      Request Callback
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <CardTitle className="text-md">Email Support</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Send us an email at:</p>
                    <p className="text-lg font-bold">support@bankinabox.com</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      We typically respond within 24 hours
                    </p>
                    <Button className="w-full mt-4" onClick={handleContactSupport}>
                      Email Us
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Support</CardTitle>
              <CardDescription>
                Chat with our support team in real-time for immediate assistance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Start a Live Chat Session</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Our support representatives are available Monday to Friday, 9:00 AM to 7:00 PM ET.
                </p>
                <Button onClick={() => {
                  toast({
                    title: "Live Chat",
                    description: "Connecting you with a support representative..."
                  });
                }}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;
