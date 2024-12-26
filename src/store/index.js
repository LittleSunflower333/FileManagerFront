// store.js

import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie'; // 引入 js-cookie 库
import { getUserInfo } from '@/api/userApi'; // 获取用户信息的接口
import { login } from '@/api/authApi'; // 登录接口

Vue.use(Vuex);

export default new Vuex.Store({
  // 全局状态
  state: {
    // apiUrl: "http://127.0.0.1:8888", // API 基础 URL
    // apiUrl: "http://27.106.98.197:8888", // API 基础 URL
    apiUrl: "/api",
    token: Cookies.get('token') || null, // 从 Cookie 获取 token
    userInfo: JSON.parse(Cookies.get('userInfo') || '{}'), // 从 Cookie 获取用户信息
    isSafe: Cookies.get('isSafe') ? Cookies.get('isSafe') === 'true' : true,// 从 Cookie 获取安全模式状态，默认 true
  },

  // 状态更新方法（同步）
  mutations: {
    // 设置 token
    setToken(state, token) {
      state.token = token;
      Cookies.set('token', token, { expires: 7 }); // 将 token 存储到 Cookie，有效期 7 天
    },
    // 清除 token
    clearToken(state) {
      state.token = null;
      Cookies.remove('token'); // 从 Cookie 移除 token
    },
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      Cookies.set('userInfo', JSON.stringify(userInfo), { expires: 7 }); // 将用户信息存储到 Cookie
    },
    // 设置安全模式
    setIsSafe(state, isSafe) {
      state.isSafe = isSafe;
      Cookies.set('isSafe', isSafe, { expires: 7 }); // 将安全模式状态存储到 Cookie
    },
  },

  // 异步操作
  actions: {
    // 登录操作
    login({ commit }, { username, password, isSafe }) {
      return login(username, password, isSafe)  // 调用登录接口
        .then(token => {
          commit('setToken', token);  // 存储 token
          console.log("登录成功，Token 已存储:", token);
        })
        .catch(error => {
          console.error("登录失败:", error);
          throw error;  // 抛出错误，便于调用者处理
        });
    },

    // 异步获取用户信息
    fetchUserInfo({ commit }) {
      return getUserInfo() // 调用获取用户信息的接口
        .then(data => {
          commit('setUserInfo', data); // 提交到状态
          console.log("用户信息已获取:", data);
        })
        .catch(error => {
          console.error("获取用户信息失败:", error);
          throw error; // 抛出错误，便于调用者处理
        });
    },

    // 登出操作
    logout({ commit }) {
      commit('clearToken'); // 清除 token
      commit('setUserInfo', {}); // 清空用户信息
      commit('setIsSafe', true); // 重置安全模式为默认值
      console.log("用户已登出");
    }
  },

  // 派生状态
  getters: {
    // 获取 token
    getToken: state => state.token,
    // 获取用户信息
    getUserInfo: state => state.userInfo,
    // 获取安全模式状态
    getIsSafe: state => state.isSafe,
  }
});
