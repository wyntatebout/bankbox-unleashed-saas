
import WelcomeBanner from "@/components/WelcomeBanner";
import StatsRow from "@/components/StatsRow";
import AccountsList from "@/components/AccountsList";
import RecentTransactions from "@/components/RecentTransactions";
import FinancialAssistant from "@/components/FinancialAssistant";

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <WelcomeBanner userName="John" notificationCount={2} />
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
