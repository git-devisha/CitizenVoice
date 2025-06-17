import { useState } from "react";
import { LogIn, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid credentials or account is inactive");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="mt-2 text-gray-600">Sign in to manage complaints</p>
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
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Demo Accounts
          </h3>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
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
                    <p className="font-medium text-gray-900">{account.email}</p>
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
      </div>
    </div>
  );
};

export default LoginForm;
