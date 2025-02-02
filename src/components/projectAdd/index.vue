<!--
 * @Author: Anixuil
 * @Date: 2024-12-28 10:26:46
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-01-21 17:33:15
 * @Description: 请填写简介
-->
<template>
    <div class="views-common-wrapper" v-loading="loading">
        <el-form :model="form" label-width="auto" style="width: 100%;" ref="ruleFormRef" :rules="rules">
            <el-form-item label="项目本地地址" prop="projectLocalUrl">
                <el-input readonly v-model="form.projectLocalUrl" placeholder="请输入项目本地地址">
                    <template #append>
                        <el-button @click="selectUrl" type="primary">
                            <el-icon>
                                <Search />
                            </el-icon>
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="form.projectName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
                <el-select v-model="form.projectType" placeholder="请选择项目类型">
                    <el-option label="VUE" value="1"></el-option>
                    <!-- <el-option label="后端" value="2"></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item label="端口" prop="projectPort">
                <el-input-number v-model="form.projectPort" placeholder="请输入端口"></el-input-number>
            </el-form-item>
            <el-form-item label="项目命令" prop="projectCommand">
                <el-input v-model="form.projectCommand" placeholder="请输入项目命令"></el-input>
            </el-form-item>
            <!-- <el-form-item label="项目git地址" prop="projectGitUrl">
                <el-input v-model="form.projectGitUrl" placeholder="请输入项目git地址"></el-input>
            </el-form-item>
            <el-form-item label="项目分支" prop="projectBranch">
                <el-input v-model="form.projectBranch" placeholder="请输入项目分支"></el-input>
            </el-form-item> -->
            <el-form-item label="项目描述" prop="projectDesc">
                <el-input type="textarea" v-model="form.projectDesc" placeholder="请输入项目描述"></el-input>
            </el-form-item>
            <el-form-item label="项目配置" prop="projectConfig">
                <monaco-editor
                    v-model="form.projectConfig"
                    :language="getConfigFileLanguage(form.projectConfigFileName)"
                    style="height: 500px;"
                    @change="handleConfigChange"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus';

defineOptions({
    name: 'projectAdd',
})
const loading = ref(false)

const actionType = ref('add')   // add: 新增, edit: 编辑
const form = reactive<Form>({
    projectId: 0,    // 项目id
    projectName: '',    // 项目名称
    projectDesc: '',    // 项目描述
    projectType: '1',    // 项目类型
    projectLocalUrl: '',     // 项目本地地址
    projectGitUrl: '',     // 项目git地址
    projectBranch: '',     // 项目分支
    projectConfig: '',    // 项目配置
    projectPort: 8080,    // 项目端口
    projectStatus: '0',    // 项目状态
    projectCommand: '',    // 项目命令
    projectVersion: '',    // 项目版本
    projectConfigFileName: '',    // 项目配置文件名
    projectBackendUrl: '',    // 项目后端地址
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<Form>>({
    projectName: [
        { required: true, message: '请输入项目名称', trigger: ['change', 'blur'] }
    ],
    // projectDesc: [
    //     { required: true, message: '请输入项目描述', trigger: 'blur' }
    // ],
    projectType: [
        { required: true, message: '请选择项目类型', trigger: 'change' }
    ],
    projectLocalUrl: [
        { required: true, message: '请输入项目本地地址', trigger: ['change', 'blur'] }
    ],
    // projectGitUrl: [
    //     { required: true, message: '请输入项目git地址', trigger: 'blur' }
    // ],
    // projectBranch: [
    //     { required: true, message: '请输入项目分支', trigger: 'blur' }
    // ],
    // projectConfig: [
    //     { required: true, message: '请输入项目配置', trigger: 'blur' }
    // ]
})

// 选择项目本地地址
const selectUrl = () => {
    window.ipcRenderer.invoke('open-file-dialog').then((res: any) => {
        if (res.length === 0) {
            ElMessage.info('取消选择')
            return
        }
        form.projectLocalUrl = res[0]
        loading.value = true
        getProjectInfo()
    }).catch((e) => {
        console.error('e', e)
        ElMessage.warning('项目导入异常')
    })
}
// 通过项目本地地址获取项目信息
const getProjectInfo = () => {
    window.ipcRenderer.invoke('getProjectInfoByPath', form.projectLocalUrl).then((res: any) => {
        if (form.projectName === '') {
            form.projectName = res.projectName
        }
        form.projectConfig = res.projectConfig
        form.projectCommand = res.projectCommand
        form.projectPort = res.projectPort
        form.projectVersion = res.projectVersion
        form.projectConfigFileName = res.projectConfigFileName
        loading.value = false
    }).catch((e) => {
        ElMessage.warning(e.message)
    }).finally(() => {
        loading.value = false
    })
}

// 监听端口变化 同步更改projectConfig中的端口
watch(() => form.projectPort, (val) => {
    if (form.projectConfig) {
        // 通过正则匹配端口
        const portReg = /port\s*:\s*(\d+)/;
        const portMatch = form.projectConfig.match(portReg);
        if (portMatch) {
            form.projectConfig = form.projectConfig.replace(portReg, `port: ${val}`);
        }
    }
})
// 监听项目配置变化 同步更改projectPort
watch(() => form.projectConfig, () => {
    if (form.projectPort) {
        // 通过正则匹配端口
        const portReg = /port\s*:\s*(\d+)/;
        const portMatch = form.projectConfig.match(portReg);
        if (portMatch && Number(portMatch[1]) !== form.projectPort) {
            form.projectPort = Number(portMatch[1]);
        }
    }
})

// 保存
const save = () => {
    return new Promise((resolve, reject) => {
        if (!ruleFormRef.value) return reject('ruleFormRef is undefined')
        ruleFormRef.value.validate(async (valid: boolean) => {
            if (valid) {
                try {
                    console.log('form', form);
                    switch (actionType.value) {
                        case 'add':
                            delete form.projectId
                            window.ipcRenderer.invoke('db', {
                                table: 'project_table',
                                type: 'insert',
                                data: {
                                    ...form
                                }
                            }).then((res) => {
                                if (res) {
                                    resolve(true)
                                    ElMessage.success('新增成功')
                                } else {
                                    ElMessage.warning('新增失败')
                                    reject('新增失败')
                                }
                            }).catch((e) => {
                                console.error('e', e)
                                ElMessage.warning('新增异常')
                                reject(e)
                            })
                            break
                        case 'edit':
                            const id = form.projectId
                            if (!id) {
                                ElMessage.warning('项目id不存在')
                                reject('项目id不存在')
                            }
                            delete form.projectId
                            window.ipcRenderer.invoke('db', {
                                table: 'project_table',
                                type: 'update',
                                data: {
                                    ...form
                                },
                                condition: {
                                    projectId: id
                                }
                            }).then((res) => {
                                if (res) {
                                    resolve(true)
                                    ElMessage.success('保存成功')
                                } else {
                                    ElMessage.warning('保存失败')
                                    reject('保存失败')
                                }
                            })
                            break
                    }
                    // window.ipcRenderer.invoke('db', {
                    //     table: 'project_table',
                    //     type: actionType.value === 'add' ? 'insert' : 'update',
                    //     data: {
                    //         ...form
                    //     }
                    // }).then((res) => {
                    //     if (res) {
                    //         resolve(true)
                    //         ElMessage.success('保存成功')
                    //     } else {
                    //         ElMessage.warning('保存失败')
                    //         reject('保存失败')
                    //     }
                    // })

                } catch (e) {
                    console.error('e', e)
                    ElMessage.warning('保存失败，请检查表单')
                    reject(e)
                }
            } else {
                ElMessage.warning('保存失败，请检查表单')
            }
        })
    })
}
const updateProject = (row: Form) => {
    actionType.value = 'edit'
    form.projectId = row.projectId
    form.projectName = row.projectName
    form.projectDesc = row.projectDesc
    form.projectType = row.projectType
    form.projectLocalUrl = row.projectLocalUrl
    form.projectGitUrl = row.projectGitUrl
    form.projectBranch = row.projectBranch
    form.projectConfig = row.projectConfig
    form.projectPort = row.projectPort
    form.projectStatus = row.projectStatus
    form.projectCommand = row.projectCommand
    form.projectVersion = row.projectVersion
    form.projectConfigFileName = row.projectConfigFileName
}

// 根据配置文件名获取语言类型
const getConfigFileLanguage = (fileName: string) => {
    if (fileName.endsWith('.ts')) {
        return 'typescript'
    }
    return 'javascript'
}

// 配置变化处理
const handleConfigChange = (value: string) => {
    form.projectConfig = value
}

defineExpose({
    save,
    updateProject,
    form
})
</script>

<style scoped lang="scss">
.views-common-wrapper {
    // border: 1px solid red;
    @include ani-theme('background-color', 'dialogBgColor');
}
</style>