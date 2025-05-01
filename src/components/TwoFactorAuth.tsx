
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Smartphone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TwoFactorAuthProps {
  onClose?: () => void;
  className?: string;
}

const TwoFactorAuth = ({ onClose, className }: TwoFactorAuthProps) => {
  const { toast } = useToast();
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [method, setMethod] = useState<"app" | "sms" | "email">("app");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"setup" | "verify" | "complete">("setup");

  const handleEnable2FA = () => {
    setStep("verify");
    toast({
      title: "Verification code sent",
      description: `A verification code has been sent to your ${
        method === "app" ? "authenticator app" : method === "sms" ? "phone" : "email"
      }.`,
    });
  };

  const handleVerify = () => {
    if (verificationCode === "123456") {
      setIs2faEnabled(true);
      setStep("complete");
      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now more secure.",
      });
    } else {
      toast({
        title: "Invalid code",
        description: "Please enter a valid verification code.",
        variant: "destructive",
      });
    }
  };

  const handleDisable2FA = () => {
    setIs2faEnabled(false);
    setStep("setup");
    toast({
      title: "Two-factor authentication disabled",
      description: "We recommend enabling 2FA for better security.",
    });
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Two-Factor Authentication (2FA)
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by enabling two-factor authentication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "setup" && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="2fa-toggle"
                checked={is2faEnabled}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    handleDisable2FA();
                  }
                }}
              />
              <Label htmlFor="2fa-toggle" className="font-medium">
                {is2faEnabled ? "Enabled" : "Disabled"}
              </Label>
            </div>

            {!is2faEnabled && (
              <Tabs value={method} onValueChange={(value) => setMethod(value as "app" | "sms" | "email")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="app">Authenticator App</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>
                <TabsContent value="app" className="space-y-4 mt-4">
                  <div className="border rounded-md p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-gray-200 h-32 w-32 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-xs text-gray-500">QR Code</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Scan this QR code with your authenticator app
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">
                    Use an authentication app like Google Authenticator, Microsoft Authenticator, or Authy to scan the QR code.
                  </p>
                </TabsContent>
                <TabsContent value="sms" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        defaultValue="+1 (555) 123-4567"
                      />
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We'll send a verification code to this phone number when you log in.
                  </p>
                </TabsContent>
                <TabsContent value="email" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        defaultValue="demo@aurorabank.com"
                      />
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We'll send a verification code to this email address when you log in.
                  </p>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              {method === "app" && <Smartphone className="h-12 w-12 text-primary" />}
              {method === "sms" && <Smartphone className="h-12 w-12 text-primary" />}
              {method === "email" && <Mail className="h-12 w-12 text-primary" />}
            </div>
            <h3 className="text-center text-lg font-medium">Verify Your Identity</h3>
            <p className="text-center text-sm text-muted-foreground">
              Enter the verification code from your{" "}
              {method === "app" ? "authenticator app" : method === "sms" ? "SMS" : "email"}
            </p>
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Didn't receive a code?{" "}
              <button className="underline text-primary" onClick={() => toast({ title: "New code sent" })}>
                Resend code
              </button>
            </p>
          </div>
        )}

        {step === "complete" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Two-Factor Authentication Enabled</h3>
            <p className="text-sm text-muted-foreground">
              Your account is now protected with an additional layer of security.
            </p>
            <div className="border rounded-md p-4 bg-muted/50 text-sm">
              <p className="font-medium">Recovery Codes</p>
              <p className="text-xs text-muted-foreground mb-2">
                Save these backup codes in a secure place in case you lose access to your device.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-background px-2 py-1 rounded text-xs">ABCDE-12345</code>
                <code className="bg-background px-2 py-1 rounded text-xs">FGHIJ-67890</code>
                <code className="bg-background px-2 py-1 rounded text-xs">KLMNO-13579</code>
                <code className="bg-background px-2 py-1 rounded text-xs">PQRST-24680</code>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === "setup" && !is2faEnabled && (
          <Button onClick={handleEnable2FA} className="ml-auto">
            Enable 2FA
          </Button>
        )}
        {step === "verify" && (
          <>
            <Button variant="ghost" onClick={() => setStep("setup")}>
              Back
            </Button>
            <Button onClick={handleVerify}>Verify</Button>
          </>
        )}
        {step === "complete" && (
          <Button onClick={handleClose} className="ml-auto">
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TwoFactorAuth;
