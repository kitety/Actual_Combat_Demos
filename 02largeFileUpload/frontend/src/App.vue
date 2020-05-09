<template>
  <div id="app">
    <input type="file" @change="handleFileChange" />
    <el-button @click="handleUpload">上传</el-button>
  </div>
</template>

<script>
const SIZE = 10 * 1024 * 1024; // 切片大小
export default {
  name: "App",
  components: {},
  data: () => ({
    container: {
      file: null,
    },
    data: [],
  }),
  methods: {
    handleFileChange(e) {
      console.log("e: ", e);
      const [file] = e.target.files;
      if (!file) {
        return;
      }
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
      console.log("file: ", file);
    },
    request({ url, methods = "post", data, headers = {} }) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open(methods, url);
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
        xhr.send(data);
        xhr.onload = (e) => {
          resolve({ data: e.target.reponse });
        };
      });
    },
    // 生成文件切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    },
    // 上传切片
    async uploadChunks() {
      const requestList = this.data
        .map(({ chunk, hash }) => {
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.container.file.name);
          return { formData };
        })
        .map(async ({ formData }) => {
          this.request({
            url: "http://localhost:3000",
            data: formData,
          });
        });
      // 并发切片
      await Promise.all(requestList);
      // 合并切片
      await this.mergeRequest();
    },
    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      console.log("fileChunkList: ", fileChunkList);
      this.data = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        hash: this.container.file.name + "-" + index, // 文件名+数组小编
      }));
      await this.uploadChunks();
    },
    async mergeRequest() {
      await this.request({
        url: "http://localhost:3000/merge",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          filename: this.container.file.name,
        }),
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
