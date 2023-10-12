import { guid } from './lib'

const label = '按钮'
const name = 'button'

export default {
  icon: 'el-icon-s-platform',
  label,
  name,
  // 规则
  rule() {
    return {
      // 使用的组件
      component: 'button',
      // 唯一标识
      guid: guid(),
      children: [],
      // 默认的配置
      props: {
        // size: 'small',
        contenttext: '内容'
      }
    }
  },
  // 配置选项
  props() {
    return [{
      title: '内容',
      type: 'input',
      field: 'contenttext',
      value: '内容'
    }, {
      title: '尺寸',
      type: 'select',
      field: 'size',
      options: [
        { label: 'medium', value: 'medium' },
        { label: 'small', value: 'small' },
        { label: 'mini', value: 'mini' }
      ]
    }, {
      title: '类型',
      type: 'select',
      field: 'type',
      options: [
        { label: 'primary', value: 'primary' },
        { label: 'success', value: 'success' },
        { label: 'warning', value: 'warning' },
        { label: 'danger', value: 'danger' },
        { label: 'info', value: 'info' },
        { label: 'text', value: 'text' }
      ]
    }]
  }
}
