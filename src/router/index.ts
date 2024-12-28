/*
 * @Author: Anixuil
 * @Date: 2024-12-27 09:49:24
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-28 09:55:04
 * @Description: 请填写简介
 */
import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import baseModules from "./modules/baseModules";
import useCommonStore from "@/store/modules/common";

const routes: Array<RouteRecordRaw> = [...baseModules];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// 路由守卫
router.beforeEach((to, from) => {
    // 设置全局主题
    const { setGlobalTheme, setGlobalThemeColor } = useCommonStore();
    // 先存颜色，再存主题
    setGlobalThemeColor(window.globalThemeColor);
    setGlobalTheme(window.globalTheme);
})

// 路由守卫
router.afterEach((to, from) => {

})

export default router;