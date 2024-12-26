import { apiClient } from './api'; // 导入通用的 apiClient 实例

// 获取日志列表，支持模糊查询和分页
export const getApiLogList = (page = 1, size = 10, search = '') => {
  return apiClient.get('/apiLog/list', {
    params: { page, size, search }
  })
  .then(response => response.data.data)
  .catch(error => {
    console.error("Error fetching API log list:", error);
    throw error;
  });
};
// 导入 XML 日志
export const importLogs = (file, isSafe) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("isSafe", isSafe);

  return apiClient.post('/apiLog/import', formData, {
    headers: {
      "Content-Type": "multipart/form-data" // 设置请求头为 multipart/form-data
    }
  })
  .then(response => {
    console.log("日志结果:", response.data);
    return response.data; // 处理成功的响应
  })
  .catch(error => {
    console.error("日志导入失败:", error);
    throw error; // 处理失败的响应
  });
};