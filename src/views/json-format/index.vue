<template>
  <VContainer title="JSON格式化">
    <div class="json-tool-container">
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <div class="button-group">
              <el-button type="primary" @click="handleFormat">
                <el-icon class="el-icon--left"><Operation /></el-icon>格式化
              </el-button>
              <el-button type="success" @click="handleCompress">
                <el-icon class="el-icon--left"><Files /></el-icon>压缩
              </el-button>
              <el-button
                type="warning"
                @click="handleCopy"
                :disabled="!formattedJson"
              >
                <el-icon class="el-icon--left"><CopyDocument /></el-icon
                >复制结果
              </el-button>
              <el-button type="danger" plain @click="handleClear">
                <el-icon class="el-icon--left"><Delete /></el-icon>清空
              </el-button>
            </div>
          </div>
        </template>

        <!-- 错误提示区 -->
        <el-alert
          v-if="errorMsg"
          :title="errorMsg"
          type="error"
          show-icon
          class="error-alert"
          @close="errorMsg = ''"
        />

        <div class="editor-area">
          <el-row :gutter="20" class="full-height-row">
            <!-- 输入区 -->
            <el-col :span="12" class="editor-col">
              <div class="label">输入 JSON:</div>
              <el-input
                v-model="sourceJson"
                type="textarea"
                placeholder="请输入需要格式化的 JSON 字符串..."
                class="json-textarea"
                :rows="20"
                resize="none"
                spellcheck="false"
              />
            </el-col>

            <!-- 输出区 -->
            <el-col :span="12" class="editor-col">
              <div class="label">
                格式化结果:
                <span v-if="formattedJson" class="success-tag">
                  <el-icon><CircleCheck /></el-icon> Valid JSON
                </span>
              </div>
              <el-input
                v-model="formattedJson"
                type="textarea"
                placeholder="等待格式化..."
                class="json-textarea result-textarea"
                :rows="20"
                readonly
                resize="none"
              />
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </VContainer>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import {
  Operation,
  Files,
  CopyDocument,
  Delete,
  CircleCheck,
} from "@element-plus/icons-vue";
import VContainer from "@/components/v-container/Container.vue";

// 数据定义
const sourceJson = ref("");
const formattedJson = ref("");
const errorMsg = ref("");

// 核心工具函数：尝试解析 JSON
const parseJson = (jsonStr) => {
  try {
    // 1. 处理空输入
    if (!jsonStr.trim()) {
      errorMsg.value = "请输入 JSON 字符串";
      return null;
    }

    // 2. 尝试解析 (处理可能存在的非标准单引号等，这里只做标准 JSON 解析)
    // 如果需要支持非标准 JSON (如 key 没有引号)，可以使用 eval 或 new Function，但有安全风险
    // 这里坚持使用标准 JSON.parse
    const obj = JSON.parse(jsonStr);
    errorMsg.value = ""; // 清除错误
    return obj;
  } catch (e) {
    errorMsg.value = `JSON 语法错误: ${e.message}`;
    formattedJson.value = ""; // 解析失败清空结果
    return null;
  }
};

// 功能：格式化 (2空格缩进)
const handleFormat = () => {
  const obj = parseJson(sourceJson.value);
  if (obj) {
    formattedJson.value = JSON.stringify(obj, null, 2);
    ElMessage.success("格式化成功");
  }
};

// 功能：压缩 (无空格)
const handleCompress = () => {
  const obj = parseJson(sourceJson.value);
  if (obj) {
    formattedJson.value = JSON.stringify(obj);
    ElMessage.success("压缩成功");
  }
};

// 功能：复制结果
const handleCopy = async () => {
  if (!formattedJson.value) return;

  try {
    await navigator.clipboard.writeText(formattedJson.value);
    ElMessage.success("已复制到剪贴板");
  } catch (err) {
    ElMessage.error("复制失败，请手动复制");
  }
};

// 功能：清空
const handleClear = () => {
  sourceJson.value = "";
  formattedJson.value = "";
  errorMsg.value = "";
};
</script>

<style scoped>
.json-tool-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
}

.box-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 让 Element Plus 的 Card Body 撑满剩余高度 */
:deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止双重滚动条 */
  padding-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.error-alert {
  margin-bottom: 15px;
}

.editor-area {
  flex: 1;
  height: 0; /* 关键：配合 flex:1 实现高度自适应 */
}

.full-height-row {
  height: 100%;
}

.editor-col {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.label {
  margin-bottom: 10px;
  font-weight: 500;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-tag {
  color: #67c23a;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 自定义 Textarea 样式以填满容器 */
.json-textarea {
  flex: 1;
}

:deep(.el-textarea__inner) {
  height: 100% !important;
  font-family: "Consolas", "Monaco", "Courier New", monospace; /* 代码字体 */
  font-size: 14px;
  line-height: 1.5;
  background-color: #f5f7fa;
  color: #303133;
}

/* 结果区域稍微区分一下背景色 */
.result-textarea :deep(.el-textarea__inner) {
  background-color: #fafafa;
  border-color: #e4e7ed;
  color: #409eff; /* 结果文字用主题色或深色均可 */
}
</style>
