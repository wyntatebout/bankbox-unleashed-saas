
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const UserAvatar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Get initials from name
  const initials = user.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <Avatar className="h-8 w-8 border-2 border-white">
        {user.avatar ? (
          <AvatarImage src={user.avatar} alt={user.name} />
        ) : (
          <AvatarFallback>{initials}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">
          {user.name}
        </span>
        <span className="text-xs text-sidebar-foreground/70">
          {user.email}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-auto"
        onClick={logout}
        title="Logout"
      >
        <LogOut className="h-4 w-4 text-sidebar-foreground" />
      </Button>
    </div>
  );
};

export default UserAvatar;
