import { createStore } from "vuex";

interface IRootStore {
  count: number;
}
export default createStore<IRootStore>({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit("increment");
    },
  },
});
