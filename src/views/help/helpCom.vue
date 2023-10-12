<template>
  <div class="helpCom">
    <div class="content">
      <div class="left_menu">
        <div
          v-for="item in rightList"
          :key="item.name"
          :class="['left-item', activeName == item.name ? 'active' : '']"
          @click="onStartTest(item.name)"
        >
          <div class="img_box">
            <img :src="item.imgUrl" alt="" />
          </div>
          <div class="text">{{ item.name }}</div>
        </div>
      </div>
      <div class="right">
        <div class="instructions" v-if="activeName == '使用说明'">
          <div v-html="htmlValue"></div>
        </div>
        <!-- 软件许可 -->
        <software-license-com
          v-if="activeName == '软件许可'"
        ></software-license-com>
        <!-- 版本信息 -->
        <div class="banbenBox" v-if="activeName == '版本信息'">
          <img src="../../assets/images/logo.png" />
          <p style="margin-bottom: 16px; margin-top: 30px">
            版本号：1.020221010
          </p>
          <p>© 2022-2023 北京首创生态环保集团股份有限公司</p>
        </div>
        <!-- 数据字典 -->
        <data-dictionary v-if="activeName == '数据字典'"></data-dictionary>
      </div>
    </div>
  </div>
</template>
    
<script>
import DataDictionary from "./dataDictionary.vue";
import SoftwareLicenseCom from "./softwareLicenseCom.vue";
import { SqliteCom } from "@/js/sqlite/index.js";
export default {
  name: "helpCom",
  components: { SoftwareLicenseCom, DataDictionary },
  data() {
    return {
      rightList: [
        {
          name: "使用说明",
          imgUrl: require("@/assets/images/menu/shiyongshuoming.png"),
        },
        {
          name: "软件许可",
          imgUrl: require("@/assets/images/menu/ruanjianxuke.png"),
        },
        {
          name: "版本信息",
          imgUrl: require("@/assets/images/menu/banbenxinxi.png"),
        },
        {
          name: "数据字典",
          imgUrl: require("@/assets/images/menu/banbenxinxi.png"),
        },
      ],
      activeName: "使用说明",
      softwareLicenseComShow: false,
      banbenInforShow: false,
      htmlValue: "",
      sqliteCom: null,
    };
  },
  created() {
    this.sqliteCom = new SqliteCom(window.dbPath);
  },
  mounted() {
    this.getExplainData();
  },
  methods: {
    // 获取使用说明的数据
    async getExplainData() {
      let params = {
        CODE: "使用说明",
      };
      let res = await this.sqliteCom.getQueryData("tb_dict", params);
      this.htmlValue = res[0].HTMLVALUE ? res[0].HTMLVALUE : res[0].VALUE;
    },
    onStartTest(text) {
      this.activeName = text;
    },
    // 软件许可
    onSoftwareLicense() {
      this.softwareLicenseComShow = true;
    },
    softwareLicenseComClose() {
      this.softwareLicenseComShow = false;
    },
    // 版本信息
    onEditionInfo() {
      this.banbenInforShow = true;
    },
  },
};
</script>
    
    <style lang="scss" scoped>
h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.text {
  margin-bottom: 10px;
}
.helpCom {
  height: 100%;
  width: 100%;
  font-size: 14px;
  .content {
    display: flex;
    height: 100%;
    .right {
      flex: 1;
      overflow: auto;
      background-color: #fff;
      padding: 20px;
      margin: 20px;
      .instructions {
        h2 {
          text-align: center;
          font-size: 20px;
          font-weight: 500;
          color: #1f263e;
          line-height: 20px;
        }
      }
      .text {
        line-height: 1.2;
      }
    }
  }
}
.banbenBox {
  width: 50%;
  margin: 10% auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 212px;
    height: 143px;
  }
}
</style>