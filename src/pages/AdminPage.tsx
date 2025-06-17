import { useState, useEffect } from "react";
import {
  Search,
  Download,
  BarChart3,
  Users,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import ProtectedRoute from "../components/ProtectedRoute";
import { Complaint } from "../types";
import { departments } from "../data/departments";
import { useAuth } from "../hooks/useAuth";

const AdminPage: React.FC = () => {
  const { user, hasPermission, canAccessDepartment } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );

  useEffect(() => {
    // Load complaints from localStorage
    const savedComplaints = JSON.parse(
      localStorage.getItem("complaints") || "[]"
    );

    // Filter complaints based on user's department access
    let accessibleComplaints = savedComplaints;
    if (user && user.role !== "super_admin" && user.role !== "admin") {
      accessibleComplaints = savedComplaints.filter((complaint: Complaint) =>
        canAccessDepartment(complaint.department)
      );
    }

    setComplaints(accessibleComplaints);
    setFilteredComplaints(accessibleComplaints);
  }, [user, canAccessDepartment]);

  useEffect(() => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.location.address
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(
        (complaint) => complaint.department === selectedDepartment
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (complaint) => complaint.status === selectedStatus
      );
    }

    if (selectedPriority) {
      filtered = filtered.filter(
        (complaint) => complaint.priority === selectedPriority
      );
    }

    setFilteredComplaints(filtered);
  }, [
    complaints,
    searchTerm,
    selectedDepartment,
    selectedStatus,
    selectedPriority,
  ]);

  const updateComplaintStatus = (complaintId: string, newStatus: string) => {
    if (!hasPermission("complaints", "update")) {
      alert("You do not have permission to update complaints");
      return;
    }

    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? {
            ...complaint,
            status: newStatus as Complaint["status"],
            assignedTo: user?.id,
          }
        : complaint
    );
    setComplaints(updatedComplaints);

    // Update localStorage with all complaints (not just filtered ones)
    const allComplaints = JSON.parse(
      localStorage.getItem("complaints") || "[]"
    );
    const updatedAllComplaints = allComplaints.map((complaint: Complaint) =>
      complaint.id === complaintId
        ? {
            ...complaint,
            status: newStatus as Complaint["status"],
            assignedTo: user?.id,
          }
        : complaint
    );
    localStorage.setItem("complaints", JSON.stringify(updatedAllComplaints));
  };

  const getStatusCounts = () => {
    const counts = {
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === "submitted").length,
      inReview: complaints.filter((c) => c.status === "in-review").length,
      inProgress: complaints.filter((c) => c.status === "in-progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Get accessible departments for the current user
  const accessibleDepartments = departments.filter(
    (dept) =>
      user?.role === "super_admin" ||
      user?.role === "admin" ||
      canAccessDepartment(dept.id)
  );

  if (selectedComplaint) {
    return (
      <ProtectedRoute
        requiredPermission={{ resource: "complaints", action: "read" }}
      >
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    ← Back to Dashboard
                  </button>
                  <h2 className="text-xl font-semibold text-white">
                    Complaint Details
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {selectedComplaint.title}
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div>
                        <strong>ID:</strong> {selectedComplaint.id}
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
                        {new Date(selectedComplaint.timestamp).toLocaleString()}
                      </div>
                      {selectedComplaint.assignedTo && (
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>
                            <strong>Assigned to:</strong>{" "}
                            {user?.id === selectedComplaint.assignedTo
                              ? "You"
                              : "Another officer"}
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
                            updateComplaintStatus(selectedComplaint.id, status)
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage and track complaint resolution
                  {user?.department && (
                    <span className="ml-2 text-blue-600">
                      •{" "}
                      {departments.find((d) => d.id === user.department)?.name}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-4">
                {hasPermission("analytics", "read") && (
                  <>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts.total}
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
                    {statusCounts.submitted}
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
                    {statusCounts.inReview}
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
                    {statusCounts.inProgress}
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
                    {statusCounts.resolved}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => setSelectedComplaint(complaint)}
              />
            ))}
          </div>

          {filteredComplaints.length === 0 && (
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

export default AdminPage;
