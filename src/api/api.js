import axios from 'axios';
import store from '@/store'; // 导入 Vuex store
import router from '@/router'; // 导入 Vue Router
import Cookies from 'js-cookie';
// 配置 Axios 默认头部
// const BASE_URL = 'http://127.0.0.1:8888';
const BASE_URL = store.state.apiUrl;
axios.defaults.baseURL =  BASE_URL; // 设置 API 基础 URL
axios.defaults.headers['Content-Type'] = 'application/json';

// 创建 Axios 实例
export const apiClient = axios.create({
  baseURL: BASE_URL, // 确保实例的 baseURL 一致
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 允许跨域请求发送 Cookies
});

// 请求拦截器：每次请求前自动添加 Authorization 头
apiClient.interceptors.request.use(
  config => {
    // 从 Vuex 获取 token，优先从 Vuex 获取，如果没有则从 localStorage 获取
    const token = store.state.token || localStorage.getItem('token');
    // 如果 token 存在，添加 Authorization 头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
        // 从 Cookies 获取 isSafe 的值
        const isSafe = Cookies.get('isSafe');
    // 将 isSafe 添加到请求的 Cookies 中
        if (isSafe !== undefined) {
          config.headers['X-Is-Safe'] = isSafe;
        }
    return config;
  },
  error => {
    console.error("请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器：处理 Token 过期（401 错误）
apiClient.interceptors.response.use(
  response => response, // 正常响应直接返回
  error => {
    if (error.response && error.response.status === 401) {
      console.error('Token 过期或无效，重定向到登录页...');
      // 清除存储的 token
      localStorage.removeItem('token');
      store.commit('setToken', null);

      // 跳转到登录页面
      router.push({ name: 'login' }); // 假设登录页面的路由名为 'login'
    }
    return Promise.reject(error);
  }
);

// 导出用于其他模块使用
export default apiClient;
