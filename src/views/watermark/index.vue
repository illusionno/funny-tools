<template>
  <VContainer title="图片加水印">
    <div class="watermark-tool">
      <el-card class="control-card">
        <el-space direction="vertical" fill size="large" style="width: 100%">
          <!-- 图片上传 -->
          <el-card shadow="never">
            <template #header>
              <span>1️⃣ 上传图片</span>
            </template>
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="handleImageUpload"
              drag
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽图片到此处或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">支持 JPG/PNG/WebP 格式</div>
              </template>
            </el-upload>
          </el-card>

          <!-- 水印类型选择 -->
          <el-card shadow="never" v-if="originalImage">
            <template #header>
              <span>2️⃣ 选择水印类型</span>
            </template>
            <el-radio-group v-model="watermarkType" @change="handleTypeChange">
              <el-radio-button label="text">文字水印</el-radio-button>
              <el-radio-button label="image">图片水印</el-radio-button>
            </el-radio-group>
          </el-card>

          <!-- 文字水印配置 -->
          <el-card
            shadow="never"
            v-if="originalImage && watermarkType === 'text'"
          >
            <template #header>
              <span>✏️ 文字水印设置</span>
            </template>

            <el-form label-width="100px" label-position="left">
              <el-form-item label="水印文字">
                <el-input
                  v-model="textConfig.text"
                  placeholder="输入水印文字..."
                  @input="updatePreview"
                />
              </el-form-item>

              <el-form-item label="字体大小">
                <el-slider
                  v-model="textConfig.fontSize"
                  :min="12"
                  :max="200"
                  show-input
                  @change="updatePreview"
                />
              </el-form-item>

              <el-form-item label="字体颜色">
                <el-color-picker
                  v-model="textConfig.color"
                  show-alpha
                  @change="updatePreview"
                />
              </el-form-item>

              <el-form-item label="透明度">
                <el-slider
                  v-model="textConfig.opacity"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  show-input
                  @change="updatePreview"
                />
              </el-form-item>

              <el-form-item label="旋转角度">
                <el-slider
                  v-model="textConfig.rotation"
                  :min="-180"
                  :max="180"
                  show-input
                  @change="updatePreview"
                >
                  <template #default="{ modelValue }">
                    {{ modelValue }}°
                  </template>
                </el-slider>
              </el-form-item>

              <el-form-item label="水印模式">
                <el-radio-group
                  v-model="textConfig.mode"
                  @change="updatePreview"
                >
                  <el-radio label="single">单个</el-radio>
                  <el-radio label="tile">平铺</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="位置" v-if="textConfig.mode === 'single'">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-input-number
                      v-model="textConfig.x"
                      controls-position="right"
                      :min="0"
                      :max="canvasWidth"
                      size="small"
                      @change="updatePreview"
                    />
                    <span style="margin-left: 5px; font-size: 12px">X坐标</span>
                  </el-col>
                  <el-col :span="12">
                    <el-input-number
                      v-model="textConfig.y"
                      controls-position="right"
                      :min="0"
                      :max="canvasHeight"
                      size="small"
                      @change="updatePreview"
                    />
                    <span style="margin-left: 5px; font-size: 12px">Y坐标</span>
                  </el-col>
                </el-row>
                <el-alert
                  type="info"
                  :closable="false"
                  style="margin-top: 10px"
                >
                  💡 提示：可以直接在预览区域拖拽水印调整位置
                </el-alert>
              </el-form-item>

              <el-form-item label="平铺间距" v-if="textConfig.mode === 'tile'">
                <el-slider
                  v-model="textConfig.tileSpacing"
                  :min="100"
                  :max="500"
                  show-input
                  @change="updatePreview"
                />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 图片水印配置 -->
          <el-card
            shadow="never"
            v-if="originalImage && watermarkType === 'image'"
          >
            <template #header>
              <span>🏷️ 图片水印设置</span>
            </template>

            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="handleLogoUpload"
              drag
            >
              <el-icon class="el-icon--upload"><picture-filled /></el-icon>
              <div class="el-upload__text">上传Logo或图片水印</div>
            </el-upload>

            <el-form
              label-width="100px"
              label-position="left"
              style="margin-top: 20px"
              v-if="logoImage"
            >
              <el-form-item label="缩放比例">
                <el-slider
                  v-model="logoConfig.scale"
                  :min="0.1"
                  :max="3"
                  :step="0.1"
                  show-input
                  @change="updatePreview"
                />
              </el-form-item>

              <el-form-item label="透明度">
                <el-slider
                  v-model="logoConfig.opacity"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  show-input
                  @change="updatePreview"
                />
              </el-form-item>

              <el-form-item label="旋转角度">
                <el-slider
                  v-model="logoConfig.rotation"
                  :min="-180"
                  :max="180"
                  show-input
                  @change="updatePreview"
                >
                  <template #default="{ modelValue }">
                    {{ modelValue }}°
                  </template>
                </el-slider>
              </el-form-item>

              <el-form-item label="位置">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-input-number
                      v-model="logoConfig.x"
                      controls-position="right"
                      :min="0"
                      :max="canvasWidth"
                      size="small"
                      @change="updatePreview"
                    />
                    <span style="margin-left: 5px; font-size: 12px">X坐标</span>
                  </el-col>
                  <el-col :span="12">
                    <el-input-number
                      v-model="logoConfig.y"
                      controls-position="right"
                      :min="0"
                      :max="canvasHeight"
                      size="small"
                      @change="updatePreview"
                    />
                    <span style="margin-left: 5px; font-size: 12px">Y坐标</span>
                  </el-col>
                </el-row>
                <el-alert
                  type="info"
                  :closable="false"
                  style="margin-top: 10px"
                >
                  💡 提示：可以直接在预览区域拖拽水印调整位置
                </el-alert>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 导出按钮 -->
          <el-button
            v-if="originalImage"
            type="primary"
            size="large"
            @click="downloadImage"
            :disabled="!canExport"
            style="width: 100%"
          >
            <el-icon><Download /></el-icon>
            下载带水印的图片
          </el-button>
        </el-space>
      </el-card>

      <!-- 预览区域 -->
      <el-card class="preview-card" v-if="originalImage">
        <template #header>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <span>👁️ 实时预览</span>
            <el-tag v-if="isDragging" type="warning" size="small"
              >拖拽中...</el-tag
            >
          </div>
        </template>
        <div class="canvas-container">
          <canvas
            ref="canvasRef"
            class="preview-canvas"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            :style="{
              cursor: isDragging ? 'grabbing' : isHovering ? 'grab' : 'default',
            }"
          ></canvas>
        </div>
      </el-card>

      <!-- 知识点 -->
      <el-card class="knowledge-card">
        <template #header>💡 核心知识点</template>
        <el-collapse>
          <el-collapse-item title="1. Canvas 旋转变换（rotate）" name="1">
            <p>
              <strong>旋转原理</strong>：Canvas
              的旋转是围绕原点(0,0)进行的，需要配合 translate 实现任意点旋转。
            </p>
            <pre><code>ctx.save();                    // 保存状态
ctx.translate(x, y);           // 移动原点到目标位置
ctx.rotate(angle * Math.PI / 180); // 旋转（弧度制）
ctx.drawImage(...);            // 绘制
ctx.restore();                 // 恢复状态</code></pre>
          </el-collapse-item>

          <el-collapse-item title="2. 鼠标拖拽交互" name="2">
            <p>通过 mousedown/mousemove/mouseup 实现拖拽功能。</p>
            <pre><code>// 记录鼠标偏移量
const offsetX = e.offsetX - watermarkX;
const offsetY = e.offsetY - watermarkY;

// 更新位置
watermarkX = e.offsetX - offsetX;
watermarkY = e.offsetY - offsetY;</code></pre>
          </el-collapse-item>

          <el-collapse-item title="3. 平铺水印算法" name="3">
            <p>通过嵌套循环实现全屏平铺，间距可调。</p>
            <pre><code>for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const x = col * spacing;
    const y = row * spacing;
    drawWatermark(x, y);
  }
}</code></pre>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </VContainer>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled, PictureFilled, Download } from "@element-plus/icons-vue";
import VContainer from "@/components/v-container/Container.vue";

// ==================== 状态管理 ====================
const originalImage = ref(null);
const logoImage = ref(null);
const canvasRef = ref(null);
const watermarkType = ref("text");

// Canvas 尺寸
const canvasWidth = ref(0);
const canvasHeight = ref(0);

// 拖拽状态
const isDragging = ref(false);
const isHovering = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

// 文字水印配置
const textConfig = ref({
  text: "版权所有",
  fontSize: 48,
  color: "#ffffff",
  opacity: 0.5,
  rotation: -45,
  x: 100,
  y: 100,
  mode: "tile", // 'single' | 'tile'
  tileSpacing: 200,
  fontFamily: "Arial",
});

// Logo水印配置
const logoConfig = ref({
  scale: 0.3,
  opacity: 0.8,
  rotation: 0,
  x: 100,
  y: 100,
});

// ==================== 计算属性 ====================
const canExport = computed(() => {
  if (watermarkType.value === "text") {
    return originalImage.value && textConfig.value.text;
  } else {
    return originalImage.value && logoImage.value;
  }
});

// ==================== 图片上传 ====================
const handleImageUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      originalImage.value = img;
      canvasWidth.value = img.width;
      canvasHeight.value = img.height;

      // 初始化水印位置（居中）
      textConfig.value.x = img.width / 2;
      textConfig.value.y = img.height / 2;
      logoConfig.value.x = img.width / 2;
      logoConfig.value.y = img.height / 2;

      nextTick(() => {
        updatePreview();
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

const handleLogoUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      logoImage.value = img;
      updatePreview();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

const handleTypeChange = () => {
  updatePreview();
};

// ==================== 核心：Canvas 绘制水印 ====================
/**
 * 绘制单个文字水印（支持旋转）
 */
const drawSingleTextWatermark = (ctx, x, y) => {
  const { text, fontSize, color, opacity, rotation } = textConfig.value;

  if (!text) return;

  ctx.save();

  ctx.font = `${fontSize}px ${textConfig.value.fontFamily}`;
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 核心：旋转变换
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.fillText(text, 0, 0);

  ctx.restore();
};

/**
 * 绘制平铺文字水印
 */
const drawTileTextWatermark = (ctx, canvas) => {
  const { tileSpacing } = textConfig.value;

  const rows = Math.ceil(canvas.height / tileSpacing) + 2;
  const cols = Math.ceil(canvas.width / tileSpacing) + 2;

  for (let i = -1; i < rows; i++) {
    for (let j = -1; j < cols; j++) {
      const x = j * tileSpacing;
      const y = i * tileSpacing;
      drawSingleTextWatermark(ctx, x, y);
    }
  }
};

/**
 * 绘制图片水印（支持旋转）
 */
const drawImageWatermark = (ctx) => {
  if (!logoImage.value) return;

  const { scale, opacity, rotation, x, y } = logoConfig.value;

  const logoWidth = logoImage.value.width * scale;
  const logoHeight = logoImage.value.height * scale;

  ctx.save();

  ctx.globalAlpha = opacity;

  // 核心：旋转变换
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(
    logoImage.value,
    -logoWidth / 2,
    -logoHeight / 2,
    logoWidth,
    logoHeight
  );

  ctx.restore();
};

/**
 * 更新预览
 */
const updatePreview = () => {
  if (!originalImage.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  canvas.width = originalImage.value.width;
  canvas.height = originalImage.value.height;

  // 1. 绘制原图
  ctx.drawImage(originalImage.value, 0, 0);

  // 2. 绘制水印
  if (watermarkType.value === "text") {
    if (textConfig.value.mode === "tile") {
      drawTileTextWatermark(ctx, canvas);
    } else {
      drawSingleTextWatermark(ctx, textConfig.value.x, textConfig.value.y);
    }
  } else if (watermarkType.value === "image") {
    drawImageWatermark(ctx);
  }
};

// ==================== 鼠标拖拽交互 ====================
const handleMouseDown = (e) => {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const scaleX = canvasRef.value.width / rect.width;
  const scaleY = canvasRef.value.height / rect.height;

  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  // 判断是否点击在水印区域（简化版：50px范围内）
  const config =
    watermarkType.value === "text" ? textConfig.value : logoConfig.value;

  if (watermarkType.value === "text" && textConfig.value.mode === "tile") {
    return; // 平铺模式不支持拖拽
  }

  const distance = Math.sqrt(
    Math.pow(mouseX - config.x, 2) + Math.pow(mouseY - config.y, 2)
  );

  if (distance < 100) {
    isDragging.value = true;
    dragOffset.value = {
      x: mouseX - config.x,
      y: mouseY - config.y,
    };
  }
};

const handleMouseMove = (e) => {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const scaleX = canvasRef.value.width / rect.width;
  const scaleY = canvasRef.value.height / rect.height;

  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  // 检测悬停
  const config =
    watermarkType.value === "text" ? textConfig.value : logoConfig.value;
  const distance = Math.sqrt(
    Math.pow(mouseX - config.x, 2) + Math.pow(mouseY - config.y, 2)
  );
  isHovering.value = distance < 100;

  // 拖拽移动
  if (isDragging.value) {
    const newX = mouseX - dragOffset.value.x;
    const newY = mouseY - dragOffset.value.y;

    if (watermarkType.value === "text") {
      textConfig.value.x = Math.max(0, Math.min(newX, canvasWidth.value));
      textConfig.value.y = Math.max(0, Math.min(newY, canvasHeight.value));
    } else {
      logoConfig.value.x = Math.max(0, Math.min(newX, canvasWidth.value));
      logoConfig.value.y = Math.max(0, Math.min(newY, canvasHeight.value));
    }

    updatePreview();
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

// ==================== 下载图片 ====================
const downloadImage = () => {
  if (!canvasRef.value) return;

  try {
    canvasRef.value.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `watermarked_${Date.now()}.png`;
        link.click();

        URL.revokeObjectURL(url);

        ElMessage.success("图片已下载！");
      },
      "image/png",
      1.0
    );
  } catch (error) {
    console.error("下载失败:", error);
    ElMessage.error("下载失败，请重试");
  }
};
</script>

<style scoped>
.watermark-tool {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.control-card {
  height: fit-content;
  position: sticky;
  top: 20px;
}

.preview-card {
  grid-column: 2;
  grid-row: 1;
}

.knowledge-card {
  grid-column: 1 / -1;
  margin-top: 20px;
}

.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 20px
    20px;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
}

.preview-canvas {
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  user-select: none;
}

.el-icon--upload {
  font-size: 67px;
  color: #8c939d;
  margin-bottom: 16px;
}

pre {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 13px;
}

code {
  font-family: "Consolas", "Monaco", monospace;
  color: #e83e8c;
}

@media (max-width: 1200px) {
  .watermark-tool {
    grid-template-columns: 1fr;
  }

  .preview-card {
    grid-column: 1;
    grid-row: 2;
  }

  .control-card {
    position: static;
  }
}
</style>
