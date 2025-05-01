import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Home, LayoutDashboard, CreditCard, ArrowLeftRight, PiggyBank, BarChart3, HelpCircle, MessageSquare, Bell, Settings, LogOut, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, current: pathname === "/" },
    { name: "Accounts", href: "/accounts", icon: CreditCard, current: pathname === "/accounts" },
    { name: "Transfers", href: "/transfers", icon: ArrowLeftRight, current: pathname === "/transfers" },
    { name: "Savings", href: "/savings", icon: PiggyBank, current: pathname === "/savings" },
    { name: "Insights", href: "/insights", icon: BarChart3, current: pathname === "/insights" },
    { name: "Help Center", href: "/help", icon: HelpCircle, current: pathname === "/help" },
    { name: "Legal", href: "/legal", icon: FileText, current: pathname === "/legal" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col border-r bg-secondary lg:flex">
        <div className="flex items-center justify-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold text-2xl">Aurora Bank</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-2 rounded-md p-2 hover:bg-muted ${item.current ? "bg-muted font-medium" : ""}`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/notifications")}>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="text-left">
            <SheetTitle>Aurora Bank</SheetTitle>
            <SheetDescription>
              Navigate through your banking options.
            </SheetDescription>
          </SheetHeader>
          <nav className="flex-1 space-y-1 p-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 rounded-md p-2 hover:bg-muted ${item.current ? "bg-muted font-medium" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/notifications")}>Notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
