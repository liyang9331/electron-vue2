<template>
  <div style="margin:-20px;height: 100vh;">
    <el-container style="height: 100%;">
      <el-aside width="200px">
        <div class="zj-l-group">
          <h4 class="zj-l-title">组件</h4>
          <draggable
            class="list-group"
            :sort="false"
            :list="componentList"
            :group="{ name: 'g1', pull: 'clone', put: false }"
            :clone="cloneDog"
            :move="onMoveCallback"
            @change="changeLog"
          >
            <div v-for="(item) in componentList" :key="item.name" class="zj-l-item">
              <div class="item-box">
                <div class="item-icon"><i :class="item.icon" /></div>
                <span class="item-name">{{ item.label }}</span>
              </div>
            </div>
          </draggable>
          <!-- <NestedDraggable :tasks="list" /> -->
        </div>
      </el-aside>

      <el-main style="background: rgb(245, 245, 245);padding: 20px;">
        <el-form class="zj-main" label-width="100px">
          <nested-draggable :value="listDD" box-class="zj-main-drag" />
        </el-form>
      </el-main>
      <el-aside width="300px">
        <set-attr :value="listDD" @change="attrChange" />

      </el-aside>
    </el-container>
  </div>
</template>

<script>
import centerMixin from './mixin/center'
import { VueDraggableNext } from 'vue-draggable-next'
import rule from './rule'
import NestedDraggable from './NestedDraggable.vue'
import SetAttr from './SetAttr.vue'
export default {
  name: 'FormDesigner',
  components: {
    draggable: VueDraggableNext,
    NestedDraggable,
    SetAttr
  },
  mixins: [centerMixin],
  props: {
  },
  emits: {
    active: val => {
      console.log('收到来自active：', val)
      return true
    },
    delete: val => {
      console.log('收到来自active：', val)
      return true
    }
  },
  data() {
    return {
      componentList: null,
      dragOptions: [],
      listDD: []
    }
  },
  computed: {
  },
  watch: {
    listDD: {
      handler(newVal, oldVal) {
        console.log('value up: ', newVal)
        console.log('oldval : ', oldVal)
      },
      // 开启深度监听
      deep: true
    }
  },
  created() {
    this.componentList = this.initList()
  },
  mounted() {
  },
  methods: {
    initList() {
      var data = []
      Object.keys(rule).forEach((i) => {
        if (rule[i].dragBtn !== false) {
          data.push(rule[i])
        }
      })
      return data
    },

    onMoveCallback(evt, originalEvent) {
      // 禁止在组件栏拖动
      // if (evt.relatedContext.element) {
      //   return false
      // } else {
      //   return true
      // }
    },
    // 拖动后的回调，调试追踪使用
    changeLog: function(evt) {
      window.console.log(evt)
    },
    // 自定义克隆数据
    // 一个组件从容器A拖动至容器B进行的复制过程，复制数据可以自定义
    // data 参数为拖动的组件的数据
    // return 的数据将保存到容器B‘list’中
    cloneDog(data) {
      var ruleData = data.rule()
      if (data.name === 'row') {
        ruleData.children.push(rule['col'].rule())
      }
      return {
        name: data.name,
        guid: data.rule().guid,
        // 使用的组件
        ...ruleData
      }
    },
    attrChange(data) {
      // console.log('原来的list', this.listDD)
      // console.log('新的', data)
      this.listDD = data
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.zj-l {
  &-group {
    padding: 0 12px;
  }
  &-title {
    font-weight: 600;
    font-size: 14px;
    margin: 18px 0 5px;
  }
  &-item{
    display: inline-block;
    background: #fff;
    color: #000;
    min-width: 70px;
    width: 33.33%;
    height: 70px;
    line-height: 1;
    text-align: center;
    transition: all .2s ease;
    cursor: pointer;
    .item-box{
      display: inline-block;
      min-width: 70px;
      width: 100%;
      height: 100%;
      line-height: 1;
      text-align: center;
      .item-icon{
        padding: 10px 5px 12px;
        i{
          font-size: 21px;
          display: inline-block;
        }
      }
      .item-name{
        font-size: 12px;
      }
    }
  }
  &-item:hover {
    background: #2e73ff;
    color: #fff;
  }
  // 设置中间栏拖动组件时显示为蓝色长条
  &-item.ghost{
    .item-box{
      display: none !important;
    }
    transition: none;
    width: 100%;
    height: 10px;
    background: #2e73ff;
  }
}
.zj-main{
  position: relative;
  height: 100%;
  &-drag{
    background: #fff;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
    padding: 2px;
    box-sizing: border-box;
  }
  &-row{
    border: 2px solid rgb(6, 141, 231);
  }
}

.drag-tool.active {
    outline: 2px solid #2e73ff;
}
.drag-tool+.drag-tool {
    margin-top: 5px;
}
.drag-tool {
  position: relative;
  min-height: 20px;
  box-sizing: border-box;
  padding: 2px;
  outline: 1px dashed #2e73ff;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  .drag-l {
    top: 0;
    left: 0;
  }
  .drag-r {
    right: 2px;
    bottom: 2px;
  }
  .drag-l, .drag-r {
    position: absolute;
    z-index: 999;
  }
  .drag-btn {
    display: none;
    height: 18px;
    width: 18px;
    color: #fff;
    background-color: #2e73ff;
    padding-bottom: 1px;
    float: left;
    cursor: pointer;
    justify-content: center;
    align-items: center;
  }
  .drag-btn+.drag-btn {
    margin-left: 2px;
  }
  .drag-btn i {
    font-size: 13px;
  }
}
.drag-tool.active{
  .drag-btn {
    display: flex;
  }
}
</style>
