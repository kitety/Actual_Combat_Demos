<template>
  <div>
    <!-- 基座可以放自己的路由 也可以放弃他子应用 -->
    <el-menu :router="true" mode="horizontal">
      <!-- 自己 -->
      <el-menu-item index="/">Home</el-menu-item>
      <!-- 其他 -->
      <el-menu-item index="/vue">vue</el-menu-item>
      <el-menu-item index="/react">react</el-menu-item>
    </el-menu>
    <router-view></router-view>
    <div id="vue"></div>
    <div id="react"></div>
  </div>
</template>

<style>
</style>
