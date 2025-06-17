import { createContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "../types";
import { mockUsers } from "../data/mockUsers";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// useAuth hook moved to useAuth.ts

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find((u: User) => u.email === email);

    if (foundUser && foundUser.isActive) {
      // Update last login
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      setUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === "super_admin") return true;

    return user.permissions.some(
      (permission: { resource: string; action: string }) =>
        permission.resource === resource &&
        (permission.action === action || permission.action === "manage")
    );
  };

  const canAccessDepartment = (departmentId: string): boolean => {
    if (!user) return false;

    // Super admin and admin can access all departments
    if (user.role === "super_admin" || user.role === "admin") return true;

    // Department-specific users can only access their department
    return user.department === departmentId;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    hasPermission,
    canAccessDepartment,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
