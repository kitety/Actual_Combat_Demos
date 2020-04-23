import Vue from "./src/platforms/web/entry-runtime";
Vue.component("button-counter", {
  data: function () {
    return {
      btnnum: 0,
    };
  },
  render(h) {
    return h("button", { on: { click: this.btnclcik } }, this.btnnum);
  },
  methods: {
    btnclcik() {
      this.btnnum++;
    },
  },
});
var vm = new Vue({
  el: "#app",
  data: {
    watchMsg: "init message",
    title: "prev",
    msg: "hello",
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
    // return h("button", { on: { click: this.someFn } }, this.watchMsg);
    return h("div", {}, [this._c("button-counter"), h("span", {}, this.msg)]);
  },

  methods: {
    someFn() {
      this.num++;
    },
  },
});
