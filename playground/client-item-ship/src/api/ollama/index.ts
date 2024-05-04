import request from "@/utils/request.ts"
import ollama from 'ollama/browser'

export function generateApi(prompt: string, model: string = 'llama2') {
    return request({
        url: '/ollama/generate',
        method: 'post',
        // responseType:'stream',
        data: {
            model,
            prompt,
        }
    })
}

export async function chatApi(message, model: string = 'llama2') {
    return await ollama.chat({model: 'llama2', messages: [message], stream: true})
}