<template>
  <div class="views-common-wrapper">
    <router-view v-slot="{ Component }">
      <Transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import useCommonStore from './store/modules/common';
import { getScreenInfo } from './utils';

const route = useRoute()
// 处理 直接在模板中使用route.meta.transition 或者 route.meta.transition as string 爆红或者报错的问题
const transitionName = computed(() => {
  return route.meta.transition as string || ''
})

const { setScreenInfo } = useCommonStore();

// 初始化
onMounted(() => {
  nextTick(() => {
    handleResize()
    type ResizeTimer = ReturnType<typeof setTimeout>
    let resizeTimer: ResizeTimer | null = null
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        handleResize()
      }, 50)
    })
  })
})

// 全局窗口变化处理
const handleResize = () => {
  setScreenInfo(getScreenInfo())
}

</script>

<style scoped lang="scss">
.views-common-wrapper {
  margin: 0 auto;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>