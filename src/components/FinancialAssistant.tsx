import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, Maximize2, Minimize2, UserRound, Lock, Unlock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const FinancialAssistant = () => {
  const { toast } = useToast();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your AI financial assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [fontSizeClass, setFontSizeClass] = useState("text-sm");
  const [highContrast, setHighContrast] = useState(false);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [language, setLanguage] = useState("en");

  // Load all saved preferences
  useEffect(() => {
    const savedPrefs = {
      enabled: localStorage.getItem("financialAssistantEnabled"),
      conversation: localStorage.getItem("financialAssistantConversation"),
      fontSize: localStorage.getItem("accessibilityFontSize"),
      contrast: localStorage.getItem("accessibilityHighContrast"),
      animations: localStorage.getItem("reduceAnimations"),
      language: localStorage.getItem("assistantLanguage")
    };

    if (savedPrefs.enabled !== null) setIsEnabled(savedPrefs.enabled === "true");
    if (savedPrefs.conversation) setConversation(JSON.parse(savedPrefs.conversation));
    if (savedPrefs.fontSize) setFontSizeClass(savedPrefs.fontSize);
    if (savedPrefs.contrast) setHighContrast(savedPrefs.contrast === "true");
    if (savedPrefs.animations) setReduceAnimations(savedPrefs.animations === "true");
    if (savedPrefs.language) setLanguage(savedPrefs.language);
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem("financialAssistantEnabled", isEnabled.toString());
    localStorage.setItem("financialAssistantConversation", JSON.stringify(conversation));
    localStorage.setItem("accessibilityFontSize", fontSizeClass);
    localStorage.setItem("accessibilityHighContrast", highContrast.toString());
    localStorage.setItem("reduceAnimations", reduceAnimations.toString());
    localStorage.setItem("assistantLanguage", language);
  }, [isEnabled, conversation, fontSizeClass, highContrast, reduceAnimations, language]);

  const sanitizeInput = useCallback((input: string) => {
    const sensitivePatterns = [/\b\d{4}-\d{4}-\d{4}-\d{4}\b/g]; // CC numbers
    return sensitivePatterns.reduce((acc, pattern) => 
      acc.replace(pattern, '[REDACTED]'), input);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedInput = sanitizeInput(input.trim());
    if (!sanitizedInput) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: sanitizedInput,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate response based on input
      let responseContent = "";
      if (sanitizedInput.toLowerCase().includes("save")) {
        responseContent = "Based on your spending habits, you could save about $200 per month by reducing dining out expenses. Would you like me to suggest a savings plan?";
      } else if (sanitizedInput.toLowerCase().includes("invest")) {
        responseContent = "For your risk profile, I'd recommend a diversified portfolio with 60% index funds, 30% bonds, and 10% alternative investments. Would you like more details?";
      } else if (sanitizedInput.toLowerCase().includes("budget")) {
        responseContent = "Looking at your transactions, you're spending 35% on housing, 20% on food, 15% on transportation, and 30% on other expenses. Would you like to set budget alerts?";
      } else {
        responseContent = "I can help you with savings goals, investment advice, budgeting, and financial planning. What specific aspect of your finances would you like to discuss?";
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, assistantMessage]);
    } catch (error) {
      setConversation(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleAssistant = () => {
    const newEnabledState = !isEnabled;
    setIsEnabled(newEnabledState);
    
    if (newEnabledState) {
      toast({
        title: "Financial Assistant Unlocked",
        description: "The assistant is now available to chat."
      });
      setIsOpen(true);
    } else {
      toast({
        title: "Financial Assistant Locked",
        description: "The assistant is now locked. Click the icon to unlock when needed."
      });
      setIsOpen(false);
    }
  };

  const changeFontSize = (size: string) => {
    setFontSizeClass(size);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleReduceAnimations = () => {
    setReduceAnimations(!reduceAnimations);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: "Language Changed",
      description: `Assistant language set to ${value === "en" ? "English" : value === "es" ? "Spanish" : "French"}`,
    });
  };

  const showBudgetTools = conversation.some(m => 
    m.content.toLowerCase().includes('budget') || 
    m.role === 'user' && /spend|expense|cost/i.test(m.content)
  );

  return (
    <>
      <Button 
        className={`fixed bottom-4 right-4 rounded-full shadow-lg p-4 gradient-bg ${
          reduceAnimations ? "" : "transition-transform hover:scale-110"
        }`}
        onClick={() => {
          if (!isEnabled) {
            handleToggleAssistant();
          } else {
            setIsOpen(true);
          }
        }}
        aria-label={isEnabled ? "Open financial assistant" : "Unlock financial assistant"}
      >
        {isEnabled ? <Bot className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
      </Button>

      {isOpen && isEnabled && (
        <Card className={`fixed shadow-lg ${
          isMinimized 
            ? 'bottom-4 right-4 w-auto h-auto' 
            : 'bottom-4 right-4 w-80 md:w-96 h-[450px]'
          } ${highContrast ? 'bg-black text-white border-white' : ''} ${
            reduceAnimations ? "" : "transition-all duration-300"
          }`}
        >
          <CardHeader className={`p-3 flex flex-row items-center justify-between ${
            highContrast ? 'bg-black text-white' : 'bg-primary text-primary-foreground'
          } rounded-t-lg`}>
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
                    className={`h-6 w-6 ${
                      highContrast ? 'text-white hover:bg-gray-800' : 'text-primary-foreground hover:bg-primary/80'
                    }`}
                    aria-label="Accessibility options"
                  >
                    <UserRound className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" side="top">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Preferences</h4>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <label htmlFor="high-contrast" className="text-sm font-medium leading-none">
                            High Contrast
                          </label>
                        </div>
                        <Switch 
                          id="high-contrast" 
                          checked={highContrast} 
                          onCheckedChange={toggleHighContrast} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <label htmlFor="reduce-animations" className="text-sm font-medium leading-none">
                            Reduce Animations
                          </label>
                        </div>
                        <Switch 
                          id="reduce-animations" 
                          checked={reduceAnimations} 
                          onCheckedChange={toggleReduceAnimations} 
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
                      <div className="space-y-1">
                        <label className="text-sm font-medium leading-none">
                          Language
                        </label>
                        <Select value={language} onValueChange={handleLanguageChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-6 w-6 ${
                  highContrast ? 'text-white hover:bg-gray-800' : 'text-primary-foreground hover:bg-primary/80'
                }`}
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-6 w-6 ${
                  highContrast ? 'text-white hover:bg-gray-800' : 'text-primary-foreground hover:bg-primary/80'
                }`}
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className={`p-3 overflow-y-auto h-[340px] ${
                highContrast ? 'bg-black' : ''
              }`}>
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div 
                      key={`${index}-${message.timestamp?.getTime()}`}
                      className={`flex ${
                        message.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${fontSizeClass} ${
                          message.role === "assistant" 
                            ? highContrast ? "bg-gray-800 text-white" : "bg-muted text-foreground" 
                            : highContrast ? "bg-blue-800 text-white" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.content}
                        <div className={`text-xs mt-1 ${
                          message.role === "assistant" 
                            ? highContrast ? "text-gray-400" : "text-muted-foreground"
                            : highContrast ? "text-blue-200" : "text-primary-foreground/70"
                        }`}>
                          {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {message.role === "assistant" && message.content.includes("savings plan") && (
                          <div className="flex space-x-2 mt-2">
                            <Button size="xs" variant={highContrast ? "outline" : "secondary"}>
                              Show Plan
                            </Button>
                            <Button size="xs" variant={highContrast ? "outline" : "secondary"}>
                              Adjust Parameters
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        highContrast ? 'bg-gray-800' : 'bg-muted'
                      }`}>
                        <div className="flex space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            highContrast ? 'bg-gray-400' : 'bg-muted-foreground'
                          } ${reduceAnimations ? "" : "animate-bounce"}`}></div>
                          <div className={`w-2 h-2 rounded-full ${
                            highContrast ? 'bg-gray-400' : 'bg-muted-foreground'
                          } ${reduceAnimations ? "" : "animate-bounce delay-100"}`}></div>
                          <div className={`w-2 h-2 rounded-full ${
                            highContrast ? 'bg-gray-400' : 'bg-muted-foreground'
                          } ${reduceAnimations ? "" : "animate-bounce delay-200"}`}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {showBudgetTools && (
                  <div className={`border-t mt-4 pt-4 ${
                    highContrast ? "border-gray-700" : "border-muted"
                  }`}>
                    <h4 className={`font-medium mb-2 ${fontSizeClass}`}>Budget Tools</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={highContrast ? "outline" : "secondary"} 
                        size="sm"
                      >
                        Spending Analysis
                      </Button>
                      <Button 
                        variant={highContrast ? "outline" : "secondary"} 
                        size="sm"
                      >
                        Set Alerts
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className={`p-3 pt-0 ${highContrast ? 'bg-black' : ''}`}>
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    placeholder="Ask about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`flex-1 ${
                      highContrast ? 'bg-gray-800 text-white border-white placeholder-gray-400' : ''
                    }`}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className={highContrast ? 'bg-blue-800 hover:bg-blue-700' : 'gradient-bg'}
                    disabled={isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default FinancialAssistant;
