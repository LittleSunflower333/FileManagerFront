import { apiClient } from './api'; // 从 api.js 导入通用的 apiClient 实例

//foldersApi.js

// 增加文件夹
export const addFolder = (folder) => {
  return apiClient.post('/folders/add', folder)
    .then(response => response.data)
    .catch(error => {
      console.error("Error adding folder:", error);
      throw error;
    });
};

// 删除文件夹
export const deleteFolder = (id) => {
  return apiClient.delete(`/folders/delete/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error("Error deleting folder:", error);
      throw error;
    });
};

// 修改文件夹
export const updateFolder = (folder) => {
  return apiClient.put('/folders/update', folder)
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating folder:", error);
      throw error;
    });
};
