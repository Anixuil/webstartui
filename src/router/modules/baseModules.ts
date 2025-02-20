/*
 * @Author: Anixuil
 * @Date: 2024-12-27 09:51:15
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-19 08:56:47
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
    },
    {
        path: '/chat',
        name: 'Chat',
        component: () => import('@views/chat.vue'),
        meta: {
            title: '聊天',
            transition: 'common-fade'
        }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@views/about.vue'),
        meta: {
            title: '关于',
            transition: 'common-fade'
        }
    }
]