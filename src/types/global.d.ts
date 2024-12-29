/*
 * @Author: Anixuil
 * @Date: 2024-12-27 10:13:04
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-29 16:15:17
 * @Description: 全局类型定义
 */
declare module 'element-plus/dist/locale/zh-cn.mjs';

interface ScreenInfo {
    width: number;
    height: number;
    availWidth?: number;
    availHeight?: number;
    colorDepth?: number;
    pixelDepth?: number;
    ratio?: number;
    screenWidth?: number;
    screenHeight?: number;
    deviceXDPI?: number;
    logicalXDPI?: number;
}
interface Window {
    deferredPrompt: Event;  // 用于监听pwa注册事件
    globalTheme: string;  // 全局主题
    setGlobalTheme: (theme?: string) => void;  // 设置全局主题
    setGlobalThemeColor: (color?: string) => void;  // 设置全局主题颜色
    globalThemeColor: string;  // 全局主题颜色
    screen: ScreenInfo;  // 屏幕信息
}

interface Form {
    projectId?: number,
    projectName: string,
    projectDesc: string,
    projectType: string,
    projectLocalUrl: string,
    projectGitUrl: string,
    projectBranch: string,
    projectConfig: string,
    projectStatus: string,
    projectPort: number,
    projectCommand: string,
    projectVersion: string,
    projectConfigFileName: string,
    projectBackendUrl: string
}