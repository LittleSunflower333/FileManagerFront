<template>
    <div class="register-page">
      <el-row type="flex" justify="center" align="middle" style="height: 100vh; width: 100%;">
        <el-col :span="8">
          <el-card class="box-card">
            <h3 class="title">注册</h3>
            <el-form :model="registerForm" ref="registerForm" label-width="80px">
              <el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
                <el-input v-model="registerForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleRegister" :loading="loading">注册</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="text" @click="goToLogin">已有账号？点击登录</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { register} from '@/api/authApi'; // 引入注册接口
  
  export default {
    data() {
      return {
        registerForm: {
          username: '',
          password: ''
        },
        loading: false
      }
    },
    methods: {
      // 注册方法
      handleRegister() {
        this.loading = true
        register(this.registerForm.username, this.registerForm.password)
          .then(() => {
            this.loading = false
            // 注册成功后跳转到登录页面
            this.$router.push('/login')
          })
          .catch(error => {
            this.loading = false
            console.error("Register error:", error)
            // 这里可以显示错误提示
          })
      },
      // 跳转到登录页面
      goToLogin() {
        this.$router.push('/login')
      }
    }
  }
  </script>
  
  <style scoped>
  .register-page {
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
  