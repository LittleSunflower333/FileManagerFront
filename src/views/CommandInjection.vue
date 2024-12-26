<template>
  <el-container>
    <el-header>
      <h2>命令执行</h2>
    </el-header>
    <el-main>
      <el-form :model="form">
        <el-form-item label="命令">
          <el-input v-model="form.command" placeholder="输入命令"></el-input>
        </el-form-item>
        <el-button type="primary" @click="executeCommand">执行命令</el-button>
      </el-form>
      <el-divider></el-divider>
      <div v-if="output">
        <h3>执行结果：</h3>
        <pre>{{ output }}</pre>
      </div>
    </el-main>
    <div class="safe-commands">
      <h2>安全状态下可执行的安全命令</h2>
      <p>以下是不同操作系统下允许执行的安全命令：</p>

      <div class="os-commands">
        <h3>Windows 系统</h3>
        <ul>
          <li><strong>dir</strong>: 列出当前目录下的文件和文件夹</li>
          <li><strong>echo</strong>: 打印 "Hello" 到终端</li>
        </ul>
      </div>

      <div class="os-commands">
        <h3>Linux 系统</h3>
        <ul>
          <li>
            <strong>ls -l</strong>: 列出当前目录下的文件和文件夹（详细信息）
          </li>
          <li><strong>pwd</strong>: 打印当前工作目录的绝对路径</li>
          <li><strong>echo</strong>: 打印 "Hello" 到终端</li>
        </ul>
      </div>

      <p>选择一个命令并根据操作系统执行。</p>
    </div>
  </el-container>
</template>

<script>
import { executeCommand } from "@/api/filesApi";

export default {
  data() {
    return {
      form: {
        command: "",
        isSafe: this.$store.getters.getIsSafe, // 默认安全执行
      },
      output: "",
    };
  },
  methods: {
    async executeCommand() {
      try {
        const response = await executeCommand(
          this.form.command,
          this.form.isSafe
        );
        this.output = response;
        console.log(this.output);
      } catch (error) {
        this.output = "执行失败: " + error.message;
      }
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
}
</style>
