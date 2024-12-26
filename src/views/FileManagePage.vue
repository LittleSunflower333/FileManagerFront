<template>
  <div class="file-manage-page">
    <!-- 左侧边栏 -->
    <div class="sidebar">
      <el-button @click="addFolder" type="text"> + 新建文件夹</el-button>
      <el-tree
        :data="folderList"
        :props="treeProps"
        :default-checked-keys="[activeFolder]"
        :default-expanded-keys="expandedKeys"
        @node-click="handleFolderSelect"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
        accordion
        class="custom-tree"
      >
        <span class="custom-tree-node" slot-scope="{ data, node }">
          <i class="el-icon-folder"></i>
          <div v-if="isSafe">{{ data.folderName }}</div>
          <div v-else v-html="data.folderName"></div>

          <!-- 添加编辑和删除按钮 -->
          <el-button
            v-if="node.level > 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="editFolderName(data, node)"
            class="folder-action-btn"
          ></el-button>
          <el-button
            v-if="node.level > 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="deleteFolder(data.id)"
            class="folder-action-btn"
          ></el-button>
        </span>
      </el-tree>
    </div>

    <!-- 右侧文件列表 -->
    <div class="file-list">
      <div class="file-header">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文件名"
          @input="searchFiles"
          clearable
          style="width: 300px; margin-bottom: 20px"
        />
        <el-button @click="showUploadDialog" type="text">上传文件</el-button>
        <el-button @click="batchDelete" type="text">批量删除</el-button>
      </div>

      <!-- 根据 isSafe 动态展示 -->
      <div v-if="isSafe" style="margin-bottom: 10px; color: #888">
        当前搜索：{{ searchQuery }}
      </div>
      <div v-else style="margin-bottom: 10px; color: #888">
        当前搜索：<span v-html="searchQuery"></span>
      </div>

      <el-table :data="currentFolderFiles" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="文件名" prop="fileName"></el-table-column>
        <el-table-column label="类型" prop="fileType"></el-table-column>
        <el-table-column label="大小" prop="fileSize">
          <template #default="scope">
            {{ formatSize(scope.row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="previewFile(scope.row)" size="small" type="text"
              >预览</el-button
            >
            <el-button @click="downloadFile(scope.row)" size="small" type="text"
              >下载</el-button
            >
            <el-button @click="deleteFile(scope.row)" size="small" type="text"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="上传文件"
      :visible.sync="uploadDialogVisible"
      width="500px"
      @close="resetUpload"
    >
      <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        :before-upload="beforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :data="{ folderId: activeFolder, isSafe: isSafe }"
        list-type="text"
        :show-file-list="false"
        :headers="uploadHeaders"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖拽到此处，或者
          <el-button type="primary">点击上传</el-button>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="uploadFile">上传</el-button>
      </div>
      <template>
        <div>
          <el-alert
            title="提示"
            description="
        安全状态下可以上传的文件类型属性信息
        文件扩展名：.jpg, .png, .pdf, .txt, .docx
        文件最大允许：10MB
        文件内容不包含以下危险关键字：
        <script> </script> <?php eval( onerror= onclick=
        MIME类型验证通过：文件的MIME类型应与文件扩展名一致。
        不包含可执行文件签名：防止上传二进制可执行文件。
      "
            type="info"
            show-icon
          ></el-alert>
          <el-alert
            title="提示"
            description="
        不安全状态下不对文件做任何限制，上传文件时请注意文件内容的安全性。
      "
            type="info"
            show-icon
          ></el-alert>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getFileTree, searchFilesByNameofLoginUser } from "@/api/filesApi";
import { addFolder, deleteFolder, updateFolder } from "@/api/foldersApi";
import { addFile, downloadFile } from "@/api/filesApi";
import store from "@/store";

export default {
  data() {
    return {
      isSafe: this.$store.getters.getIsSafe,
      activeFolder: null, // 当前选中的文件夹ID
      currentFolderFiles: [], // 当前选中文件夹的文件列表
      folderList: [], // 文件夹树列表
      expandedKeys: [], // 存储展开的节点ID
      uploadDialogVisible: false, // 控制上传弹窗显示
      fileToUpload: null, // 存储待上传的文件
      uploadUrl: store.state.apiUrl + "/files/add", // 文件上传接口
      searchQuery: "", // 用于搜索的关键字
    };
  },

  computed: {
    treeProps() {
      return {
        children: "childFolders",
        label: "folderName",
      };
    },
    uploadHeaders() {
      const token = this.$store.state.token || localStorage.getItem("token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return headers;
    },
  },

  methods: {
    // 记录展开的节点
    handleNodeExpand(nodeData) {
      if (!this.expandedKeys.includes(nodeData.id)) {
        this.expandedKeys.push(nodeData.id);
      }
    },
    // 记录收起的节点
    handleNodeCollapse(nodeData) {
      const index = this.expandedKeys.indexOf(nodeData.id);
      if (index !== -1) {
        this.expandedKeys.splice(index, 1);
      }
    },
    async fetchFileTree() {
      try {
        const response = await getFileTree();
        this.folderList = response;

        // 重新设置展开状态
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.expandedKeys);
        });
      } catch (error) {
        console.error("获取文件树失败:", error);
      }
    },

    async updateFolder(folder) {
      try {
        await updateFolder(folder);
        this.fetchFileTree();
        this.$message.success("文件夹更新成功");
      } catch (error) {
        this.$message.error("文件夹更新失败");
      }
    },

    handleFolderSelect(data) {
      this.activeFolder = data.id;
      this.loadFilesForFolder(data.id);
    },

    loadFilesForFolder(folderId) {
      const folder = this.findFolderById(this.folderList, folderId);
      if (folder) {
        this.currentFolderFiles = folder.childFiles;
      }
    },

    findFolderById(folders, folderId) {
      for (const folder of folders) {
        if (folder.id === folderId) {
          return folder;
        }
        const found = this.findFolderById(folder.childFolders, folderId);
        if (found) return found;
      }
      return null;
    },

    async addFolder() {
      const folder = {
        folderName: "新文件夹",
        parentFolderId: this.activeFolder,
      };
      try {
        await addFolder(folder);
        this.fetchFileTree();
        this.$message.success("新建文件夹成功");
      } catch (error) {
        this.$message.error("新建文件夹失败");
      }
    },

    async deleteFolder(id) {
      try {
        await deleteFolder(id);
        this.fetchFileTree();
        this.$message.success("删除文件夹成功");
      } catch (error) {
        this.$message.error("删除文件夹失败");
      }
    },

    editFolderName(data) {
      this.$prompt("编辑", "编辑文件夹名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        value: data.folderName,
      })
        .then(({ value }) => {
          data.folderName = value;
          this.updateFolder(data);
        })
        .catch(() => {});
    },

    showUploadDialog() {
      if (!this.activeFolder) {
        this.$message.warning("请先选择一个文件夹");
        return;
      }
      this.uploadDialogVisible = true;
    },

    beforeUpload(file) {
      this.fileToUpload = file;
    },

    handleUploadSuccess() {
      this.$message.success("文件上传成功");
      this.uploadDialogVisible = false;
      this.fetchFileTree();
    },

    handleUploadError() {
      this.$message.error("文件上传失败");
    },

    resetUpload() {
      this.fileToUpload = null;
    },

    async uploadFile() {
      if (!this.fileToUpload) {
        this.$message.warning("请先选择一个文件");
        return;
      }
      try {
        await addFile(this.fileToUpload, this.activeFolder, this.isSafe);
        this.uploadDialogVisible = false;
        this.fetchFileTree();
      } catch (error) {
        this.$message.error("文件上传失败");
      }
    },

    batchDelete() {
      this.$message.warning("批量删除文件");
    },

    previewFile(file) {
      this.$message.info(`预览文件：${file.id}`);
    },

    downloadFile(file) {
      const fileId = file.id;
      downloadFile(fileId)
        .then(() => {
          this.$message.success(`下载文件：${file.fileName}`);
        })
        .catch((err) => {
          this.$message.error(`下载文件失败` + err);
        });
    },

    deleteFile(file) {
      this.$message.success(`删除文件：${file.fileName}`);
    },

    async searchFiles() {
      if (this.searchQuery) {
        try {
          const response = await searchFilesByNameofLoginUser(this.searchQuery);
          this.currentFolderFiles = response;
        } catch (error) {
          this.$message.error("搜索文件失败");
        }
      } else {
        this.loadFilesForFolder(this.activeFolder);
      }
    },

    formatSize(size) {
      if (size < 1024) return size + " B";
      else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
      else return (size / (1024 * 1024)).toFixed(2) + " MB";
    },
  },

  mounted() {
    this.fetchFileTree();
  },
};
</script>

<style scoped>
.file-manage-page {
  display: flex;
  width: 100%;
}

.sidebar {
  width: 240px;
  background-color: #f4f4f4;
}

.file-list {
  flex: 1;
  padding: 20px;
}

.file-header {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
}

.el-table {
  margin-top: 20px;
}

/* 美化 el-tree */
.custom-tree .el-tree-node {
  border-radius: 4px;
  padding: 8px 12px;
  margin: 4px 0;
  transition: background-color 0.3s;
}

.custom-tree .el-tree-node:hover {
  background-color: #f5f5f5;
}

.custom-tree .el-tree-node.is-checked {
  background-color: #e0f7fa;
}

/* 设置 custom-tree-node 内的元素为横向排列 */
.custom-tree .custom-tree-node {
  display: flex; /* 设置横向排列 */
  align-items: center; /* 垂直居中 */
  gap: 10px; /* 子元素间的间距 */
}

.custom-tree .custom-tree-node i {
  font-size: 18px;
  color: #64b5f6;
}

.custom-tree .custom-tree-node .folder-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.custom-tree .custom-tree-node .folder-action-btn {
  margin-left: 8px;
}

.custom-tree .el-tree-node.is-current {
  background-color: #e0f7fa !important;
  color: #00796b;
}

/* 上传文件样式 */
.upload-demo {
  padding: 20px;
  border: 2px dashed #d3d3d3;
  text-align: center;
}

.upload-demo i {
  font-size: 40px;
  color: #409eff;
}

.upload-demo .el-upload__text {
  font-size: 16px;
  color: #409eff;
}
</style>
