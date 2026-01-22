.
<script setup>
import VContainer from "@/components/v-container/Container.vue";

const allLists = [
  {
    type: "常用网址",
    lists: [
      {
        title: "Vue",
        url: "https://vuejs.org/",
      },
      {
        title: "React",
        url: "https://reactjs.org/",
      },
      {
        title: "Vite",
        url: "https://vitejs.dev",
      },
      {
        title: "Webpack",
        url: "https://webpack.js.org/",
      },
      {
        title: "Three.js",
        url: "https://threejs.org/",
      },
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org/zh-CN/",
      },
      {
        title: "pinia",
        url: "https://pinia.vuejs.org/",
      },
      {
        title: "zustand",
        url: "https://docs.pmnd.rs/zustand/getting-started/introduction",
        desc: "zustand是一个React状态管理库",
      },
      {
        title: "TypeScript教程",
        url: "https://www.typescriptlang.org/",
      },
      {
        title: "lodash",
        url: "https://lodash.com/",
      },
      {
        title: "Sass",
        url: "https://www.sass.hk/docs/",
      },
      {
        title: "TailwindCSS",
        url: "https://tailwindcss.com/",
      },
      {
        title: "Echarts",
        url: "https://echarts.apache.org/zh/index.html",
      },
      {
        title: "Vueuse",
        url: "https://vueuse.org/",
      },
      {
        title: "Unocss",
        url: "https://unocss.dev/",
      },
      {
        title: "阮一峰ES6教程",
        url: "https://es6.ruanyifeng.com/",
      },
      {
        title: "阮一峰Flex布局教程",
        url: "https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html",
      },
      {
        title: "阮一峰Grid布局教程",
        url: "https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html",
      },
      {
        title: "Web Dev博客",
        url: "https://web.dev/",
      },
    ],
  },
  {
    type: "UI组件库",
    lists: [
      {
        title: "Vuetify（vue）",
        url: "https://vuetifyjs.com/",
      },
      {
        title: "Ant Design（React）",
        url: "https://ant.design/",
      },
      {
        title: "Element Plus（vue）",
        url: "https://element-plus.org/",
      },
      {
        title: "Material UI（React）",
        url: "https://mui.com/",
      },
      {
        title: "Naive UI（vue）",
        url: "https://www.naiveui.com/",
      },
      {
        title: "Vant（vue）",
        url: "https://vant-ui.github.io",
      },
    ],
  },
  {
    type: "其他学习网站",
    lists: [
      {
        title: "菜鸟教程",
        url: "https://www.runoob.com",
      },
      {
        title: "W3Cschool",
        url: "https://www.w3school.com.cn/",
      },
      {
        title: "慕课网",
        url: "https://www.imooc.com/",
      },
      {
        title: "极客时间",
        url: "https://www.geekbang.com/",
      },
      {
        title: "牛客网",
        url: "https://www.nowcoder.com/",
      },
      {
        title: "力扣",
        url: "https://leetcode.com/",
      },
      {
        title: "稀土掘金",
        url: "https://juejin.cn/",
      },
      {
        title: "CSDN",
        url: "https://www.csdn.net/",
      },
      {
        title: "语雀",
        url: "https://www.yuque.com/",
      },
      {
        title: "github",
        url: "https://github.com/",
      },
      {
        title: "hello github",
        url: "https://hellogithub.com/",
      },
      {
        title: "stackoverflow",
        url: "https://stackoverflow.com/",
      },
    ],
  },
  {
    type: "在线工具类",
    lists: [
      {
        title: "CodePen",
        url: "https://codepen.io",
      },
      {
        title: "CodeSandbox",
        url: "https://codesandbox.io",
      },
      {
        title: "JSFiddle",
        url: "https://jsfiddle.net",
      },
      {
        title: "JS bin",
        url: "https://jsbin.com",
      },
      {
        title: "JSON Formatter",
        url: "https://jsonformatter.curiousconcept.com",
      },
      {
        title: "Can I Use（兼容性查询）",
        url: "https://caniuse.com/",
      },
      {
        title: "Vscode插件市场",
        url: "https://marketplace.visualstudio.com/",
      },
      {
        title: "在线制作ico图标",
        url: "https://www.bitbug.net/",
      },
      {
        title: "JSON转TypeScript",
        url: "https://transform.tools/json-to-typescript",
      },
      {
        title: "在线免费录屏",
        url: "https://www.geekersoft.cn/free-screen-recorder-online.html",
      },
      {
        title: "PDF工具",
        url: "https://smallpdf.com/cn#r=app",
      },
      {
        title: "Miku Tools工具集合",
        url: "https://imiku.netlify.app/",
      },
    ],
  },
];
</script>
<template>
  <VContainer title="前端学习网址">
    <div v-for="item in allLists" :key="item.type" class="box-wrap">
      <div class="flex items-center justify-center">
        <h2 class="purple-border inline-block px-18 py-6 text-coolGray-700">
          {{ item.type }}
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-16">
        <div
          v-for="list in item.lists"
          :key="list.title"
          class="flex items-center mb-12 justify-center"
        >
          <a
            :href="list.url"
            target="_blank"
            class="text-coolGray-700 text-16 hover:text-purple-500"
            >{{ list.title }}</a
          >
        </div>
      </div>
    </div>
  </VContainer>
</template>
<style scoped></style>
