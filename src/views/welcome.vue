<!--
 * @Author: Anixuil
 * @Date: 2024-12-27 09:52:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-27 14:12:39
 * @Description: 首页
-->
<template>
    <div class="views-common-wrapper">
        <span>
            <span class="title">WebStartUI</span>
            <span class="version"> 内测版</span>
        </span>
        <el-button type="primary" @click="goHome">即刻体验</el-button>
    </div>
</template>

<script setup lang="ts">
const { push } = useRouter()
const goHome = () => {
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