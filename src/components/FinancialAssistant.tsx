
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, Maximize2, Minimize2 } from "lucide-react";

const FinancialAssistant = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm your AI financial assistant. How can I help you today?" 
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to conversation
    setConversation([
      ...conversation,
      { role: "user", content: input }
    ]);
    
    // Simulate assistant response
    setTimeout(() => {
      let response = "";
      if (input.toLowerCase().includes("save")) {
        response = "Based on your spending habits, you could save about $200 per month by reducing dining out expenses. Would you like me to suggest a savings plan?";
      } else if (input.toLowerCase().includes("invest")) {
        response = "For your risk profile, I'd recommend a diversified portfolio with 60% index funds, 30% bonds, and 10% alternative investments. Would you like more details?";
      } else if (input.toLowerCase().includes("budget")) {
        response = "Looking at your transactions, you're spending 35% on housing, 20% on food, 15% on transportation, and 30% on other expenses. Would you like to set budget alerts?";
      } else {
        response = "I can help you with savings goals, investment advice, budgeting, and financial planning. What specific aspect of your finances would you like to discuss?";
      }
      
      setConversation(prev => [...prev, { role: "assistant", content: response }]);
    }, 1000);
    
    setInput("");
  };

  if (!isOpen) {
    return (
      <Button 
        className="fixed bottom-4 right-4 rounded-full shadow-lg p-4 gradient-bg"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed transition-all duration-300 shadow-lg ${
      isMinimized 
        ? 'bottom-4 right-4 w-auto h-auto' 
        : 'bottom-4 right-4 w-80 md:w-96 h-[450px]'
    }`}>
      <CardHeader className="p-3 flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-sm font-medium flex items-center">
          <Bot className="h-4 w-4 mr-2" />
          Financial Assistant
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-primary-foreground hover:text-white hover:bg-primary/80"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-primary-foreground hover:text-white hover:bg-primary/80"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <>
          <CardContent className="p-3 overflow-y-auto h-[340px]">
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "assistant" 
                        ? "bg-muted text-foreground" 
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-0">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Ask about your finances..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="gradient-bg">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default FinancialAssistant;
