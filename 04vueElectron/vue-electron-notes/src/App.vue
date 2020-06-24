<template>
  <div class="app-wrapper">
    <div class="sidebar-container">
      <file-search
        v-model="searchTitle"
        @create="fileCreate"
        @clear="getFileList"
        @change="handleChange"
        @keyup.enter.native="handleSearch"
        @search="handleSearch"
      />
      <file-list :fileList="fileList" :active.sync="activeIndex" />
    </div>
    <div class="main-container">
      <file-edit
        v-model="fileItem.content"
        :title.sync="fileItem.title"
        :boxShadow="false"
        :subfield="false"
        :shortcut="false"
        @change="onSubmit"
        @titleBlur="updateTitle"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import FileSearch from '@/components/FileSearch'
import FileList from '@/components/FileList'
import FileEdit from '@/components/FileEdit'

const init = {
  title: '文件名',
  content: ''
}
export default {
  name: 'Home',
  components: { FileSearch, FileList, FileEdit },
  data() {
    return {
      searchTitle: '',
      fileList: [],
      fileItem: init,
      activeIndex: 0
    }
  },
  mounted() {
    this.getFileList()
  },
  watch: {
    activeIndex(newValue) {
      this.fileItem = this.fileList[newValue]
    }
  },
  methods: {
    handleChange(val) {
      if (!val) {
        this.getFileList()
      }
    },
    async refreshList() {
      if (this.activeIndex === 0) return
      await this.getFileList()
      const [firstFileItem] = this.fileList
      this.fileItem = firstFileItem
      this.activeIndex = 0
    },
    // 修改标题
    updateTitle(title) {
      const { _id } = this.fileItem
      this.$db.markdown.update({ _id, title: { $ne: title } }, { $set: { title } }).then(() => {
        this.refreshList()
      })
    },
    handleSearch() {
      const reg = new RegExp(`${this.searchTitle}`, 'i')
      const query = { title: reg }
      this.getFileList(query)
    },
    fileCreate() {
      console.log(1)
      const defaultFile = { title: '无标题笔记', content: '' }
      this.$db.markdown.insert(defaultFile)
      this.$message.success('创建成功')
      this.getFileList()
    },
    onSubmit(value) {
      console.log(value)
      console.log(this.fileItem)
    },
    async getFileList(query = {}) {
      const list = await this.$db.markdown.find(query).sort({ updatesAt: -1 })
      // for (const item of list) {
      //   item.createAt = dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss')
      //   item.updatedAt = dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      // }
      list.map(item => ({
        ...item,
        createAt: dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      }))
      console.log()
      this.fileList = list
      this.fileItem = list[0] || init
      this.activeIndex = 0
    }
  }
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
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
