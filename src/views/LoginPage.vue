<template>
  <div class="login-page">
    <el-row
      type="flex"
      justify="center"
      align="middle"
      style="height: 100vh; width: 100%"
    >
      <el-col :span="8">
        <el-card class="box-card">
          <h3 class="title">登录</h3>
          <el-form :model="loginForm" ref="loginForm" label-width="80px">
            <el-form-item
              label="用户名"
              prop="username"
              :rules="[ { required: true, message: '请输入用户名', trigger: 'blur' } ]"
            >
              <el-input
                v-model="loginForm.username"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
              :rules="[ { required: true, message: '请输入密码', trigger: 'blur' } ]"
            >
              <el-input
                type="password"
                v-model="loginForm.password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch
                v-model="loginForm.isSafe"
                active-text="安全"
                inactive-text="不安全"
              ></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogin" :loading="loading">
                登录
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="text" @click="goToRegister">
                没有账号？点击注册
              </el-button>
            </el-form-item>
            <!-- 显示 Hello 提示信息 -->
            <el-form-item v-if="helloMessage">
              <el-alert :title="helloMessage" type="success"></el-alert>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHello } from "@/api/userApi";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        isSafe: true, // 默认为 true，即安全
      },
      loading: false,
      hello: "",
      helloMessage: "", // 用于显示提示信息
    };
  },
  created() {
    // 检查 Vuex 中是否存有 token
    if (this.$store.getters.getToken) {
      console.log("检测到已登录的 Token，直接跳转到仪表盘");
      this.$router.push("/dashboard");
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;

      // 验证表单
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          this.loading = false;
          console.log("表单验证失败");
          return;
        }

        const { username, password, isSafe } = this.loginForm;

        this.$store.commit("setIsSafe", isSafe);

        const loginParams = {
          username,
          password,
          isSafe,
        };

        this.$store
          .dispatch("login", loginParams)
          .then(() => {
            return this.$store.dispatch("fetchUserInfo");
          })
          .then(() => {
            this.loading = false;
            this.$router.push({
              path: "/dashboard",
              query: { userName: this.$store.getters.getUserInfo.username },
            });
          })
          .catch((error) => {
            this.loading = false;
            console.error("登录失败:", error);
            this.$message.error("登录失败，请检查用户名或密码");
          });
      });
    },

    // 跳转到注册页面
    goToRegister() {
      this.$router.push("/register");
    },

    // 获取 Hello 信息
    async fetchHello() {
      try {
        const response = await getHello();
        if (response) {
          this.helloMessage = "后端连接正常: " + response;
          this.$message.success("后端连接正常");
        }
      } catch (error) {
        this.helloMessage = "无法连接到后端";
        this.$message.error("无法连接到后端");
      }
    },
  },
  mounted() {
    this.fetchHello();
  },
};
</script>

<style scoped>
.login-page {
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}
.title {
  margin-bottom: 20px;
  text-align: center;
}
.el-card {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
