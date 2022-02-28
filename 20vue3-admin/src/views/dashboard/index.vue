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
export default {
  name: "DashBoard",
  methods: {
    handleClick() {
      console.log("click");
    },
  },
};
</script>

<style lang="scss">
.custom-class {
  color: blue;
  font-size: 60px;
}
</style>
