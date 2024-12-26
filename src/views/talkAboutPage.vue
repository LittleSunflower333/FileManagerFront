<template>
  <div class="discussion-page">
    <el-row class="header">
      <el-col :span="24">
        <el-input
          v-model="newComment"
          placeholder="输入你的评论..."
          :rows="2"
          type="textarea"
          show-word-limit
          :max-length="200"
        />
        <el-tooltip
          v-if="isSafe"
          content="安全状态下会对评论内容进行转义和过滤"
          placement="right"
          effect="dark"
          style="margin-top: 10px; display: inline-block"
        >
      </el-tooltip>
      <el-button @click="postComment" type="primary" style="margin-top: 10px"
          >发布评论</el-button
        >
      </el-col>
    </el-row>

    <el-divider></el-divider>

    <el-row class="comments-list">
      <el-col :span="24" v-for="(comment, index) in comments" :key="index">
        <el-card class="comment-card" :body-style="{ padding: '20px' }">
          <div>
            <div v-if="isSafe">
              <h3>{{ comment.username }}</h3>
              <p>{{ comment.text }}</p>
            </div>
            <div v-else>
              <h3 v-html="comment.username"></h3>
              <p v-html="comment.text"></p>
            </div>

            <div class="comment-footer">
              <span>{{ comment.formattedTime }}</span>
              <!-- 删除评论按钮，只有评论者本人才能删除 -->
              <el-button
                v-if="comment.username === loginUserName"
                size="mini"
                @click="deleteComment(comment.id)"
                type="text"
              >
                删除
              </el-button>
              <!-- <el-button size="mini" @click="replyComment(comment)" type="text"
                >回复</el-button
              > -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 加载更多评论按钮 -->
    <el-row class="load-more">
      <el-col :span="24" style="text-align: center">
        <el-button v-if="hasMoreComments" @click="loadMoreComments"
          >加载更多评论</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTalkList, publishTalk, deleteTalk } from "@/api/talkApi"; // 引入talkApi

export default {
  data() {
    return {
      newComment: "",
      comments: [], // 用于保存评论列表
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页显示的评论数
      hasMoreComments: true, // 是否还有更多评论
      loginUserName: this.$store.getters.getUserInfo.username,
    };
  },
  methods: {
    // 格式化时间
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 发布评论
    postComment() {
      if (this.newComment.trim()) {
        const text = this.newComment;

        // 从 computed 获取 isSafe 的值
        const isSafe = this.isSafe;

        // 调用 publishTalk API 发布评论，并传递 isSafe 参数
        publishTalk(text, isSafe)
          .then(() => {
            this.newComment = ""; // 清空输入框
            this.loadComments(); // 重新加载评论列表
          })
          .catch((error) => {
            this.$message.error("发布评论失败", error);
          });
      } else {
        this.$message.error("评论内容不能为空");
      }
    },

    // 获取评论列表
    loadComments() {
      getTalkList(this.currentPage, this.pageSize)
        .then((response) => {
          // 格式化时间
          const formattedComments = response.map((comment) => ({
            ...comment,
            formattedTime: this.formatTimestamp(comment.createdAt), // 添加格式化后的时间
          }));
          console.log(formattedComments);

          // 如果返回的评论数小于每页的大小，表示没有更多评论了
          if (response.length < this.pageSize) {
            this.hasMoreComments = false;
          }

          // 更新评论列表
          this.comments = formattedComments;
        })
        .catch((error) => {
          this.$message.error("加载评论失败", error);
        });
    },

    // 加载更多评论
    loadMoreComments() {
      this.currentPage += 1;
      getTalkList(this.currentPage, this.pageSize)
        .then((response) => {
          // 格式化时间
          const formattedComments = response.map((comment) => ({
            ...comment,
            formattedTime: this.formatTimestamp(comment.createdAt), // 添加格式化后的时间
          }));

          // 如果返回的评论数小于每页的大小，表示没有更多评论了
          if (response.length < this.pageSize) {
            this.hasMoreComments = false;
          }

          // 将新的评论追加到现有评论列表
          this.comments.push(...formattedComments);
        })
        .catch((error) => {
          this.$message.error("加载更多评论失败", error);
        });
    },

    // 删除评论
    deleteComment(commentId) {
      deleteTalk(commentId)
        .then(() => {
          this.$message.success("评论删除成功");
          this.loadComments(); // 删除成功后重新加载评论列表
        })
        .catch((error) => {
          this.$message.error("删除评论失败", error);
        });
    },

    // 回复评论
    replyComment(comment) {
      this.$message.info(`正在回复：${comment.username}`);
    },
  },
  computed: {
    // 从 Vuex 获取安全状态
    isSafe() {
      return this.$store.getters.getIsSafe;
    },
  },

  created() {
    // 页面加载时获取评论列表
    this.loadComments();
  },
};
</script>

<style scoped>
.discussion-page {
  padding: 20px;
  width: 100%;
}

.comment-card {
  margin-bottom: 20px;
}

.comment-footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-row.header {
  margin-bottom: 20px;
}

.el-input {
  width: 100%;
}

.el-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.load-more {
  margin-top: 20px;
}
</style>
