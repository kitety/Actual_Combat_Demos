<template>
  <!-- 如果iconClass是带协议的图标链接 则通过style属性方式渲染-->
  <div
    class="scg-icon scg-external-icon"
    v-if="isExt"
    :style="styleExternalIcon"
    v-bind="$attrs"
  ></div>
  <!-- svg -->
  <svg v-else :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <!-- SVG中的use元素可以调用其他SVG文件的元素，<use xlink:href="#symbolId"></use> -->
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script lang="ts">
import { isExternal } from "@/utils/validate";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "SvgIcon",
  inheritAttrs: false, // 组件上的$attrs不自动添加到组件根元素上 默认添加到组件根元素上,
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const isExt = computed(() => isExternal(props.iconClass || ""));
    // 拼接成symbolId 在loader配置中指定了symbolId格式 icon-图标名称
    const iconName = computed(() => `#icon-${props.iconClass}`);
    // 添加类名 props.className外部传入自定义类名
    const svgClass = computed(() =>
      props.className ? `scg-icon ${props.className}` : "scg-icon"
    );
    // 如果iconClass是带协议的图标链接 则通过style css属性方式渲染
    const styleExternalIcon = computed(() => ({
      mask: `url(${props.iconClass}) no-repeat 50% 50%`,
      "-webkit-mask": `url(${props.iconClass}) no-repeat 50% 50%`,
    }));
    return {
      isExt,
      iconName,
      svgClass,
      styleExternalIcon,
    };
  },
});
</script>
<style scoped>
.scg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
