
export default {
  computed: {
    activeDrag() {
      return this.$root.$data.activeDragData ? this.$root.$data.activeDragData : null
    }
  },
  watch: {
    activeDrag(newVal) {
      // console.log('sadfasdfasdf', newVal)
    }
  },
  methods: {
    activeDragDataUpdate(newData) {
      this.$root.$data.activeDragData = newData
      this.$emit('active')
    }
  }
}
