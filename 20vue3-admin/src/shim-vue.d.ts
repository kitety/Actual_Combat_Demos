import ElementPlus, {
  ElMessage,
  ElMessageBox,
  ElNotification,
} from "element-plus";

declare module "*.vue" {
  import { Component } from "vue";
  const component: Component;
  export default Component;
}
// vue实例上挂载属性类型声明
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $message: typeof ElMessage;
    $notify: typeof ElNotification;
    $confirm: typeof ElMessageBox.confirm;
    $alert: typeof ElMessageBox.alert;
    $prompt: typeof ElMessageBox.prompt;
  }
}
