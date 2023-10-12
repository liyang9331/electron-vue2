<template>
  <div class="drag-tool" :class="{'active': value.guid && activeDragData && value.guid == activeDragData.guid}" @click.stop="dragToolClickHandle">
    <div class="drag-l">
      <div v-if="activeDragData && activeDragData.component !='col' " class="drag-btn drag-rank" style="cursor: move;"><i class="el-icon-rank" /></div>
    </div>
    <div class="drag-r">
      <!-- <div class="drag-btn"><i class="el-icon-copy-document" /></div> -->
      <div v-if="activeDragData && activeDragData.component=='row'" class="drag-btn" @click="$emit('addcol')"><i class="el-icon-circle-plus-outline" /></div>
      <div class="drag-btn drag-btn-danger" @click="$emit('delete')"><i class="el-icon-delete" /></div>
    </div>
    <slot name="default" :data="value" />
  </div>
</template>
<script>
import centerMixin from './mixin/center'
export default {
  name: 'DragTool',
  components: {
  },
  mixins: [centerMixin],
  props: {
    value: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      currentComponent: null,
      activeDragData: this.activeDrag
    }
  },
  watch: {
    activeDrag(val) {
      this.activeDragData = val
    }
  },
  methods: {
    dragToolClickHandle() {
      this.activeDragDataUpdate(this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.ghost-class{
  width: 100%;
  max-height: 10px;
  background-color: #2e73ff;
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
.drag-tool.active{
  >.drag-l .drag-btn,>.drag-r .drag-btn {
    display: flex;
  }
}
</style>
