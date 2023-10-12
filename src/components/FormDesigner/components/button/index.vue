<template>
  <el-button>{{ contenttext }}</el-button>
</template>
<script>
export default {
  name: 'Button',
  props: {
    contenttext: {
      type: String,
      default: ''
    }
  },
  created() {
    console.log(this.type)
  }
}
</script>
