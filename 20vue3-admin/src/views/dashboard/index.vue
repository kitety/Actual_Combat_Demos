<template>
  <div>
    <h1>DashBoard</h1>
    <svg-icon
      icon-class="404"
      class-name="custom-class"
      @click="handleClick"
    ></svg-icon>
  </div>
</template>
<script lang="ts">
import { getCurrentInstance } from "vue";

export default {
  name: "DashBoard",
  setup() {
    const { proxy } = getCurrentInstance()!;
    const handleClick = () => {
      proxy?.$message.success("Clicked");
      console.log("click");
    };
    return {
      handleClick,
    };
  },
};
</script>

<style lang="scss">
.custom-class {
  color: blue;
  font-size: 60px;
}
</style>
