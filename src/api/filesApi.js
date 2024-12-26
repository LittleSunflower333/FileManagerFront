import { apiClient } from './api'; // 从 api.js 导入通用的 apiClient 实例

// 获取当前用户的文件夹树形结构
export const getFileTree = () => {
  return apiClient.get(`/files/getFileTree`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error("Error fetching file tree:", error);
      throw error;
    });
};

// 新增文件
export const addFile = (fileData, folderId,isSafe) => {
  const formData = new FormData();
  formData.append('file', fileData);       // 将文件添加到 FormData
  formData.append('folderId', folderId);   // 将文件夹 ID 添加到 FormData
  formData.append("isSafe", isSafe);
  
  return apiClient.post('/files/add', formData) // 使用 FormData 发送请求
    .then(response => response.data)
    .catch(error => {
      console.error("Error adding file:", error);
      throw error;
    });
};

// 删除文件
export const deleteFile = (fileId) => {
  return apiClient.delete(`/files/delete/${fileId}`)
    .then(response => response.data)
    .catch(error => {
      console.error("Error deleting file:", error);
      throw error;
    });
};

// 修改文件名
export const updateFileName = (fileId, newName) => {
  return apiClient.put(`/files/updateName/${fileId}`, { name: newName })
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating file name:", error);
      throw error;
    });
};
// 根据文件名模糊搜索当前用户的文件
export const searchFilesByNameofLoginUser = (fileName) => {
  return apiClient.get('/files/searchFilesByNameofLoginUser', { params: { fileName:fileName } })
    .then(response => response.data)
    .catch(error => {
      console.error("Error searching user files by name:", error);
      throw error;
    });
};
// 获取当前用户的所有文件数量和文件总大小
export const getFileStats = (userId) => {
  return apiClient.get(`/files/getFileStats/${userId}`)
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching file stats:", error);
      throw error;
    });
};

// 根据文件名查找文件列表
export const searchFilesByName = (fileName) => {
  return apiClient.get('/files/searchByName', { params: { name: fileName } })
    .then(response => response.data)
    .catch(error => {
      console.error("Error searching files by name:", error);
      throw error;
    });
};

export const downloadFile = (fileId) => {
  return apiClient.get(`/files/download/${fileId}`, {
    responseType: 'blob', // 确保响应为文件流
  })
    .then(response => {
      // 创建一个下载链接并触发下载
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // 获取文件名（可从响应头中解析，如 Content-Disposition）
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'downloaded-file'; // 默认文件名
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=([\\'"]?)([^\\'"]+)\1/.exec(contentDisposition);
        if (matches != null && matches[2]) {
          fileName = matches[2]; // 从 Content-Disposition 头解析文件名
        }
      }

      // 确保文件名是 URL 解码的，并设置为下载文件的名称
      link.setAttribute('download', decodeURIComponent(fileName));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 释放对象 URL
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error("Error downloading file:", error);
      throw error;
    });
  
};
export const executeCommand = (command, isSafe) => {
  return apiClient.post('/files/execute', 
    {
      command: command,
      isSafe: isSafe
    }
  )
  .then(response => response.data)
  .catch(error => {
    console.error("Error executing command:", error);
    throw error;
  });
};
