<!--
 * @Author: Anixuil
 * @Date: 2024-12-27 09:52:14
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-01-11 14:24:40
 * @Description: 首页
-->
<template>
    <div class="views-common-wrapper">
        <div class="table-container">
            <div class="table-header-menu">
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
            <el-table :data="tableData" height="400" style="width: 100%" empty-text="暂无项目" v-loading="loading">
                <el-table-column prop="projectStatus" label="状态" width="110">
                    <template #default="{ row }">
                        <el-tag :type="{ '1': 'success' }[String(row.projectStatus)] || 'danger'">
                            {{ row.projectStatus === '1' ? 'RUNNING' : 'STOPPED' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="projectName" label="项目" width="180">
                    <template #default="{row}">
                        <el-link :underline="false" type="primary" @click="openProjectUrl(row)">{{ row.projectName
                            }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="projectType" label="项目类型" width="100">
                    <template #default="{ row }">
                        <el-tag :type="{ '1': 'success' }[String(row.projectType)] || 'primary'">
                            {{ row.projectType === '1' ? 'VUE' : '暂无' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="projectPort" label="端口" width="100" />
                <el-table-column prop="projectDesc" label="描述" show-overflow-tooltip />
                <el-table-column prop="projectLocalUrl" label="本地路径" show-overflow-tooltip />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" text class="table-button" @click="startOrStopProject(row)">
                            <el-tooltip class="item" effect="dark" content="启停" placement="top">
                                <el-icon class="table-icon">
                                    <TurnOff />
                                </el-icon>
                            </el-tooltip>
                        </el-button>
                        <el-button type="primary" text class="table-button" @click="openDialog('运行日志', row)">
                            <el-tooltip class="item" effect="dark" content="运行日志" placement="top">
                                <el-icon class="table-icon">
                                    <Monitor />
                                </el-icon>
                            </el-tooltip>
                        </el-button>
                        <el-button type="primary" text class="table-button" @click="editProject(row)">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-icon class="table-icon">
                                    <Edit />
                                </el-icon>
                            </el-tooltip>
                        </el-button>
                        <el-button type="primary" text class="table-button" color="red" @click="deleteProject(row)">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-icon class="table-icon" style="color: red;">
                                    <Delete />
                                </el-icon>
                            </el-tooltip>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
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

const actionType = ref('add')   // add: 新增, edit: 编辑
const dialogLoading = ref(false)
const loading = ref(false)
const tableData = ref([])
const projectInfo = ref<Form | {}>({})
onMounted(() => {
    getProjectList()
    refreshData()
})

const dialogVisible = ref(false)    // 弹窗是否显示
const dialogTitle = ref('新建项目')  // 弹窗标题
// 打开弹窗
const openDialog = (title: string, row?: Form) => {
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
const deleteProject = (row: any) => {
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
const editProject = (row: Form) => {
    actionType.value = 'edit'
    dialogVisible.value = true
    dialogTitle.value = '编辑项目'
    nextTick(() => {
        projectRef.value.updateProject(row)
    })
}

// 启停项目
const startOrStopProject = async (row: Form) => {
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
const startProject = (row: Form) => {
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
const stopProject = (row: Form) => {
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
const updateProject = (row: Form) => {
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
const openProjectUrl = (row: Form) => {
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
</script>

<style scoped lang="scss">
.views-common-wrapper {
    box-sizing: border-box;
    padding: 0 20px;

    .table-header-menu {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

    }

    .table-container {
        width: 100%;
        max-width: 1200px;
        min-width: 600px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 10px;

        .table-icon {
            cursor: pointer;
        }
    }
}



::v-deep(.custom-class) {
    position: relative;
    height: 95vh;
    margin-top: 2.5vh;
    margin-bottom: 2.5vh;

    .el-dialog__body {
        overflow: auto;
        height: calc(100% - 90px);
        position: relative;
    }

    .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
    }
}

.table-button {
    box-sizing: border-box;
    padding: 0px;
}
</style>