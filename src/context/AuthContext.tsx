
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../api/apiService';

// Define types
export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setApiBaseUrl: (url: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing login on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          // You could also verify the token is still valid with an API call here
        } catch (error) {
          console.error('Failed to parse stored user', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const setApiBaseUrl = (url: string) => {
    if (url) {
      localStorage.setItem('API_BASE_URL', url);
      toast.success(`API URL set to: ${url}`);
      // Force reload to apply new API URL
      window.location.reload();
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Login attempt with:', { email });
      const response = await api.auth.login(email, password);
      console.log('Login successful, response:', response);
      
      const userData: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        isAdmin: response.roles?.includes('ADMIN') || false,
      };
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Login successful');
      navigate('/vote');
      return response;
    } catch (error: any) {
      console.error('Login error in AuthContext:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      // Let the component handle the error for better UX
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.register(name, email, password);
      
      toast.success('Registration successful. Please log in.');
      
      // ✅ Do NOT store token or user yet
      // ✅ Redirect to login page instead of /vote
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    setApiBaseUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
