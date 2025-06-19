import React from "react";
import { Department } from "../types";
import * as Icons from "lucide-react";

interface DepartmentCardProps {
  department: Department;
  onClick: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onClick,
}) => {
  const IconComponent = Icons[
    department.icon as keyof typeof Icons
  ] as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
    >
      <div className={`${department.color} h-2 w-full`} />
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          {/* Icon Display - can be replaced with image */}
          <div className={`${department.color} p-3 rounded-lg`}>
            {IconComponent ? (
              <IconComponent className="w-6 h-6 text-white" />
            ) : (
              <div className="w-6 h-6 bg-white rounded"></div>
            )}
            {/* For future image support, replace the above with:
            {department.image ? (
              <img 
                src={department.image} 
                alt={department.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            ) : (
              <div className={`${department.color} p-3 rounded-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            )}
            */}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {department.name}
            </h3>
            <p className="text-sm text-gray-500">
              {department.officials.length} officials
            </p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {department.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {department.officials.map((official, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {official}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
