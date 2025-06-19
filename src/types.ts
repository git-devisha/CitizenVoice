export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  officials: string[];
  color: string;
  // For future image support:
  // image?: string; // URL to department image
}

export interface Complaint {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  description: string;
  department: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'in-review' | 'in-progress' | 'resolved' | 'closed';
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    area: string;
  };
  timestamp?: Date;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  anonymous: boolean;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  statusHistory?: Array<{
    status: string;
    changedBy?: {
      _id: string;
      name: string;
      email: string;
    };
    changedAt: string;
    notes?: string;
  }>;
}

export interface LocationData {
  address: string;
  area: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  _id: string;
  id?: string; // For backward compatibility
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'department_head' | 'officer' | 'civil';
  department?: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  // Profile fields
  phone?: string;
  avatar?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'civil' | 'admin') => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
  }) => Promise<boolean>;
  updateProfile: (profileData: {
    name: string;
    email: string;
    department?: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  canAccessDepartment: (departmentId: string) => boolean;
  isLoading?: boolean;
}