<template>
  <el-header class="header">
    <el-row class="header-row">
      <el-col :span="20">
        <h2 class="title">
          文件管理系统
          <small class="status-text">
            {{ isSafe ? "（安全状态）" : "（不安全状态）" }}
          </small>
        </h2>
      </el-col>
      <el-col :span="4" class="text-right">
        <el-button class="logout-btn" @click="logout">退出</el-button>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
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
/* 顶栏背景颜色和阴影 */
.header {
  background: #2c3e50; /* 渐变背景 */
  padding: 0 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  color: white;
  display: flex;
  align-items: center;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px; /* 顶栏高度 */
}

.title {
  font-size: 24px; /* 调整标题字体大小 */
  font-weight: bold;
  margin: 0;
  color: white; /* 文字颜色 */
}

.text-right {
  text-align: right;
}

.logout-btn {
  background-color: #ecf0f1; /* 按钮背景色 */
  color: #2c3e50; /* 按钮字体颜色 */
  border: none;
  border-radius: 4px; /* 圆角效果 */
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #bdc3c7; /* 悬停效果 */
}

.logout-btn:focus {
  outline: none; /* 去除焦点边框 */
}
</style>
