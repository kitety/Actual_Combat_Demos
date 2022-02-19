<template>
  <div class="app-wrapper">
    <div class="sidebar-container">sidebar</div>
    <div class="main-container">
      <div class="header">
        <div class="navbar">navbar</div>
        <div class="tag-view">tag-view</div>
      </div>
      <div class="app-main">
        <h2>app-main</h2>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "Layout",
};
</script>
<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  .sidebar-container {
    width: 200px;
  }
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    .header {
      background: cyan;
      .navbar {
        height: 50px;
        background: #1890ff;
      }
      .tags-view {
        height: 34px;
        background: #12efff;
      }
    }
    .app-main {
      /* 50= navbar  50  如果有tagsview + 34  */
      min-height: calc(100vh - 84px);
      background: red;
    }
  }
}
</style>
