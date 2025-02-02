<template>
    <div class="log-info-wrapper">
        <div class="status-header">
            <span class="project-name">项目：{{ projectInfo.projectName }}</span>
            <span class="port-info">端口：{{ currentPort }}</span>
            <el-tag :type="latestStatus ? 'success' : 'danger'" class="status-tag">
                {{ latestStatus ? '运行中' : '已停止' }}
            </el-tag>
        </div>

        <!-- 端口状态日志 -->
        <!-- <div class="log-section">
            <div class="section-title">端口状态日志</div>
            <el-table :data="portLogList" style="width: 100%" stripe height="300"
                :default-sort="{ prop: 'time', order: 'descending' }" class="custom-table">
                <el-table-column label="内存使用" width="200">
                    <template #default="{ row }">
                        <div>已用: {{ row.memoryUsage.heapUsed }}</div>
                        <div>总量: {{ row.memoryUsage.heapTotal }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="cpuUsage" label="CPU 使用率" minWidth="140" sortable>
                    <template #default="{ row }">
                        <el-progress :percentage="row.cpuUsage" :color="customColors" />
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="时间" width="200" sortable fixed="left" />
            </el-table>
        </div> -->

        <!-- 项目运行日志 -->
        <div class="log-section">
            <div class="section-title">
                <span>项目运行日志</span>
                <span class="log-btn">
                    <!-- 开始监听 -->
                    <el-tooltip content="开始监听" placement="top">
                        <el-button text v-show="!logWatchStatus" type="primary" @click="startListen">
                            <el-icon>
                                <VideoPlay />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                    <!-- 停止监听 -->
                    <el-tooltip content="停止监听" placement="top">
                        <el-button text v-show="logWatchStatus" type="primary" @click="stopListen">
                            <el-icon>
                                <VideoPause />
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </span>
            </div>
            <div class="log-content" ref="logContentRef">
                <pre class="log-text" v-html="formattedLogs"></pre>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'

defineOptions({
    name: 'logInfo'
})

const props = defineProps<{
    projectInfo: Form
}>()

const $emit = defineEmits(['refreshData'])

interface MemoryUsage {
    heapUsed: number
    heapTotal: number
}

interface PortLogItem {
    port: number
    status: boolean
    memoryUsage: {
        heapUsed: string
        heapTotal: string
    }
    time: string
    cpuUsage: number
}

interface ProcessLogItem {
    port: number
    data: string
    time: string
}

const portLogList = ref<PortLogItem[]>([])
const processLogList = ref<ProcessLogItem[]>([])
const logContentRef = ref<HTMLElement | null>(null)
const currentPort = computed(() => props.projectInfo.projectPort || '-')
const latestStatus = computed(() => Number(props.projectInfo.projectStatus) == 0 ? false : true)

const formatMemory = (bytes = 0): string => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

const debounce = (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout | null = null
    return function (this: unknown, ...args: any[]) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

const customColors = [
    { color: '#67c23a', percentage: 20 },  // 绿色 - 低负载
    { color: '#409eff', percentage: 40 },   // 蓝色 - 正常负载
    { color: '#e6a23c', percentage: 60 },   // 橙色 - 中等负载
    { color: '#f56c6c', percentage: 80 },   // 红色 - 高负载
    { color: '#ff0000', percentage: 100 },  // 深红色 - 极高负载
]

// 添加定时器引用
let logUpdateTimer: NodeJS.Timeout | null = null;
const logWatchStatus = ref(false)   // 日志监听状态

// 使用单个字符串存储日志
const logContent = ref('');
const lastPosition = ref(0);

// 格式化日志文本
const formatLogText = (text: string) => {
    if (!text) return '';
    
    // 处理特殊字符
    const escapedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    // 处理控制台颜色
    const colorMap: { [key: string]: string } = {
        '31': '#f56c6c', // 红色
        '32': '#67c23a', // 绿色
        '33': '#e6a23c', // 黄色
        '34': '#409eff', // 蓝色
        '35': '#f56cf0', // 粉色
        '36': '#67e0e3', // 青色
        '37': '#ffffff', // 白色
    };

    // 替换ANSI颜色代码为span标签
    return escapedText.replace(/\x1B\[(\d+)m(.*?)(?=\x1B|\n|$)/g, (_, color, content) => {
        const textColor = colorMap[color] || '#fff';
        return `<span style="color: ${textColor}">${content}</span>`;
    });
};

// 计算格式化后的日志
const formattedLogs = computed(() => {
    return formatLogText(logContent.value);
});

// 优化滚动到底部函数
const scrollToBottom = debounce(async () => {
    await nextTick()
    if (logContentRef.value) {
        logContentRef.value.scrollTo({
            top: logContentRef.value.scrollHeight,
            behavior: 'smooth'
        });
    }
}, 100);

// 优化更新日志的方法
const updateProjectLog = async () => {
    try {
        const { content, position } = await window.ipcRenderer.invoke('readProjectLog', {
            projectName: props.projectInfo.projectName,
            lastPosition: lastPosition.value
        });

        if (content) {
            lastPosition.value = position;
            
            const isScrolledToBottom = logContentRef.value && 
                (logContentRef.value.scrollHeight - logContentRef.value.scrollTop <= logContentRef.value.clientHeight + 50);

            // 追加新内容
            logContent.value += content;

            // 限制日志长度
            const maxLines = 1000;
            const lines = logContent.value.split('\n');
            if (lines.length > maxLines) {
                logContent.value = lines.slice(-maxLines).join('\n');
            }

            if (isScrolledToBottom) {
                scrollToBottom();
            }
        }
    } catch (error) {
        console.error('更新日志失败:', error);
    }
};

// 添加事件监听器引用
const portStatusListener = (event: any, data: any) => {
    const { port, status, memoryUsage, cpuUsage } = data
    portLogList.value.unshift({
        port,
        status,
        memoryUsage: {
            heapUsed: formatMemory(memoryUsage?.heapUsed),
            heapTotal: formatMemory(memoryUsage?.heapTotal)
        },
        time: new Date().toLocaleString(),
        cpuUsage
    })

    if (portLogList.value.length > 100) {
        portLogList.value = portLogList.value.slice(0, 100)
    }
}

// 修改窗口大小变化监听函数
const updateLogContentHeight = () => {
    if (logContentRef.value) {
        const wrapper = document.querySelector('.log-info-wrapper') as HTMLElement;
        if (wrapper) {
            const wrapperRect = wrapper.getBoundingClientRect();
            const headerHeight = wrapper.querySelector('.status-header')?.getBoundingClientRect().height || 50;
            const titleHeight = wrapper.querySelector('.section-title')?.getBoundingClientRect().height || 34;
            const padding = 20;
            
            // 计算可用高度时考虑父容器的限制
            const parentHeight = wrapper.parentElement?.getBoundingClientRect().height || 0;
            const maxHeight = parentHeight > 0 ? parentHeight - padding : wrapperRect.height;
            const availableHeight = maxHeight - headerHeight - titleHeight - padding;
            
            logContentRef.value.style.height = `${Math.max(300, availableHeight)}px`;
            
            // 确保wrapper不超出父容器
            wrapper.style.maxHeight = `${maxHeight}px`;
            wrapper.style.overflow = 'hidden';
        }
    }
};

// 修改onMounted钩子
onMounted(() => {
    if (logContentRef.value) {
        // 初始设置高度
        updateLogContentHeight();
        
        // 添加窗口大小变化监听
        const resizeObserver = new ResizeObserver(() => {
            updateLogContentHeight();
        });
        
        // 监听整个wrapper的大小变化
        const wrapper = document.querySelector('.log-info-wrapper');
        if (wrapper) {
            resizeObserver.observe(wrapper);
        }
        
        // 初始读取日志
        updateProjectLog();
        
        // 如果latestStatus为true,则开始监听
        if (latestStatus.value) {
            startListen();
        }

        // 添加事件监听
        window.ipcRenderer.on('port-status', portStatusListener);
        
        // 组件卸载时清理
        onUnmounted(() => {
            resizeObserver.disconnect();
            if (logUpdateTimer) {
                clearInterval(logUpdateTimer);
                logUpdateTimer = null;
            }
            window.ipcRenderer.off('port-status', portStatusListener);
            lastPosition.value = 0;
        });
    }
});

// 每5秒刷新一次
const refreshLog = () => {
    logUpdateTimer = setInterval(updateProjectLog, 1000);
}

// 开始监听
const startListen = () => {
    logWatchStatus.value = true;
    // 更频繁但更小批量地更新
    logUpdateTimer = setInterval(updateProjectLog, 1000);
}

// 停止监听
const stopListen = () => {
    logWatchStatus.value = false;
    lastPosition.value = 0;
    if (logUpdateTimer) {
        clearInterval(logUpdateTimer);
        logUpdateTimer = null;
    }
}

</script>

<style scoped lang="scss">
.log-info-wrapper {
    padding: 10px;
    height: 100%;
    max-height: 100%; // 限制最大高度
    display: flex;
    flex-direction: column;
    overflow: hidden; // 防止wrapper出现滚动条

    .status-header {
        flex-shrink: 0;
        margin-bottom: 15px;

        .project-name {
            font-size: 16px;
            font-weight: bold;
            margin-left: 10px;
            margin-right: 10px;
        }

        .port-info {
            font-size: 16px;
            font-weight: bold;
            margin-right: 15px;
        }

        .status-tag {
            font-size: 14px;
        }
    }

    .log-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0; // 重要：允许内容区域收缩
        overflow: hidden; // 防止section出现滚动条

        .section-title {
            flex-shrink: 0;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: bold;
            color: #606266;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .log-btn {
                box-sizing: border-box;
            }
        }

        .log-content {
            flex: 1;
            min-height: 200px; // 降低最小高度以适应小窗口
            max-height: calc(100vh - 150px); // 限制最大高度
            overflow-y: auto; // 只在日志内容区域显示滚动条
            overflow-x: hidden; // 防止水平滚动条
            background-color: #1e1e1e;
            color: #fff;
            padding: 10px;
            font-family: monospace;
            border-radius: 4px;
            position: relative;
            
            // 优化滚动行为
            scroll-behavior: smooth;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;

            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            &::-webkit-scrollbar-thumb {
                background: #666;
                border-radius: 4px;
                transition: background-color 0.2s;
                
                &:hover {
                    background: #888;
                }
            }

            &::-webkit-scrollbar-track {
                background: #333;
            }

            .log-text {
                margin: 0;
                padding-bottom: 10px; // 添加底部内边距，防止内容贴边
                white-space: pre-wrap;
                word-break: break-word;
                line-height: 1.5;
                font-family: monospace;

                ::v-deep(span) {
                    font-family: monospace;
                }
            }
        }
    }

    .custom-table {
        :deep(.el-table__body-wrapper::-webkit-scrollbar) {
            width: 8px;
            height: 8px;
        }

        :deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
            background: #ddd;
            border-radius: 4px;
        }

        :deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
            background: #f5f5f5;
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 确保弹窗内部不出现滚动条
:deep(.el-dialog__body) {
    overflow: hidden !important;
}
</style>