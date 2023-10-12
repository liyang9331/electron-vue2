
<template>
  <draggable
    class="drag-box"
    :class="boxClass"
    :list="listData"
    :group="{ name: 'g1' }"
    :put="true"
    handle=".drag-rank"
    animation="200"
    ghost-class="ghost"
    @change="log"
  >
    <drag-tool v-for="(item, index) in listData" :key="item.guid" class="drag-tool" :value="item" @delete="removeAt(index)" @addcol="addCol(item)">
      <template #default="{ data }">
        <!-- <row v-if="data.component=='row'" :collist="data.children" /> -->
        <el-row v-if="data.component=='row'" v-bind="data.props">
          <el-col
            v-for="(item2, inddex2) in data.children"
            :key="item2.guid"
            v-bind="item2.props"
          >
            <drag-tool class="drag-tool" :value="item2" @delete="data.children.splice(inddex2, 1)">
              <template #default="resData">
                <NestedDraggable :value="resData.data.children" />
              </template>
            </drag-tool>
          </el-col>
        </el-row>
        <component :is="data.component" v-else v-bind="data.props">{{ data.children }}</component>
      </template>
    </drag-tool>
  </draggable>
</template>
<script>
import centerMixin from './mixin/center'
import { VueDraggableNext } from 'vue-draggable-next'
import DragTool from './DragTool'
import component from './component.js'
import rule from './rule'
export default {
  name: 'NestedDraggable',
  components: {
    draggable: VueDraggableNext,
    ...component,
    DragTool
  },
  mixins: [centerMixin],
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    boxClass: {
      type: String,
      default: ''
    },
    isrow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listData: this.value,
      currentComponent: null,
      activeDragData: this.activeDrag
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.listData = newVal
      },
      // 开启深度监听
      deep: true
    },
    listData(newVal) {
      console.log('执行了')
    }
  },
  methods: {
    removeAt(index) {
      this.listData.splice(index, 1)
    },
    removeCol(parentData, data) {
      this.listData = this.listData.map(item => {
        return item.guid === parentData.guid ? parentData.splice(data, 1) : item
      })
    },
    addCol(data) {
      // console.log('this.listData22', this.listData)
      this.listData = this.listData.map(item => {
        if (item.guid === data.guid) {
          data.children.push(rule['col'].rule())
          return data
        }
        return item
      })
    },
    log: function(evt) {
      window.console.log(evt)
    }
  }
}
</script>
<style lang="scss">
.ghost-class{
  width: 100%;
  max-height: 10px;
  background-color: #2e73ff;
}
.drag-box{
  position: relative;
  padding: 6px;
  min-height: 40px;
  box-sizing: border-box;
}
.drag-tool.active {
    outline: 2px solid #2e73ff;
}
.drag-tool+.drag-tool {
    margin-top: 6px;
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
.drag-tool .drag-tool {
  margin: 5px;
}
.drag-tool.active{
  >.drag-l .drag-btn,>.drag-r .drag-btn {
    display: flex;
  }
}
</style>
