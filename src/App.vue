<template>
  <div id="app">
    <!-- 当当前不是登录页时显示 Navbar -->
    <NavbarComponent v-if="!isLoginPage" />
    <div class="container">
      <!-- 当当前不是登录页时显示 Sidebar -->
      <SidebarComponent v-if="!isLoginPage" />
      <!-- 路由视图渲染页面内容 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import NavbarComponent from "./components/NavbarComponent.vue";
import SidebarComponent from "./components/SidebarComponent.vue";

export default {
  components: {
    NavbarComponent,
    SidebarComponent,
  },
  computed: {
    isLoginPage() {
      // 判断当前路由路径是否为登录页，假设登录页路径是 '/login'
      return this.$route.path === "/login" || this.$route.path === "/register";
    },
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使应用充满屏幕 */
  width: 100%;
}

.container {
  display: flex;
  width: 100%;
}

.container > SidebarComponent {
  width: 250px; /* 侧边栏宽度可以调整 */
}

.container > router-view {
  flex: 1; /* <router-view /> 占据剩余空间 */
}

/* 为 Navbar 设置合适的高度 */
.NavbarComponent {
  height: 60px; /* 可以根据需要调整高度 */
}
</style>
