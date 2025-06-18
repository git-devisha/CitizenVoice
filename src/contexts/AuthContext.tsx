import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "../types";
import { apiService } from "../services/api";
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const token = localStorage.getItem("authToken");
    if (token) {
      // Verify token with backend
      apiService
        .getCurrentUser()
        .then((userData: User) => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem("authToken");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "civil" | "admin"
  ): Promise<boolean> => {
    try {
      // For civil users, create a mock user without backend authentication
      if (role === "civil") {
        const civilUser: User = {
          _id: "civil-user-1",
          email: email,
          name: "Civil User",
          role: "civil",
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        setUser(civilUser);
        setIsAuthenticated(true);
        localStorage.setItem("authToken", "civil-mock-token");
        return true;
      }

      // For admin users, use backend authentication
      const response = await apiService.login(email, password);

      if (response.token && response.user) {
        localStorage.setItem("authToken", response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (user?.role !== "civil") {
        await apiService.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    // Civil users have no admin permissions
    if (user.role === "civil") return false;

    // Super admin has all permissions
    if (user.role === "super_admin") return true;

    return user.permissions.some(
      (permission) =>
        permission.resource === resource &&
        (permission.action === action || permission.action === "manage")
    );
  };

  const canAccessDepartment = (departmentId: string): boolean => {
    if (!user) return false;

    // Civil users can access all departments for complaint submission
    if (user.role === "civil") return true;

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
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
