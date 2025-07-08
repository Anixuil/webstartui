/*
 * @Author: Anixuil
 * @Date: 2025-02-19 08:50:27
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-04-14 16:49:01
 * @Description: 聊天接口
 */

export const deepSeekR1 = (data: Array<{ role: string, content: string }>, scene: string) => {
    const body = {
        model: "deepseek-reasoner",
        max_tokens: 4096,
        stream: true,
        // temperature: 0,
        // top_k: 10, // 从概率最高的K个候选词中选择（聚焦质量）
        // top_p: 0.9, // 从累积概率达到p的候选词中选择（平衡多样性）
        messages: [
            {
                role: "system",
                content: scene
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

    // return fetch('http://localhost:3000/ani-server/ai/deepseek', {
    return fetch('https://api.anixuil.com/ani-server/ai/deepseek', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

