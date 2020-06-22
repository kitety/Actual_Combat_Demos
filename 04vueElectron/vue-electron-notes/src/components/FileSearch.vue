<template>
  <div class="search-container">
    <el-input placeholde="请输入内容" v-bind="$attrs" v-on="$listeners">
      <el-button slot="append" icon="el-icon-search" />
    </el-input>
    <el-dropdown>
      <el-button slot="primary" icon="el-icon-circle-plus-outline" circle />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click="createFile()">新建笔记</el-dropdown-item>
        <el-dropdown-item divided @click="importFile()">导入文件</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  name: 'FileSearch',
  methods: {
    createFile() {
      this.$emit('create')
    },
    importFile() {
      this.$emit('import')
    }
  }
}
</script>
<style lang="less" scoped></style>
