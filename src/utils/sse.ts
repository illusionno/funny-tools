// utils/sse.ts
// 解析服务端发送的流数据，并把每一段增量内容（delta）提取出来
export function parseSSE(
  chunk: string,
  onDelta: (delta: {
    id?: string;
    content?: string;
    reasoning_content?: string;
  }) => void
) {
  const lines = chunk.split("\n");

  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    const data = line.replace("data:", "").trim();
    if (data === "[DONE]") return;
    try {
      const json = JSON.parse(data);
      const delta = json.choices?.[0]?.delta || {};
      // 只传存在的字段
      const result: {
        id?: string;
        content?: string;
        reasoning_content?: string;
      } = {};
      if (delta.id) result.id = delta.id;
      if (delta.content) result.content = delta.content;
      if (delta.reasoning_content)
        result.reasoning_content = delta.reasoning_content;
      onDelta(result);
    } catch (e) {
      console.error("SSE parse error", e);
    }
  }
}