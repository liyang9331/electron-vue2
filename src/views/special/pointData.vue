<template>
  <div>
    <div class="tableData">
      <ul>
        <li
          :class="[activeNum == index ? 'active' : '']"
          v-for="(item, index) in pointArray"
          :key="item['标识码']"
          @click="handPointData(item, index)"
        >
          <div class="left">{{ index + 1 }}</div>
          <div class="right">
            <div class="right-title">
              {{ item["标识码"] }}
              <span>{{ item["检查井类型"] }}</span>
            </div>
            <div class="identification-code">
              <span class="first"
                >井盖/盖板尺寸（mm）: {{ item["井盖/盖板尺寸（mm）"] }}</span
              >
              <span class="last">地址描述:{{ item["地址描述"] }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "pointData",
  props: {
    pointArray: {
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
    handPointData(item, index) {
      this.activeNum = index;
      this.$emit("handPointData", item);
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
          }
          .first {
            width: 160px;
          }
          .last {
            width: calc(100% - 160px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>