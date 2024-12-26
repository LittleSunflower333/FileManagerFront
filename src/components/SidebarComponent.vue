<template>
  <el-aside width="200px" class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      unique-opened
    >
      <el-menu-item index="1" @click="navigateTo('/dashboard')">
        <i class="el-icon-house"></i> 仪表盘
      </el-menu-item>
      <el-menu-item index="2" @click="navigateTo('/file-manage')">
        <i class="el-icon-folder"></i> 文件管理
      </el-menu-item>
      <el-menu-item index="3" @click="navigateTo('/user-profile')">
        <i class="el-icon-user"></i> 个人资料
      </el-menu-item>
      <el-menu-item index="4" @click="navigateTo('/admin-user-manage')">
        <i class="el-icon-user"></i> 用户管理
      </el-menu-item>
      <el-menu-item index="5" @click="navigateTo('/talk')">
        <i class="el-icon-user"></i> 讨论区
      </el-menu-item>

      <el-menu-item index="6" @click="navigateTo('/CommandInjection')">
        <i class="el-icon-user"></i> 命令注入
      </el-menu-item>
      
      <el-menu-item index="7" @click="navigateTo('/ApiLogPage')">
        <i class="el-icon-user"></i> 系统日志
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: "1",
      userName: "", // 初始为空
      isSafe:true,
    };
  },
  mounted() {
    // 组件加载时确保 userName 已从 Vuex 中获取
    this.userName = this.$store.getters.getUserInfo.username;
    this.isSafe = this.$store.getters.getIsSafe;
  },
  methods: {
    navigateTo(route) {
      // 判断当前路由是否和目标路由相同，如果相同则不做跳转
      if (this.$route.path !== route) {
        this.$router.push({ path: route, query: { userName: this.userName,isSafe: this.isSafe} });
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #2c3e50; /* 深色背景 */
  color: #fff; /* 白色字体 */
  height: 100vh; /* 侧边栏占满整个视口 */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* 添加侧边栏阴影 */
  padding-top: 30px; /* 顶部留空 */
}

.el-menu-vertical-demo {
  width: 100%;
  padding-top: 10px; /* 增加顶部间距 */
  background-color: transparent; /* 去掉菜单背景颜色 */
}

.el-menu-item {
  padding-left: 20px; /* 增加左侧内边距 */
  font-size: 16px; /* 增加字体大小 */
  color: #ecf0f1; /* 文字颜色 */
  border-radius: 4px; /* 给按钮加圆角 */
}

.el-menu-item i {
  margin-right: 10px; /* 图标和文字之间的间距 */
  font-size: 18px; /* 图标大小 */
}

.el-menu-item:hover {
  background-color: #34495e; /* 悬停时背景色变化 */
}

.el-menu-item.is-active {
  background-color: #1abc9c; /* 选中的菜单项背景色 */
  color: white; /* 选中时字体颜色 */
}

.el-menu-item.is-active:hover {
  background-color: #16a085; /* 悬停时选中菜单项背景色 */
}

/* 修改侧边栏内边距 */
.el-menu-vertical-demo .el-menu-item {
  margin: 5px 0; /* 上下间距 */
  transition: all 0.3s ease; /* 平滑的过渡效果 */
}

/* 去除菜单项的焦点框 */
.el-menu-item:focus {
  outline: none;
}
</style>
