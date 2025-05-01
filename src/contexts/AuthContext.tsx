
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock user data with corrected credentials
const DEMO_USERS = [
  {
    id: "usr_1",
    email: "demo@aurorabank.com",
    password: "password123",
    name: "John Doe",
    avatar: "https://github.com/shadcn.png",
    accountType: "Premium",
  },
  {
    id: "usr_2",
    email: "admin@aurorabank.com",
    password: "admin123",
    name: "Admin User",
    avatar: "",
    accountType: "Admin",
  },
];

type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  accountType: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage with updated key
    const savedUser = localStorage.getItem("auroraBank");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("auroraBank");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulating API call
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure case-insensitive email comparison and exact password matching
      const foundUser = DEMO_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        // Remove password before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("auroraBank", JSON.stringify(userWithoutPassword));
        toast.success("Login successful!");
        navigate("/");
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auroraBank");
    toast.info("You've been logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
