const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProfile(profileData: {
    name: string;
    email: string;
    department?: string;
    phone?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Complaint endpoints
  async getComplaints(params?: {
    department?: string;
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/complaints?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getComplaint(id: string) {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createComplaint(complaintData: {
    title: string;
    description: string;
    department: string;
    category: string;
    priority: string;
    location: {
      address: string;
      area: string;
      coordinates?: { lat: number; lng: number };
    };
  }) {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData)
    });
    return this.handleResponse(response);
  }

  async updateComplaintStatus(id: string, status: string, notes?: string) {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    return this.handleResponse(response);
  }

  async getComplaintStats() {
    const response = await fetch(`${API_BASE_URL}/complaints/stats/overview`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // User endpoints
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
    [key: string]: unknown;
  }) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async updateUser(
    id: string,
    userData: {
      email?: string;
      password?: string;
      name?: string;
      role?: string;
      department?: string;
      [key: string]: unknown;
    }
  ) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async toggleUserStatus(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();