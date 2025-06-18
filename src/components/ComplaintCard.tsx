import React from "react";
import {
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Complaint } from "../types";
import { departments } from "../data/departments";

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onClick,
}) => {
  const department = departments.find((d) => d.id === complaint.department);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "in-review":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-4 h-4" />;
      case "in-review":
        return <Eye className="w-4 h-4" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden ${
        onClick ? "cursor-pointer transform hover:-translate-y-1" : ""
      }`}
    >
      <div className={`${department?.color || "bg-gray-500"} h-1 w-full`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {complaint.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  {complaint.timestamp
                    ? new Date(complaint.timestamp).toLocaleDateString()
                    : "N/A"}
                </span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{complaint.location.area}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                complaint.status
              )} flex items-center space-x-1`}
            >
              {getStatusIcon(complaint.status)}
              <span className="capitalize">
                {complaint.status.replace("-", " ")}
              </span>
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                complaint.priority
              )}`}
            >
              {complaint.priority.toUpperCase()}
            </span>
          </div>

          <div className="text-sm text-gray-500">
            {department?.name || "Unknown Department"}
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {complaint.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Category: {complaint.category}
          </span>
          <span className="text-xs text-gray-400">ID: {complaint.id}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
