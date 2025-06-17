import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Shield,
  Home,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "department_head":
        return "bg-green-100 text-green-800";
      case "officer":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CitizenVoice</h1>
              <p className="text-xs text-gray-500">
                Anonymous Complaint Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith("/admin")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {isAuthenticated && user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.department || "System"}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="mt-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {formatRole(user.role)}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 py-2">
                      <p className="text-xs text-gray-500 mb-2">Permissions:</p>
                      <div className="space-y-1">
                        {user.permissions
                          .slice(0, 3)
                          .map(
                            (permission: { name: string }, index: number) => (
                              <p key={index} className="text-xs text-gray-600">
                                • {permission.name}
                              </p>
                            )
                          )}
                        {user.permissions.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{user.permissions.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
