<!--
 * @Author: Anixuil
 * @Date: 2025-01-01 15:30:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-20 23:05:39
 * @Description: 请填写简介
-->
<template>
    <div class="about-wrapper">
        <div class="glass-card">
            <div class="version-section">
                <el-button @click="update" type="primary" class="update-btn">检查更新 当前版本 v1.0.3</el-button>
                <el-button @click="updateLog" text type="primary" class="log-btn">查看更新日志</el-button>
            </div>
            <div class="links-section">
                <el-link href="https://github.com/Anixuil/webstartui" target="_blank" class="github-link">
                    <i class="el-icon-github"></i>
                    Github
                </el-link>
            </div>
            <div class="footer-section">
                Power by 
                <el-link href="https://www.anixuil.top" target="_blank" class="author-link">ANIXUIL</el-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const update = () => {
    window.ipcRenderer.invoke('auto-check-update');
}
const updateLog = () => {
    window.ipcRenderer.send('update-log', { mode: 'open' });
}

// 添加鼠标移动跟踪
const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
};

onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped lang="scss">
@use "@/styles/modules/theme/mixins.scss" as *;

.about-wrapper {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
    overflow-x: hidden;
    @include ani-theme("background-color", "bgColor");

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            var(--ani-primary-dark-color) 0%,
            transparent 50%
        );
        opacity: 0.05;
        z-index: 0;
        transition: opacity 0.3s ease;
    }

    &:hover::before {
        opacity: 0.1;
    }

    .glass-card {
        position: relative;
        z-index: 1;
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 40px 20px;
        width: 100%;
        max-width: 400px;
        min-width: 280px;
        display: flex;
        flex-direction: column;
        gap: 30px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        @include ani-theme("color", "color");
        @include ani-theme("background-color", "cardBgColor");
        @include ani-theme("border", "border");
        @include ani-theme("box-shadow", "boxShadow");
        
        &:hover {
            transform: translateY(-5px);
        }
        
        @media screen and (max-width: 480px) {
            padding: 30px 15px;
        }
        
        .version-section {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
            width: 100%;

            .update-btn {
                width: 80%;
                max-width: 300px;
                min-width: 200px;
                height: 40px;
                border-radius: 20px;
                font-weight: 500;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 0 20px;
                @include ani-theme("color", "btColor");
                @include ani-theme("background-color", "btBgColor");
                position: relative;
                isolation: isolate;
                
                &::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    @include ani-theme("background-color", "primaryColor");
                    opacity: 0.1;
                    z-index: -1;
                }
                
                &::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    border: 1px solid;
                    @include ani-theme("border-color", "primaryColor");
                    opacity: 0.3;
                }
                
                &:hover {
                    transform: translateY(-2px);
                    @include ani-theme("background-color", "primaryColor");
                    @include ani-theme("color", "btColor");
                    @include ani-theme("box-shadow", "boxShadow");
                    
                    &::before {
                        opacity: 0;
                    }
                    
                    &::after {
                        opacity: 1;
                    }
                }
            }

            .log-btn {
                @include ani-theme("color", "primaryColor");
                position: relative;
                
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 1px;
                    @include ani-theme("background-color", "primaryColor");
                    transition: width 0.3s ease;
                }
                
                &:hover::after {
                    width: 100%;
                }
            }
        }

        .links-section {
            text-align: center;
            width: 100%;
            
            .github-link {
                font-size: 16px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.4s ease;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                @include ani-theme("color", "color");
                
                &:hover {
                    transform: scale(1.05);
                    @include ani-theme("color", "primaryColor");
                }
            }
        }

        .footer-section {
            text-align: center;
            @include ani-theme("color", "secondaryColor");
            font-size: 14px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            
            .author-link {
                font-weight: 500;
                display: inline-block;
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                vertical-align: bottom;
                @include ani-theme("color", "color");
                transition: all 0.4s ease;
                
                &:hover {
                    @include ani-theme("color", "primaryColor");
                }
            }
        }
    }
}
</style>