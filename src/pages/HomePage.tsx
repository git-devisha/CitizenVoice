import React, { useState } from 'react';
import { MessageSquare, Users, CheckCircle, TrendingUp } from 'lucide-react';
import DepartmentCard from '../components/DepartmentCard';
import ComplaintForm from '../components/ComplaintForm';
import { departments } from '../data/departments';
import { Department } from '../types';

const HomePage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const stats = [
    { icon: MessageSquare, label: 'Total Complaints', value: '1,234', color: 'text-blue-600' },
    { icon: CheckCircle, label: 'Resolved', value: '987', color: 'text-green-600' },
    { icon: TrendingUp, label: 'In Progress', value: '156', color: 'text-orange-600' },
    { icon: Users, label: 'Departments', value: departments.length.toString(), color: 'text-purple-600' }
  ];

  if (selectedDepartment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <ComplaintForm
          department={selectedDepartment}
          onBack={() => setSelectedDepartment(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Voice Matters
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Submit anonymous complaints to help improve your community. Your identity is protected while your concerns are heard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-blue-100">
                <CheckCircle className="w-5 h-5" />
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <CheckCircle className="w-5 h-5" />
                <span>Direct to Officials</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
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
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Departments Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Select a Department
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the relevant department for your complaint to ensure it reaches the right officials for prompt resolution.
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Department</h3>
              <p className="text-gray-600">
                Choose the relevant department that handles your type of complaint
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit Complaint</h3>
              <p className="text-gray-600">
                Fill out the form with details about your complaint and location
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Officials are notified and you can track the status of your complaint
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;