<template>
    <div class="monaco-editor-container" ref="editorContainer"></div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

defineOptions({
    name: 'monacoEditor',
})

// 定义props
const props = defineProps<{
    modelValue: string
    language?: string
    theme?: string
    readOnly?: boolean
}>()

// 定义emit
const emit = defineEmits(['update:modelValue', 'change'])

// 编辑器容器ref
const editorContainer = ref<HTMLElement | null>(null)
// 编辑器实例
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// 初始化workers
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

// 初始化编辑器
const initMonaco = () => {
    if (!editorContainer.value) return

    editor = monaco.editor.create(editorContainer.value, {
        value: props.modelValue,
        language: props.language || 'javascript',
        theme: props.theme || 'vs-dark',
        readOnly: props.readOnly || false,
        automaticLayout: true,
        minimap: {
            enabled: true
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
        }
    })

    // 监听内容变化
    editor.onDidChangeModelContent(() => {
        const value = editor?.getValue() || ''
        emit('update:modelValue', value)
        emit('change', value)
    })
}

// 监听props变化
watch(() => props.modelValue, (newValue) => {
    if (editor && newValue !== editor.getValue()) {
        editor.setValue(newValue)
    }
})

watch(() => props.language, (newValue) => {
    if (editor) {
        monaco.editor.setModelLanguage(editor.getModel()!, newValue || 'javascript')
    }
})

watch(() => props.theme, (newValue) => {
    if (editor) {
        monaco.editor.setTheme(newValue || 'vs-dark')
    }
})

// 组件挂载时初始化
onMounted(() => {
    initMonaco()
})

// 组件销毁时清理
onBeforeUnmount(() => {
    if (editor) {
        editor.dispose()
    }
})

// 暴露方法给父组件
defineExpose({
    getEditor: () => editor
})
</script>

<style scoped>
.monaco-editor-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
    border-radius: 4px;
    overflow: hidden;
}
</style> 