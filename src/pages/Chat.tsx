
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, PlusCircle, HelpCircle, Star, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

type SuggestionTopic = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Chat = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your Financial Assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  
  // Suggested topics for users
  const suggestionTopics: SuggestionTopic[] = [
    {
      icon: <PlusCircle className="h-5 w-5" />,
      title: "Open a new account",
      description: "I can help you understand account options",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: "Understand fees",
      description: "Learn about our fee structure",
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Investment advice",
      description: "Get started with investing",
    },
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate delay for AI response
    setTimeout(() => {
      const botResponses = [
        "I can definitely help you with that! To start, I'll need to understand your financial goals a bit better.",
        "Based on your account history, I would recommend setting up automatic transfers to your savings account.",
        "That's a great question. The interest rate for that account type is currently 2.5% APY.",
        "I'd be happy to explain our fee structure. For standard accounts, there's no monthly maintenance fee as long as you maintain a minimum balance of $500.",
        "For your investment goals, I would suggest considering our diversified portfolios that align with your risk tolerance.",
      ];
      
      // Select random response
      const responseIndex = Math.floor(Math.random() * botResponses.length);
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponses[responseIndex],
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (topic: SuggestionTopic) => {
    setInput(`Tell me about ${topic.title.toLowerCase()}`);
    toast({
      title: "Suggestion Selected",
      description: `"${topic.title}" topic has been added to your message.`,
    });
  };

  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Financial Assistant</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="p-4 border-b">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    <Bot className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Financial Assistant</CardTitle>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-0"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-300"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={endOfMessagesRef} />
                </div>
              </ScrollArea>
              
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || loading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggested Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestionTopics.map((topic, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between w-full rounded-lg border p-3 hover:bg-muted"
                  onClick={() => handleSuggestionClick(topic)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 rounded-full items-center justify-center bg-primary/10 text-primary">
                      {topic.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-medium">{topic.title}</h4>
                      <p className="text-xs text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How can I help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Answer questions about your accounts</p>
              <p>• Help you understand financial terms</p>
              <p>• Provide personalized recommendations</p>
              <p>• Guide you through banking services</p>
              <p>• Assist with troubleshooting issues</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
