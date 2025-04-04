
import Sidebar from "@/components/Sidebar";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64">
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
