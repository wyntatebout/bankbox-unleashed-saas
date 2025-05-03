
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import PortfolioDisclaimer from "@/components/PortfolioDisclaimer";
import SecurityNotice from "@/components/SecurityNotice";
import RegulatoryDisclosures from "@/components/RegulatoryDisclosures";
import TransactionLimits from "@/components/TransactionLimits";
import FraudMonitoring from "@/components/FraudMonitoring";
import KYCVerification from "@/components/KYCVerification";
import AccessibilityCompliance from "@/components/AccessibilityCompliance";
import CustomerSupportSLA from "@/components/CustomerSupportSLA";
import BeneficiaryManagement from "@/components/BeneficiaryManagement";
import { ShieldOff, Info } from "lucide-react";

const BankingFeatures = () => {
  const { user } = useAuth();
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);
  const [showPortfolioInfo, setShowPortfolioInfo] = useState(false);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Banking Features</h1>
          <p className="text-muted-foreground">Essential banking services and compliance</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPortfolioInfo(true)}
            className="flex items-center gap-1"
          >
            <Info className="h-4 w-4" />
            Portfolio Info
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowSecurityNotice(true)}
            className="flex items-center gap-1"
          >
            <ShieldOff className="h-4 w-4" />
            2FA Info
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RegulatoryDisclosures />
        <TransactionLimits />
        <FraudMonitoring />
        <KYCVerification />
        <AccessibilityCompliance />
        <CustomerSupportSLA />
        <BeneficiaryManagement />
      </div>
      
      {/* Portfolio and 2FA Dialogs */}
      <SecurityNotice open={showSecurityNotice} onClose={() => setShowSecurityNotice(false)} />
      <PortfolioDisclaimer />
      
      {/* Show portfolio modal when button is clicked */}
      {showPortfolioInfo && (
        <SecurityNotice 
          open={showPortfolioInfo} 
          onClose={() => setShowPortfolioInfo(false)} 
        />
      )}
    </div>
  );
};

export default BankingFeatures;
