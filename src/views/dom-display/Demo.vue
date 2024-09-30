<template>
  <div class="p-24">
    <select v-model="selectedTheme">
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
    <pre>
      <code class="language-js" v-html="highlightedCode.value"></code></pre>
  </div>
</template>
<script setup lang="ts">
import { watch, onMounted } from "vue";
import hljs from "highlight.js";
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
        <p> 2024 我的网站</p>
      </footer>
    </body>
  </html>`;
const highlightedCode = hljs.highlight(html, { language: "html" });
//主题
const themes = ref(["default", "dark", "night-owl"]); // 这里可以添加更多主题
const selectedTheme = ref("default");
watch(
  () => selectedTheme.value,
  (val) => {
    console.log(highlightedCode);

    if (val === "default") {
      import(`highlight.js/styles/default.css`);
    }
    if (val === "dark") {
       import(`highlight.js/styles/dark.css`);
    }
    if (val === "night-owl") {
       import(`highlight.js/styles/night-owl.css`);
    }

  },

);
onMounted(() => {
  // 高光全部
  hljs.highlightAll();

});
</script>
<style scoped>
pre {
  margin-top: 0;
}
</style>
