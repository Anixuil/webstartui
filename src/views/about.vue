<!--
 * @Author: Anixuil
 * @Date: 2025-01-01 15:30:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-01-21 17:47:13
 * @Description: 请填写简介
-->
<template>
    <div class="views-common-wrapper">
        <el-button @click="update" type="primary">检查更新 当前版本 v1.0.1</el-button>
        <el-button @click="updateLog" text type="primary">查看更新日志</el-button>
        <el-link href="https://github.com/Anixuil/webstartui" target="_blank">Github</el-link>
    </div>
</template>

<script setup lang="ts">
const update = () => {
    window.ipcRenderer.invoke('auto-check-update');
}
const updateLog = () => {
    window.ipcRenderer.send('update-log', { mode: 'open' });
}
</script>

<style scoped lang="scss">
.views-common-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
}
</style>