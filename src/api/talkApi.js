import { apiClient } from './api'; // 从 api.js 导入通用的 apiClient 实例

// 获取评论列表，按时间倒序排列
export const getTalkList = (page = 1, size = 10) => {
  return apiClient.get('/talk/list', {
    params: { page, size }
  })
  .then(response => response.data)
  .catch(error => {
    console.error("Error fetching talk list:", error);
    throw error;
  });
};

// 发布评论
export const publishTalk = (text, isSafe = true) => {
    // 向后端发送请求时携带 isSafe 参数，默认为 true（启用安全防范）
    return apiClient.post('/talk/publish', { text }, { params: { isSafe } })
      .then(response => response.data)
      .catch(error => {
        console.error("Error publishing talk:", error);
        throw error;
      });
  };
  

// 删除评论
export const deleteTalk = (id) => {
  return apiClient.delete(`/talk/delete/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error("Error deleting talk:", error);
      throw error;
    });
};
