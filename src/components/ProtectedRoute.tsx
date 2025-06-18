import React from "react";
import { useAuth } from "../hooks/useAuth";
import { AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  requiredRole?: string[];
  departmentId?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  departmentId,
}) => {
  const { user, hasPermission, canAccessDepartment } = useAuth();

  if (!user) {
    return null; // This should not happen as AuthGuard handles authentication
  }

  // Check role-based access
  if (requiredRole && !requiredRole.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have the required role to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required: {requiredRole.join(" or ")} | Your role: {user.role}
          </p>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (
    requiredPermission &&
    !hasPermission(requiredPermission.resource, requiredPermission.action)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to perform this action.
          </p>
          <p className="text-sm text-gray-500">
            Required: {requiredPermission.action} on{" "}
            {requiredPermission.resource}
          </p>
        </div>
      </div>
    );
  }

  // Check department-based access
  if (departmentId && !canAccessDepartment(departmentId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Department Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have access to this department's data.
          </p>
          <p className="text-sm text-gray-500">
            Your department: {user.department || "None assigned"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
