<template>
    <div class="log-info-wrapper">
        <div class="status-header">
            <span class="port-info">端口：{{ currentPort }}</span>
            <el-tag :type="latestStatus ? 'success' : 'danger'" class="status-tag">
                {{ latestStatus ? '运行中' : '已停止' }}
            </el-tag>
        </div>

        <!-- 端口状态日志 -->
        <div class="log-section">
            <div class="section-title">端口状态日志</div>
            <el-table :data="portLogList" style="width: 100%" stripe height="200"
                :default-sort="{ prop: 'time', order: 'descending' }" class="custom-table">
                <el-table-column label="内存使用" width="180">
                    <template #default="{ row }">
                        <div>已用: {{ row.memoryUsage.heapUsed }}</div>
                        <div>总量: {{ row.memoryUsage.heapTotal }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="cpuUsage" label="CPU 使用率" width="140" sortable>
                    <template #default="{ row }">
                        <el-progress :percentage="row.cpuUsage" :color="customColors" />
                    </template>
                </el-table-column>
                <el-table-column prop="data" label="输出信息" show-overflow-tooltip />
                <el-table-column prop="time" label="时间" width="200" sortable fixed="left" />
            </el-table>
        </div>

        <!-- 项目运行日志 -->
        <div class="log-section">
            <div class="section-title">项目运行日志</div>
            <div class="log-content" ref="logContentRef">
                <div v-for="(log, index) in processLogList" :key="index" class="log-line">
                    <span class="log-time">[{{ log.time }}]</span>
                    <span class="log-text">{{ log.data }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

defineOptions({
    name: 'logInfo'
})

interface MemoryUsage {
    heapUsed: number
    heapTotal: number
}

interface PortLogItem {
    port: number
    status: boolean
    data: string
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
const currentPort = computed(() => portLogList.value[0]?.port || '-')
const latestStatus = computed(() => portLogList.value[0]?.status)

const formatMemory = (bytes = 0): string => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

const debounce = (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout | null = null
    return function(this: unknown, ...args: any[]) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

const scrollToBottom = debounce(async () => {
    await nextTick()
    if (logContentRef.value) {
        logContentRef.value.scrollTop = logContentRef.value.scrollHeight
    }
}, 100) // 100ms debounce delay


const customColors = [
    { color: '#67c23a', percentage: 20 },  // 绿色 - 低负载
    { color: '#409eff', percentage: 40 },   // 蓝色 - 正常负载
    { color: '#e6a23c', percentage: 60 },   // 橙色 - 中等负载
    { color: '#f56c6c', percentage: 80 },   // 红色 - 高负载
    { color: '#ff0000', percentage: 100 },  // 深红色 - 极高负载
]

onMounted(() => {
    window.ipcRenderer.on('port-status', (event, data) => {
        const { port, status, data: stdoutData, memoryUsage, cpuUsage } = data
        portLogList.value.unshift({
            port,
            status,
            data: stdoutData || '-',
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
    })

    window.ipcRenderer.on('process-output', (event, data) => {
        const { port, output } = data
        if (processLogList.value.length <= 10000) {
            processLogList.value.push({
                port,
                // data: output,
                data: output.replace(/\x1B\[\d+m/g, ''),
                time: new Date().toLocaleString()
            })
        }
        if (processLogList.value.length > 10000) {
            processLogList.value.splice(0, 10000)
        }
        // console.log('processLogList', processLogList.value);
        scrollToBottom()
    })
})

</script>

<style scoped lang="scss">
.log-info-wrapper {
    padding: 10px;

    .status-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

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
        margin-bottom: 20px;

        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #606266;
        }

        .log-content {
            height: 200px;
            background-color: #1e1e1e;
            color: #fff;
            padding: 10px;
            overflow-y: auto;
            font-family: monospace;
            border-radius: 4px;

            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            &::-webkit-scrollbar-thumb {
                background: #666;
                border-radius: 4px;
            }

            &::-webkit-scrollbar-track {
                background: #333;
            }

            .log-line {
                line-height: 1.5;
                // white-space: pre-wrap;
                word-break: break-all;

                .log-time {
                    color: #888;
                    margin-right: 8px;
                }

                .log-text {
                    color: #fff;
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
</style>