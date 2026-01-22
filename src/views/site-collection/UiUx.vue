.
<script setup>
import VContainer from "@/components/v-container/Container.vue";
const allLists = [
  {
    type: "绘图工具",
    lists: [
      {
        title: "Figma 🌟",
        url: "https://www.figma.com/",
      },
      {
        title: "Adobe XD",
        url: "https://www.adobe.com/products/xd.html",
      },
      {
        title: "Sketch",
        url: "https://www.sketch.com/",
      },
      {
        title: "即时设计",
        url: "https://js.design/special/article/free-learning-ui-design-website.html",
      },
      {
        title: "Canva",
        url: "https://www.canva.com/",
      },
    ],
  },
  {
    type: "学习资源",
    lists: [
      {
        title: "Coursera",
        url: "https://www.coursera.org/search?query=free+ux",
      },
      {
        title: "Codecademy-Introduction to UI and UX Design",
        url: "https://www.codecademy.com/learn/intro-to-ui-ux?utm_source=chatgpt.com",
      },
      {
        title: "Alison — Introduction to UI/UX Design",
        url: "https://alison.com/course/introduction-to-ui-ux-design?utm_source=chatgpt.com",
      },
      {
        title: "Noble Desktop — 免费 UI/UX 入门课程",
        url: "https://www.nobledesktop.com/learn/ux-ui?utm_source=chatgpt.com",
      },
      {
        title: "Resources to get started with UX 🌟",
        url: "https://www.ebi.ac.uk/training/online/courses/user-experience-design/resources-to-get-started-with-ux/",
      },
      {
        title: "interaction design foundation 🌟",
        url: "https://www.interaction-design.org/literature/article/overview",
      },
      {
        title: "Laws of UX 🌟",
        url: "https://lawsofux.com/",
      },
      {
        title: "UX Myths",
        url: "https://uxmyths.com/",
      },{
        title:"Medium（UX collective）🌟",
        url:'https://uxdesign.cc/'
      }
    ],
  },{
    type:'Figma学习资源',
    lists:[{
      title: "Figma学习路径 🌟",
      url: "https://www.figma.cool/learning-paths",
    },{
      title:'freeCodeCamp',
      url:'https://www.freecodecamp.org/chinese/news/figma-crash-course/?utm_source=chatgpt.com'
    },{
      title:'YouTube频道（Figma 101）',
      url:'https://www.youtube.com/@Figma101'
    }]
  }
];
</script>
<template>
  <VContainer title="UI/UX学习">
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