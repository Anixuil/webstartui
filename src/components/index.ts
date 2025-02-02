/*
 * @Author: Anixuil
 * @Date: 2024-07-27 17:17:48
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-09-30 09:29:39
 * @Description: 导入components文件夹下的所有组件
 * 批量导入 import.meta.glob("./**转义\/*.vue", { eager: true });
 * import.meta.glob(pattern: string, eager: boolean)
 * pattern: 匹配规则
 * eager: 是否立即加载
*/
import { App } from "vue";

// 返回一个对象，对象的键是匹配到的文件名，值是一个函数，调用函数会返回一个Promise，Promise的结果是一个模块对象
const imporFn: Record<string, object> = import.meta.glob("./**/index.vue", { eager: true });
// console.log('components',imporFn) // 打印出所有匹配的文件名

export default {
    install(app: App<Element>) {
        // 批量注册全局组件
        Object.keys(imporFn).forEach((fileName) => {
            // 获取组件配置
            const componentConfig: Record<string, object & { name?: string }> = imporFn[fileName] as Record<string, object>;
            // 获取组件的 PascalCase 命名
            const componentName = componentConfig.default.name as string;
            // 全局注册组件
            app.component(componentName, componentConfig.default || componentConfig);
        });
    },
};