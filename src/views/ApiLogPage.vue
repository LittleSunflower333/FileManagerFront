<template>
  <div class="api-log-page">
    <el-row class="header">
      <el-col :span="24">
        <!-- 搜索框 -->
        <el-input
          v-model="searchText"
          placeholder="请输入搜索关键字"
          clearable
          style="width: 300px"
          @input="searchLogs"
        />
        <el-button @click="searchLogs" type="primary" style="margin-left: 10px"
          >搜索</el-button
        >
      </el-col>
    </el-row>

    <!-- 根据 isSafe 动态展示 -->
    <div v-if="isSafe" style="margin-bottom: 10px; color: #888">
      当前搜索：{{ searchText }}
    </div>
    <div v-else style="margin-bottom: 10px; color: #888">
      当前搜索：<span v-html="searchText"></span>
    </div>
    <!-- 导入日志按钮 -->
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-upload
          :action="uploadUrl"
          :before-upload="beforeUpload"
          accept=".xml"
          multiple
          :on-success="handleImportSuccess"
          :on-error="handleImportError"
          :http-request="customUpload"
        >
          <el-button type="primary">上传XML日志文件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-divider></el-divider>

    <!-- 日志列表 -->
    <el-row class="log-list">
      <el-col :span="24" v-for="(log, index) in apiLogs.records" :key="index">
        <el-card class="log-card" :body-style="{ padding: '15px' }">
          <div class="log-content">
            <h3>{{ log.method }} - {{ log.url }}</h3>
            <div class="log-info">
              <p>
                <strong>IP:</strong> {{ log.ip }} | <strong>用户:</strong>
                {{ log.username }}
              </p>
              <p>
                <strong>时间:</strong> {{ log.createdAt }} |
                <strong>状态:</strong> {{ log.status === 1 ? "成功" : "失败" }}
              </p>
              <p>
                <strong>响应结果:</strong> {{ log.result }} |
                <strong>执行时间:</strong> {{ log.executionTime }} ms
              </p>
            </div>
            <el-button size="mini" type="text" @click="openLogDetail(log)"
              >查看详情</el-button
            >
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-row class="pagination" style="margin-top: 20px">
      <el-col :span="24" style="text-align: center">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="apiLogs.total"
          layout="prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getApiLogList, importLogs } from "@/api/apiLog"; // 引入获取日志列表和导入日志的 API 函数

export default {
  data() {
    return {
      searchText: "", // 搜索框中的文本
      apiLogs: {
        // 存储日志数据
        records: [],
        total: 0,
      },
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示的记录数
    };
  },
  methods: {
    // 搜索日志
    searchLogs() {
      this.currentPage = 1; // 重置为第一页
      this.loadLogs();
    },

    // 加载日志
    loadLogs() {
      getApiLogList(this.currentPage, this.pageSize, this.searchText)
        .then((data) => {
          this.apiLogs = data; // 更新日志列表
          console.log("日志列表", data.records);
        })
        .catch((error) => {
          this.$message.error("加载日志失败", error);
        });
    },

    // 页码切换时触发
    handlePageChange(page) {
      this.currentPage = page; // 更新当前页
      this.loadLogs(); // 加载新的日志
    },

    // 打开日志详细信息弹窗
    openLogDetail(log) {
      console.log("Log clicked:", log); // 调试用，查看是否点击时触发
      this.selectedLog = log; // 设置选中的日志对象
      this.dialogVisible = true; // 打开弹窗
    },

    // 上传日志文件之前的处理
    beforeUpload(file) {
      if (file.type !== "application/xml"&&file.type !== "text/xml") {
        console.log(file.type);
        this.$message.error("请上传 XML 文件");
        return false; // 不允许上传非 XML 文件
      }
      return true; // 允许上传
    },

    // 上传成功后的处理
    handleImportSuccess(response) {
      this.$message.info(response);
      this.loadLogs(); // 导入成功后刷新日志列表
    },

    // 上传失败后的处理
    handleImportError(error) {
      this.$message.error("日志导入失败", error);
    },

    // 自定义上传接口调用
    customUpload({ file }) {
      importLogs(file, this.isSafe)
        .then((response) => {
          this.handleImportSuccess(response, file);
        })
        .catch((error) => {
          this.handleImportError(error, file);
        });
    },
  },
  computed: {
    // 从 Vuex 获取安全状态
    isSafe() {
      return this.$store.getters.getIsSafe;
    },
  },
  created() {
    // 页面加载时默认加载日志列表
    this.loadLogs();
  },
};
</script>

<style scoped>
.api-log-page {
  padding: 20px;
}

.log-card {
  margin-bottom: 15px;
}

.log-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.log-info p {
  margin: 5px 0;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
}

.el-button {
  margin-top: 10px;
}
</style>
