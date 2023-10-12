import { guid } from './lib'

const label = '栅格'
const name = 'row'

export default {
  icon: 'el-icon-s-platform',
  label,
  name,
  // 规则
  rule() {
    return {
      // 使用的组件
      component: 'row',
      // 唯一标识
      guid: guid(),
      children: [
      ],
      // 默认的配置
      props: {
      }
    }
  },
  // 配置选项
  props() {
    return [{ type: 'inputNumber', field: 'gutter', title: '栅格间隔' }, {
      type: 'switch',
      field: 'type',
      title: 'flex布局模式',
      props: { activeValue: 'flex', inactiveValue: 'default' }
    }, {
      type: 'select',
      field: 'justify',
      title: 'flex 布局下的水平排列方式',
      options: [{ label: 'start', value: 'start' }, { label: 'end', value: 'end' }, {
        label: 'center',
        value: 'center'
      }, { label: 'space-around', value: 'space-around' }, { label: 'space-between', value: 'space-between' }]
    }, {
      type: 'select',
      field: 'align',
      title: 'flex 布局下的垂直排列方式',
      options: [{ label: 'top', value: 'top' }, { label: 'middle', value: 'middle' }, {
        label: 'bottom',
        value: 'bottom'
      }]
    }]
  }
}
