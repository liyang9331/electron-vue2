<template>
  <el-row :gutter="20">
    <el-col v-for="(item) in collist" :key="item.guid" :span="item.props.span">
      <drag-tool class="drag-tool" :value="item" @delete="removeAt(item.guid)">
        <template #default="{ data }">
          <NestedDraggable :list="data.children" />
        </template>
      </drag-tool>
    </el-col>
  </el-row>
</template>
<script>
import NestedDraggable from './NestedDraggable.vue'
import DragTool from './DragTool'
export default {
  name: 'Row',
  components: {
    NestedDraggable,
    DragTool
  },
  props: {
    collist: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      listData: this.collist,
      currentComponent: null
    }
  },
  computed: {
  },
  watch: {
    list(newVal) {
      this.listData = newVal
    },
    listData(newVal) {
      console.log('执行了')
    }
  },
  methods: {
    removeAt(idx) {
      this.listData.splice(idx, 1)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
