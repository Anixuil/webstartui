/*
 * @Author: Anixuil
 * @Date: 2024-12-27 09:51:15
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-29 17:54:25
 * @Description: 基本路由模块
 */
export default [
    {
        path: '/',
        redirect: '/welcome'
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@views/welcome.vue'),
        meta: {
            title: '欢迎页',
            transition: 'common-fade'
        }
    },
    {
        path: '/index',
        alias: '/home',
        name: 'Index',
        component: () => import('@views/index.vue'),
        meta: {
            title: '首页',
            transition: 'common-fade'
        }
    },
    {
        path: '/config',
        name: 'Config',
        component: () => import('@views/config.vue'),
        meta: {
            title: '环境配置',
            transition: 'common-fade'
        }
    }
]