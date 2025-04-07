import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, Maximize2, Minimize2, UserRound, Lock, Unlock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const FinancialAssistant = () => {
  const { toast } = useToast();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isAccessibilityDialogOpen, setIsAccessibilityDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm your AI financial assistant. How can I help you today?" 
    }
  ]);
  const [fontSizeClass, setFontSizeClass] = useState("text-sm");
  const [highContrast, setHighContrast] = useState(false);

  // Check saved preferences
  useEffect(() => {
    const savedIsEnabled = localStorage.getItem("financialAssistantEnabled");
    if (savedIsEnabled !== null) {
      setIsEnabled(savedIsEnabled === "true");
    }
    
    const savedFontSize = localStorage.getItem("accessibilityFontSize");
    if (savedFontSize) {
      setFontSizeClass(savedFontSize);
    }
    
    const savedHighContrast = localStorage.getItem("accessibilityHighContrast");
    if (savedHighContrast) {
      setHighContrast(savedHighContrast === "true");
    }
  }, []);

  // Update state when enabled status changes
  useEffect(() => {
    localStorage.setItem("financialAssistantEnabled", isEnabled.toString());
  }, [isEnabled]);

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

  const handleToggleAssistant = () => {
    setIsEnabled(!isEnabled);
    // Always show the chat button even when disabled
    // Just don't auto-open the chat
    
    if (!isEnabled) {
      toast({
        title: "Financial Assistant Enabled",
        description: "The assistant is now available to chat."
      });
    } else {
      toast({
        title: "Financial Assistant Locked",
        description: "The assistant is now locked. Click the icon to unlock when needed."
      });
      // Close the chat if it's open, but keep the button visible
      setIsOpen(false);
    }
  };

  const toggleAccessibilityDialog = () => {
    setIsAccessibilityDialogOpen(!isAccessibilityDialogOpen);
  };

  const changeFontSize = (size: string) => {
    setFontSizeClass(size);
    localStorage.setItem("accessibilityFontSize", size);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    localStorage.setItem("accessibilityHighContrast", (!highContrast).toString());
  };

  // Always show the button, but control the full chat visibility
  return (
    <>
      {!isOpen && (
        <Button 
          className="fixed bottom-4 right-4 rounded-full shadow-lg p-4 gradient-bg"
          onClick={() => {
            // If disabled, enable it first when they click the button
            if (!isEnabled) {
              setIsEnabled(true);
              toast({
                title: "Financial Assistant Unlocked",
                description: "The assistant is now ready to help you."
              });
              localStorage.setItem("financialAssistantEnabled", "true");
            }
            setIsOpen(true);
          }}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className={`fixed transition-all duration-300 shadow-lg ${
          isMinimized 
            ? 'bottom-4 right-4 w-auto h-auto' 
            : 'bottom-4 right-4 w-80 md:w-96 h-[450px]'
          } ${highContrast ? 'bg-black text-white border-white' : ''}`}>
          <CardHeader className={`p-3 flex flex-row items-center justify-between ${highContrast ? 'bg-black text-white' : 'bg-primary text-primary-foreground'} rounded-t-lg`}>
            <CardTitle className={`${fontSizeClass} font-medium flex items-center`}>
              <Bot className="h-4 w-4 mr-2" />
              Financial Assistant
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 ${highContrast ? 'text-white hover:bg-gray-800' : 'text-primary-foreground hover:bg-primary/80'}`}
                    aria-label="Accessibility options"
                  >
                    <UserRound className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Accessibility Options</h4>
                      <p className="text-sm text-muted-foreground">
                        Customize your assistant for better accessibility.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <label htmlFor="high-contrast" className="text-sm font-medium leading-none">
                            High Contrast
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Increase contrast for better visibility
                          </p>
                        </div>
                        <Switch 
                          id="high-contrast" 
                          checked={highContrast} 
                          onCheckedChange={toggleHighContrast} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium leading-none">
                          Text Size
                        </label>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => changeFontSize("text-xs")}
                            className={fontSizeClass === "text-xs" ? "bg-primary text-primary-foreground" : ""}
                          >
                            Small
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => changeFontSize("text-sm")}
                            className={fontSizeClass === "text-sm" ? "bg-primary text-primary-foreground" : ""}
                          >
                            Medium
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => changeFontSize("text-base")}
                            className={fontSizeClass === "text-base" ? "bg-primary text-primary-foreground" : ""}
                          >
                            Large
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-6 w-6 ${highContrast ? 'text-white hover:bg-gray-800' : 'text-primary-foreground hover:bg-primary/80'}`}
                  onClick={handleToggleAssistant}
                  aria-label={isEnabled ? "Lock chat assistant" : "Unlock chat assistant"}
                >
                  {isEnabled ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-6 w-6 ${highContrast ? 'text-white hover:bg-gray-800' : 'text-primary-foreground hover:bg-primary/80'}`}
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-6 w-6 ${highContrast ? 'text-white hover:bg-gray-800' : 'text-primary-foreground hover:bg-primary/80'}`}
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className={`p-3 overflow-y-auto h-[340px] ${highContrast ? 'bg-black' : ''}`}>
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${fontSizeClass} ${
                          message.role === "assistant" 
                            ? highContrast ? "bg-gray-800 text-white" : "bg-muted text-foreground" 
                            : highContrast ? "bg-blue-800 text-white" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className={`p-3 pt-0 ${highContrast ? 'bg-black' : ''}`}>
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    placeholder="Ask about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`flex-1 ${highContrast ? 'bg-gray-800 text-white border-white' : ''}`}
                  />
                  <Button type="submit" size="icon" className={highContrast ? 'bg-blue-800 hover:bg-blue-700' : 'gradient-bg'}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}

      <Dialog open={isAccessibilityDialogOpen} onOpenChange={setIsAccessibilityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessibility Options</DialogTitle>
            <DialogDescription>
              Customize your experience for better accessibility.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <span>High Contrast</span>
              <Switch checked={highContrast} onCheckedChange={toggleHighContrast} />
            </div>
            <div className="space-y-2">
              <span>Text Size</span>
              <div className="flex space-x-2">
                <Button 
                  variant={fontSizeClass === "text-xs" ? "default" : "outline"} 
                  onClick={() => changeFontSize("text-xs")}
                >
                  Small
                </Button>
                <Button 
                  variant={fontSizeClass === "text-sm" ? "default" : "outline"} 
                  onClick={() => changeFontSize("text-sm")}
                >
                  Medium
                </Button>
                <Button 
                  variant={fontSizeClass === "text-base" ? "default" : "outline"} 
                  onClick={() => changeFontSize("text-base")}
                >
                  Large
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinancialAssistant;
