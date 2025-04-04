
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CreditCard, ShieldAlert, TrendingUp, DollarSign, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "transaction" | "security" | "account" | "promotion";
};

const Notifications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    transactionAlerts: true,
    securityAlerts: true,
    marketingUpdates: false,
    accountAlerts: true,
  });

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Large Transaction Alert",
      message: "A transaction of $1,500 was made from your Primary Checking account to Amazon on April 3, 2025.",
      timestamp: new Date(2025, 3, 3, 14, 30),
      read: false,
      type: "transaction",
    },
    {
      id: "2",
      title: "Security Alert",
      message: "Your password was changed successfully. If you didn't make this change, please contact support immediately.",
      timestamp: new Date(2025, 3, 2, 10, 15),
      read: false,
      type: "security",
    },
    {
      id: "3",
      title: "Account Statement Available",
      message: "Your March 2025 statement is now available. You can view it in the Accounts section.",
      timestamp: new Date(2025, 3, 1, 9, 0),
      read: true,
      type: "account",
    },
    {
      id: "4",
      title: "New Savings Goal Achieved",
      message: "Congratulations! You've reached your 'Emergency Fund' savings goal of $10,000.",
      timestamp: new Date(2025, 2, 28, 16, 45),
      read: true,
      type: "account",
    },
    {
      id: "5",
      title: "Limited Time Offer",
      message: "Get 2.5% APY on your savings account when you deposit $5,000 or more. Offer valid until April 30, 2025.",
      timestamp: new Date(2025, 2, 25, 11, 30),
      read: true,
      type: "promotion",
    },
    {
      id: "6",
      title: "Suspicious Login Attempt",
      message: "We detected a login attempt from an unrecognized device in New York. If this wasn't you, please secure your account.",
      timestamp: new Date(2025, 2, 24, 22, 10),
      read: true,
      type: "security",
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case "security":
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case "account":
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case "promotion":
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Today at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return "Yesterday at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return diffInDays + " days ago";
    } else {
      return date.toLocaleDateString();
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
    
    toast({
      title: "Notifications",
      description: "All notifications marked as read.",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "Notifications",
      description: "All notifications cleared.",
    });
  };

  const handleToggleSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
    
    toast({
      title: "Settings Updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} notifications ${!notificationSettings[setting] ? "enabled" : "disabled"}.`,
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
          <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="transaction">Transactions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <TabsContent value={activeTab} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications
                  </CardTitle>
                  <CardDescription>
                    {filteredNotifications.length === 0
                      ? "No notifications to display."
                      : `You have ${filteredNotifications.length} ${activeTab === "all" ? "" : activeTab} notification${filteredNotifications.length !== 1 ? "s" : ""}.`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`relative p-4 rounded-lg border ${
                            !notification.read ? "bg-muted/50" : ""
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h4 className="text-sm font-medium">
                                  {notification.title}
                                  {!notification.read && (
                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                  )}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(notification.timestamp)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredNotifications.length === 0 && (
                        <div className="text-center py-8">
                          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            {activeTab === "all"
                              ? "You don't have any notifications yet."
                              : `You don't have any ${activeTab} notifications.`}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  <CardTitle>Notification Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Delivery Methods</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="email-notifications"
                        className="text-sm"
                      >
                        Email Notifications
                      </label>
                      <Switch
                        id="email-notifications"
                        checked={notificationSettings.email}
                        onCheckedChange={() => handleToggleSetting("email")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="push-notifications"
                        className="text-sm"
                      >
                        Push Notifications
                      </label>
                      <Switch
                        id="push-notifications"
                        checked={notificationSettings.push}
                        onCheckedChange={() => handleToggleSetting("push")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="sms-notifications" className="text-sm">
                        SMS Notifications
                      </label>
                      <Switch
                        id="sms-notifications"
                        checked={notificationSettings.sms}
                        onCheckedChange={() => handleToggleSetting("sms")}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="transaction-alerts"
                          className="text-sm"
                        >
                          Transaction Alerts
                        </label>
                        <Switch
                          id="transaction-alerts"
                          checked={notificationSettings.transactionAlerts}
                          onCheckedChange={() => handleToggleSetting("transactionAlerts")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="security-alerts"
                          className="text-sm"
                        >
                          Security Alerts
                        </label>
                        <Switch
                          id="security-alerts"
                          checked={notificationSettings.securityAlerts}
                          onCheckedChange={() => handleToggleSetting("securityAlerts")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="account-alerts"
                          className="text-sm"
                        >
                          Account Updates
                        </label>
                        <Switch
                          id="account-alerts"
                          checked={notificationSettings.accountAlerts}
                          onCheckedChange={() => handleToggleSetting("accountAlerts")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="marketing-updates"
                          className="text-sm"
                        >
                          Marketing & Promotions
                        </label>
                        <Switch
                          id="marketing-updates"
                          checked={notificationSettings.marketingUpdates}
                          onCheckedChange={() => handleToggleSetting("marketingUpdates")}
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => {
                    toast({
                      title: "Settings Saved",
                      description: "Your notification preferences have been updated."
                    });
                  }}>
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Notifications;
