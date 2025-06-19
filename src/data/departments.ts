import { Department } from '../types';

export const departments: Department[] = [
  {
    id: 'public-works',
    name: 'Public Works',
    description: 'Roads, drainage, water supply, streetlights, and infrastructure',
    icon: 'Construction',
    officials: ['Public Works Commissioner', 'Infrastructure Manager'],
    color: 'bg-blue-500'
    // For future image support:
    // image: '/images/departments/public-works.jpg'
  },
  {
    id: 'health-sanitation',
    name: 'Health & Sanitation',
    description: 'Waste management, food safety, public health, and cleanliness',
    icon: 'Heart',
    officials: ['Health Officer', 'Sanitation Inspector'],
    color: 'bg-green-500'
    // image: '/images/departments/health-sanitation.jpg'
  },
  {
    id: 'law-order',
    name: 'Law & Order',
    description: 'Police, traffic, safety, and emergency services',
    icon: 'Shield',
    officials: ['Police Inspector', 'Traffic Controller'],
    color: 'bg-red-500'
    // image: '/images/departments/law-order.jpg'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Schools, libraries, educational facilities, and programs',
    icon: 'GraduationCap',
    officials: ['Education Officer', 'School Inspector'],
    color: 'bg-purple-500'
    // image: '/images/departments/education.jpg'
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Public transport, parking, traffic management, and mobility',
    icon: 'Bus',
    officials: ['Transport Manager', 'Traffic Engineer'],
    color: 'bg-yellow-500'
    // image: '/images/departments/transport.jpg'
  },
  {
    id: 'environment',
    name: 'Environment',
    description: 'Pollution control, green spaces, environmental protection',
    icon: 'Leaf',
    officials: ['Environmental Officer', 'Pollution Control Officer'],
    color: 'bg-emerald-500'
    // image: '/images/departments/environment.jpg'
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'Electricity, gas, telecommunications, and utility services',
    icon: 'Zap',
    officials: ['Utilities Manager', 'Service Coordinator'],
    color: 'bg-orange-500'
    // image: '/images/departments/utilities.jpg'
  },
  {
    id: 'housing',
    name: 'Housing & Planning',
    description: 'Building permits, housing, urban planning, and development',
    icon: 'Home',
    officials: ['Planning Officer', 'Building Inspector'],
    color: 'bg-indigo-500'
    // image: '/images/departments/housing.jpg'
  }
];