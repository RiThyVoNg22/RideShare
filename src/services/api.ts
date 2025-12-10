const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// API request helper
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    // Network errors or other fetch errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    accountType: 'rent' | 'list' | 'both';
  }) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getCurrentUser: async () => {
    return request('/auth/me');
  },

  updateProfile: async (updates: any) => {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async (filters?: {
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString();
    return request(`/vehicles${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return request(`/vehicles/${id}`);
  },

  create: async (vehicleData: any) => {
    return request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  update: async (id: string, updates: any) => {
    return request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return request(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  },

  getMyVehicles: async () => {
    return request('/vehicles/user/my-vehicles');
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData: {
    vehicleId: string;
    pickupDate: string;
    returnDate: string;
  }) => {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getMyBookings: async () => {
    return request('/bookings/my-bookings');
  },

  getOwnerRequests: async () => {
    return request('/bookings/owner-requests');
  },

  getById: async (id: string) => {
    return request(`/bookings/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Chat API
export const chatAPI = {
  getChatByBooking: async (bookingId: string) => {
    return request(`/chat/booking/${bookingId}`);
  },

  getMyChats: async () => {
    return request('/chat/my-chats');
  },

  sendMessage: async (chatId: string, message: string) => {
    return request(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  markAsRead: async (chatId: string) => {
    return request(`/chat/${chatId}/read`, {
      method: 'PUT',
    });
  },

  getChatById: async (chatId: string) => {
    return request(`/chat/${chatId}`);
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return request('/users/profile');
  },

  updateProfile: async (updates: any) => {
    return request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  toggleFavorite: async (vehicleId: string) => {
    return request(`/users/favorites/${vehicleId}`, {
      method: 'POST',
    });
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getToken();
    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const token = getToken();
    const response = await fetch(`${API_URL}/upload/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },
};

// Verification API
export const verificationAPI = {
  submitVerification: async (verificationData: {
    documentType: string;
    frontImage: string;
    backImage?: string;
    selfieImage?: string;
    drivingLicenseImage?: string;
  }) => {
    return request('/verification/submit', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  },

  getMyVerification: async () => {
    return request('/verification/my-verification');
  },

  skipVerification: async () => {
    return request('/verification/skip', {
      method: 'POST',
    });
  },

  // Admin routes
  getPendingVerifications: async () => {
    return request('/verification/admin/pending');
  },

  getAllVerifications: async (status?: string) => {
    const url = status ? `/verification/admin/all?status=${status}` : '/verification/admin/all';
    return request(url);
  },

  getVerificationById: async (id: string) => {
    return request(`/verification/admin/${id}`);
  },

  approveVerification: async (id: string, notes?: string) => {
    return request(`/verification/admin/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  },

  rejectVerification: async (id: string, rejectionReason: string, notes?: string) => {
    return request(`/verification/admin/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ rejectionReason, notes }),
    });
  },
};

