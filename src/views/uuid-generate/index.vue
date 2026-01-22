<template>
  <VContainer title="uuid生成">
    <div class="box-wrap flex-col gap-12">
      <div class="flex gap-8 items-center mb-12">
        <el-input v-model="uuid" readonly style="width: 340px" />
        <el-button type="primary" @click="generateUuid">生成UUID</el-button>
        <el-button @click="copyUuid" :disabled="!uuid">复制</el-button>
      </div>
      <div class="mb-12">
        UUID（Universally Unique
        Identifier）用于生成全局唯一标识符，在分布式系统中避免冲突，常用于主键、请求追踪、资源标识等场景。
      </div>
      <div v-html="descriptionText"></div>
    </div>
    <div v-if="copied" style="color: #8a63d2">已复制到剪贴板！</div>
  </VContainer>
</template>
<script setup lang="ts">
import VContainer from "@/components/v-container/Container.vue";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";

const uuid = ref("");
const copied = ref(false);
const descriptionText = `
<p><strong>UUID的常见应用场景包括：</strong></p>
<p><strong>1.数据库主键：</strong><br>用于解决分库分表、数据迁移时的 ID 冲突问题，适合分布式系统，可在数据插入前生成。</p>
<p><strong>2.前端临时 ID / 列表 Key：</strong><br>在 React/Vue 等框架渲染动态列表时，作为唯一的 key 使用，特别是当数据尚未持久化（无后端 ID）时。</p>
<p><strong>3.上传文件名 / 资源标识：</strong><br>用于重命名用户上传的文件（如图片、文档），防止因同名文件导致的覆盖问题。</p>
<p><strong>4.Session ID / Token / Request ID：</strong><br>用于生成用户会话标识、认证令牌，或在微服务架构中生成链路追踪 ID（Trace ID）。</p>
`;
function generateUuid() {
  uuid.value = uuidv4();
  copied.value = false;
}

async function copyUuid() {
  if (!uuid.value) return;
  await navigator.clipboard.writeText(uuid.value);
  copied.value = true;
}
</script>
<style scoped></style>
