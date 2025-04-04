
import { useAuth } from "@/contexts/AuthContext";
import WelcomeBanner from "@/components/WelcomeBanner";
import StatsRow from "@/components/StatsRow";
import AccountsList from "@/components/AccountsList";
import RecentTransactions from "@/components/RecentTransactions";
import FinancialAssistant from "@/components/FinancialAssistant";

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] || 'User';

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <WelcomeBanner userName={firstName} notificationCount={2} />
      <StatsRow />
      
      <div className="grid grid-cols-1 gap-6">
        <AccountsList />
        
        <RecentTransactions />
      </div>
      
      <FinancialAssistant />
    </div>
  );
};

export default Dashboard;
