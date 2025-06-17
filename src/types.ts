export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  officials: string[];
  color: string;
}

export interface Complaint {
  id: string;
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
  timestamp: Date;
  attachments?: string[];
  anonymous: boolean;
  assignedTo?: string;
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
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'department_head' | 'officer';
  department?: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  canAccessDepartment: (departmentId: string) => boolean;
}