<!--
 * @Author: Anixuil
 * @Date: 2024-12-27 09:52:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-20 22:44:16
 * @Description: 首页
-->
<template>
    <div class="views-common-wrapper">
        <div class="card-container" ref="cardContainerRef">
            <div class="content-wrapper">
                <div class="header-menu">
                    <div class="left">
                        <el-button type="primary" @click="openDialog('新建项目')">新建项目</el-button>
                    </div>
                    <div class="right">
                        <el-button text type="primary" @click="refreshList">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                        </el-button>
                    </div>
                </div>
                
                <div class="card-grid" v-loading="loading">
                    <el-empty v-if="!tableData.length" description="暂无项目" />
                    <el-card v-for="row in tableData" :key="row.projectId" class="project-card" shadow="hover">
                        <div class="card-header">
                            <div class="project-title">
                                <el-link :underline="false" type="primary" @click="openProjectUrl(row)">
                                    {{ row.projectName }}
                                </el-link>
                            </div>
                            <div class="project-status">
                                <el-tag :type="{ '1': 'success' }[String(row.projectStatus)] || 'danger'">
                                    {{ row.projectStatus === '1' ? 'RUNNING' : 'STOPPED' }}
                                </el-tag>
                            </div>
                        </div>
                        
                        <div class="card-content">
                            <div class="info-item">
                                <span class="label">项目类型：</span>
                                <el-tag :type="{ '1': 'success' }[String(row.projectType)] || 'primary'" size="small">
                                    {{ row.projectType === '1' ? 'VUE' : '暂无' }}
                                </el-tag>
                            </div>
                            <div class="info-item">
                                <span class="label">端口：</span>
                                <span>{{ row.projectPort }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">描述：</span>
                                <el-tooltip :content="row.projectDesc" placement="top">
                                    <span class="ellipsis">{{ row.projectDesc || '暂无描述' }}</span>
                                </el-tooltip>
                            </div>
                            <div class="info-item">
                                <span class="label">本地路径：</span>
                                <el-tooltip :content="row.projectLocalUrl" placement="top">
                                    <span class="ellipsis">{{ row.projectLocalUrl }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        
                        <div class="card-actions">
                            <el-button type="primary" text @click="startOrStopProject(row)">
                                <el-tooltip effect="dark" content="启停" placement="top">
                                    <el-icon><TurnOff /></el-icon>
                                </el-tooltip>
                            </el-button>
                            <el-button type="primary" text @click="openDialog('运行日志', row)">
                                <el-tooltip effect="dark" content="运行日志" placement="top">
                                    <el-icon><Monitor /></el-icon>
                                </el-tooltip>
                            </el-button>
                            <el-button type="primary" text @click="editProject(row)">
                                <el-tooltip effect="dark" content="编辑" placement="top">
                                    <el-icon><Edit /></el-icon>
                                </el-tooltip>
                            </el-button>
                            <el-button type="primary" text color="red" @click="deleteProject(row)">
                                <el-tooltip effect="dark" content="删除" placement="top">
                                    <el-icon style="color: red;"><Delete /></el-icon>
                                </el-tooltip>
                            </el-button>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>

        <!-- 回到顶部按钮 -->
        <div class="back-to-top" :class="{ visible: showBackToTop }" @click="scrollToTop">
            <el-icon><Top /></el-icon>
        </div>

        <!-- 弹窗 -->
        <el-dialog class="custom-class" v-model="dialogVisible" :title="dialogTitle" width="95%" destroy-on-close>
            <template #header>
                <div class="title">
                    <span>
                        {{ dialogTitle }}
                    </span>
                    <el-popover v-if="['新建项目', '编辑项目'].includes(dialogTitle)" placement="right" :title="dialogTitle"
                        :width="200" trigger="hover" content="选择文件夹后，系统将自动根据文件夹创建或识别项目">
                        <template #reference>
                            <el-icon style="cursor: pointer;">
                                <QuestionFilled />
                            </el-icon>
                        </template>
                    </el-popover>
                </div>
            </template>
            <projectAdd ref="projectRef" v-if="['新建项目', '编辑项目'].includes(dialogTitle)"></projectAdd>
            <logInfo v-if="dialogTitle === '运行日志'" :projectInfo="projectInfo"></logInfo>
            <template #footer v-if="['新建项目', '编辑项目'].includes(dialogTitle)">
                <el-button v-if="actionType === 'edit'" type="primary" @click="install">安装依赖</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </template>
            <el-dialog v-model="installVisible" width="50%" destroy-on-close title="选择包管理工具">
                <el-radio-group v-model="installType">
                    <el-radio label="npm">npm</el-radio>
                    <el-radio label="pnpm">pnpm</el-radio>
                    <!-- <el-radio label="yarn">yarn</el-radio> -->
                </el-radio-group>
                <template #footer>
                    <el-button type="primary" @click="runInstall" :loading="dialogLoading">确 定</el-button>
                    <el-button @click="installVisible = false" :loading="dialogLoading">取 消</el-button>
                </template>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

interface ProjectData {
    projectId: string;
    projectName: string;
    projectStatus: string;
    projectType: string;
    projectPort: string;
    projectDesc: string;
    projectLocalUrl: string;
}

const actionType = ref('add')   // add: 新增, edit: 编辑
const dialogLoading = ref(false)
const loading = ref(false)
const tableData = ref<ProjectData[]>([])
const projectInfo = ref<ProjectData | {}>({})
const showBackToTop = ref(false)
const cardContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
    getProjectList()
    refreshData()
    cardContainerRef.value = document.querySelector('.card-container')
    if (cardContainerRef.value) {
        cardContainerRef.value.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    if (cardContainerRef.value) {
        cardContainerRef.value.removeEventListener('scroll', handleScroll)
    }
})

const dialogVisible = ref(false)    // 弹窗是否显示
const dialogTitle = ref('新建项目')  // 弹窗标题
// 打开弹窗
const openDialog = (title: string, row?: ProjectData) => {
    dialogVisible.value = true
    dialogTitle.value = title
    actionType.value = 'add'
    if (row) {
        projectInfo.value = row
    }
}

const projectRef = ref<any>(null);
// 保存
const save = () => {
    nextTick(async () => {
        try {
            await projectRef.value.save()
            getProjectList()
            dialogVisible.value = false
        } catch (e) {
            console.error('e', e)
        } finally {
            loading.value = false
        }
    })
}
// 获取项目列表
const getProjectList = () => {
    return new Promise(async (resolve, reject) => {
        try {
            loading.value = true
            const res = await window.ipcRenderer.invoke('db', {
                table: 'project_table',
                type: 'query',
                data: {}
            })
            tableData.value = res || []
            resolve(true)
        } catch (err) {
            console.error('err', err)
            ElMessage.error('获取项目列表异常,' + err)
            reject(false)
        } finally {
            loading.value = false
        }

    })
}

// 刷新列表
const refreshList = async () => {
    try {
        await getProjectList()
        ElMessage.success('刷新成功')
    } catch (err) {
        console.error('err', err)
        // ElMessage.error('刷新异常,' + err)
    }

}

// 删除项目
const deleteProject = (row: ProjectData) => {
    // 如果项目正在运行，先停止项目
    const tips = row.projectStatus === '1' ? '项目正在运行，' : ''
    ElMessageBox.confirm(`${tips}此操作将永久删除该项目, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            if (row.projectStatus === '1') {
                await stopProject(row)
            }
            window.ipcRenderer.invoke('db', {
                table: 'project_table',
                type: 'delete',
                data: {
                    projectId: row.projectId
                }
            }).then((res) => {
                if (res) {
                    ElMessage.success('删除成功')
                    getProjectList()
                } else {
                    ElMessage.warning('删除失败')
                }
            }).catch(err => {
                ElMessage.error('删除异常', err)
                console.error('err', err);
            })
        } catch (e) {
            console.error('e', e)
        }
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 编辑项目
const editProject = (row: ProjectData) => {
    actionType.value = 'edit'
    dialogVisible.value = true
    dialogTitle.value = '编辑项目'
    nextTick(() => {
        projectRef.value.updateProject(row)
    })
}

// 启停项目
const startOrStopProject = async (row: ProjectData) => {
    loading.value = true
    // 首先根据项目当前状态，判断是启动还是停止 1 启动 0 停止 2 准备中
    const status = row.projectStatus === '1' ? '0' : '1'
    try {
        // 更新项目状态
        switch (status) {
            case '1':
                await startProject(row)
                // 更新项目状态
                await updateProject(row)
                break;
            case '0':
                await stopProject(row)
                // 更新项目状态
                await updateProject(row)
                break;
        }
    } catch (e) {
        console.error('e', e)
        ElMessage.error('操作异常')
    } finally {
        loading.value = false
    }
}

// 启动项目
const startProject = (row: ProjectData) => {
    ElNotification({
        title: '启动提示',
        message: '启动中，请稍后...',
        type: 'info',
        duration: 0,
        position: 'top-left'
    })
    return new Promise((resolve, reject) => {
        window.ipcRenderer.invoke('startProject', {
            ...row
        }).then(res => {
            ElNotification.closeAll()
            if (res) {
                ElNotification({
                    title: '启动成功',
                    message: '该项目已启动',
                    type: 'success',
                    duration: 3000,
                    position: 'top-left'
                })
                resolve(true)
            } else {
                ElNotification({
                    title: '启动失败',
                    message: res,
                    type: 'error',
                    duration: 3000,
                    position: 'top-left'
                })
                reject(false)
                console.log('res', res);
            }
        }).catch(err => {
            ElNotification.closeAll()
            ElNotification({
                title: '启动异常',
                message: err,
                type: 'error',
                duration: 3000,
                position: 'top-left'
            })
            console.error('err', err);
            reject(false)
        })
    })
}

// 停止项目
const stopProject = (row: ProjectData) => {
    return new Promise((resolve, reject) => {
        ElNotification({
            title: '停止提示',
            message: '停止中，请稍后...',
            type: 'info',
            duration: 0,
            position: 'top-left'
        })
        window.ipcRenderer.invoke('stopProject', {
            ...row
        }).then(res => {
            ElNotification.closeAll()
            if (res) {
                ElNotification({
                    title: '停止成功',
                    message: '该项目已停止',
                    type: 'success',
                    duration: 3000,
                    position: 'top-left'
                })
                resolve(true)
            } else {
                ElNotification({
                    title: '停止失败',
                    message: res,
                    type: 'error',
                    duration: 3000,
                    position: 'top-left'
                })
                reject(false)
            }
        }).catch(err => {
            ElNotification.closeAll()
            ElNotification({
                title: '停止异常',
                message: err,
                type: 'error',
                duration: 3000,
                position: 'top-left'
            })
            console.error('err', err);
            reject(false)
        })
    })
}

// 更新项目
const updateProject = (row: ProjectData) => {
    return new Promise((resolve, reject) => {
        window.ipcRenderer.invoke('db', {
            table: 'project_table',
            type: 'update',
            data: {
                projectStatus: row.projectStatus === '1' ? '0' : '1'
            },
            condition: {
                projectId: row.projectId
            }
        }).then(res => {
            if (res) {
                ElMessage.success('操作成功')
                getProjectList()
                resolve(true)
            } else {
                ElMessage.warning('操作失败')
                reject(false)
            }
        }).catch(err => {
            ElMessage.error('操作异常', err)
            console.error('err', err);
            reject(false)
        })
    })
}

// 安装依赖
const installVisible = ref(false)
const installType = ref('npm')
const install = () => {
    installVisible.value = true
}
const runInstall = () => {
    dialogLoading.value = true
    nextTick(() => {
        ElNotification({
            title: '安装提示',
            message: '安装中，请稍后...',
            type: 'info',
            duration: 0,
            position: 'top-left'
        })
        window.ipcRenderer.invoke('install', {
            type: installType.value,
            projectLocalUrl: projectRef.value.form.projectLocalUrl
        }).then(res => {
            console.log('res', res);
            ElNotification.closeAll()
            ElNotification({
                title: '安装成功',
                message: res ? '该项目可以启动' : '安装失败',
                type: res ? 'success' : 'error',
                duration: 3000,
                position: 'top-left'
            })
        }).catch(err => {
            ElNotification.closeAll()
            ElNotification({
                title: '安装异常',
                message: err,
                type: 'error',
                duration: 3000,
                position: 'top-left'
            })
            console.error('err', err);
        }).finally(() => {
            dialogLoading.value = false
            installVisible.value = false
        })
    })
}

// 打开项目地址
const openProjectUrl = (row: ProjectData) => {
    // 用浏览器打开项目地址 http://localhost:port
    window.ipcRenderer.invoke('openProjectUrl', {
        projectPort: row.projectPort
    }).then(res => {
        console.log('res', res);
    }).catch(err => {
        console.error('err', err);
    })
}

// 监听是否刷新
const refreshData = () => {
    window.ipcRenderer.on('refresh-data', (event, data) => {
        getProjectList()
        // 如果当前运行日志弹窗存在，关闭弹窗
        if (dialogVisible.value) {
            dialogVisible.value = false
        }
        if (data?.msg) {
            ElNotification.warning({
                title: '系统提示',
                message: data.msg,
                duration: 3000,
                position: 'top-left'
            })
        }
    })
}

// 监听滚动事件
const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement
    showBackToTop.value = target.scrollTop > 300
}

// 滚动到顶部
const scrollToTop = () => {
    if (cardContainerRef.value) {
        cardContainerRef.value.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}
</script>

<style scoped lang="scss">
.views-common-wrapper {
    box-sizing: border-box;
    height: 100vh;
    position: relative;
    background-color: var(--el-bg-color);
    transition: all 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 0% 0%, 
                var(--el-color-primary-light-3) 0%, 
                transparent 50%),
            radial-gradient(circle at 100% 0%, 
                var(--el-color-success-light-3) 0%, 
                transparent 50%),
            radial-gradient(circle at 100% 100%, 
                var(--el-color-warning-light-3) 0%, 
                transparent 50%),
            radial-gradient(circle at 0% 100%, 
                var(--el-color-danger-light-3) 0%, 
                transparent 50%);
        opacity: 0.08;
        z-index: 0;
        
        @media (prefers-color-scheme: dark) {
            opacity: 0.15;
            background: 
                radial-gradient(circle at 0% 0%, 
                    rgba(var(--el-color-primary-rgb), 0.3) 0%, 
                    transparent 50%),
                radial-gradient(circle at 100% 0%, 
                    rgba(var(--el-color-success-rgb), 0.3) 0%, 
                    transparent 50%),
                radial-gradient(circle at 100% 100%, 
                    rgba(var(--el-color-warning-rgb), 0.3) 0%, 
                    transparent 50%),
                radial-gradient(circle at 0% 100%, 
                    rgba(var(--el-color-danger-rgb), 0.3) 0%, 
                    transparent 50%);
        }
    }

    .card-container {
        position: relative;
        height: 100%;
        overflow: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        
        &::-webkit-scrollbar {
            display: none;
        }

        .content-wrapper {
            position: relative;
            width: 100%;
            max-width: 1440px;
            margin: auto;
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding-bottom: 80px;
            box-sizing: border-box;
            min-height: min-content;

            @media screen and (min-width: 1921px) {
                max-width: 1800px;
            }

            @media screen and (max-width: 1500px) {
                max-width: 1200px;
            }

            @media screen and (max-width: 1200px) {
                max-width: 900px;
                gap: 20px;
            }

            @media screen and (max-width: 900px) {
                max-width: 100%;
                gap: 16px;
                padding: 0 16px;
            }
        }

        .header-menu {
            position: sticky;
            top: 0;
            z-index: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 16px;
            backdrop-filter: blur(20px);
            background: var(--el-bg-color);
            border-radius: 16px;
            border: 1px solid var(--el-border-color-lighter);
            box-shadow: 
                0 4px 6px -1px rgba(0, 0, 0, 0.05),
                0 2px 4px -1px rgba(0, 0, 0, 0.03);
            transition: all 0.3s ease;
            box-sizing: border-box;
            margin-bottom: 8px;
            
            @media screen and (max-width: 900px) {
                padding: 12px;
                border-radius: 12px;
            }

            .left {
                .el-button {
                    height: 40px;
                    padding: 0 24px;
                    font-weight: 500;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                    background: var(--el-color-primary);
                    border-color: transparent;
                    
                    @media screen and (max-width: 900px) {
                        height: 36px;
                        padding: 0 16px;
                        font-size: 14px;
                    }
                    
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
                        background: var(--el-color-primary-dark-2);
                    }
                }
            }
            
            .right {
                .el-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid var(--el-border-color-lighter);
                    background: var(--el-bg-color-page);
                    
                    @media screen and (max-width: 900px) {
                        width: 36px;
                        height: 36px;
                    }
                    
                    &:hover {
                        background: var(--el-color-primary-light-9);
                        border-color: var(--el-color-primary-light-5);
                        
                        .el-icon {
                            color: var(--el-color-primary);
                            transform: rotate(180deg);
                        }
                    }
                    
                    .el-icon {
                        font-size: 20px;
                        color: var(--el-text-color-secondary);
                        transition: all 0.3s ease;
                        
                        @media screen and (max-width: 900px) {
                            font-size: 18px;
                        }
                    }
                }
            }
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            width: 100%;
            
            @media screen and (min-width: 1921px) {
                grid-template-columns: repeat(4, 1fr);
            }
            
            @media screen and (max-width: 1500px) {
                grid-template-columns: repeat(3, 1fr);
            }
            
            @media screen and (max-width: 1200px) {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }
            
            @media screen and (max-width: 768px) {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .el-empty {
                grid-column: 1 / -1;
                padding: 48px;
                background: var(--el-bg-color);
                border-radius: 16px;
                box-shadow: 
                    0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    
                @media screen and (max-width: 900px) {
                    padding: 32px;
                }
            }
        }
    }

    .back-to-top {
        position: fixed;
        right: 40px;
        bottom: 40px;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        background: var(--el-color-primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
        opacity: 0;
        transform: scale(0.8) translateY(20px);
        pointer-events: none;
        z-index: 100;

        &.visible {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: auto;
        }

        &:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 6px 16px rgba(var(--el-color-primary-rgb), 0.3);
            background: var(--el-color-primary-dark-2);
        }

        .el-icon {
            font-size: 20px;
            color: white;
            transition: transform 0.3s ease;
        }

        &:hover .el-icon {
            transform: translateY(-1px);
        }

        @media screen and (max-width: 900px) {
            right: 20px;
            bottom: 20px;
            width: 36px;
            height: 36px;
            
            .el-icon {
                font-size: 18px;
            }
        }
    }
}

::v-deep(.custom-class) {
    position: relative;
    height: 95vh;
    margin-top: 2.5vh;
    margin-bottom: 2.5vh;
    backdrop-filter: blur(20px);
    background: var(--el-bg-color);
    border: 1px solid rgba(var(--el-color-primary-rgb), 0.1);
    border-radius: 16px;
    box-shadow: 
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el-dialog__header {
        position: relative;
        padding: 20px;
        margin: 0;
        background: var(--el-bg-color);
        border-bottom: 1px solid var(--el-border-color-lighter);
        flex-shrink: 0;
        min-height: 64px;
        display: flex;
        align-items: center;

        .title {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--el-text-color-primary);
            font-size: 18px;
            font-weight: 600;
            line-height: 1.4;
            margin-right: 32px;

            .el-icon {
                font-size: 18px;
                color: var(--el-text-color-secondary);
                transition: all 0.3s ease;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                cursor: pointer;

                &:hover {
                    color: var(--el-color-primary);
                    background: var(--el-color-primary-light-9);
                }
            }
        }
    }

    .el-dialog__headerbtn {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 2;
        padding: 0;
        width: 32px;
        height: 32px;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background: var(--el-color-danger-light-9);
            
            .el-dialog__close {
                color: var(--el-color-danger);
            }
        }

        .el-dialog__close {
            font-size: 18px;
            color: var(--el-text-color-secondary);
            transition: all 0.3s;
        }
    }

    .el-dialog__body {
        position: relative;
        padding: 20px;
        flex: 1;
        overflow: auto;
        color: var(--el-text-color-primary);
        background: var(--el-bg-color);
        
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
            background: var(--el-border-color-darker);
            border-radius: 3px;
        }
        
        &::-webkit-scrollbar-track {
            background: var(--el-border-color-light);
            border-radius: 3px;
        }
    }

    .el-dialog__footer {
        position: relative;
        padding: 16px 20px;
        margin: 0;
        background: var(--el-bg-color);
        border-top: 1px solid var(--el-border-color-lighter);
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .el-button {
            padding: 8px 20px;
            font-weight: 500;
            font-size: 14px;
            border-radius: 6px;
            transition: all 0.3s ease;
            min-width: 80px;
            height: 36px;

            + .el-button {
                margin-left: 12px;
            }

            &:hover {
                transform: translateY(-1px);
            }

            &.el-button--default {
                border-color: var(--el-border-color);
                color: var(--el-text-color-regular);
                
                &:hover {
                    color: var(--el-color-primary);
                    border-color: var(--el-color-primary);
                    background: var(--el-color-primary-light-9);
                }
            }

            &.el-button--primary {
                &:hover {
                    box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
                }
            }
        }
    }
}

// 修复嵌套弹窗的样式
::v-deep(.el-dialog__wrapper) {
    .el-dialog {
        &.custom-class {
            .el-dialog {
                position: relative;
                margin: 15vh auto !important;
                width: 500px !important;
                max-width: 90%;
                max-height: 70vh;
                min-height: 200px;
                border-radius: 12px;
                overflow: hidden;
                backdrop-filter: blur(20px);
                background: var(--el-bg-color);
                border: 1px solid var(--el-border-color-light);
                box-shadow: 0 12px 32px 4px rgba(0, 0, 0, 0.04), 0 8px 20px rgba(0, 0, 0, 0.08);
                display: flex;
                flex-direction: column;

                .el-dialog__header {
                    padding: 16px 20px;
                    min-height: 56px;

                    .title {
                        font-size: 16px;
                    }
                }

                .el-dialog__body {
                    padding: 20px;
                    height: auto;
                    max-height: calc(70vh - 120px);
                    min-height: 100px;
                }

                .el-dialog__footer {
                    padding: 16px 20px;
                    min-height: 64px;
                }

                .el-dialog__headerbtn {
                    top: 12px;
                    right: 12px;
                }

                // 修复嵌套弹窗中的表单样式
                .el-form {
                    .el-form-item {
                        margin-bottom: 20px;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        .el-form-item__label {
                            padding-right: 12px;
                            font-weight: 500;
                            color: var(--el-text-color-primary);
                        }

                        .el-form-item__content {
                            .el-input,
                            .el-select {
                                width: 100%;
                            }
                        }
                    }
                }

                // 修复嵌套弹窗中的单选框组样式
                .el-radio-group {
                    display: flex;
                    gap: 16px;
                    padding: 8px 0;

                    .el-radio {
                        margin-right: 0;
                        height: 32px;
                        
                        .el-radio__label {
                            font-size: 14px;
                            color: var(--el-text-color-regular);
                        }
                        
                        &.is-checked {
                            .el-radio__label {
                                color: var(--el-color-primary);
                            }
                        }
                    }
                }
            }
        }
    }
}

.project-card {
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    border-radius: 16px;
    backdrop-filter: blur(20px);
    background: var(--el-bg-color);
    border: 1px solid rgba(var(--el-color-primary-rgb), 0.1);
    box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;

    @media screen and (max-width: 900px) {
        border-radius: 12px;
    }

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(var(--el-color-primary-rgb), 0.1),
            rgba(var(--el-color-success-rgb), 0.1)
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 0;
        
        @media (prefers-color-scheme: dark) {
            background: linear-gradient(
                135deg,
                rgba(var(--el-color-primary-rgb), 0.2),
                rgba(var(--el-color-success-rgb), 0.2)
            );
        }
    }

    &:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.15),
            0 10px 10px -5px rgba(0, 0, 0, 0.08);
            
        @media (prefers-color-scheme: dark) {
            box-shadow: 
                0 20px 25px -5px rgba(0, 0, 0, 0.3),
                0 10px 10px -5px rgba(0, 0, 0, 0.2);
        }

        &::before {
            opacity: 1;
        }

        .card-actions {
            border-color: transparent;
            background: var(--el-bg-color);
        }
    }

    .el-card__body {
        padding: 20px;
        
        @media screen and (max-width: 900px) {
            padding: 16px;
        }
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        @media screen and (max-width: 900px) {
            margin-bottom: 16px;
            padding-bottom: 12px;
        }

        .project-title {
            font-size: 18px;
            font-weight: 600;

            @media screen and (max-width: 900px) {
                font-size: 16px;
            }

            .el-link {
                color: var(--el-color-primary);
                transition: all 0.3s ease;

                &:hover {
                    opacity: 0.8;
                    text-decoration: underline;
                }
            }
        }

        .project-status {
            .el-tag {
                padding: 0 12px;
                height: 28px;
                font-weight: 500;
                border-radius: 8px;

                @media screen and (max-width: 900px) {
                    padding: 0 8px;
                    height: 24px;
                    font-size: 12px;
                }
            }
        }
    }

    .card-content {
        margin-bottom: 20px;

        @media screen and (max-width: 900px) {
            margin-bottom: 16px;
        }

        .info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            line-height: 1.6;

            &:last-child {
                margin-bottom: 0;
            }

            .label {
                color: var(--el-text-color-secondary);
                font-size: 14px;
                font-weight: 500;
                margin-right: 12px;
                min-width: 80px;

                @media screen and (max-width: 900px) {
                    font-size: 13px;
                    min-width: 70px;
                }
            }

            .el-tag {
                border-radius: 6px;
            }

            .ellipsis {
                flex: 1;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--el-text-color-primary);
                padding: 2px 0;

                @media screen and (max-width: 900px) {
                    font-size: 13px;
                }
            }
        }
    }

    .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 20px;
        margin: 0 -20px -20px;
        background: var(--el-bg-color-page);
        border-top: 1px solid var(--el-border-color-lighter);
        transition: all 0.3s ease;

        @media screen and (max-width: 900px) {
            padding: 12px 16px;
            margin: 0 -16px -16px;
            gap: 8px;
        }

        .el-button {
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
            
            @media screen and (max-width: 900px) {
                padding: 6px;
            }
            
            &:hover {
                background: var(--el-color-primary-light-9);
                transform: translateY(-2px);
            }
            
            &[color="red"]:hover {
                color: var(--el-color-danger) !important;
                background: var(--el-color-danger-light-9);
            }
            
            .el-icon {
                font-size: 18px;

                @media screen and (max-width: 900px) {
                    font-size: 16px;
                }
            }
        }
    }
}
</style>