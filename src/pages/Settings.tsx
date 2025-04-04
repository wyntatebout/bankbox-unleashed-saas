
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, CreditCard, Key, User } from "lucide-react";

const Settings = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transactions: true,
    marketing: false,
    securityAlerts: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast.success(`Notification preference updated`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="profile" className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 items-center">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex gap-2 items-center">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      {profileData.avatar ? (
                        <AvatarImage src={profileData.avatar} alt={profileData.name} />
                      ) : (
                        <AvatarFallback className="text-lg">
                          {profileData.name.split(" ").map(name => name[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications and alerts from BankInABox.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={() => handleNotificationChange('email')} 
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch 
                  checked={notifications.push} 
                  onCheckedChange={() => handleNotificationChange('push')} 
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Transaction Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified for all transactions</p>
                </div>
                <Switch 
                  checked={notifications.transactions} 
                  onCheckedChange={() => handleNotificationChange('transactions')} 
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                </div>
                <Switch 
                  checked={notifications.marketing} 
                  onCheckedChange={() => handleNotificationChange('marketing')} 
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Security Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified about security concerns</p>
                </div>
                <Switch 
                  checked={notifications.securityAlerts} 
                  onCheckedChange={() => handleNotificationChange('securityAlerts')} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button 
                  onClick={() => toast.success("Password updated successfully")}
                  className="mt-2"
                >
                  Update Password
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication is disabled</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => toast.info("Two-factor authentication setup will be available soon")}
                  >
                    Enable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info("Adding new payment methods will be available soon")}
              >
                + Add Payment Method
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <h3 className="text-base font-medium">Billing Address</h3>
              <p className="text-sm text-muted-foreground">123 Banking Street, Financial District</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA 94103</p>
              <Button 
                variant="link" 
                className="px-0"
                onClick={() => toast.info("Updating billing address will be available soon")}
              >
                Update billing address
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
