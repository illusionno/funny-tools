<template>
  <el-row class="qrg-root" :gutter="20">
    <el-col :span="12">
      <el-card shadow="hover">
        <el-form label-position="top">
          <el-form-item label="内容">
            <el-input
              v-model="text"
              type="textarea"
              :rows="6"
              placeholder="输入要编码的内容"
            />
          </el-form-item>

          <el-form-item label="尺寸">
            <el-slider v-model="size" :min="128" :max="1024" show-input />
          </el-form-item>

          <el-form-item label="前景色">
            <el-color-picker v-model="color" />
          </el-form-item>

          <el-form-item label="背景色">
            <el-color-picker v-model="bgColor" />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="useMargin">带白边</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="generate" :loading="generating"
              >生成</el-button
            >
            <el-button @click="downloadPng" :disabled="!generated"
              >下载 PNG</el-button
            >
            <el-button @click="downloadSvg" :disabled="!generated"
              >下载 SVG</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card class="preview" shadow="hover">
        <div class="canvas-wrap">
          <canvas ref="canvasRef" :width="size" :height="size"></canvas>
          <div v-if="generating" class="overlay">生成中…</div>
        </div>
        <div class="meta">
          <p v-if="generated">已生成 • 内容长度: {{ text.length }} 字符</p>
          <p v-else>尚未生成二维码</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import QRCode from "qrcode";

const text = ref("https://example.com");
const size = ref(256);
const color = ref("#111111");
const bgColor = ref("#ffffff");
const useMargin = ref(true);
const generating = ref(false);
const generated = ref(false);
const canvasRef = ref(null);

function buildOptions() {
  return {
    width: size.value,
    color: { dark: color.value, light: bgColor.value },
    margin: useMargin.value ? 4 : 0,
    errorCorrectionLevel: "M",
  };
}

async function generate() { 
  if (!canvasRef.value) return;
  generating.value = true;
  generated.value = false;
  try {
    const opts = buildOptions();
    await QRCode.toCanvas(canvasRef.value, text.value || " ", opts);
    generated.value = true;
  } catch (err) {
    console.error("二维码生成失败", err);
    ElMessage.error("生成二维码失败：" + err.message);
  } finally {
    generating.value = false;
  }
}

function downloadPng() {
  if (!canvasRef.value) return;
  const a = document.createElement("a");
  a.href = canvasRef.value.toDataURL("image/png");
  a.download = sanitizeFilename(text.value || "qrcode") + ".png";
  a.click();
}

async function downloadSvg() {
  try {
    const opts = buildOptions();
    const svgString = await QRCode.toString(text.value || " ", {
      ...opts,
      type: "svg",
    });
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sanitizeFilename(text.value || "qrcode") + ".svg";
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("SVG 导出失败", err);
    ElMessage.error("SVG 导出失败：" + err.message);
  }
}

function sanitizeFilename(s) {
  return s.replace(/[^a-z0-9\-_.()\u4e00-\u9fa5]/gi, "_").slice(0, 50);
}

let timeout;
watch([text, size, color, bgColor, useMargin], () => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    generate();
  }, 400);
});

onMounted(() => {
  generate();
});
</script>

<style scoped>
.qrg-root {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial;
}
.canvas-wrap {
  position: relative;
  display: inline-block;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(13, 24, 31, 0.06);
}
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}
.meta {
  margin-top: 8px;
  color: #666;
}
.hint {
  margin-top: 8px;
  color: #888;
  font-size: 12px;
}
</style>
s