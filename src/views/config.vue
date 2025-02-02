<!--
 * @Author: Anixuil
 * @Date: 2024-12-29 17:53:19
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-29 20:16:53
 * @Description: 设置页面
-->
<template>
    <div class="views-common-wrapper">
        绝赞开发中...
    </div>
</template>

<script setup lang="ts">
onMounted(() => {
    
})

// 获取nvm信息 nvm的版本 nvm的路径 node的版本 npm的版本 node的镜像源 npm的镜像源
const nvmInfo = reactive({
    nvmVersion: '',
    nvmPath: '',
    nodeVersion: '',
    npmVersion: '',
    nvmRegistry: ''
})
const getNvmInfo = () => {
    
}
</script>

<style scoped lang="scss">

</style>