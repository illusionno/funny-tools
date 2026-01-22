<script setup>
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { CaretRight } from "@element-plus/icons-vue";
import { streamChatCompletion } from "../../../services/llm";
import LetsIconsStop from "~icons/lets-icons/stop";
import { ElMessage ,ElMessageBox} from 'element-plus'

const visible = defineModel({ default: false });
const input = ref("");
const messageList = ref(null);
// LLM 是 无状态的，所以每次对话都需要传入完整的消息历史记录
const messages = ref([
  // role: 'system', 'user', 'assistant', 'tool'
  { role: "assistant", content: "你好！我是 AI助手，有什么可以帮你？" },
]);

const modelOptions = [
  "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
  "tencent/Hunyuan-MT-7B",
  "Qwen/Qwen2.5-Coder-7B-Instruct",
  "internlm/internlm2_5-7b-chat",
];
const modelName = ref(modelOptions[0]);

const modelDescriptions = {
  "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B":
    "DeepSeek推出的基于Qwen3-8B优化的推理增强模型，专注于数学和推理任务",
  "tencent/Hunyuan-MT-7B":
    "腾讯混元团队开发的7B多语言翻译模型，支持多种语言对翻译",
  "Qwen/Qwen2.5-Coder-7B-Instruct":
    "通义千问团队开发的7B代码生成专用模型，针对编程任务进行指令优化",
  "internlm/internlm2_5-7b-chat":
    "上海AI实验室推出的7B对话优化模型，具备较强的中文对话和理解能力",
};
const modelDescription = computed(() => {
  return modelDescriptions[modelName.value] || "通用大语言模型";
});
const scrollToBottom = () => {
  nextTick(() => {
    const el = messageList.value;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  });
};

const isLoading = ref(false);
let abortController = null;
// 停止流式输出
const stopMessage = () => {
  isLoading.value = false;
  // 中止一个尚未完成的异步操作。这能够中止 fetch 请求及任何响应体和流的使用。
  abortController?.abort();
};
// 支持代码高亮
marked.setOptions({
  highlight(code, lang) {
    return hljs.highlightAuto(code, [lang]).value;
  },
});
// markdown渲染函数
const renderMarkdown = (text) => {
  return marked.parse(text);
};

// -----------滑动窗口实现上下文管理---------------
const MAX_HISTORY = 15;//只保留最近15轮对话
const getContextMessages = () => {
  if (!messages.value?.length) return [];
  
  const systemMsgs = messages.value.filter(m => m.role === 'system');
  const conversationMsgs = messages.value.filter(m => m.role !== 'system');
  
  // 只保留最近 N*2 条对话
  const recentMsgs = conversationMsgs.slice(-MAX_HISTORY * 2);
  return [...systemMsgs, ...recentMsgs];
};


// 新增一个通用的流式回复函数
const streamReply = async () => {
  scrollToBottom();
  const aiMessage = {
    role: "assistant",
    content: "",
    reasoning: "",
    _streaming: true,
    isExpanded: false,
  };
  messages.value.push(aiMessage);
  scrollToBottom();
  isLoading.value = true;
  abortController = new AbortController();

  try {
    await streamChatCompletion(
      getContextMessages(),
      modelName.value,
      (delta) => {
        if (delta.reasoning_content) {
          aiMessage.reasoning += delta.reasoning_content;
        }
        if (delta.content) {
          aiMessage.content += delta.content;
        }
        messages.value = [...messages.value];
        scrollToBottom();
      },
      { signal: abortController.signal }
    );
    delete aiMessage._streaming;
    messages.value = [...messages.value];
  } catch (error) {
    if (error.name !== "AbortError") {
      console.log(error, "error");
    }
  } finally {
    isLoading.value = false;
  }
};

// -----------对用户输入进行清洗和验证-------------
// 配置常量
const CONFIG = {
  MAX_LENGTH: 2000, // 最大字符长度
  MAX_LINES: 50, // 最大行数
  MERGE_INTERVAL: 2000, // 2秒内的输入视为连续输入（毫秒）
};

// Prompt injection 检测模式 提示注入检测
const INJECTION_PATTERNS = [
  /ignore\s+(previous|above|all)\s+instructions?/i,
  /you\s+are\s+now/i,
  /system\s*:/i,
  /\[SYSTEM\]/i,
  /<\|.*?\|>/g, // 特殊标记
  /```.*?(?:system|assistant)/i,
];

// 存储上次输入时间，用于合并连续输入
let lastInputTime = 0;
let pendingInput = "";

// 输入清洗函数
const sanitizeInput = (text) => {
  if (!text) return "";

  // 1. 去除首尾空格
  let cleaned = text.trim();

  // 2. 合并多个连续空格为单个空格
  cleaned = cleaned.replace(/\s+/g, " ");

  // 3. 合并多个连续换行（保留最多2个）
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // 4. 移除特殊控制字符（保留换行、制表符等常用字符）
  cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  return cleaned;
};

// 长度验证
const validateLength = (text) => {
  if (text.length > CONFIG.MAX_LENGTH) {
    return {
      valid: false,
      error: `输入超过最大长度限制 ${CONFIG.MAX_LENGTH} 字符`,
      truncated: text.slice(0, CONFIG.MAX_LENGTH),
    };
  }

  const lines = text.split("\n");
  if (lines.length > CONFIG.MAX_LINES) {
    return {
      valid: false,
      error: `输入超过最大行数限制 ${CONFIG.MAX_LINES} 行`,
      truncated: lines.slice(0, CONFIG.MAX_LINES).join("\n"),
    };
  }

  return { valid: true };
};

// Prompt injection 检测
const detectInjection = (text) => {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        detected: true,
        pattern: pattern.toString(),
        message: "检测到可能的恶意指令，请修改后重试",
      };
    }
  }

  // 检测过多的特殊符号
  const specialChars = text.match(/[<>{}[\]|\\]/g);
  if (specialChars && specialChars.length > text.length * 0.1) {
    return {
      detected: true,
      message: "输入包含过多特殊字符",
    };
  }

  return { detected: false };
};

// 合并连续输入
const mergeIfContinuous = (newInput) => {
  const now = Date.now();

  if (now - lastInputTime < CONFIG.MERGE_INTERVAL && pendingInput) {
    // 合并输入
    pendingInput = pendingInput + "\n" + newInput;
    lastInputTime = now;
    return { merged: true, content: pendingInput };
  } else {
    // 新的输入序列
    pendingInput = newInput;
    lastInputTime = now;
    return { merged: false, content: newInput };
  }
};

// 发送消息
const sendMessage = async () => {
  // 1. 基础验证
  console.log(1,input.value.trim())
  if (!input.value.trim()) return;

  // 2. 清洗输入
  let cleanedInput = sanitizeInput(input.value);

  // 3. 长度验证
  const lengthCheck = validateLength(cleanedInput);
  if (!lengthCheck.valid) {
    // 提示用户并选择是否截断
    ElMessageBox.confirm(`${lengthCheck.error}\n是否自动截断发送？`, '长度超限', {
      confirmButtonText: '是',
      cancelButtonText: '否',
    }).then(() => {
      cleanedInput = lengthCheck.truncated;
    }).catch(() => {
      return;
    });
  }

  // 4. Prompt injection 检测
  const injectionCheck = detectInjection(cleanedInput);
  if (injectionCheck.detected) {
    ElMessage.error(`安全警告: ${injectionCheck.message}`)
    return;
  }

  // 5. 合并连续输入（可选功能）
  const mergeResult = mergeIfContinuous(cleanedInput);
  if (mergeResult.merged) {
    console.log("合并了连续输入");
  }
console.log(cleanedInput,'cleanedInput')
  // 6. 添加到消息列表
  messages.value.push({
    role: "user",
    content: cleanedInput,
    timestamp: Date.now(), // 可选：记录时间戳
  });

  // 7. 清空输入框
  input.value = "";

  // 8. 发送请求
  try {
    await streamReply();
  } catch (error) {
ElMessage.error(`消息发送失败: ${error.message}`)
  }
};
// 额外的：内容过滤（针对敏感词等）
// const filterSensitiveContent = (text) => {
//   // 这里可以接入敏感词库
//   const sensitiveWords = ['敏感词1', '敏感词2'];

//   let filtered = text;
//   sensitiveWords.forEach(word => {
//     const regex = new RegExp(word, 'gi');
//     filtered = filtered.replace(regex, '*'.repeat(word.length));
//   });

//   return filtered;
// };

// 翻译
const sendTranslate = async () => {
  if (!input.value.trim()) return;
  messages.value.push({
    role: "user",
    content: `请将以下内容翻译成英文：${input.value}`,
  });
  input.value = "";
  await streamReply();
};

// 摘要
const sendSummary = async () => {
  if (!input.value.trim()) return;
  messages.value.push({
    role: "user",
    content: `请帮我对以下内容进行摘要：${input.value}`,
  });
  input.value = "";
  await streamReply();
};

</script>
<template>
  <div>
    <el-drawer
      v-model="visible"
      size="50%"
      resizable
      header-class="drawer-header"
      footer-class="chat-input"
    >
      <template #title>
        <div>
          <div class="font-size-29 fw-700">AI Chat</div>
          <div class="font-12 font-size-12 py-4">
            模型介绍：{{ modelDescription }}
          </div>
        </div>
      </template>
      <div class="chat-messages" ref="messageList">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
          :class="msg.role"
        >
          <!-- 思考过程 -->
          <div v-if="msg.role === 'assistant' && msg.reasoning">
            <div class="flex gap-3 color-#686868">
              <span
                class="w-20 h-20 cursor-pointer"
                :class="msg.isExpanded ? 'rotate-90' : ''"
                @click="msg.isExpanded = !msg.isExpanded"
              >
                <CaretRight />
              </span>
              思考过程
            </div>
            <div v-if="!msg.isExpanded" style="font-size: 12px; color: #999">
              <div
                class="reasoning"
                v-html="renderMarkdown(msg.reasoning)"
              ></div>
            </div>
          </div>
          <!-- 最终完整回答 -->
          <div
            v-if="msg.role === 'assistant'"
            v-html="renderMarkdown(msg.content)"
          ></div>
          <!-- 用户消息 -->
          <div v-if="msg.role === 'user'">{{ msg.content }}</div>
        </div>
      </div>

      <template #footer>
        <el-select v-model="modelName" style="width: 120px">
          <el-option
            v-for="item in modelOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <input
          v-model="input"
          :placeholder="isLoading ? 'AI正在思考中...' : '请输入内容...'"
          @keydown.enter="sendMessage"
          :disabled="isLoading"
        />
<!--  -->
        <span
          @click="sendSummary"
          :disabled="isLoading || !input.trim()"
          class="extra-btn"
          >摘要</span
        >
        <span
          @click="sendTranslate"
          :disabled="isLoading || !input.trim()"
          class="extra-btn"
          >翻译</span
        >

        <span
          v-if="!isLoading"
          class="button"
          @click="sendMessage"
          :class="{ 'opacity-50 cursor-not-allowed': !input.trim() }"
        >
          <MdiSend />
        </span>
        <span v-else class="button" @click="stopMessage">
          <LetsIconsStop />
        </span>
      </template>
    </el-drawer>
  </div>
</template>
<style>
.drawer-header {
  background: #464546;
  color: #f3f3f3;
  border-bottom: 1px solid #e8e8e8;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 80%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
}

.message.ai {
  align-self: flex-start;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.message.user {
  align-self: flex-end;
  background: #464546;
  color: #fff;
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  outline: none;
}

.chat-input input:focus {
  border-color: #464546;
}

.chat-input .button {
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  background: #464546;
  color: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.reasoning {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 6px;
  border-radius: 6px;
  margin-top: 4px;
  overflow: auto;
}
.el-select__wrapper {
  height: 37px;
}
.extra-btn {
  border: 1px solid #686767;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
