<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <Store />
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Store from './Store.vue'

export default {
  name: 'Home',
  components: {
    Store
  }
}
</script>
<style scoped>

</style>
