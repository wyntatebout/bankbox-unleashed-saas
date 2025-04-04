
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default Index;
