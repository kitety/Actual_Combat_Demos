import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
/**
 * 3.默认采用es6原生模块
 * main.js引入了一个文件就会发一个http请求（import）
 * import { createApp } from '/@modules/vue.js'
 * 1.默认给vue的模块加前缀。@modules 引入的模块
 * template变为render函数
 * 2.vue文件在后端解析成一个对象（唯一编译了.vue文件）
 * 
 * node koa 快速搭建服务
 * 
 * 
 * 
 * Uncaught TypeError: Failed to resolve module specifier "vue". Relative references must start with either "/", "./", or "../".
 * 因此需要转换
 * 
 * 
 */
