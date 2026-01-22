// services/llm.ts
import { parseSSE } from "@/utils/sse";
const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * 支持 signal 参数用于中断流式请求
 * @param messages 消息历史
 * @param model 模型名
 * @param onDelta 流式回调
 * @param options 可选参数，支持 signal
 */
export async function streamChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string,
  onDelta: (delta: {
    id?: string;
    content?: string;
    reasoning_content?: string;
  }) => void,
  options?: { signal?: AbortSignal }
) {
  console.log(model, "aa");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: 4096,
      messages,
    }),
    // 可以让fetch主动中断请求
    signal: options?.signal, //将 signal 传递给 fetch
  });
  // 获取HTTP响应的可读流
  const reader = response.body!.getReader();
  // 创建UTF-8解码器
  const decoder = new TextDecoder("utf-8");

  while (true) {
    if (options?.signal?.aborted) {
      // 如果已中断，退出循环
      break;
    }
    // 从流中读取数据块
    const { value, done } = await reader.read();
    if (done) break;
    // 将从流中读取到的二进制数据 value，使用 UTF-8 解码器 decoder 转换为字符串
    const chunk = decoder.decode(value, { stream: true });
    parseSSE(chunk, onDelta);
  }
}
