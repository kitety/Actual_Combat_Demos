import Vue from "./src/platforms/web/entry-runtime";
var vm = new Vue({
  el: "#app",
  data: {
    watchMsg: "init message",
    title: "prev",
    num: 1,
    deep: {
      num: 1,
    },
  },
  computed: {
    computedNum() {
      return this.num * 10;
    },
  },
  watch: {
    num(newVal, oldVal) {
      this.watchMsg = newVal + " apples";
    },
  },
  render(h) {
    return h("button", { on: { click: this.someFn } }, this.watchMsg);
  },

  methods: {
    someFn() {
      this.num++;
    },
  },
});
