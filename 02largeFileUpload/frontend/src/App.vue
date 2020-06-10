<template>
  <div id="app">
    <input type="file" @change="handleFileChange" />
    <el-button @click="handleUpload">上传</el-button>
    <el-button @click="merge">合并</el-button>
    <div>
      <div>总进度</div>
      {{ uploadPercentage }}
      <el-progress :percentage="uploadPercentage"></el-progress>
    </div>
    <el-table :data="data">
      <el-table-column
        prop="chunkHash"
        label="切片hash"
        align="center"
      ></el-table-column>
      <el-table-column
        lable="大小"
        align="center"
        prop="size"
      ></el-table-column>
      <el-table-column label="进度" align="center">
        <template v-slot="{ row }">
          <el-progress :percentage="row.percentage"></el-progress>
        </template>
      </el-table-column>
    </el-table>
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
  computed: {
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      console.log("this.data: ", this.data);
      const loaded = this.data
        .map((item) => item.chunk.size * item.percentage)
        .reduce((acc, cur) => Number(acc) + Number(cur), 0);
      console.log("loaded: ", loaded);
      return parseInt((loaded / this.container.file.size).toFixed(2));
    },
  },
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
    request({
      url,
      methods = "post",
      data,
      headers = {},
      onProgress = (e) => e,
    }) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = onProgress;
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
    async merge() {
      await this.mergeRequest();
    },
    // 上传切片
    async uploadChunks() {
      const requestList = this.data
        .map(({ chunk, hash, index }) => {
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.container.file.name);
          return { formData, index };
        })
        .map(async ({ formData, index }) => {
          this.request({
            url: "http://localhost:3000",
            data: formData,
            onProgress: this.createProgressHandler(this.data[index]),
          });
        });
      // 并发切片
      await Promise.all(requestList);
      // 合并切片
    },
    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      console.log("fileChunkList: ", fileChunkList);
      console.log("fileChunkList: ", fileChunkList);
      this.data = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        index,
        hash: this.container.file.name + "-" + index, // 文件名+数组小编
        percentage: 0,
      }));
      await this.uploadChunks();
    },
    createProgressHandler(item) {
      return (e) => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100));
      };
    },

    async mergeRequest() {
      await this.request({
        url: "http://localhost:3000/merge",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          size: SIZE,
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
