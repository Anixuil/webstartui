<!--
 * @Author: Anixuil
 * @Date: 2024-12-29 17:57:15
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-02 12:29:45
 * @Description: 侧边栏
-->
<template>
    <div class="views-common-wrapper side-bar" @click.stop="drawerVisible = true">
        <!-- 菜单图标 -->
        <el-icon style="font-size: 20px;">
            <Menu />
        </el-icon>
        <el-drawer v-model="drawerVisible" direction="ltr" size="250">
            <!-- <template #header>WebStartUI Nav</template> -->
            <template #default>
                <div class="sidebar-container">
                    <ul class="menu-wrapper">
                        <li v-for="(item, index) in menuList" :key="index"
                            :class="['menu-item', currentMenuIndex === index && 'active']" @click="goMenu(index)">
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>
                                {{ item.name }}
                            </span>
                        </li>
                    </ul>
                    <div class="sidebar-footer">
                        <el-tooltip content="切换主题" placement="top">
                            <label class="switch">
                                <span @click="toggleTheme"
                                    :class="['slider', globalTheme === 'light' && 'active']"></span>
                            </label>
                        </el-tooltip>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import useCommonStore from '@/store/modules/common'

defineOptions({
    name: 'sideBar'
})
const router = useRouter()
const drawerVisible = ref(false)
const menuList = ref([
    {
        name: '项目管理',
        path: '/index',
        icon: 'List'
    },
    // {
    //     name: '环境设置',
    //     path: '/config',
    //     icon: 'Setting'
    // },
    {
        name: '关于',
        path: '/about',
        icon: 'InfoFilled'
    }
])

const store = useCommonStore()
const currentMenuIndex = computed(() => store.getCurrentMenuSideBarIndex)

const goMenu = (index: number) => {
    const path = menuList.value[index].path
    store.setCurrentMenuSideBarIndex(index)
    drawerVisible.value = false
    router.push(path)
}

const globalTheme = computed(() => store.getGlobalTheme)
// 切换主题
const toggleTheme = () => {
    store.setGlobalTheme(globalTheme.value === 'dark' ? 'light' : 'dark')
}
</script>

<style scoped lang="scss">
.views-common-wrapper.side-bar {
    position: fixed;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 10px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    z-index: 5;
    transition: all 0.3s;
    @include ani-theme("color", "color");
    background-color: transparent;

    &:hover {
        @include ani-theme('color', 'hoverColor');
        @include ani-theme("background-color", "hoverBgColor");
    }

    ::v-deep(.el-drawer__body) {
        padding: 0;
    }

    .sidebar-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        box-sizing: border-box;
        padding: 0 0 10px 0;

        .menu-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            list-style: none;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            gap: 10px;

            .menu-item {
                width: 75%;
                height: 50px;
                border-radius: 10px;
                margin: 0;
                gap: 10px;
                box-sizing: border-box;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s;
                @include ani-theme("color", "color");

                &:hover,
                &.active {
                    @include ani-theme('color', 'hoverColor');
                    @include ani-theme("background-color", "hoverBgColor");
                }
            }
        }

        .sidebar-footer {
            box-sizing: border-box;
            padding: 0 10px;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            /* From Uiverse.io by alexruix */
            /* The switch - the box around the slider */
            .switch {
                font-size: 17px;
                position: relative;
                display: inline-block;
                width: 50px;
                height: 25px;
            }

            /* Hide default HTML checkbox */
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            /* The slider */
            .slider {
                --background: #28096b;
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--background);
                transition: .5s;
                border-radius: 30px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                border-radius: 50%;
                left: 10%;
                bottom: 10%;
                box-shadow: inset 8px -4px 0px 0px #fff000;
                background: var(--background);
                transition: .5s;
            }

            .slider.active {
                // background-color: #522ba7;
                @include ani-theme("background-color", "hoverBgColor");
            }

            .slider.active:before {
                transform: translateX(100%);
                box-shadow: inset 15px -4px 0px 15px #fff000;
            }

            // input:checked+.slider {
            //     background-color: #522ba7;
            // }

            // input:checked+.slider:before {
            //     transform: translateX(100%);
            //     box-shadow: inset 15px -4px 0px 15px #fff000;
            // }
        }
    }

}
</style>