<!--
 * @Author: Anixuil
 * @Date: 2024-12-29 17:57:15
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-02 11:25:10
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
}
</style>