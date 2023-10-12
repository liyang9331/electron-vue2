
<template>
  <div class="softwareLicenseCom">
    <!-- 待审核 -->
    <div class="content" v-if="auditStatus == 0">
      <div class="first">
        <img src="@/assets/images/shangweitongguo.png" />
        <p>尚未通过许可认证</p>
      </div>
      <div class="rzm">
        <div class="inputBox">
          <el-input v-model="form.rzm" placeholder="请输入认证码"></el-input>
          <el-button type="primary" @click="onAuthentication">认证</el-button>
        </div>
      </div>
    </div>
    <!-- 审核成功 -->
    <div class="content" v-if="auditStatus == 1">
      <div class="first">
        <img src="@/assets/images/tongguo.png" />
        <p>已完成认证</p>
        <p style="
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 22px;
            margin-top: 20px;
          ">
          你的账户已完成认证
        </p>
      </div>
    </div>
    <!-- 审核成功 -->
    <div class="content" v-if="auditStatus == 2">
      <div class="first">
        <img src="@/assets/images/weitongguo.png" />
        <p>未通过认证</p>
        <p style="
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 22px;
            margin-top: 20px;
          ">
          你的账户未通过认证，请<span class="retry" @click="onRetry">重试</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-ui";
export default {
  name: "fileUploadDialog",
  components: {},
  created () { },
  data () {
    return {
      form: {
        rzm: "",
      },
      auditStatus: 0, // 0待审核 1审核通过 2审核未通过
    };
  },
  methods: {
    // 认证
    onAuthentication () {
      if (!this.form.rzm) {
        ElMessage.error("认证码不能为空");
        return;
      }
      this.auditStatus = 1;
    },
    //重试
    onRetry () {
      this.auditStatus = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-input {
    margin-right: 20px;
  }
}

.content {
  width: 50%;
  margin: 14% auto;

  .first {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    flex-direction: column;
    justify-content: center;
    margin-left: -10%;

    img {
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
    }
  }

  .rzm {
    p {
      margin-bottom: 6px;
    }

    .inputBox {
      display: flex;
    }
  }

  .retry {
    color: $color_theme;
    cursor: pointer;
  }
}
</style>