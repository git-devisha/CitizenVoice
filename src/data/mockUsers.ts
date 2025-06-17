import { User, Permission } from '../types';

// Define permissions
export const permissions: Permission[] = [
  // Complaint permissions
  { id: 'complaint-read', name: 'Read Complaints', description: 'View complaints', resource: 'complaints', action: 'read' },
  { id: 'complaint-update', name: 'Update Complaints', description: 'Update complaint status', resource: 'complaints', action: 'update' },
  { id: 'complaint-delete', name: 'Delete Complaints', description: 'Delete complaints', resource: 'complaints', action: 'delete' },
  { id: 'complaint-manage', name: 'Manage Complaints', description: 'Full complaint management', resource: 'complaints', action: 'manage' },
  
  // User permissions
  { id: 'user-read', name: 'Read Users', description: 'View users', resource: 'users', action: 'read' },
  { id: 'user-create', name: 'Create Users', description: 'Create new users', resource: 'users', action: 'create' },
  { id: 'user-update', name: 'Update Users', description: 'Update user details', resource: 'users', action: 'update' },
  { id: 'user-delete', name: 'Delete Users', description: 'Delete users', resource: 'users', action: 'delete' },
  { id: 'user-manage', name: 'Manage Users', description: 'Full user management', resource: 'users', action: 'manage' },
  
  // Department permissions
  { id: 'department-read', name: 'Read Departments', description: 'View departments', resource: 'departments', action: 'read' },
  { id: 'department-manage', name: 'Manage Departments', description: 'Full department management', resource: 'departments', action: 'manage' },
  
  // Analytics permissions
  { id: 'analytics-read', name: 'Read Analytics', description: 'View analytics and reports', resource: 'analytics', action: 'read' },
];

// Mock users with different roles
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@city.gov',
    name: 'System Administrator',
    role: 'super_admin',
    permissions: permissions, // Super admin has all permissions
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-12-20')
  },
  {
    id: '2',
    email: 'admin@city.gov',
    name: 'City Administrator',
    role: 'admin',
    permissions: [
      permissions.find(p => p.id === 'complaint-manage')!,
      permissions.find(p => p.id === 'user-read')!,
      permissions.find(p => p.id === 'department-read')!,
      permissions.find(p => p.id === 'analytics-read')!,
    ],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-19')
  },
  {
    id: '3',
    email: 'publicworks@city.gov',
    name: 'Public Works Head',
    role: 'department_head',
    department: 'public-works',
    permissions: [
      permissions.find(p => p.id === 'complaint-manage')!,
      permissions.find(p => p.id === 'user-read')!,
      permissions.find(p => p.id === 'analytics-read')!,
    ],
    isActive: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-12-18')
  },
  {
    id: '4',
    email: 'health@city.gov',
    name: 'Health Department Head',
    role: 'department_head',
    department: 'health-sanitation',
    permissions: [
      permissions.find(p => p.id === 'complaint-manage')!,
      permissions.find(p => p.id === 'user-read')!,
      permissions.find(p => p.id === 'analytics-read')!,
    ],
    isActive: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-12-17')
  },
  {
    id: '5',
    email: 'officer1@city.gov',
    name: 'Public Works Officer',
    role: 'officer',
    department: 'public-works',
    permissions: [
      permissions.find(p => p.id === 'complaint-read')!,
      permissions.find(p => p.id === 'complaint-update')!,
    ],
    isActive: true,
    createdAt: new Date('2024-03-01'),
    lastLogin: new Date('2024-12-16')
  },
  {
    id: '6',
    email: 'officer2@city.gov',
    name: 'Health Inspector',
    role: 'officer',
    department: 'health-sanitation',
    permissions: [
      permissions.find(p => p.id === 'complaint-read')!,
      permissions.find(p => p.id === 'complaint-update')!,
    ],
    isActive: true,
    createdAt: new Date('2024-03-15'),
    lastLogin: new Date('2024-12-15')
  }
];