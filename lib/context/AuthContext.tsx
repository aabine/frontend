'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api, { authApi, User } from '@/lib/services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ role: string }>;
  register: (data: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAdmin = user?.role === 'admin' || false;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await authApi.getCurrentUser();
      setUser(userData as User);
      
      // Set admin cookie based on user data
      if (userData.role === 'admin') {
        Cookies.set('isAdmin', 'true', { 
          expires: 7,
          path: '/',
          sameSite: 'strict'
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('token');
      Cookies.remove('isAdmin');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // First, get the token
      const loginResponse = await authApi.login(email, password);
      console.log('Login response:', loginResponse);
      
      if (!loginResponse || typeof loginResponse !== 'object' || !loginResponse.access_token) {
        console.error('Invalid login response:', loginResponse);
        throw new Error('Invalid response from server');
      }

      // Store the token in cookies
      const token = loginResponse.access_token;
      Cookies.set('token', token, { 
        expires: 7,
        path: '/',
        sameSite: 'strict'
      });
      
      // Then fetch user data
      try {
        const userData = await authApi.getCurrentUser();
        console.log('User data:', userData);
        setUser(userData as User);

        // Set admin cookie if user is admin
        if (userData.role === 'admin') {
          Cookies.set('isAdmin', 'true', { 
            expires: 7,
            path: '/',
            sameSite: 'strict'
          });
        }

        return { role: userData.role };
      } catch (userError) {
        console.error('Failed to fetch user data:', userError);
        Cookies.remove('token');
        Cookies.remove('isAdmin');
        throw new Error('Failed to fetch user data after login');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Cookies.remove('token');
      Cookies.remove('isAdmin');
      
      if (error.response?.status === 401) {
        throw new Error('Invalid email/username or password');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.detail || 'Invalid request');
      }
      
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: { email: string; username: string; password: string }) => {
    try {
      await authApi.register(data);
      router.push('/auth/login?registered=true');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('isAdmin');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 