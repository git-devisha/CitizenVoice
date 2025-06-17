import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertCircle, Paperclip, Send } from 'lucide-react';
import { Department, Complaint, LocationData } from '../types';

interface ComplaintFormProps {
  department: Department;
  onBack: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ department, onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const,
    location: {
      address: '',
      area: '',
      coordinates: undefined as { lat: number; lng: number } | undefined
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const categories = [
    'Service Disruption',
    'Infrastructure Issue',
    'Safety Concern',
    'Quality Issue',
    'Accessibility Problem',
    'Staff Behavior',
    'Policy Concern',
    'Other'
  ];

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { lat: latitude, lng: longitude }
            }
          }));
          // In a real app, you'd reverse geocode to get the address
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              area: 'Current Location'
            }
          }));
          setLocationLoading(false);
        },
        () => {
          setLocationLoading(false);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const complaint: Complaint = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      department: department.id,
      category: formData.category,
      priority: formData.priority,
      status: 'submitted',
      location: formData.location,
      timestamp: new Date(),
      anonymous: true
    };

    // Save to localStorage for demo purposes
    const existingComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    localStorage.setItem('complaints', JSON.stringify([...existingComplaints, complaint]));

    setIsSubmitting(false);
    
    // Show success message and redirect
    alert('Complaint submitted successfully! Your complaint ID is: ' + complaint.id);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`${department.color} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Departments</span>
            </button>
            <h2 className="text-xl font-semibold text-white">
              Submit Complaint - {department.name}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
                { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
                { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
                { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
              ].map(option => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={formData.priority === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="sr-only"
                  />
                  <span className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.priority === option.value
                      ? option.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Please provide detailed information about the issue, including when it occurred, any relevant circumstances, and what resolution you're seeking..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Location Information</span>
              </h3>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {locationLoading ? 'Getting Location...' : 'Use Current Location'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Street address or landmark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area/Neighborhood *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location.area}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, area: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Area or neighborhood name"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Anonymous Submission</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your identity will remain completely anonymous. Officials will only see the complaint details and location information to address your concern effectively.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Complaint'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;