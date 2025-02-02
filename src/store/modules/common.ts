/*
 * @Author: Anixuil
 * @Date: 2024-12-27 10:52:21
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-02 11:24:34
 * @Description: 公共状态
 */
import { defineStore } from 'pinia'

const useCommonStore = defineStore('common', {
    state: () => ({
        globalThemeColor: '',
        globalTheme: '',
        screenInfo: {},
        currentMenuSideBarIndex: -1, // 当前侧边栏索引
    }),
    getters: {
        getGlobalThemeColor(): string {
            return this.globalThemeColor
        },
        getGlobalTheme(): string {
            return this.globalTheme
        },
        getCurrentMenuSideBarIndex(): number {
            return this.currentMenuSideBarIndex
        }
    },
    actions: {
        // 设置全局主题颜色
        setGlobalThemeColor(color: string) {
            window.setGlobalThemeColor(color)
            this.globalThemeColor = color || window.globalThemeColor
        },
        // 设置全局主题
        setGlobalTheme(theme: string) {
            window.setGlobalTheme(theme)
            this.globalTheme = theme || window.globalTheme
        },
        // 设置屏幕信息
        setScreenInfo(info: Record<string, any>) {
            this.screenInfo = info
        },
        // 设置当前侧边栏索引
        setCurrentMenuSideBarIndex(index: number) {
            this.currentMenuSideBarIndex = index
        }
    },
    // 持久化
    persist: {
        // 持久化存储的key
        key: 'ac-common',
        // 持久化存储的路径
        storage: localStorage,
        // state的字段
        pick: ['globalThemeColor', 'globalTheme', 'screenInfo']
    },
})

export default useCommonStore