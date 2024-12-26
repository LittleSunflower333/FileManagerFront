<template>
    <el-card class="box-card" shadow="always" style="margin: 20px 0">
      <h3>文件上传的整体防护策略</h3>
      <el-divider></el-divider>
      <el-alert
        title="在安全模式下，这些过滤机制共同构成了多层次的防护："
        type="info"
        effect="dark"
        show-icon
      />
      <el-timeline style="margin: 20px 0">
        <el-timeline-item timestamp="1" placement="bottom" type="primary">
          <p>
            <b>文件类型限制：</b> 通过扩展名检查和 MIME 类型验证，仅允许安全文件类型上传。
          </p>
        </el-timeline-item>
        <el-timeline-item timestamp="2" placement="bottom" type="primary">
          <p>
            <b>大小限制：</b> 限制文件大小，防止上传超大文件导致 DoS 攻击。
          </p>
        </el-timeline-item>
        <el-timeline-item timestamp="3" placement="bottom" type="primary">
          <p>
            <b>内容安全检查：</b> 检查文件内容是否包含危险关键字或恶意二进制可执行文件。
          </p>
        </el-timeline-item>
        <el-timeline-item timestamp="4" placement="bottom" type="primary">
          <p>
            <b>可扩展的内容扫描：</b> 保留扩展能力，应对未来潜在威胁。
          </p>
        </el-timeline-item>
      </el-timeline>
  
      <el-divider></el-divider>
      <h4>这些措施有效防止以下常见文件上传攻击：</h4>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" style="margin-bottom: 10px">
            <h5>恶意脚本攻击</h5>
            <p>通过上传脚本文件触发 XSS 或代码注入。</p>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" style="margin-bottom: 10px">
            <h5>MIME 类型伪装攻击</h5>
            <p>上传伪装成图片的脚本文件。</p>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" style="margin-bottom: 10px">
            <h5>文件炸弹攻击</h5>
            <p>上传压缩炸弹或超大文件导致服务拒绝。</p>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" style="margin-bottom: 10px">
            <h5>后门攻击</h5>
            <p>上传可执行文件作为后门程序运行。</p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </template>
  
  <script>
  export default {
    name: "FileUploadStrategy",
  };
  </script>
  
  <style scoped>
  h3 {
    font-weight: bold;
  }
  h4 {
    margin-top: 20px;
  }
  </style>
  