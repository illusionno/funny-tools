<template>
  <VContainer title="倒数日/纪念日生成器">
    <div class="countdown-app">
      <el-card class="input-card">
        <!-- 输入表单 -->
        <el-form :model="form" label-width="100px" label-position="left">
          <el-form-item label="事件名称">
            <el-input
              v-model="form.eventName"
              placeholder="例如：春节、入职纪念日、宝宝出生..."
              maxlength="20"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="事件日期">
            <el-date-picker
              v-model="form.eventDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="类型">
            <el-radio-group v-model="form.mode">
              <el-radio label="countdown">倒计时（未来）</el-radio>
              <el-radio label="anniversary">纪念日（过去）</el-radio>
              <el-radio label="auto">自动判断</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="卡片尺寸">
            <el-radio-group v-model="form.cardSize">
              <el-radio-button label="portrait">
                <el-icon><Document /></el-icon>
                竖版 3:4
              </el-radio-button>
              <el-radio-button label="square">
                <el-icon><Grid /></el-icon>
                正方形 1:1
              </el-radio-button>
              <el-radio-button label="landscape">
                <el-icon><Monitor /></el-icon>
                横版 16:9
              </el-radio-button>
            </el-radio-group>
            <div class="size-hint">
              {{ sizeConfig[form.cardSize].hint }}
            </div>
          </el-form-item>

          <el-form-item label="卡片主题">
            <el-select v-model="form.theme" placeholder="选择主题">
              <el-option
                v-for="theme in themes"
                :key="theme.value"
                :label="theme.label"
                :value="theme.value"
              >
                <span>{{ theme.emoji }} {{ theme.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="generate"
              :disabled="!canGenerate"
            >
              生成卡片
            </el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 预览卡片 -->
      <el-card v-if="result" class="preview-card">
        <template #header>
          <div class="card-header">
            <span>✨ 预览效果（{{ sizeConfig[form.cardSize].label }}）</span>
            <div class="header-actions">
              <el-tag type="info" size="small">
                {{ sizeConfig[form.cardSize].dimensions }}
              </el-tag>
              <el-button
                type="success"
                @click="exportImage"
                :loading="exporting"
              >
                {{ exporting ? "生成中..." : "导出图片" }}
              </el-button>
            </div>
          </div>
        </template>

        <!-- 卡片容器（自适应） -->
        <div class="card-wrapper">
          <div
            ref="cardRef"
            class="share-card"
            :class="[`theme-${form.theme}`, `size-${form.cardSize}`]"
          >
            <div class="card-background"></div>
            <div class="card-content">
              <!-- 图标装饰 -->
              <div class="icon-decoration">{{ currentTheme?.emoji }}</div>

              <!-- 事件名称 -->
              <h1 class="event-name">{{ form.eventName || "未命名事件" }}</h1>

              <!-- 核心数字展示 -->
              <div class="days-container">
                <div class="days-number">{{ Math.abs(result.days) }}</div>
                <div class="days-label">{{ result.label }}</div>
              </div>

              <div class="footer-decoration">
                <span class="watermark">由倒数日生成器创建 @Funny-Tools</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 知识点 -->
      <el-card class="knowledge-card">
        <template #header>💡 核心知识点</template>
        <el-collapse>
          <el-collapse-item title="Day.js 日期计算" name="1">
            <p>
              使用 <code>dayjs().diff(targetDate, 'day')</code> 计算天数差。
            </p>
            <p>
              Day.js 比原生 Date 对象更易用且体积小（仅2KB），支持插件化扩展。
            </p>
          </el-collapse-item>
          <el-collapse-item title="html2canvas 导出图片" name="2">
            <p>
              将 DOM 节点转换为 Canvas，再用
              <code>canvas.toDataURL()</code> 导出为图片。
            </p>
            <p>
              适用于各种"生成海报"、"分享卡片"的场景。设置
              <code>scale: 2</code> 可提高清晰度。
            </p>
          </el-collapse-item>
          <el-collapse-item title="CSS 自适应容器查询" name="3">
            <p>使用 <code>aspect-ratio</code> CSS 属性保持固定宽高比。</p>
            <p>配合 <code>clamp()</code> 函数实现响应式字号，适配不同屏幕。</p>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </VContainer>
</template>

<script setup>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { Document, Grid, Monitor } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import VContainer from "@/components/v-container/Container.vue";

// ==================== 尺寸配置 ====================
const sizeConfig = {
  portrait: {
    label: "竖版",
    dimensions: "800×1000px",
    width: 800,
    height: 1000,
    ratio: 0.8, // width / height
    hint: "适合：微信、小红书、抖音分享",
  },
  square: {
    label: "正方形",
    dimensions: "800×800px",
    width: 800,
    height: 800,
    ratio: 1,
    hint: "适合：微信朋友圈、Instagram",
  },
  landscape: {
    label: "横版",
    dimensions: "1200×675px",
    width: 1200,
    height: 675,
    ratio: 16 / 9,
    hint: "适合：微博头图、PPT、桌面壁纸",
  },
};

// ==================== 主题配置 ====================
const themes = [
  { value: "sunset", label: "日落橙", emoji: "🌅" },
  { value: "ocean", label: "海洋蓝", emoji: "🌊" },
  { value: "spring", label: "春日绿", emoji: "🌸" },
  { value: "warm", label: "温暖红", emoji: "❤️" },
  { value: "night", label: "星空夜", emoji: "🌙" },
];

// ==================== 表单状态 ====================
const form = ref({
  eventName: "",
  eventDate: null,
  mode: "auto",
  theme: "sunset",
  cardSize: "portrait",
});

const result = ref(null);
const cardRef = ref(null);
const exporting = ref(false);

// ==================== 计算属性 ====================
const canGenerate = computed(() => {
  return form.value.eventName && form.value.eventDate;
});

const currentTheme = computed(() => {
  return themes.find((t) => t.value === form.value.theme);
});

// ==================== 核心计算函数 ====================
const calculate = () => {
  const today = dayjs();
  const target = dayjs(form.value.eventDate);

  const diffDays = target.diff(today, "day");

  let actualMode = form.value.mode;
  if (actualMode === "auto") {
    actualMode = diffDays >= 0 ? "countdown" : "anniversary";
  }

  const isCountdown = actualMode === "countdown";

  return {
    days: diffDays,
    weeks: Math.floor(Math.abs(diffDays) / 7),
    remainingDays: Math.abs(diffDays) % 7,
    dateStr: target.format("YYYY年MM月DD日"),
    label: isCountdown ? "天" : "天",
    prefix: isCountdown ? "距离还有" : "已经过去",
    generatedAt: today.format("YYYY-MM-DD HH:mm"),
    mode: actualMode,
  };
};

// ==================== 生成卡片 ====================
const generate = () => {
  if (!canGenerate.value) {
    ElMessage.warning("请填写完整信息");
    return;
  }

  result.value = calculate();

  ElMessage.success({
    message: "卡片生成成功！",
    duration: 1500,
  });
};

// ==================== 导出图片 ====================
const exportImage = async () => {
  if (!cardRef.value) return;

  exporting.value = true;

  try {
    const config = sizeConfig[form.value.cardSize];

    const canvas = await html2canvas(cardRef.value, {
      backgroundColor: null,
      scale: 2,
      width: config.width,
      height: config.height,
      logging: false,
      useCORS: true,
    });

    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = `${form.value.eventName || "倒数日"}_${
      form.value.cardSize
    }_${dayjs().format("YYYYMMDDHHmmss")}.png`;
    link.href = dataURL;
    link.click();

    ElMessage.success("图片已下载到本地！");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请重试");
  } finally {
    exporting.value = false;
  }
};

// ==================== 重置 ====================
const reset = () => {
  form.value = {
    eventName: "",
    eventDate: null,
    mode: "auto",
    theme: "sunset",
    cardSize: "portrait",
  };
  result.value = null;
};
</script>

<style scoped>
.countdown-app {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.input-card,
.preview-card,
.knowledge-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.size-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

/* ==================== 卡片容器（自适应）==================== */
.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  /* background: #f5f7fa; */
  border-radius: 8px;
  overflow-x: auto;
}

.share-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

/* 竖版 3:4 */
.share-card.size-portrait {
  width: 800px;
  height: 1000px;
}

/* 正方形 1:1 */
.share-card.size-square {
  width: 800px;
  height: 800px;
}

/* 横版 16:9 */
.share-card.size-landscape {
  width: 1200px;
  height: 675px;
}

/* 移动端自适应 */
@media (max-width: 1300px) {
  .share-card.size-landscape {
    width: 100%;
    max-width: 1000px;
    height: auto;
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 900px) {
  .share-card.size-portrait {
    width: 90vw;
    max-width: 600px;
    height: auto;
    aspect-ratio: 4 / 5;
  }

  .share-card.size-square {
    width: 90vw;
    max-width: 600px;
    height: auto;
    aspect-ratio: 1 / 1;
  }

  .share-card.size-landscape {
    width: 90vw;
    max-width: 800px;
    height: auto;
    aspect-ratio: 16 / 9;
  }
}

/* ==================== 卡片背景 ==================== */
.card-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.theme-sunset .card-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.theme-ocean .card-background {
  background: linear-gradient(135deg, #0093e9 0%, #80d0c7 100%);
}

.theme-spring .card-background {
  background: linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%);
}

.theme-warm .card-background {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.theme-night .card-background {
  background: linear-gradient(135deg, #2e1437 0%, #1c1b29 100%);
}

.theme-night .card-content {
  color: white;
}

/* 光斑装饰 */
.card-background::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 70%
  );
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, 20px);
  }
}

/* ==================== 卡片内容 ==================== */
.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
  color: white;
  text-align: center;
}

/* 图标装饰 */
.icon-decoration {
  font-size: clamp(50px, 8vw, 80px);
  margin-bottom: clamp(15px, 3%, 30px);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 事件名称 */
.event-name {
  font-size: clamp(24px, 4vw, 42px);
  font-weight: bold;
  margin: 0 0 clamp(20px, 4%, 40px) 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
  max-width: 90%;
  word-break: break-word;
}

/* 核心数字 */
.days-container {
  margin: clamp(15px, 3%, 30px) 0;
}

.days-number {
  font-size: clamp(60px, 12vw, 120px);
  font-weight: bold;
  line-height: 1;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
  font-family: "Arial Black", sans-serif;
}

.days-label {
  font-size: clamp(18px, 3vw, 32px);
  margin-top: clamp(8px, 1.5%, 15px);
  opacity: 0.9;
}

/* 详细信息 - 横版适配 */
.size-landscape .detail-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.size-landscape .info-item {
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.detail-info {
  margin-top: clamp(20px, 4%, 40px);
  padding: clamp(15px, 3%, 25px) clamp(20px, 4%, 30px);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  font-size: clamp(13px, 2vw, 16px);
  width: 85%;
  max-width: 500px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin: clamp(8px, 1.5%, 12px) 0;
  line-height: 1.6;
}

.info-item .label {
  opacity: 0.85;
}

.info-item .value {
  font-weight: bold;
}

/* 底部水印 */
.footer-decoration {
  position: absolute;
  bottom: clamp(15px, 3%, 25px);
  left: 0;
  right: 0;
  text-align: center;
}

.watermark {
  font-size: clamp(11px, 1.5vw, 13px);
  opacity: 0.6;
  font-style: italic;
}

code {
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  color: #e83e8c;
  font-family: "Consolas", monospace;
}
</style>
