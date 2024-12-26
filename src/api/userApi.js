import { apiClient } from './api'; // 从 api.js 导入通用的 apiClient 实例


// 分页查找用户信息
export const getHello = () => {
  return apiClient.get('/users/hello')
  .then(response => response.data)
  .catch(error => {
    console.error("未连接后端", error);
    throw error;
  });
};

// 分页查找用户信息
export const getUserList = (page = 1, size = 10) => {
  return apiClient.get('/users/list', {
    params: { page, size }
  })
  .then(response => response.data)
  .catch(error => {
    console.error("Error fetching user list:", error);
    throw error;
  });
};

// 增加用户
export const addUser = (user) => {
  return apiClient.post('/users/add', user)
    .then(response => response.data)
    .catch(error => {
      console.error("Error adding user:", error);
      throw error;
    });
};

// 批量删除用户
export const deleteUsers = (ids) => {
  return apiClient.delete('/users/delete', { data: ids })
    .then(response => response.data)
    .catch(error => {
      console.error("Error deleting users:", error);
      throw error;
    });
};

// 修改用户信息
export const updateUser = (user) => {
  return apiClient.put('/users/update', user)
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating user:", error);
      throw error;
    });
};
// 根据用户 ID 获取用户信息
export const getUserInfo = () => {
  return apiClient.get(`/users/getLoginUserInfo`)
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching user by ID:", error);
      throw error;
    });
};
