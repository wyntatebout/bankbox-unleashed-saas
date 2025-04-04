import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  BarChart2,
  Send,
  Settings,
  Menu,
  X,
  HelpCircle,
  MessageSquare,
  Bell,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({
  href,
  icon,
  label,
  isActive,
  onClick,
}: SidebarLinkProps) => {
  return (
    <Link to={href} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 mb-1 font-normal text-sidebar-foreground hover:text-white hover:bg-sidebar-accent",
          isActive && "bg-sidebar-accent text-white"
        )}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-50 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-sidebar lg:translate-x-0",
          {
            "-translate-x-full": isMobile && !isOpen,
            "translate-x-0": !isMobile || isOpen,
          }
        )}
      >
        {/* Close Button (Mobile Only) */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        <div className="flex flex-col h-full p-4">
          {/* Brand Logo */}
          <div className="flex items-center justify-center mb-8 mt-4">
            <div className="bg-white rounded-lg p-1.5">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
                BankInABox
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 space-y-6">
            <div className="space-y-1">
              <h2 className="px-4 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Main
              </h2>
              <SidebarLink
                href="/"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="Dashboard"
                isActive={true}
                onClick={closeSidebar}
              />
              <SidebarLink
                href="/accounts"
                icon={<CreditCard className="h-5 w-5" />}
                label="Accounts"
                onClick={closeSidebar}
              />
              <SidebarLink
                href="/transfers"
                icon={<Send className="h-5 w-5" />}
                label="Transfers"
                onClick={closeSidebar}
              />
              <SidebarLink
                href="/savings"
                icon={<PiggyBank className="h-5 w-5" />}
                label="Savings"
                onClick={closeSidebar}
              />
              <SidebarLink
                href="/insights"
                icon={<BarChart2 className="h-5 w-5" />}
                label="Insights"
                onClick={closeSidebar}
              />
            </div>

            <div className="space-y-1">
              <h2 className="px-4 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Support
              </h2>
              <SidebarLink
                href="/help"
                icon={<HelpCircle className="h-5 w-5" />}
                label="Help Center"
                onClick={closeSidebar}
              />
              <SidebarLink
                href="/chat"
                icon={<MessageSquare className="h-5 w-5" />}
                label="Financial Assistant"
                onClick={closeSidebar}
              />
              <SidebarLink
                href="/notifications"
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
                onClick={closeSidebar}
              />
            </div>
          </div>

          {/* Settings & User */}
          <div>
            <SidebarLink
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              onClick={closeSidebar}
            />
            <div className="mt-4 border-t border-sidebar-border pt-4">
              <UserAvatar />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
