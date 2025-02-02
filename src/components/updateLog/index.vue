<!--
 * @Author: Anixuil
 * @Date: 2025-01-21 15:32:50
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-02 12:35:26
 * @Description: 更新日志
-->
<template>
    <Transition name="update-log">
        <div class="views-common-wrapper update-log-wrapper" v-if="isFirstRunVal">
            <div class="card">
                <div data-position="top" class="carousel">
                    <span class="carousel__text">- UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG -
                        UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG
                        -</span>
                </div>
                <div class="card-top">
                    <div class="image">
                        <svg t="1737446301565" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="4224" width="24" height="24">
                            <path
                                d="M511.330783 1018.384907a510.462996 510.462996 0 0 1-472.178271-313.730557A508.268005 508.268005 0 0 1 149.157287 149.474795a511.381829 511.381829 0 0 1 556.404666-110.77047A509.186838 509.186838 0 0 1 1020.925992 509.198069c0.204185 280.958833-227.921728 508.931607-509.595209 509.186838z m200.560911-605.766437l-160.489566-160.030149a56.814531 56.814531 0 0 0-80.14269 0L310.718826 412.61847a56.508254 56.508254 0 0 0 0 80.040598 56.814531 56.814531 0 0 0 80.244783 0l63.603689-63.450551v306.277798a56.661393 56.661393 0 0 0 56.661392 56.610346 56.661393 56.661393 0 0 0 56.763486-56.610346v-306.277798l63.552643 63.399504a56.814531 56.814531 0 0 0 94.946117-25.318964 56.508254 56.508254 0 0 0-14.650288-54.619541z"
                                p-id="4225"></path>
                        </svg>
                    </div>
                    <span class="title">更新日志 v1.0.1</span>
                </div>
                <p class="paragraph">
                    <el-tag type="success">更新</el-tag><br />
                    1、新增更新日志功能<br>
                    2、新增主题切换功能<br>
                    <el-tag type="danger">修复</el-tag><br />
                    1、修复并优化部分样式<br>
                    2、优化侧边栏交互逻辑<br>
                </p>
                <div data-direction="right" data-position="bottom" class="carousel">
                    <span class="carousel__text">- UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG -
                        UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG - UPDATE LOG
                        -</span>
                </div>
            </div>
            <div class="card-bottom">
                <el-button style="width: 100%;" type="primary" @click="closeUpdateLog">开始体验</el-button>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
defineOptions({
    name: 'updateLog'
})

const isFirstRunVal = ref(false)

onMounted(() => {
    setTimeout(() => {
        isFirstRun()
    }, 1000)
})

// 向主进程询问是否是第一次运行
const isFirstRun = () => {
    window.ipcRenderer.invoke('is-first-run').then((res: any) => {
        isFirstRunVal.value = res || false
    })
}

// 监听更新日志
window.ipcRenderer.on('update-log', (event, params) => {
    switch (params.mode) {
        case 'open':
            isFirstRunVal.value = true
            break;
    }
})

// 关闭更新日志
const closeUpdateLog = () => {
    isFirstRunVal.value = false
}
</script>

<style scoped lang="scss">
.views-common-wrapper .update-log-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: auto;
    max-width: 500px;
    min-height: 250px;
    border-radius: 10px;
    // overflow: hidden;
    @include ani-theme('background-color', 'cardBgColor');
    @include ani-theme('color', 'color');
    @include ani-theme('box-shadow', 'boxShadow');
    font-family: 'Arial', sans-serif;
    padding: 0;
    transition: all 0.5s ease;
    box-sizing: border-box;
    z-index: 9;
    border: 1px solid;
    @include ani-theme('border-color', 'primaryColor');

    .card-bottom {
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 20px;
        border-radius: 0px 0px 10px 10px;
        overflow: hidden;
        z-index: -1;
        transition: all 0.5s ease;
        @include ani-theme('border-color', 'primaryColor');
    }

    &:hover {
        & {
            border-radius: 10px 10px 0 0;
            border-top: 3px solid;
            border-left: 3px solid;
            border-right: 3px solid;
            @include ani-theme('border-color', 'primaryColor');
        }

        .card {
            border-radius: 10px 10px 0 0;
        }

        .card-bottom {
            transform: translate(-50%, 100%);
            border-left: 3px solid;
            border-right: 3px solid;
            border-bottom: 3px solid;
            @include ani-theme('border-color', 'primaryColor');
        }
    }

}

// 动画
.update-log-enter-active,
.update-log-leave-active {
    transition: all 0.5s ease;
}

.update-log-enter-from,
.update-log-leave-to {
    opacity: 0;
}

.card {
    --lime-500: #bdd910;
    @include ani-theme('--violet-700', 'primaryColor');
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    padding: 35px;
    width: 100%;
    height: 100%;
    min-height: 16rem;
    background-color: var(--lime-500);
    border-radius: 10px;
}

.card::before {
    content: "";
    position: absolute;
    top: 7rem;
    right: 2rem;

    width: 1.25rem;
    aspect-ratio: 1 / 1;
    background-color: var(--violet-700);

    border-radius: 9999px;
}

.card::after {
    content: "";
    position: absolute;
    top: 8.75rem;
    right: -0.5rem;

    width: 3rem;
    aspect-ratio: 1 / 1;
    background-color: var(--violet-700);

    border-radius: 9999px;
}

.card .carousel {
    position: absolute;
    left: 0;
    user-select: none;
    animation: carousel 10s linear var(--carousel_direction, normal) infinite;
    background: linear-gradient(90deg,
            rgba(64, 158, 255, 0.05) 0%,
            rgba(64, 158, 255, 0.1) 50%,
            rgba(64, 158, 255, 0.05) 100%);
}

.card .carousel[data-direction="right"] {
    --carousel_direction: reverse;
}

.card .carousel[data-position="top"] {
    top: 10px;
}

.card .carousel[data-position="bottom"] {
    bottom: 10px;
}

.card .carousel .carousel__text {
    font-size: 0.75rem;
    // color: black;
    text-wrap: nowrap;
    background: linear-gradient(45deg,
            var(--el-color-primary) 0%,
            var(--el-color-primary-light-3) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
    text-transform: uppercase;
    padding: 0 5px;
    font-style: italic;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0px;
    opacity: 0.5;
}

@keyframes carousel {
    to {
        transform: translate(-50%);
    }
}

.card {
    .card-top {
        display: flex;
        align-items: center;
        gap: 10px;

        .image {
            position: relative;
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
            width: fit-content;
            aspect-ratio: 1 / 1;
            @include ani-theme('background-color', 'cardBgColor');
            border-radius: 50%;
        }
    }
}

.card .image svg {
    width: 1.5rem;
    fill: white;

    @include ani-theme('fill', 'primaryColor');
}

.card .title {
    position: relative;
    z-index: 10;

    font-size: 1rem;
    // color: black;
    font-weight: bold;
}

.card .paragraph {
    position: relative;
    z-index: 10;
    padding-right: 0.25rem;
    font-size: 0.75rem;
    line-height: 2.5;
    // color: black;
}
</style>