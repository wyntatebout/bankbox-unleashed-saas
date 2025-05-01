
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AlertCircle, LogIn, LogOut, Settings, CreditCard, ArrowLeftRight, Eye, Info, Shield } from "lucide-react";
import ExportOptions from "./ExportOptions";

// Mock data for audit trail entries
const mockAuditTrail = [
  {
    id: "act_1",
    type: "login",
    timestamp: new Date(2025, 4, 1, 9, 30),
    description: "Successful login",
    ipAddress: "192.168.1.1",
    device: "Chrome / Windows",
    icon: LogIn,
    severity: "info"
  },
  {
    id: "act_2",
    type: "transaction",
    timestamp: new Date(2025, 4, 1, 10, 15),
    description: "Transfer to External Account",
    amount: 500.00,
    destination: "Bank of America - *****1234",
    icon: ArrowLeftRight,
    severity: "info"
  },
  {
    id: "act_3",
    type: "security",
    timestamp: new Date(2025, 4, 1, 11, 0),
    description: "Password changed",
    icon: Settings,
    severity: "info"
  },
  {
    id: "act_4",
    type: "login",
    timestamp: new Date(2025, 4, 1, 14, 22),
    description: "Failed login attempt",
    ipAddress: "84.232.124.45",
    device: "Unknown Device",
    icon: AlertCircle,
    severity: "warning"
  },
  {
    id: "act_5",
    type: "account",
    timestamp: new Date(2025, 4, 1, 14, 30),
    description: "Account statement viewed",
    icon: Eye,
    severity: "info"
  },
  {
    id: "act_6",
    type: "security",
    timestamp: new Date(2025, 4, 1, 15, 45),
    description: "Two-factor authentication enabled",
    icon: Shield,
    severity: "info"
  },
  {
    id: "act_7",
    type: "transaction",
    timestamp: new Date(2025, 4, 1, 16, 30),
    description: "ATM withdrawal",
    amount: 100.00,
    location: "ATM ID #45219 - Main Street",
    icon: CreditCard,
    severity: "info"
  },
  {
    id: "act_8",
    type: "session",
    timestamp: new Date(2025, 4, 1, 17, 45),
    description: "Session ended",
    icon: LogOut,
    severity: "info"
  },
];

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const AuditTrail = () => {
  const [filter, setFilter] = useState("all");
  
  const filteredActivities = filter === "all" 
    ? mockAuditTrail 
    : mockAuditTrail.filter(activity => activity.type === filter);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Review your recent account activities</CardDescription>
        </div>
        <ExportOptions entityType="transactions" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="login">Logins</TabsTrigger>
              <TabsTrigger value="transaction">Transactions</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4 mr-2" />
              About Activity Logs
            </Button>
          </div>
          
          <TabsContent value={filter} className="mt-0">
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No activities found</p>
                </div>
              ) : (
                filteredActivities.map((activity) => {
                  const ActivityIcon = activity.icon;
                  
                  return (
                    <div key={activity.id} className="relative pl-8 py-3">
                      <div className="absolute left-0 top-4">
                        <div className={`rounded-full p-1 ${
                          activity.severity === "warning" ? "bg-amber-100 text-amber-600" : 
                          activity.severity === "critical" ? "bg-red-100 text-red-600" : 
                          "bg-blue-100 text-blue-600"
                        }`}>
                          <ActivityIcon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{activity.description}</h4>
                            {activity.severity === "warning" && (
                              <Badge variant="outline" className="ml-2 text-amber-600 border-amber-200 bg-amber-50">
                                Suspicious
                              </Badge>
                            )}
                            {activity.severity === "critical" && (
                              <Badge variant="outline" className="ml-2 text-red-600 border-red-200 bg-red-50">
                                Critical
                              </Badge>
                            )}
                          </div>
                          {activity.amount && (
                            <p className="text-sm text-muted-foreground">
                              {activity.type === "transaction" ? `Amount: $${activity.amount.toFixed(2)}` : ""}
                              {activity.destination && ` • To: ${activity.destination}`}
                              {activity.location && ` • Location: ${activity.location}`}
                            </p>
                          )}
                          {activity.ipAddress && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <p className="text-sm text-muted-foreground cursor-help underline decoration-dotted">
                                  {activity.device}
                                </p>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold">Device Details</h4>
                                  <div className="grid grid-cols-2 gap-1 text-xs">
                                    <span className="text-muted-foreground">IP Address:</span>
                                    <span>{activity.ipAddress}</span>
                                    <span className="text-muted-foreground">Device:</span>
                                    <span>{activity.device}</span>
                                    <span className="text-muted-foreground">Location:</span>
                                    <span>New York, USA</span>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                      <Separator className="mt-3" />
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuditTrail;
