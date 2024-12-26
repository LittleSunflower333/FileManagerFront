<template>
  <div class="admin-user-manage-page">
    <!-- 用户管理操作按钮 -->
    <div class="action-buttons">
      <el-button @click="addUser" type="primary" icon="el-icon-plus">新增用户</el-button>
      <el-button @click="batchDelete" type="danger" icon="el-icon-delete">批量删除</el-button>
    </div>

    <!-- 用户列表表格 -->
    <el-table
      :data="userList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="创建时间" prop="created_at"></el-table-column>
      <el-table-column label="角色" prop="role"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
            {{ scope.row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button @click="editUser(scope.row)" size="small" type="primary">编辑</el-button>
          <el-button @click="deleteUser(scope.row)" size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalUsers"
        @current-change="handlePageChange"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </div>

    <!-- 编辑/新增用户弹框 -->
    <el-dialog :visible.sync="dialogVisible" title="编辑用户" width="50%">
      <el-form :model="currentUser" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="currentUser.username" :disabled="isEditing"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentUser.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="用户" value="user"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="currentUser.status"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUser">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, addUser, deleteUsers, updateUser } from "@/api/userApi"; // 引入 API

export default {
  data() {
    return {
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条数
      totalUsers: 0, // 总用户数
      userList: [], // 用户数据列表
      selectedUsers: [], // 被选中的用户
      dialogVisible: false, // 弹框是否显示
      isEditing: false, // 是否是编辑状态
      currentUser: { // 当前操作的用户
        username: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active'
      }
    };
  },
  methods: {
    // 获取用户列表数据
    fetchUsers() {
      getUserList(this.currentPage, this.pageSize).then(response => {
        this.userList = response.records; // 假设返回的数据格式符合需求
        this.totalUsers = response.total; // 更新总用户数
      }).catch(error => {
        this.$message.error('获取用户列表失败',error);
      });
    },
    // 翻页操作
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchUsers();
    },
    // 选中用户变化
    handleSelectionChange(selected) {
      this.selectedUsers = selected;
    },
    // 新增用户
    addUser() {
      this.isEditing = false;
      this.currentUser = {
        username: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active'
      };
      this.dialogVisible = true;
    },
    // 编辑用户
    editUser(user) {
      this.isEditing = true;
      this.currentUser = { ...user };
      this.dialogVisible = true;
    },
    // 删除用户
    deleteUser(user) {
      this.$confirm(`确定删除用户 ${user.username} 吗?`, '删除确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsers([user.id]).then(() => {
          this.$message.success(`用户 ${user.username} 删除成功`);
          this.fetchUsers(); // 刷新用户列表
        }).catch(error => {
          this.$message.error(`删除失败: ${error.message}`);
        });
      });
    },
    // 批量删除选中的用户
    batchDelete() {
      if (this.selectedUsers.length === 0) {
        this.$message.warning('请先选择用户');
        return;
      }

      this.$confirm('确定批量删除选中的用户吗?', '批量删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedUsers.map(user => user.id);
        deleteUsers(ids).then(() => {
          const usernames = this.selectedUsers.map(user => user.username).join(', ');
          this.$message.success(`用户 ${usernames} 删除成功`);
          this.selectedUsers = [];
          this.fetchUsers(); // 刷新用户列表
        }).catch(error => {
          this.$message.error(`批量删除失败: ${error.message}`);
        });
      });
    },
    // 保存用户（新增或编辑）
    saveUser() {
      const action = this.isEditing ? updateUser : addUser;
      action(this.currentUser).then(() => {
        this.$message.success(`${this.isEditing ? '修改' : '新增'}用户成功`);
        this.dialogVisible = false;
        this.fetchUsers(); // 刷新用户列表
      }).catch(error => {
        this.$message.error(`${this.isEditing ? '修改' : '新增'}用户失败: ${error.message}`);
      });
    }
  },
  created() {
    this.fetchUsers(); // 初始化时加载用户列表
  }
};
</script>

<style scoped>
.admin-user-manage-page {
  padding: 20px;
  background-color: #f9f9f9;
  width: 100%;
}

.action-buttons {
  margin-bottom: 20px;
  text-align: right;
}

.el-button {
  margin-left: 10px;
}

.el-table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.dialog-footer {
  text-align: right;
}
</style>
