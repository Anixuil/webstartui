/*
 * @Author: Anixuil
 * @Date: 2025-02-19 08:50:27
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-20 21:16:01
 * @Description: 聊天接口
 */
import request from '@api/index'

// 华为云 DeepSeek-r1 模型
// export const deepSeekR1 = (data: Array<{ role: string, content: string }>) => {
//     // return fetch('http://localhost:2025/api/v1/deepseek-r1/chat', {
//     return fetch('https://ai.anixuil.com/api/v1/deepseek-r1/chat', {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
// }

export const deepSeekR1 = (data: Array<{ role: string, content: string }>) => {
    const body = {
        model: "DeepSeek-R1",
        max_tokens: 4000,
        stream: true,
        stream_options: {
            include_usage: true
        },
        temperature: 0,
        // top_k: 10, // 从概率最高的K个候选词中选择（聚焦质量）
        // top_p: 0.9, // 从累积概率达到p的候选词中选择（平衡多样性）
        messages: [
            {
                role: "system",
                content: "你是WebStartUI的智能助手且是一个前端高手，回答问题时，请使用markdown格式。"
            },
            ...data
        ],
    }

    // 计算messages中后五条各content的长度 如果换算成tokens超过4000，则算出需要截取的条数
    let totalLength = 0;
    for (const message of body.messages.slice(-5)) {
        totalLength += message.content.length;
    }
    // 如果换算成tokens超过4000，则算出需要截取的条数
    if (totalLength > 1000) {
        const needCutLength = totalLength - 1000;
        const cutLength = Math.floor(needCutLength / 5);
        body.messages = body.messages.slice(-5 - cutLength);
    }

    return fetch('https://infer-modelarts-cn-southwest-2.modelarts-infer.com/v1/infers/952e4f88-ef93-4398-ae8d-af37f63f0d8e/v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mkmNcK47hTpCn8xKhQn0PKYr0hpbIf_qaHd3UXN2RLfhiNEK01ciie8wRfKIpD0xl5SY91IbNov30LlayRNWXw'
        },
    })
}

