<template>
  <VContainer title="Markdown 编辑器">
  <div class="md-editor-container">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="button-group">
            <el-button type="info" plain @click="handleClear">
              <el-icon class="el-icon--left"><Delete /></el-icon>清空
            </el-button>
            <el-button type="primary" @click="handleExportImage" :loading="exporting">
              <el-icon class="el-icon--left"><Picture /></el-icon>保存为图片
            </el-button>
          </div>
        </div>
      </template>

      <div class="editor-main">
        <el-row :gutter="0" class="full-height">
          <!-- 左侧编辑区 -->
          <el-col :span="12" class="col-edit">
            <div class="panel-header">编辑区</div>
            <el-input
              v-model="markdownText"
              type="textarea"
              placeholder="请输入 Markdown 内容..."
              class="md-input"
              resize="none"
              spellcheck="false"
            />
          </el-col>

          <!-- 右侧预览区 -->
          <el-col :span="12" class="col-preview">
            <div class="panel-header">实时预览</div>
            <div class="preview-scroll-container">
              <!-- 这个 div 是我们要截图的目标 -->
              <div ref="previewRef" class="markdown-body" v-html="renderedHtml"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
  </VContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import html2canvas from 'html2canvas'
import { ElMessage } from 'element-plus'
import { Delete, Picture } from '@element-plus/icons-vue'
import VContainer from "@/components/v-container/Container.vue";

// 状态
const markdownText = ref('# Hello Markdown\n\n- 输入一些内容\n- 右侧实时预览\n\n> 支持导出为图片哦！')
const previewRef = ref(null)
const exporting = ref(false)

// 简单的 Markdown 解析配置
marked.setOptions({
  breaks: true, // 支持回车换行
  gfm: true     // 启动 GitHub 风格 Markdown
})

// 计算属性：将 Markdown 转为 HTML
const renderedHtml = computed(() => {
  return marked.parse(markdownText.value || '')
})

// 功能：清空
const handleClear = () => {
  markdownText.value = ''
}

// 功能：导出为图片
const handleExportImage = async () => {
  if (!markdownText.value) {
    ElMessage.warning('没有内容可导出')
    return
  }

  exporting.value = true
  try {
    const element = previewRef.value
    if (!element) return

    // 使用 html2canvas 截图
    // scale: 2 提高清晰度
    // useCORS: true 允许跨域图片(如果有)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff', // 确保背景是白色的
      logging: false
    })

    // 转为图片链接并下载
    const imgUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imgUrl
    link.download = `markdown_export_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('图片导出成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.md-editor-container {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.box-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-card__body) {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-weight: bold;
  font-size: 18px;
}

.editor-main {
  height: 100%;
}

.full-height {
  height: 100%;
}

.panel-header {
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

/* 编辑区样式 */
.col-edit {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dcdfe6;
}

.md-input {
  flex: 1;
}

:deep(.el-textarea__inner) {
  height: 100% !important;
  border: none;
  border-radius: 0;
  padding: 15px;
  font-family: Consolas, Monaco, monospace;
  font-size: 14px;
  background-color: #fafafa;
  min-height: 500px !important;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: none;
}

/* 预览区样式 */
.col-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.preview-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 模拟 GitHub 风格的 Markdown 样式 (简化版) */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #24292e;
  word-wrap: break-word;
}

/* 针对 markdown 生成的 HTML 标签的基础样式 */
:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

:deep(.markdown-body h1) { font-size: 2em; }
:deep(.markdown-body h2) { font-size: 1.5em; }

:deep(.markdown-body p) {
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.markdown-body ul), 
:deep(.markdown-body ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

:deep(.markdown-body blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

:deep(.markdown-body code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
}

:deep(.markdown-body pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
  margin-bottom: 16px;
}

:deep(.markdown-body pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(.markdown-body img) {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
}
</style>