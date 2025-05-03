
import { Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export default function FraudMonitoring() {
  const [alertSettings, setAlertSettings] = useState({
    unusualActivity: true,
    largeTransactions: true,
    internationalTransactions: true,
    newDeviceLogin: true,
    addressChange: false,
  });

  const toggleSetting = (setting: keyof typeof alertSettings) => {
    setAlertSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      toast.success(`Fraud alert setting updated`);
      return newSettings;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Fraud Monitoring Notifications
        </CardTitle>
        <CardDescription>
          Customize how you receive fraud alerts and suspicious activity notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Unusual Account Activity</h4>
              <p className="text-sm text-muted-foreground">Get alerts for suspicious transactions</p>
            </div>
            <Switch 
              checked={alertSettings.unusualActivity} 
              onCheckedChange={() => toggleSetting('unusualActivity')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Large Transactions</h4>
              <p className="text-sm text-muted-foreground">Get alerts for transactions over $1,000</p>
            </div>
            <Switch 
              checked={alertSettings.largeTransactions} 
              onCheckedChange={() => toggleSetting('largeTransactions')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">International Transactions</h4>
              <p className="text-sm text-muted-foreground">Get alerts for transactions outside your country</p>
            </div>
            <Switch 
              checked={alertSettings.internationalTransactions} 
              onCheckedChange={() => toggleSetting('internationalTransactions')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">New Device Login</h4>
              <p className="text-sm text-muted-foreground">Get alerts when your account is accessed from a new device</p>
            </div>
            <Switch 
              checked={alertSettings.newDeviceLogin} 
              onCheckedChange={() => toggleSetting('newDeviceLogin')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Address Change</h4>
              <p className="text-sm text-muted-foreground">Get alerts when your account address is updated</p>
            </div>
            <Switch 
              checked={alertSettings.addressChange} 
              onCheckedChange={() => toggleSetting('addressChange')} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
