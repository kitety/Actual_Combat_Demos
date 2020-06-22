<template>
  <div class="app-wrapper">
    <div class="sidebar-container"></div>
    <div class="main-container"></div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
<style lang="less" scoped>
.app-wrapper {
  display: flex;
  .sidebar-container {
    width: 300px;
    height: 100vh;
    border-right: 1px solid #eaeefb;
  }
  .main-container {
    flex: 1;
  }
}
</style>
