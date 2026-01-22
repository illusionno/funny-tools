<template>
  <VContainer title="打字速度测试">
    <div class="typing-test-container">
      <el-card class="main-card">
        <template #header>
          <div class="card-header">
            <el-button type="primary" @click="resetTest">重新开始</el-button>
          </div>
        </template>

        <!-- 统计面板 -->
        <el-row :gutter="20" class="stats-panel">
          <el-col :span="6">
            <el-statistic title="WPM (每分钟字数)" :value="wpm">
              <template #suffix>
                <span style="font-size: 16px">字/分</span>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="准确率" :value="accuracy" :precision="1">
              <template #suffix>
                <span style="font-size: 16px">%</span>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="已用时间" :value="elapsedTime">
              <template #suffix>
                <span style="font-size: 16px">秒</span>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="进度" :value="progress" :precision="0">
              <template #suffix>
                <span style="font-size: 16px">%</span>
              </template>
            </el-statistic>
          </el-col>
        </el-row>

        <!-- 难度选择 -->
        <div class="difficulty-selector">
          <span class="label">选择内容类型：</span>
          <el-radio-group v-model="textType" @change="resetTest">
            <el-radio-button label="article">中文文章</el-radio-button>
            <el-radio-button label="code">代码片段</el-radio-button>
            <el-radio-button label="english">英文文章</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 目标文本显示区（带高亮） -->
        <div class="target-text-container">
          <div class="target-text">
            <span
              v-for="(char, index) in targetText"
              :key="index"
              :class="getCharClass(index)"
            >
              {{ char }}
            </span>
            <span class="cursor" v-if="!isFinished">|</span>
          </div>
        </div>

        <!-- 用户输入区 -->
        <div class="input-container">
          <el-input
            ref="inputRef"
            v-model="userInput"
            type="textarea"
            :rows="4"
            placeholder="点击这里开始打字..."
            :disabled="isFinished"
            @keydown="handleKeyDown"
            @input="handleInput"
            @focus="handleFocus"
          />
        </div>

        <!-- 完成提示 -->
        <el-alert
          v-if="isFinished"
          title="🎉 完成！"
          type="success"
          :closable="false"
          class="finish-alert"
        >
          <template #default>
            <div class="finish-stats">
              <p><strong>总用时：</strong>{{ elapsedTime }} 秒</p>
              <p><strong>平均速度：</strong>{{ wpm }} 字/分钟</p>
              <p><strong>准确率：</strong>{{ accuracy.toFixed(2) }}%</p>
              <p><strong>评级：</strong>{{ getRating() }}</p>
            </div>
          </template>
        </el-alert>
      </el-card>

      <!-- 知识点讲解 -->
      <el-card class="knowledge-card">
        <template #header>
          <span>💡 核心知识点</span>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="keydown vs keypress">
            <strong>keydown</strong>: 按下任何键都触发（包括功能键），event.key
            获取按键值。 <strong>keypress</strong>（已废弃）:
            只在字符键按下时触发，不推荐使用。
          </el-descriptions-item>
          <el-descriptions-item label="时间戳精度">
            使用 <code>performance.now()</code> 替代 <code>Date.now()</code>，
            精度可达微秒级（0.001ms），避免系统时间调整影响。
          </el-descriptions-item>
          <el-descriptions-item label="WPM 计算公式">
            WPM = (正确字符数 / 5) / (时间(秒) / 60)。 英文中 1 word ≈ 5
            字符（含空格）。
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import VContainer from "@/components/v-container/Container.vue";

// ==================== 状态定义 ====================
const textType = ref<"article" | "code" | "english">("article");
const targetText = ref("");
const userInput = ref("");
const startTime: Ref<number | null> = ref(null);
const endTime: Ref<number | null> = ref(null);
const isFinished = ref(false);
const currentTime = ref(0); // 当前时间（用于实时更新）
const inputRef = ref();

// 错误字符记录（用于计算准确率）
const errorCount = ref(0);
const totalTypedChars = ref(0);

let timerInterval: number | null = null;

// ==================== 文本素材库 ====================
const textSamples = {
  article: [
    "在计算机科学中，算法是解决问题的一系列明确指令。一个优秀的算法不仅要保证正确性，还需要考虑时间复杂度和空间复杂度。数据结构与算法是程序员的基本功，它们决定了程序的性能和可扩展性。",
    "人工智能的发展正在深刻改变我们的生活方式。机器学习、深度学习等技术使计算机能够从数据中学习规律，实现图像识别、语音识别、自然语言处理等复杂任务。未来，AI将在更多领域发挥重要作用。",
  ],
  code: [
    `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    `const debounce = (fn, delay) => {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};`,
  ],
  english: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet and is often used for testing keyboards and fonts.",
    "Programming is not about what you know; it is about what you can figure out. The best way to learn is by doing, making mistakes, and learning from them.",
  ],
};

// ==================== 核心计算属性 ====================

// 已用时间（秒）
const elapsedTime = computed(() => {
  if (!startTime.value) return 0;
  const end = endTime.value || currentTime.value;
  return ((end - startTime.value) / 1000).toFixed(1);
});

// WPM 计算（Words Per Minute）
const wpm = computed(() => {
  if (!startTime.value || parseFloat(elapsedTime.value) === 0) return 0;

  // 核心公式：WPM = (正确字符数 / 5) / (分钟数)
  // 中文中，通常 1 个汉字 = 1 个 word
  const correctChars = userInput.value.length - errorCount.value;
  const minutes = parseFloat(elapsedTime.value) / 60;

  // 针对中文和英文采用不同计算方式
  if (textType.value === "english") {
    return Math.round(correctChars / 5 / minutes);
  } else {
    return Math.round(correctChars / minutes);
  }
});

// 准确率
const accuracy = computed(() => {
  if (totalTypedChars.value === 0) return 100;
  return (
    ((totalTypedChars.value - errorCount.value) / totalTypedChars.value) * 100
  );
});

// 进度
const progress = computed(() => {
  if (!targetText.value) return 0;
  return (userInput.value.length / targetText.value.length) * 100;
});

// ==================== 字符样式判断 ====================
const getCharClass = (index: number) => {
  if (index >= userInput.value.length) {
    return "char-pending";
  }

  const userChar = userInput.value[index];
  const targetChar = targetText.value[index];

  if (userChar === targetChar) {
    return "char-correct";
  } else {
    return "char-error";
  }
};

// ==================== 事件处理 ====================

/**
 * 核心知识点1：keydown 事件处理
 * - keydown: 任何按键按下时触发（包括 Ctrl、Shift、Delete 等）
 * - keypress: 已废弃，不推荐使用
 * - event.key: 获取按下的键值（'a', 'Enter', 'Backspace' 等）
 */
const handleKeyDown = (event: KeyboardEvent) => {
  // 启动计时器（第一次按键时）
  if (!startTime.value) {
    startTimer();
  }

  // 阻止某些特殊键的默认行为（可选）
  if (event.key === "Tab") {
    event.preventDefault();
  }

  // 调试输出（开发环境可以打开）
  // console.log('按键:', event.key, '| code:', event.code, '| keyCode:', event.keyCode);
};

const handleInput = () => {
  totalTypedChars.value = userInput.value.length;

  // 检测错误字符
  let errors = 0;
  for (let i = 0; i < userInput.value.length; i++) {
    if (userInput.value[i] !== targetText.value[i]) {
      errors++;
    }
  }
  errorCount.value = errors;

  // 检测是否完成
  if (userInput.value.length === targetText.value.length) {
    finishTest();
  }
};

const handleFocus = () => {
  // 聚焦时如果还没开始，则准备开始
  if (!startTime.value && userInput.value.length === 0) {
    // 可以在这里添加"准备开始"的提示
  }
};

// ==================== 计时器管理 ====================

/**
 * 核心知识点2：高精度时间戳
 * - performance.now(): 返回高精度时间戳（精度到微秒）
 * - Date.now(): 返回毫秒级时间戳，且可能受系统时间调整影响
 */
const startTimer = () => {
  startTime.value = performance.now();

  // 每 100ms 更新一次当前时间（用于实时显示）
  timerInterval = window.setInterval(() => {
    currentTime.value = performance.now();
  }, 100);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  endTime.value = performance.now();
};

// ==================== 测试流程控制 ====================

const resetTest = () => {
  // 随机选择一段文本
  const samples = textSamples[textType.value];
  targetText.value = samples[Math.floor(Math.random() * samples.length)];

  // 重置状态
  userInput.value = "";
  startTime.value = null;
  endTime.value = null;
  currentTime.value = 0;
  isFinished.value = false;
  errorCount.value = 0;
  totalTypedChars.value = 0;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // 聚焦输入框
  setTimeout(() => {
    inputRef.value?.focus();
  }, 100);
};

const finishTest = () => {
  stopTimer();
  isFinished.value = true;
};

// ==================== 评级系统 ====================
const getRating = () => {
  const speed = wpm.value;
  const acc = accuracy.value;

  if (acc < 90) return "😅 需要加强";
  if (speed < 30) return "🐌 新手上路";
  if (speed < 50) return "🚶 稳步前进";
  if (speed < 80) return "🏃 快速打字";
  if (speed < 120) return "🚀 打字高手";
  return "👑 打字之王";
};

// ==================== 生命周期 ====================
onMounted(() => {
  resetTest();
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
.typing-test-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}

.main-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
}

.stats-panel {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}

.stats-panel :deep(.el-statistic__head) {
  color: rgba(255, 255, 255, 0.8);
}

.stats-panel :deep(.el-statistic__content) {
  color: white;
  font-weight: bold;
}

.difficulty-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.label {
  font-weight: 500;
  color: #606266;
}

/* 目标文本样式 */
.target-text-container {
  margin-bottom: 20px;
  padding: 20px;
  background: #f9f9f9;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  min-height: 150px;
}

.target-text {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 18px;
  line-height: 1.8;
  letter-spacing: 0.5px;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 字符状态样式 */
.char-pending {
  color: #909399;
  background: transparent;
}

.char-correct {
  color: #67c23a;
  background: #f0f9ff;
  font-weight: 500;
}

.char-error {
  color: #f56c6c;
  background: #fef0f0;
  font-weight: 500;
  text-decoration: underline wavy #f56c6c;
}

/* 光标动画 */
.cursor {
  display: inline-block;
  animation: blink 1s infinite;
  color: #409eff;
  font-weight: bold;
  margin-left: 2px;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* 输入框样式 */
.input-container {
  margin-bottom: 20px;
}

.input-container :deep(.el-textarea__inner) {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 16px;
  line-height: 1.6;
}

/* 完成提示 */
.finish-alert {
  margin-top: 20px;
}

.finish-stats {
  padding: 10px 0;
}

.finish-stats p {
  margin: 8px 0;
  font-size: 16px;
}

/* 知识卡片 */
.knowledge-card {
  margin-top: 20px;
  border: 2px dashed #dcdfe6;
}

.knowledge-card code {
  padding: 2px 6px;
  background: #f5f7fa;
  border-radius: 3px;
  color: #e83e8c;
  font-family: "Consolas", monospace;
}
</style>
