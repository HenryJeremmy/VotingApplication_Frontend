import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Get API base URL from localStorage or use default
const getApiBaseUrl = () => {
  return localStorage.getItem('API_BASE_URL') || 'http://localhost:8080/api';
};

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Fix: Add correct Authorization header with token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;

    console.error('API Error:', response?.data || error.message);

    if (response) {
      if (response.status === 401) {
        const isLoginPage = window.location.pathname.includes('login');
        const isLoginEndpoint = response.config?.url?.includes('login');

        if (!isLoginPage && !isLoginEndpoint) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('Your session has expired. Please log in again.');
        }
      } else if (response.status === 403) {
        toast.error('You do not have permission to perform this action');
      } else if (response.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (response.status === 400) {
        const errorData = response.data as any;
        const errorMessage = errorData?.message || 'Invalid request. Please check your input.';
        toast.error(errorMessage);
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
    } else {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// API service object
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    },
    register: async (name: string, email: string, password: string) => {
      const response = await apiClient.post('/auth/register', { name, email, password });
      return response.data;
    },
  },

  candidates: {
    getAll: async () => {
      const response = await apiClient.get('/candidates');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/candidates/${id}`);
      return response.data;
    },
  },

  votes: {
    cast: async (voterId: string, candidateId: string) => {
      const response = await apiClient.post('/votes', { voterId, candidateId });
      return response.data;
    },
    getResults: async () => {
      const response = await apiClient.get('/votes/results');
      return response.data;
    },
    hasVoted: async (voterId: string) => {
      const response = await apiClient.get(`/votes/voter/${voterId}`);
      return response.data;
    },
  },

  admin: {
    getCandidates: async () => {
      const response = await apiClient.get('/admin/candidates');
      return response.data;
    },
    addCandidate: async (candidateData: { name: string; party: string; position: string; imageUrl: string }) => {
      const response = await apiClient.post('/admin/candidates', candidateData);
      return response.data;
    },
    deleteCandidate: async (id: string) => {
      const response = await apiClient.delete(`/admin/candidates/${id}`);
      return response.data;
    },
  },
};

export default apiClient;
