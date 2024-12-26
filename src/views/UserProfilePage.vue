<template>
  <div class="user-profile-page">
    <!-- 个人资料标题 -->
    <div class="page-header">
      <h2>个人资料</h2>
      <p>在这里管理您的个人信息。</p>
    </div>

    <el-card class="profile-card">
      <!-- 用户头像 -->
      <div class="profile-avatar">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-change="handleAvatarChange"
        >
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
          <el-button v-else>上传头像</el-button>
        </el-upload>
      </div>

      <!-- 用户信息表单 -->
      <el-form
        :model="userInfo"
        ref="form"
        label-width="120px"
        class="user-form"
      >
        <el-form-item label="用户名">
          <div v-if="isSafe">{{ userInfo.username }}</div>
          <div v-else v-html="userInfo.username"></div>
          
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="userInfo.password"
            type="password"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input
            v-model="userInfo.confirmPassword"
            type="password"
            show-password
          ></el-input>
        </el-form-item>

        <div class="form-footer">
          <el-button type="primary" @click="saveChanges">保存更改</el-button>
          <el-button @click="resetForm">取消</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updateUser } from '@/api/userApi';
export default {
  data() {
    return {
      avatarUrl: "", // 用户头像的URL
      userInfo: {
        username: "", // 模拟的用户名
        password: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
    // 从 Vuex 获取安全状态
    isSafe() {
      return this.$store.getters.getIsSafe;
    },
  },
  methods: {
    handleAvatarChange(file) {
      // 模拟头像上传的处理
      if (file.status === "success") {
        this.avatarUrl = URL.createObjectURL(file.raw); // 设置新头像
      }
    },
    saveChanges() {
      // 模拟保存用户资料
      if (this.userInfo.password !== this.userInfo.confirmPassword) {
        this.$message.error("密码和确认密码不一致");
        return;
      }
      updateUser({id:this.$store.getters.getUserInfo.id,username:this.userInfo.username,password:this.userInfo.password}); // 更新用户资料
      // 提示用户资料保存成功
      this.$message.success("资料保存成功");
    },
    resetForm() {
      // 重置表单内容
      this.$refs.form.resetFields();
    },
  },
  mounted() {
    // 从路由的 query 中获取传递的 userName
    this.userInfo.username = this.$route.query.userName || ''; // 确保有值时才赋值
    console.log("Received userName:", this.userInfo.username);
  },
};
</script>


<style scoped>
.user-profile-page {
  padding: 30px;
  background-color: #f9f9f9;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 28px;
  color: #333;
}

.page-header p {
  font-size: 16px;
  color: #666;
}

.profile-card {
  width: 80%;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  text-align: center;
  margin-top: 20px;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
}

.user-form {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.form-footer {
  text-align: right;
}

.el-button {
  margin-left: 10px;
}
</style>
