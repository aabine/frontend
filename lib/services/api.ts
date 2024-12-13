import axios from 'axios';
import Cookies from 'js-cookie';

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: {
    username: string;
  };
  created_at: string;
  tags: Array<{ name: string }>;
  likes_count: number;
  comments_count: number;
}

interface PostsResponse {
  items: Post[];
  total: number;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_verified: boolean;
  role: string;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from cookies
    const token = Cookies.get('token');
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // Ensure content type is set correctly for non-FormData requests
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response.data;
  },
  async (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear the token and redirect to login
      Cookies.remove('token');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Login attempt:', { email });
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      console.log('Login request URL:', `${API_URL}/auth/login`);
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: { email: string; username: string; password: string }): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response;
  },
};

export const postsApi = {
  getAll: async (page = 1, limit = 10): Promise<PostsResponse> => {
    try {
      const response = await api.get<PostsResponse>(`/posts/?skip=${(page - 1) * limit}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { items: [], total: 0 };
    }
  },

  getOne: async (slug: string): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${slug}/`);
    return response;
  },

  create: async (data: FormData): Promise<Post> => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.post('/posts/', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, axios will set it automatically with boundary
        },
      });

      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Could not validate credentials. Please log in again.');
      }
      console.error('Error creating post:', error.response || error);
      throw error;
    }
  },

  getMyPosts: async (): Promise<PostsResponse> => {
    try {
      const response = await api.get<PostsResponse>('/posts/my-posts/');
      return response;
    } catch (error) {
      console.error('Error fetching my posts:', error);
      return { items: [], total: 0 };
    }
  },

  update: async (slug: string, data: FormData): Promise<Post> => {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.put(`${API_URL}/posts/${slug}/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (slug: string): Promise<void> => {
    await api.delete(`/posts/${slug}/`);
  },

  like: async (slug: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/posts/${slug}/like/`);
    return response;
  },
};

export const commentsApi = {
  getForPost: async (postId: number) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response;
  },

  create: async (data: { post_id: number; content: string; parent_id?: number }) => {
    const response = await api.post('/comments', data);
    return response;
  },

  update: async (commentId: number, content: string) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response;
  },

  delete: async (commentId: number) => {
    await api.delete(`/comments/${commentId}`);
  },
};

export const adminApi = {
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },

  getUsers: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/admin/users?skip=${skip}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  updateUserStatus: async (userId: number, isActive: boolean) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { is_active: isActive });
      return response;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  updateUserRole: async (userId: number, isAdmin: boolean) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { is_admin: isAdmin });
      return response;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  getAllPosts: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/admin/posts/all?skip=${skip}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
  },

  updatePostStatus: async (postId: number, status: string) => {
    try {
      const response = await api.patch(`/admin/posts/${postId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error updating post status:', error);
      throw error;
    }
  },

  getAllComments: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/admin/comments/all?skip=${skip}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching all comments:', error);
      throw error;
    }
  },

  updateCommentStatus: async (commentId: number, status: string) => {
    try {
      const response = await api.patch(`/admin/comments/${commentId}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error updating comment status:', error);
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      return response;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings: any) => {
    try {
      const response = await api.put('/admin/settings', settings);
      return response;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },
};

export default api; 