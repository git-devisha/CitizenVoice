import React, { useState } from "react";
import {
  MessageSquare,
  Users,
  CheckCircle,
  TrendingUp,
  LogOut,
  Plus,
  Search,
} from "lucide-react";
import DepartmentCard from "../components/DepartmentCard";
import ComplaintForm from "../components/ComplaintForm";
import ComplaintCard from "../components/ComplaintCard";
import { departments } from "../data/departments";
import { Department, Complaint } from "../types";
import { useAuth } from "../hooks/useAuth";

const CivilDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [showMyComplaints, setShowMyComplaints] = useState(false);
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  const stats = [
    {
      icon: MessageSquare,
      label: "Total Complaints",
      value: "1,234",
      color: "text-blue-600",
    },
    {
      icon: CheckCircle,
      label: "Resolved",
      value: "987",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "In Progress",
      value: "156",
      color: "text-orange-600",
    },
    {
      icon: Users,
      label: "Departments",
      value: departments.length.toString(),
      color: "text-purple-600",
    },
  ];

  const loadMyComplaints = async () => {
    setLoading(true);
    try {
      // In a real implementation, you'd have a way to track user's complaints
      // For now, we'll simulate this with localStorage
      const savedComplaints = JSON.parse(
        localStorage.getItem("userComplaints") || "[]"
      );
      setMyComplaints(savedComplaints);
    } catch (error) {
      console.error("Error loading complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMyComplaints = () => {
    setShowMyComplaints(true);
    loadMyComplaints();
  };

  if (selectedDepartment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    CitizenVoice
                  </h1>
                  <p className="text-sm text-gray-500">Civil Dashboard</p>
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

        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <ComplaintForm
            department={selectedDepartment}
            onBack={() => setSelectedDepartment(null)}
          />
        </div>
      </div>
    );
  }

  if (showMyComplaints) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowMyComplaints(false)}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  ← Back to Dashboard
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    My Complaints
                  </h1>
                  <p className="text-sm text-gray-500">
                    Track your submitted complaints
                  </p>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your complaints...</p>
            </div>
          ) : myComplaints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id || complaint.id}
                  complaint={complaint}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No complaints yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any complaints yet.
              </p>
              <button
                onClick={() => setShowMyComplaints(false)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Your First Complaint
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  CitizenVoice
                </h1>
                <p className="text-sm text-gray-500">Civil Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShowMyComplaints}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>My Complaints</span>
              </button>
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Voice Matters
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Submit anonymous complaints to help improve your community. Your
              identity is protected while your concerns are heard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Direct to Officials</span>
              </div>
              <div className="flex items-center space-x-2 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Real-time Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedDepartment(departments[0])}
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <Plus className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Submit New Complaint
                </p>
                <p className="text-sm text-gray-600">
                  Report a new issue in your area
                </p>
              </div>
            </button>
            <button
              onClick={handleShowMyComplaints}
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <Search className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Track My Complaints</p>
                <p className="text-sm text-gray-600">
                  View status of your submissions
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Select a Department
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the relevant department for your complaint to ensure it
            reaches the right officials for prompt resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onClick={() => setSelectedDepartment(department)}
            />
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple, secure, and completely anonymous
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select Department
              </h3>
              <p className="text-gray-600">
                Choose the relevant department that handles your type of
                complaint
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Submit Complaint
              </h3>
              <p className="text-gray-600">
                Fill out the form with details about your complaint and location
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Officials are notified and you can track the status of your
                complaint
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivilDashboard;
