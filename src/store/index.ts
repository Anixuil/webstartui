import { createPinia } from "pinia";
import persistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()

// 注册插件
store.use(persistedstate)


export default store