<template>
  <div class="auto-wrap index-wrap">
    <EpBack
      class="hvr-sweep-to-top back-btn"
      @click="router.push({ name: 'home' })"
    />
    <div class="content-wrap">
      <div>
        <div v-for="item in allLists" :key="item.type">
          <div class="shell flex items-center gap-24">
            <div
              class=""
              v-for="(subItem, i) in item.lists"
              :key="subItem.path"
              @click="router.push({ name: subItem.path })"
            >
            <div class="flex justify-center mb-12 ">
              <span class="box-title">{{ subItem.title}}</span>
            </div>
              <div class="box">
                <div class="img-container">
                <el-image
                  :src="subItem.img"
                  :alt="subItem.title"
                  fit="cover"
                  class="image"
                />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border">右侧</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import EpBack from "~icons/ep/back";
import { useRouter } from "vue-router";
import * as Img from "./export";

const router = useRouter();
const allLists = [
  {
    type: "默认分类",
    lists: [
      {
        title: "图片转像素画",
        img: Img.Bg1,
        path: "pixel-art",
      },
      {
        title: "人生小格",
        img: Img.Bg2,
        path: "life-grid",
      },
      {
        title: "颜色识别",
        img: Img.Bg3,
        path: "color-identify",
      },
      {
        title: "IP地址自动计算",
        img: Img.Bg4,
        path: "ip-compute",
      },
      {
        title: "B",
        img: Img.Bg5,
      },
      {
        title: "C",
        img: Img.Bg6,
      },
      {
        title: "D",
        img: Img.Bg7,
      },
      {
        title: "E",
        img: Img.Bg8,
      },
    ],
  },
];
</script>
<style scoped lang="scss">


.index-wrap {
  width: 100%;
  height: 100%;
  --color: #ede6fa;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    );
  background-size: 55px 55px;
  padding-left: 50px;
  padding-right: 50px;
}

.back-btn {
  background-color: #ccb8f0;
}
.content-wrap {
  display: grid;
  grid-template-columns: 3fr 1fr;
  margin-top: 24px;
  .box-title{
    padding: 3px 0;
    font-family: 'MaoKenWangXingYuan', sans-serif;
    font-size: 18px;
    background-color: #ede6fa;
    color: #0000009d;
    padding:3px 12px;
    border-radius: 6px;
  }
}
.border {
  border: 1px solid #d2d2f7;
}
.shell {
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.shell .box {
  /* 设置相对定位和固定宽高 */
  position: relative;
  width: 300px;
  /* 宽度250像素 */
  height: 200px;
  /* 高度350像素 */
  transition: 0.6s;
  /* 过渡效果时长 */
  overflow: hidden;
  /* 隐藏溢出部分 */
  // margin: 30px;
  border-radius: 5px;
  border: #d2d2f7 7px dashed;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0 0 2em #d2d2f7);
  }
  .img-container {
    overflow: hidden; /* 确保溢出部分不显示 */
    display: inline-block; /* 使容器自适应内容 */
    .image {
      transition: transform 0.4s ease-in-out; /* 添加过渡效果 */
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
