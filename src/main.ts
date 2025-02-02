/*
 * @Author: Anixuil
 * @Date: 2024-12-26 17:19:21
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-29 18:55:28
 * @Description: 项目入口文件
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Router from '@/router/index'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@styles/index.scss'
// import '@styles/element/index.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Store from '@/store/index'
import AniComponents from  '@/components/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(Router).use(Store).use(ElementPlus,{locale: zhCn}).use(AniComponents).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
