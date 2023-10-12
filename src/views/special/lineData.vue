<template>
  <div>
    <div class="tableData">
      <ul>
        <li
          :class="[activeNum == index ? 'active' : '']"
          v-for="(item, index) in lineArray"
          :key="index"
          @click="handLineData(item, index)"
        >
          <div class="left">{{ index + 1 }}</div>
          <div class="right">
            <div class="right-title">
              {{ item["起始节点标识码"] }} - {{ item["终止节点标识码"] }}
            </div>
            <div class="identification-code">
              <span class="first">管径（mm）: {{ item["管径（mm）"] }}</span>
              <span class="last">所处位置:{{ item["所处位置"] }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "lineData",
  props: {
    lineArray: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeNum: null,
    };
  },
  methods: {
    handLineData(item, index) {
      this.activeNum = index;
      this.$emit("handLineData", item);
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.tableData {
  overflow: auto;
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    .active {
      background: rgba(163, 210, 236, 0.15);
      border-radius: 4px;
    }
    li {
      padding: 8px 0 8px 18px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      border-bottom: 1px solid #f1f1f1;
      background-color: #fff;
      overflow: hidden;
      cursor: pointer;
      .left {
        margin-right: 16px;
        width: 10px;
      }
      .right {
        flex: 1;
        .right-title {
          font-size: 14px;
          color: #1f263e;
          letter-spacing: 0;
          line-height: 22px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .identification-code {
          width: 100%;
          opacity: 0.5;
          font-size: 12px;
          color: rgba(31, 38, 62, 0.5);
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 400;

          span {
            display: inline-block;
            vertical-align: middle;
            &:first-child {
                margin-right: 10px;
            }
          }
        }
      }
    }
  }
}
</style>