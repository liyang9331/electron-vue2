<template>
  <el-container direction="vertical" style="height: 100%;">
    <el-header height="40px">
      <div>组件配置</div>
    </el-header>
    <el-main>
      <el-form ref="form" :model="formData" label-width="80px" label-position="top">
        <el-divider>基础配置</el-divider>
        <el-form-item v-for="(item, index) in propsData" :key="index" :label="item.title">
          <template v-if="item.type == 'slider'">
            <el-slider v-model="formData[item.field]" v-bind="item.props" />
          </template>
          <template v-else-if="item.type == 'input'">
            <el-input v-model="formData[item.field]" v-bind="item.props" />
          </template>
          <template v-else-if="item.type == 'inputNumber'">
            <el-input-number v-model="formData[item.field]" v-bind="item.props" />
          </template>
          <template v-else-if="item.type == 'switch'">
            <el-switch v-model="formData[item.field]" v-bind="item.props" />
          </template>
          <template v-else-if="item.type == 'select'">
            <el-select v-model="formData[item.field]" placeholder="请选择">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-divider>属性配置</el-divider>
        <raw-displayer :value="value" title="JSON结构" />
        <raw-displayer :value="[activeDragData]" title="JSON结构" />
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import RawDisplayer from './RawDisplayer.vue'
import centerMixin from './mixin/center'
import rule from './rule'
export default {
  name: 'SetAttr',
  components: {
    RawDisplayer
  },
  mixins: [centerMixin],
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      activeDragData: this.activeDrag,
      ruleData: null,
      propsData: [],
      formData: {}
    }
  },
  computed: {
    updataFormData() {
      return this.formData
    }
  },
  watch: {
    activeDrag(newVal) {
      this.init(newVal)
    },
    formData: {
      handler(newVal, oldName) {
        var data = {}
        Object.keys(newVal).forEach((key) => {
          if (newVal[key] !== null) {
            data[key] = newVal[key]
          }
        })
        var newList = this.cha(this.value, this.activeDragData.guid, data)
        // console.log(newList)
        this.$emit('change', newList)
      },
      // 开启深度监听
      deep: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    init(listData) {
      var propsData = rule[listData.component].props()
      var dataProps = listData.props
      this.formData = {}
      Object.keys(dataProps).forEach((key) => {
        this.formData[key] = dataProps[key] ? dataProps[key] : null
      })
      this.propsData = propsData
      this.activeDragData = listData
    },
    cha(data, guid, props) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].guid === guid) {
          data[i].props = props
          break
        } else if (data[i].children && data[i].children.length > 0) {
          data[i].children = this.cha(data[i].children, guid, props)
        }
      }
      return data
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
