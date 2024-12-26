<template>
  <div>
    <el-table :data="files" style="width: 100%">
      <el-table-column label="文件名" prop="name"></el-table-column>
      <el-table-column label="大小" prop="size"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="downloadFile(scope.row)" size="small" type="primary">下载</el-button>
          <el-button @click="deleteFile(scope.row)" size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    files: Array // 传递文件列表
  },
  computed: {
    // 从 Vuex 获取用户 ID（假设已经登录）
    userId() {
      return this.$store.state.userInfo.id;
    }
  },
  methods: {
    // 下载文件
    downloadFile(file) {
      this.$message.success(`下载文件: ${file.name}`);
      
      // 调用 Vuex action 来处理下载操作
      this.$store.dispatch('downloadFile', file).then(() => {
        console.log(`File ${file.name} has been downloaded.`);
        // 执行下载操作逻辑
      }).catch(error => {
        this.$message.error(`下载文件失败: ${file.name}`);
        console.error(error);
      });
    },
    
    // 删除文件
    deleteFile(file) {
      this.$message.success(`删除文件: ${file.name}`);
      
      // 调用 Vuex action 来处理删除操作
      this.$store.dispatch('deleteFile', file).then(() => {
        console.log(`File ${file.name} has been deleted.`);
        // 执行删除操作逻辑
      }).catch(error => {
        this.$message.error(`删除文件失败: ${file.name}`);
        console.error(error);
      });
    }
  }
};
</script>

<style scoped>
.el-button {
  margin-right: 10px;
}
</style>
