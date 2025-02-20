<template>
    <div class="views-common-wrapper chat-container">
        <!-- 聊天记录区域 -->
        <div class="chat-messages custom-scrollbar" ref="messageContainer">
            <div v-for="(message, index) in chatMessages" 
                 :key="index" 
                 :class="['message', message.role]"
                 :style="{ 
                     animationDelay: `${index * 0.1}s`,
                     opacity: message.tag === 'generating' ? 0.7 : 1
                 }">
                <div class="message-content">
                    <!-- 推理内容 -->
                    <div v-if="message.reasoning_content" class="reasoning-content">
                        <span>推理内容：</span>
                        <div :key="'user-' + messageKey"
                            v-if="!['generated', 'default'].includes(message.tag as string)" 
                            v-text="message.reasoning_content">
                        </div>
                        <div :key="'assistant-' + messageKey" 
                             v-else 
                             v-html="message.reasoning_content"
                             :class="{'typing-effect': message.tag === 'generating'}">
                        </div>
                    </div>
                    <!-- 主要内容 -->
                    <div :key="'user-' + messageKey" 
                         v-if="!['generated', 'default'].includes(message.tag as string)"
                         v-text="message.content">
                    </div>
                    <div :key="'assistant-' + messageKey" 
                         v-else 
                         v-html="message.content"
                         :class="{'typing-effect': message.tag === 'generating'}">
                    </div>
                </div>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input">
            <el-input 
                v-model="userInput" 
                type="textarea" 
                :rows="1" 
                :autosize="{ minRows: 1, maxRows: 4 }" 
                placeholder="请输入消息..."
                @keyup.prevent.enter="sendMessage" 
                :disabled="loading"
                class="input-transition" 
            />
            <div class="button-group">
                <el-button 
                    type="primary" 
                    @click="sendMessage" 
                    :loading="loading"
                    class="send-button">
                    发送<span class="shortcut-hint">ctrl+enter</span>
                </el-button>
                <el-button 
                    type="primary" 
                    @click="clearChatHistory"
                    :disabled="chatMessages.length < 2 || loading"
                    class="clear-button">
                    清空聊天记录
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deepSeekR1 } from '@/api/chat'
import { marked } from 'marked'
import { deepClone } from '@/utils'
import { ElMessage } from 'element-plus'

const userInput = ref('')
const loading = ref(false)
const messageContainer = ref<HTMLElement | null>(null)
const chatMessages = ref<Array<{ role: string, reasoning_content: string, content: string, usage?: string, tag?: string }>>([])
const messageKey = ref(new Date().getTime())

onMounted(() => {
    init()
})

// 初始化
const init = () => {
    chatMessages.value = []
    // 获取聊天记录
    window.ipcRenderer.invoke('db', {
        table: 'ai_chat_history',
        type: 'query',
        condition: {
            aiChatHistoryUsage: 'deepseek-r1'
        }
    }).then((res) => {
        if (res.length > 0) {
            chatMessages.value = JSON.parse(res[0].aiChatHistoryContent).map((item: { role: string, content: string, reasoning_content: string }) => ({
                role: item.role,
                content: item.content,
                reasoning_content: item.reasoning_content,
                tag: 'generated'
            }))
            messageKey.value = new Date().getTime() + Math.random()
        } else {
            setTimeout(async () => {
                chatMessages.value.push({
                    role: 'assistant',
                    content: await marked(`您好👏，我是**WebStartUI**的智能助手🤖，很高兴认识你！`),
                    reasoning_content: '',
                    tag: 'default'
                })
                messageKey.value = new Date().getTime() + Math.random()
                scrollToBottom()
            }, 1000)
        }
    }).catch((err) => {
        console.error('获取聊天记录失败:', err)
        ElMessage.error('获取聊天记录失败')
        setTimeout(async () => {
            chatMessages.value.push({
                role: 'assistant',
                content: await marked(`您好👏，我是**WebStartUI**的智能助手🤖，很高兴认识你！`),
                reasoning_content: '',
                tag: 'default'
            })
            messageKey.value = new Date().getTime() + Math.random()
            scrollToBottom()
        }, 1000)
    })
}

// 发送消息
const sendMessage = async () => {
    if (!userInput.value.trim() || loading.value) return

    // 添加用户消息
    chatMessages.value.push({
        role: 'user',
        content: userInput.value,
        reasoning_content: ''
    })
    const data = deepClone(chatMessages.value.filter(item => item.tag !== 'default').map(item => { return { role: item.role, content: item.content } })) // 去除tag为default的消息
    loading.value = true
    try {

        // 添加助手消息占位
        const assistantMessage = {
            role: 'assistant',
            content: '',
            reasoning_content: '',
            tag: 'generate'
        }
        chatMessages.value.push(assistantMessage)

        // 创建响应处理器
        const response = await deepSeekR1(data)
        userInput.value = ''

        if (response.status != 200) {
            assistantMessage.content = '很抱歉，我无法回答这个问题。错误码：' + response.status
            scrollToBottom()
            return
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()


        // 处理流式响应
        while (true) {
            const { done, value } = await reader!.read()
            if (done) {
                assistantMessage.content = await marked(assistantMessage.content)
                assistantMessage.tag = 'generated'
                break
            }

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(line => line.trim() !== '')

            for (const line of lines) {
                if (line.endsWith('[DONE]')) {
                    console.log('结束');
                    // 如果结束的时候assistantMessage.content为空，则输入内容，且tag为default
                    if (!assistantMessage.content) {
                        assistantMessage.content = '服务器繁忙，请稍后再试。'
                        assistantMessage.tag = 'default'
                        messageKey.value = new Date().getTime() + Math.random()
                    }
                } else if (line.startsWith('data: ')) {
                    let data: { choices: Array<{ delta: { reasoning_content: string, content: string } }> } = {
                        choices: [{ delta: { reasoning_content: '', content: '' } }]
                    }
                    try {
                        const jsonStr = line.split('data: ')[1]
                        if (jsonStr) {
                            data = JSON.parse(jsonStr)
                        }
                    } catch (err) {
                        console.error('JSON解析失败:', err)
                        data = { choices: [{ delta: { reasoning_content: '', content: '' } }] }
                    }
                    if (data.choices?.[0]?.delta?.reasoning_content) {
                        assistantMessage.reasoning_content += data.choices[0].delta.reasoning_content
                    }
                    if (data.choices?.[0]?.delta?.content) {
                        assistantMessage.tag = 'generating'
                        assistantMessage.content += data.choices[0].delta.content
                    }
                }
                messageKey.value = new Date().getTime() + Math.random()
            }
            scrollToBottom()
        }
    } catch (error) {
        console.error('发送消息失败:', error)
        chatMessages.value.splice(chatMessages.value.length - 1, 1, {
            role: 'assistant',
            content: '服务器繁忙，请稍后再试。',
            reasoning_content: '',
            tag: 'default'
        })
    } finally {
        loading.value = false
        storeChatHistory()
        scrollToBottom()
    }
}

// 滚动到底部
const scrollToBottom = () => {
    setTimeout(() => {
        if (messageContainer.value) {
            messageContainer.value.scrollTop = messageContainer.value.scrollHeight
        }
    }, 100)
}

// 调用主进程数据库方法，存储聊天记录
const storeChatHistory = () => {
    const data = deepClone(chatMessages.value)
    const history = data.map((item: { role: string, content: string, reasoning_content: string }) => ({
        role: item.role,
        content: item.content,
        reasoning_content: item.reasoning_content
    }))
    window.ipcRenderer.invoke('db', {
        table: 'ai_chat_history',
        type: 'insert',
        data: {
            aiChatHistoryContent: JSON.stringify(history),
            aiChatHistoryTime: new Date().getTime(),
            aiChatHistoryUsage: 'deepseek-r1'
        }
    }).then((res) => {
        console.log('res', res);
    }).catch((err) => {
        console.error('存储聊天记录失败:', err)
        ElMessage.error('存储聊天记录失败')
    })
}

// 清空聊天记录
const clearChatHistory = () => {
    window.ipcRenderer.invoke('db', {
        table: 'ai_chat_history',
        type: 'delete',
        data: {
            aiChatHistoryUsage: 'deepseek-r1'
        }
    }).then((res) => {
        console.log('res', res);
        ElMessage.info('已清除')
        init()
    }).catch((err) => {
        console.error('清空聊天记录失败:', err)
        ElMessage.error('清空聊天记录失败')
    })
}

</script>

<style scoped lang="scss">
.chat-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    gap: 20px;
}

.chat-messages {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    scroll-behavior: smooth;

    &.custom-scrollbar {
        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
            
            &:hover {
                background: rgba(0, 0, 0, 0.2);
            }
        }
    }
}

.message {
    margin-bottom: 20px;
    max-width: 80%;
    opacity: 0;
    
    &.user {
        margin-left: auto;
        animation: fadeInRight 0.5s ease-in-out forwards;
    }
    
    &.assistant {
        margin-right: auto;
        animation: fadeInLeft 0.5s ease-in-out forwards;
    }
}

.reasoning-content {
    margin-bottom: 10px;
    font-size: 12px;
    color: #999;
    transition: opacity 0.3s ease;
}

.message-content {
    padding: 12px 16px;
    border-radius: 12px;
    word-break: break-word;
    line-height: 1.6;
    font-size: 14px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
}

@keyframes fadeInRight {
    from {
        transform: translateX(50px);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeInLeft {
    from {
        transform: translateX(-50px);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.typing-effect {
    overflow: hidden;
    border-right: 2px solid currentColor;
    animation: typing 1s steps(40, end) infinite;
}

@keyframes typing {
    from { border-color: transparent }
    50% { border-color: currentColor }
    to { border-color: transparent }
}

.user {
    width: fit-content;

    .message-content {
        @include ani-theme('background-color', 'borderColor');
        @include ani-theme('color', 'color');
        width: fit-content;
    }
}

.assistant {
    width: fit-content;

    .message-content {
        @include ani-theme('background-color', 'primaryColor');
        color: white;
        width: fit-content;
    }
}

.chat-input {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.button-group {
    display: flex;
    gap: 10px;
}

.input-transition {
    transition: all 0.3s ease;

    &:deep(.el-textarea__inner) {
        resize: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:focus {
            box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.2);
            transform: translateY(-1px);
        }
    }
}

.send-button, .clear-button {
    transition: all 0.3s ease;
    
    &:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
}

.shortcut-hint {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
    margin-left: 5px;
}
</style>