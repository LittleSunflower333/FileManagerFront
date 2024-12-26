import { apiClient } from './api'; // 从 api.js 导入通用的 apiClient 实例
import store from '@/store'; // 导入 Vuex store

// 用户登录
export const login = async (username, password,isSafe) => {
  try {
    const response = await apiClient.post('/auth/login', { username, password,isSafe }); // 使用通用的 apiClient，路径加上 /auth
    const token = response.data.token;
    // 存储 Token 到 localStorage 和 Vuex
    localStorage.setItem('token', token);
    store.commit('setToken', token);  // 存储到 Vuex
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// 用户注册
export const register = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/register', { username, password }); // 使用通用的 apiClient，路径加上 /auth
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// 验证 Token 是否有效
export const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await apiClient.get('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`, // 这里也可以省略，因为已经在 apiClient 拦截器中处理了
      },
    });
    return response.data;
  } catch (error) {
    console.error('Token validation failed:', error);
    throw error;
  }
};

// 用户注销
export const logout = () => {
  // 移除 Token
  localStorage.removeItem('token');
  store.commit('setToken', null);  // 清除 Vuex 中的 token
  console.log('User logged out');
};
