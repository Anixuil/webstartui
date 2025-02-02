<!--
 * @Author: Anixuil
 * @Date: 2025-01-01 14:59:05
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-01-21 17:58:16
 * @Description: 自动更新组件
-->
<template>
    <Transition name="fade-in">
        <div v-if="isShow" class="views-common-wrapper check-update-wrapper">
            <div class="check-update-container">
                <div class="check-update-container-one">
                    <div class="check-update-container-title">
                        <!-- 三行滚动文本 -->
                        <div class="scroll-line line1">
                            <div class="scroll-content">
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                            </div>
                        </div>
                        <div class="scroll-line line2">
                            <div class="scroll-content">
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                            </div>
                        </div>
                        <div class="scroll-line line3">
                            <div class="scroll-content">
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                                <span>{{ updateText }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="check-update-container-content" v-show="active">
                        <span>发现新版本，是否立即更新？</span>
                        <div class="check-update-container-content-btn">
                            <el-button type="primary" @click="update">现在更新</el-button>
                            <el-button type="primary" @click="isShow = false">稍后更新</el-button>
                        </div>
                    </div>
                    <div class="check-update-container-update" v-show="updateLoading">
                        <span>系统更新中，请勿退出...</span>
                        <el-progress :percentage="updateProgress" striped striped-flow :stroke-width="15"
                            :duration="duration" />
                        <el-button type="primary" @click="updateCancel">取消更新</el-button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';

defineOptions({
    name: 'checkUpdate'
})

onMounted(() => {
    initCheckUpdate();
})

const updateText = ref('NEW VERSION');
const isShow = ref(false);  // 是否显示
const active = ref(true);  // 是否更新
const updateLoading = ref(false);  // 是否正在更新
const updateProgress = ref(0);  // 更新进度
const duration = computed(() => {
    return Math.floor(updateProgress.value / 10);
})

// 监听更新
const initCheckUpdate = () => {
    updateText.value = 'NEW VERSION';
    window.ipcRenderer.on('web-update-message', (event, data: { state?: number, msg?: string, percent?: number }) => {
        console.log('update-message', data);
        if (data?.state || data?.state === 0) {
            switch (data.state) {
                case 0:
                    // 如果data.message中有500，则什么都不显示
                    if (data.msg && data.msg.indexOf('500') === -1) {
                        updateText.value = 'NEW VERSION';
                        updateProgress.value = 0;
                        updateLoading.value = false;
                        isShow.value = false;
                        active.value = true;
                        ElMessage.error(data.msg);
                    }
                    break;
                case 1:
                    break;
                case 2:
                    isShow.value = true;
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    ElMessage.info('已是最新版本');
                    break;
            }
        } else if (data?.percent || data?.percent === 0) {
            console.log('percent', data.percent);
            updateProgress.value = Number(data.percent.toFixed(0));
        }
    })
    setTimeout(() => {
        checkUpdate();
    }, 1000);
}

// 发起更新检测
const checkUpdate = () => {
    window.ipcRenderer.invoke('auto-check-update').then((res: any) => {
        console.log('auto-check-update', res);
    });
}

// 更新
const update = () => {
    window.ipcRenderer.invoke('auto-update').then((res: any) => {
        console.log('auto-update', res);
        active.value = false;
        updateLoading.value = true;
        updateProgress.value = 0;
        updateText.value = 'UPDATING';
    })
}

// 取消更新
const updateCancel = () => {
    window.ipcRenderer.invoke('auto-update-cancel').then((res: any) => {
        console.log('auto-update-cancel', res);
        updateLoading.value = false;
        updateProgress.value = 0;
        updateText.value = 'NEW VERSION';
        isShow.value = false;
        active.value = true;
    })
}

</script>

<style scoped lang="scss">
.views-common-wrapper .check-update-wrapper {
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    max-height: 150px;
    transform: translate(-50%, -50%);
    z-index: 10;
    @include ani-theme('background-color', 'bgColor');
    @include ani-theme('box-shadow', 'boxShadow');
    border-radius: 20px;
    transition: all .3s ease;

    .check-update-container {
        box-sizing: border-box;
        padding: 20px;
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        @include ani-theme('background-color', 'bgColor');

        .check-update-container-one {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
            padding: 10px 0;

            .check-update-container-title {
                user-select: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                padding: 0;
                z-index: 1;
                pointer-events: none;

                .scroll-line {
                    height: 33.33%;
                    position: relative;
                    overflow: hidden;

                    &::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg,
                                rgba(64, 158, 255, 0.05) 0%,
                                rgba(64, 158, 255, 0.1) 50%,
                                rgba(64, 158, 255, 0.05) 100%);
                        z-index: 1;
                    }

                    .scroll-content {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: fit-content;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        white-space: nowrap;
                        animation: scrollText 8s linear infinite;
                        opacity: 0.15;

                        span {
                            display: inline-block;
                            padding: 0 5px;
                            font-style: italic;
                            font-size: 24px;
                            font-weight: 800;
                            letter-spacing: 0px;
                            text-transform: uppercase;
                            background: linear-gradient(45deg,
                                    var(--el-color-primary) 0%,
                                    var(--el-color-primary-light-3) 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            text-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
                        }
                    }

                    &.line1 {
                        .scroll-content {
                            animation-direction: normal;
                        }
                    }

                    &.line2 {
                        .scroll-content {
                            animation-direction: reverse;
                            opacity: 0.1;
                        }
                    }

                    &.line3 {
                        .scroll-content {
                            animation-direction: normal;
                        }
                    }
                }
            }

            .check-update-container-content {
                position: relative;
                z-index: 2;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 20px;
                flex: 1;
            }

            .check-update-container-update {
                flex: 1;
                min-width: 400px;
                position: relative;
                z-index: 2;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 10px;

                .el-progress--line {
                    width: 100%;
                }
            }
        }
    }
}

// 动画
.fade-in-enter-active,
.fade-in-leave-active {
    transition: all .3s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
    left: 200%;
    opacity: 0;
}

@keyframes scrollText {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}
</style>