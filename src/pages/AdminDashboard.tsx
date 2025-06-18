import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  AlertTriangle,
  UserCheck,
  LogOut,
  Shield,
} from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import ProtectedRoute from "../components/ProtectedRoute";
import { Complaint } from "../types";
import { departments } from "../data/departments";
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../services/api";

const AdminDashboard: React.FC = () => {
  const { user, hasPermission, canAccessDepartment, logout } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inReview: 0,
    inProgress: 0,
    resolved: 0,
  });

  const loadComplaints = React.useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};

      if (searchTerm) params.search = searchTerm;
      if (selectedDepartment) params.department = selectedDepartment;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedPriority) params.priority = selectedPriority;

      const response = await apiService.getComplaints(params);
      setComplaints(response.complaints || []);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDepartment, selectedStatus, selectedPriority]);

  const loadStats = React.useCallback(async () => {
    try {
      if (hasPermission("analytics", "read")) {
        const statsData = await apiService.getComplaintStats();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, [hasPermission]);

  useEffect(() => {
    loadComplaints();
    loadStats();
  }, [
    searchTerm,
    selectedDepartment,
    selectedStatus,
    selectedPriority,
    loadComplaints,
    loadStats,
  ]);

  const updateComplaintStatus = async (
    complaintId: string,
    newStatus: string
  ) => {
    if (!hasPermission("complaints", "update")) {
      alert("You do not have permission to update complaints");
      return;
    }

    try {
      await apiService.updateComplaintStatus(complaintId, newStatus);

      // Refresh complaints and stats
      await loadComplaints();
      await loadStats();

      // Update selected complaint if it's the one being updated
      if (
        selectedComplaint &&
        (selectedComplaint._id === complaintId ||
          selectedComplaint.id === complaintId)
      ) {
        const updatedComplaint = await apiService.getComplaint(complaintId);
        setSelectedComplaint(updatedComplaint);
      }
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Failed to update complaint status");
    }
  };

  // Get accessible departments for the current user
  const accessibleDepartments = departments.filter(
    (dept) =>
      user?.role === "super_admin" ||
      user?.role === "admin" ||
      canAccessDepartment(dept.id)
  );

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

  if (selectedComplaint) {
    return (
      <ProtectedRoute
        requiredPermission={{ resource: "complaints", action: "read" }}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    ← Back to Dashboard
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Complaint Details
                    </h1>
                    <p className="text-sm text-gray-500">Admin Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Complaint Details
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {selectedComplaint.title}
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div>
                        <strong>ID:</strong>{" "}
                        {selectedComplaint._id || selectedComplaint.id}
                      </div>
                      <div>
                        <strong>Department:</strong>{" "}
                        {
                          departments.find(
                            (d) => d.id === selectedComplaint.department
                          )?.name
                        }
                      </div>
                      <div>
                        <strong>Category:</strong> {selectedComplaint.category}
                      </div>
                      <div>
                        <strong>Priority:</strong>{" "}
                        <span className="capitalize">
                          {selectedComplaint.priority}
                        </span>
                      </div>
                      <div>
                        <strong>Submitted:</strong>{" "}
                        {new Date(
                          selectedComplaint.createdAt ||
                            selectedComplaint.timestamp!
                        ).toLocaleString()}
                      </div>
                      {selectedComplaint.assignedTo && (
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>
                            <strong>Assigned to:</strong>{" "}
                            {selectedComplaint.assignedTo.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <strong>Address:</strong>{" "}
                        {selectedComplaint.location.address}
                      </div>
                      <div>
                        <strong>Area:</strong> {selectedComplaint.location.area}
                      </div>
                      {selectedComplaint.location.coordinates && (
                        <div>
                          <strong>Coordinates:</strong>{" "}
                          {selectedComplaint.location.coordinates.lat.toFixed(
                            6
                          )}
                          ,{" "}
                          {selectedComplaint.location.coordinates.lng.toFixed(
                            6
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                {selectedComplaint.statusHistory &&
                  selectedComplaint.statusHistory.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Status History
                      </h4>
                      <div className="space-y-2">
                        {selectedComplaint.statusHistory.map(
                          (history, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <span className="font-medium capitalize">
                                  {history.status.replace("-", " ")}
                                </span>
                                {history.changedBy && (
                                  <span className="text-sm text-gray-500 ml-2">
                                    by {history.changedBy.name}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(history.changedAt).toLocaleString()}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {hasPermission("complaints", "update") && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Update Status
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "submitted",
                        "in-review",
                        "in-progress",
                        "resolved",
                        "closed",
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            updateComplaintStatus(
                              selectedComplaint._id || selectedComplaint.id!,
                              status
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedComplaint.status === status
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {status
                            .replace("-", " ")
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute
      requiredPermission={{ resource: "complaints", action: "read" }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage and track complaint resolution
                    {user?.department && (
                      <span className="ml-2 text-blue-600">
                        •{" "}
                        {
                          departments.find((d) => d.id === user.department)
                            ?.name
                        }
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {formatRole(user.role)}
                      </span>
                    </div>
                  </div>
                )}
                {hasPermission("users", "read") && (
                  <Link
                    to="/admin/users"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.submitted}
                  </p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.inReview}
                  </p>
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.resolved}
                  </p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {accessibleDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="in-review">In Review</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("");
                  setSelectedStatus("");
                  setSelectedPriority("");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Complaints Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading complaints...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id || complaint.id}
                  complaint={complaint}
                  onClick={() => setSelectedComplaint(complaint)}
                />
              ))}
            </div>
          )}

          {!loading && complaints.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
