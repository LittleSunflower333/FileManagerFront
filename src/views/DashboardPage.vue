<!-- <template>
  <div class="dashboard-page">
    <div class="quick-actions">
      <el-button type="primary" icon="el-icon-upload" size="medium"
        >上传文件</el-button
      >
      <el-button type="success" icon="el-icon-folder" size="medium"
        >新建文件夹</el-button
      >
      <el-button type="info" icon="el-icon-search" size="medium"
        >搜索文件</el-button
      >
    </div>

    <el-row :gutter="20" class="content-area">
      <el-col :span="6">
        <el-card class="info-card">
          <div class="user-info">
            <el-avatar
              :size="64"
              :src="userInfo.avatar"
              icon="el-icon-user-solid"
              class="user-avatar"
            >
            </el-avatar>

            <div class="info-text">
              <h3 v-if="isSafe">欢迎回来, {{ userInfo.username }}</h3>
              <h3 v-else >欢迎回来, <span v-html="userInfo.username"></span></h3>
              <p>
                剩余存储空间：{{ storageInfo.remaining }}/{{
                  storageInfo.total
                }}
              </p>
            </div>
          </div>
          <el-progress
            :percentage="storageInfo.usagePercent"
            stroke-width="20"
            text-inside
            color="#409EFF"
          ></el-progress>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="files-card">
          <div class="files-header">
            <h3>最近查看</h3>
            <el-button
              type="text"
              size="small"
              icon="el-icon-refresh"
              @click="refreshFiles"
              >刷新</el-button
            >
          </div>
          <el-table :data="fileList" border stripe>
            <el-table-column
              prop="name"
              label="文件名"
              width="300"
            ></el-table-column>
            <el-table-column
              prop="size"
              label="大小"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="date"
              label="上传日期"
              width="200"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="downloadFile(scope.row)"
                  >下载</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="deleteFile(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <FileUploadStrategy v-if="isSafe" />
    </el-row>
  </div>
</template> -->

<!-- <script>
import FileUploadStrategy from "@/components/FileUploadStrategy.vue";
export default {
  name: "DashboardComponent",
  components: {
    FileUploadStrategy,
  },
  data() {
    return {
      userInfo: {
        username: this.$store.getters.getUserInfo.username,
        avatar: "https://via.placeholder.com/64",
      },
      storageInfo: {
        total: "100GB",
        remaining: "80GB",
        usagePercent: 20,
      },
      fileList: [
        { name: "项目文档.docx", size: "12MB", date: "2024-12-08" },
        { name: "设计稿.zip", size: "25MB", date: "2024-12-07" },
        { name: "代码备份.tar.gz", size: "3GB", date: "2024-12-06" },
      ],
    };
  },
  methods: {
    refreshFiles() {
      console.log("文件列表已刷新");
    },
    downloadFile(file) {
      console.log("下载文件：", file.name);
    },
    deleteFile(file) {
      console.log("删除文件：", file.name);
    },
  },
  computed: {
    // 从 Vuex 获取安全状态
    isSafe() {
      return this.$store.getters.getIsSafe;
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
  background-color: #f4f6f9;
  min-height: 100vh;
}

.quick-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
}

.content-area {
  margin-top: 20px;
}

.info-card {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  margin-right: 15px;
}

.info-text h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.info-text p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.files-card {
  padding: 20px;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.files-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
}
</style> -->

<template>
  <div class="home-page">
    <el-container>
      <!-- 首页标题 -->
      <el-header>
        <h3>Web 安全实验平台</h3>
      </el-header>

      <!-- 实验介绍内容 -->
      <el-main>
        <div>
          <div class="info-text">
            <h3 v-if="isSafe">欢迎回来, {{ username }},当前系统处于安全状态，所有漏洞都已修补</h3>
            <h3 v-else>欢迎回来, <span v-html="username"></span>，当前系统处于不安全状态，存在实验相关漏洞</h3>
            <h3>登陆页面可选模式（安全/不安全）</h3>
          </div>
        </div>

        <!-- 实验模块 -->
        <div class="experiment-list">
          <h3>实验内容包括：</h3>
          <el-collapse v-model="activeNames">
            <!-- SQL注入实验 -->
            <el-collapse-item title="SQL 注入实验" name="1">
              <p>
                <strong>实验描述：</strong>通过模拟登录页面中的 SQL
                注入漏洞，您将体验到攻击者如何利用未加密的 SQL 查询进行攻击。
              </p>
              <p>
                <strong>修复方案：</strong>采用预编译 SQL
                语句，避免拼接用户输入，确保查询安全。
              </p>
              <p><strong>位置：</strong>登陆页面</p>
            </el-collapse-item>

            <!-- 命令注入实验 -->
            <el-collapse-item title="命令注入实验" name="2">
              <p>
                <strong>实验描述：</strong
                >在命令注入页面中，用户可以尝试通过不安全的输入调用系统 Shell
                命令，从而进行潜在的恶意操作。
              </p>
              <p>
                <strong>修复方案：</strong
                >后端对用户输入进行严格的校验，并采用安全的执行命令方式。
              </p>
              <p><strong>位置：</strong>命令注入页面</p>
            </el-collapse-item>

            <!-- XSS实验 -->
            <el-collapse-item title="XSS (跨站脚本攻击) 实验" name="3">
              <p>
                <strong>实验描述：</strong>展示了多种类型的 XSS
                攻击，包括反射型、DOM 型、存储型及 XSS 蠕虫攻击。
              </p>
              <p>
                <strong>修复方案：</strong>通过避免直接使用
                <code>v-html</code
                >，以及对用户输入进行严格的过滤和编码，防止恶意代码的执行。
              </p>
              <p><strong>位置：</strong>反射型-文件管理搜索，系统日志搜索；
                DOM型-仪表盘首页用户名，个人资料用户名；
                存储型：文件管理文件夹名称修改；
                xss蠕虫：讨论区
              </p>
            </el-collapse-item>

            <!-- CSRF实验 -->
            <el-collapse-item title="CSRF (跨站请求伪造) 实验" name="4">
              <p>
                <strong>实验描述：</strong
                >演示了未授权的请求，如文件删除请求，如何利用 CSRF
                漏洞进行攻击。
              </p>
              <p>
                <strong>修复方案：</strong>启用 CORS
                限制，确保每个请求都经过认证，防止跨站请求伪造。
              </p>
            </el-collapse-item>

            <!-- 文件上传和XXE实验 -->
            <el-collapse-item
              title="文件上传与 XXE (外部实体注入) 实验"
              name="5"
            >
              <p>
                <strong>实验描述：</strong
                >模拟了允许上传危险文件的场景，包括恶意脚本和带有外部实体的 XML
                文件。
              </p>
              <p>
                <strong>修复方案：</strong>通过限制文件类型和大小，并禁用 XML
                外部实体，避免潜在的 XXE 漏洞。
              </p>
              <p><strong>位置：</strong>系统日志xml导入</p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      activeNames: ["1", "2", "3", "4", "5"], // 默认展开所有实验项
    };
  },
  computed: {
    // 从 Vuex 获取安全状态
    isSafe() {
      return this.$store.getters.getIsSafe;
    },
  },
  mounted() {
    // 从路由的 query 中获取传递的 userName
    this.username = this.$route.query.userName || ''; // 确保有值时才赋值
    console.log("Received userName:", this.username);
  },
};
</script>

<style scoped>
.home-page {
  padding: 20px;
  background-color: #f9f9f9;
  width: 100%;
}

.page-title {
  text-align: center;
  font-size: 32px;
  color: #333;
}

.intro {
  margin: 20px 0;
  text-align: center;
}

.intro p {
  font-size: 18px;
  color: #666;
}

.experiment-list {
  margin: 30px 0;
}

.el-collapse-item {
  margin-bottom: 10px;
}

.el-collapse-item p {
  font-size: 16px;
  color: #555;
}

.fix-intro {
  margin-top: 30px;
  text-align: center;
}

.fix-intro h3 {
  font-size: 24px;
  color: #333;
}

.fix-intro p {
  font-size: 16px;
  color: #555;
}
</style>
