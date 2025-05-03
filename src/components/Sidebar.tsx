
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/use-mobile";
import { 
  BarChart3, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronLeft, 
  Home, 
  ArrowLeftRight, 
  PiggyBank, 
  LifeBuoy, 
  MessageSquare,
  Bell,
  ShieldCheck,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  isProOnly?: boolean;
};

const Sidebar = () => {
  const { logout } = useAuth();
  const { isMobile } = useMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [isPending, startTransition] = useState(false);

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Accounts",
      href: "/accounts",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Transfers",
      href: "/transfers",
      icon: <ArrowLeftRight className="h-5 w-5" />,
    },
    {
      title: "Savings",
      href: "/savings",
      icon: <PiggyBank className="h-5 w-5" />,
    },
    {
      title: "Insights",
      href: "/insights",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Banking Features",
      href: "/features",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      title: "Chat",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Help Center",
      href: "/help",
      icon: <LifeBuoy className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    // Close sidebar on mobile when route changes
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    startTransition(true);
    setTimeout(() => logout(), 500);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50" 
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
    
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="border-b px-6 py-4">
          <h1 className="text-xl font-bold text-primary">Aurora Bank</h1>
        </div>
        
        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {item.icon}
                {item.title}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
        
        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Settings className="h-5 w-5" />
              Settings
            </NavLink>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={handleLogout}
              disabled={isPending}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
