<template>
  <VContainer title="HTML元素查看">
    <div class="flex flex-col gap-12">
      <div class="box-wrap">
        <VElementParse :html="html" />
      </div>
      <div class="box-wrap">
        <pre><code class="language-js" v-html="highlightedCode"></code></pre>
      </div>
    </div>
  </VContainer>
</template>
<script setup lang="ts">
import VContainer from "@/components/v-container/Container.vue";
import VElementParse from "@/components/v-element-parse/ElementParse.vue";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
const html = `<!DOCTYPE html>
  <html lang="zh">
    <head>
      <meta charset="UTF-8" />
      <title>简单 HTML 文档</title>
    </head>
    <body>
      <!-- 简单 HTML 文档 -->
      <h1 id="welcome">欢迎来到我的网站</h1>
      <p class="title">这是一个简单的 HTML 页面。</p>
      <ul>
        <li>项目 1</li>
        <li>项目 2</li>
        <li>项目 3</li>
      </ul>

      <img src="example.jpg" alt="示例图片" />

      <footer>
        <p>&copy; 2023 我的网站</p>
      </footer>
    </body>
  </html>`;

const highlightedCode = hljs.highlight(html, { language: "html" }).value;
onMounted(() => {
  // 手动初始化高亮
  hljs.highlightAll();
});
//
</script>
<style scoped></style>
