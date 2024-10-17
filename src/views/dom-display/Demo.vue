<template>
  <div class="p-24">
    <!-- <pre>
      <code class="language-js" v-html="highlightedCode.value"></code></pre> -->
    <hljsVuePlugin.component
      language="vue"
      :code="vue"
    ></hljsVuePlugin.component>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css"
import hljsVuePlugin from "@highlightjs/vue-plugin";

// const html = `<!DOCTYPE html>
//   <html lang="zh">
//     <head>
//       <meta charset="UTF-8" />
//       <title>简单 HTML 文档</title>
//     </head>
//     <body>
//       <!-- 简单 HTML 文档 -->
//       <h1 id="welcome">欢迎来到我的网站</h1>
//       <p class="title">这是一个简单的 HTML 页面。</p>
//       <ul>
//         <li>项目 1</li>
//         <li>项目 2</li>
//         <li>项目 3</li>
//       </ul>
//       <img src="example.jpg" alt="示例图片" />
//       <footer>
//         <p> 2024 我的网站</p>
//       </footer>
//     </body>
//   </html>`;
//  
  const vue= `<template>
  <div id="app">
    <h1>欢迎来到我的 Vue 应用</h1>
    <p>这是一个简单的 Vue 页面示例。</p>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>`
// d
// const highlightedCode = hljs.highlight(html, { language: "html" });
// watch(
//   () => selectedTheme.value,
//   (val) => {
//     console.log(highlightedCode);
//     if (val === "dark") {
//        import(`highlight.js/styles/dark.css`); 
//     }
//     if (val === "night-owl") {
//        import(`highlight.js/styles/night-owl.css`);
//     }
//   },
// );
onMounted(() => {
  // 高光全部
  // hljs.highlightAll();
});
</script>
<style scoped>
pre {
  margin-top: 0;
}
</style>
