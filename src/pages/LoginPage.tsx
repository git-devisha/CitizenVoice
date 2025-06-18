import React, { useState } from "react";
import {
  MessageSquare,
  Users,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

type UserRole = "civil" | "admin";

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError("");
    // Pre-fill demo credentials based on role
    if (role === "civil") {
      setEmail("citizen@example.com");
      setPassword("demo123");
    } else {
      setEmail("admin@city.gov");
      setPassword("demo123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password, selectedRole!);
      if (success) {
        // Navigation will be handled by the App component based on user role
      } else {
        setError("Invalid credentials or account is inactive");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const adminDemoAccounts = [
    {
      email: "superadmin@city.gov",
      role: "Super Admin",
      description: "Full system access",
    },
    {
      email: "admin@city.gov",
      role: "City Admin",
      description: "City-wide management",
    },
    {
      email: "publicworks@city.gov",
      role: "Dept Head",
      description: "Public Works department",
    },
    {
      email: "health@city.gov",
      role: "Dept Head",
      description: "Health & Sanitation",
    },
    {
      email: "officer1@city.gov",
      role: "Officer",
      description: "Public Works officer",
    },
    {
      email: "officer2@city.gov",
      role: "Officer",
      description: "Health inspector",
    },
  ];

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CitizenVoice
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Anonymous Complaint Platform
            </p>
            <p className="text-lg text-gray-700">
              Choose your role to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Civil User Card */}
            <div
              onClick={() => handleRoleSelect("civil")}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl mb-4 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white text-center">
                  Civil User
                </h2>
              </div>

              <div className="p-8">
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Submit anonymous complaints about civic issues in your
                  community. Your identity remains protected while your concerns
                  are addressed.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Submit anonymous complaints</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Track complaint status</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Complete privacy protection</span>
                  </div>
                </div>

                <div className="flex items-center justify-center text-green-600 group-hover:text-green-700 transition-colors">
                  <span className="font-medium">Continue as Civil User</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Admin User Card */}
            <div
              onClick={() => handleRoleSelect("admin")}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl mb-4 mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white text-center">
                  Admin User
                </h2>
              </div>

              <div className="p-8">
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Manage and resolve complaints, oversee departments, and ensure
                  efficient handling of civic issues across the platform.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Manage complaints & responses</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Department oversight</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Analytics & reporting</span>
                  </div>
                </div>

                <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="font-medium">Continue as Admin</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              Secure • Anonymous • Efficient
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button
            onClick={() => setSelectedRole(null)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 flex items-center mx-auto"
          >
            ← Back to role selection
          </button>

          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
              selectedRole === "civil" ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {selectedRole === "civil" ? (
              <Users className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            {selectedRole === "civil" ? "Civil User Login" : "Admin Portal"}
          </h2>
          <p className="mt-2 text-gray-600">
            {selectedRole === "civil"
              ? "Access your complaint dashboard"
              : "Sign in to manage complaints"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 ${
                selectedRole === "civil"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {selectedRole === "civil" ? (
                <Users className="w-5 h-5" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>
        </div>

        {/* Demo Accounts for Admin */}
        {selectedRole === "admin" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Demo Admin Accounts
            </h3>
            <div className="space-y-3">
              {adminDemoAccounts.map((account, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword("demo123");
                  }}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {account.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {account.description}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {account.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Click any account to auto-fill credentials. Password: demo123
            </p>
          </div>
        )}

        {/* Demo Account for Civil */}
        {selectedRole === "civil" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Demo Civil Account
            </h3>
            <div
              onClick={() => {
                setEmail("citizen@example.com");
                setPassword("demo123");
              }}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <p className="font-medium text-gray-900">citizen@example.com</p>
              <p className="text-sm text-gray-600">Demo civil user account</p>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Click to auto-fill credentials. Password: demo123
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
