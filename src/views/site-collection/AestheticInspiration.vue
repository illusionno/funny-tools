.
<script setup>
import VContainer from "@/components/v-container/Container.vue";

const lists = [
  {
    title: "Dribbble",
    url: "https://dribbble.com/",
    desc: "Dribbble是一个设计师分享作品的平台",
  },
  {
    title: "Awwwards",
    url: "https://www.awwwards.com/",
    desc: "寻找设计灵感",
  },
  {
    title: "Pinterest",
    url: "https://www.pinterest.com/",
    desc: "Pinterest是一个图片分享平台",
  },
  {
    title: "Unsplash",
    url: "https://unsplash.com/",
    desc: "Unsplash是一个免费的高质量图片库",
  },
  {
    title: "Pixabay",
    url: "https://pixabay.com/",
    desc: "Pixabay是一个免费的高质量图片库",
  },
  {
    title: "picsum",
    url: "https://picsum.photos/images",
    desc: "picsum是一个免费的高质量图片库",
  },
  {
    title: "uiverse",
    url: "https://uiverse.io/",
    desc: "好看的小组件集合",
  },
  {
    title: "CSS Tricks",
    url: "https://css-tricks.com/",
    desc: "CSS Tricks是一个CSS技巧博客",
  },
  {
    title: "30 seconds of code",
    url: "https://www.30secondsofcode.org/css/p/1/",
    desc: "30秒教你一个CSS小技巧",
  },
  {
    title: "iconfont",
    url: "https://www.iconfont.cn/",
    desc: "iconfont是阿里巴巴图标库",
  },
  {
    title: "Medium",
    url: "https://medium.com/",
    desc: "Medium是一个博客平台",
  },
];
</script>
<template>
  <VContainer title="提升审美灵感">
  <div  class="box-wrap grid grid-cols-2 gap-4 mt-16">
    <div
      v-for="item in lists"
      :key="item.title"
      class="flex items-center mb-12 justify-center"
    >
      <a
        :href="item.url"
        target="_blank"
        class="text-coolGray-700 text-16 hover:text-purple-500"
        >{{ item.title }}</a
      >
    </div>
  </div>

  </VContainer>
</template>
<style scoped></style>
