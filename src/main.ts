/*
 * @Author: Anixuil
 * @Date: 2024-12-26 17:19:21
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-28 09:55:21
 * @Description: 项目入口文件
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Router from '@/router/index'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// import '@styles/element/index.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Store from '@/store/index'
import AniComponents from  '@/components/index'
import '@styles/index.scss'

createApp(App).use(Router).use(Store).use(ElementPlus,{locale: zhCn}).use(AniComponents).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
