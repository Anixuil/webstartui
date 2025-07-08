<!--
 * @Author: Anixuil
 * @Date: 2024-12-27 09:52:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-02 10:47:31
 * @Description: 首页
-->
<template>
    <div class="views-common-wrapper">
        <span>
            <span class="title">WebStartUI</span>
            <span class="version"> v1.0.3</span>
        </span>
        <el-button type="primary" @click="goHome">即刻体验</el-button>
    </div>
</template>

<script setup lang="ts">
import useCommonStore from '@/store/modules/common';

const { push } = useRouter()
const store = useCommonStore()
const goHome = () => {
    // 设置当前侧边栏索引
    store.setCurrentMenuSideBarIndex(0)
    push({ name: 'Index' })
}
</script>

<style scoped lang="scss">
.views-common-wrapper {
    user-select: none;
}

.title {
    font-size: 44px;
    font-weight: bold;
    // 彩虹渐变字体
    background: linear-gradient(45deg, #f3ec78, #af4261, #577399, #2b4f72, #0a2e3d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-style: italic;
    box-sizing: border-box;
    padding: 0 5px;
}

.version {
    font-size: 12px;
    color: #666;
}
</style>