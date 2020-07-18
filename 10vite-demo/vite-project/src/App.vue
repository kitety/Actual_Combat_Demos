<template>
  <div>
    <div>{{count}}</div>
    <button @click="handleClick">增加</button>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  name: "App",
  setup() {
    let state = reactive({ count: 0 });
    function handleClick() {
      state.count++;
    }
    return { ...toRefs(state), handleClick };
  }
};
</script>
