<template>
  <div class="container-wrap">
    <div class="box">
      <div class="flex gap-16">
        <Transition name="fade">
          <div v-show="isHover">
            <n-image :src="Img1" width="100%" :height="50" preview-disabled />
            <n-image :src="Img3" width="100%" :height="70" preview-disabled />、
          </div>
        </Transition>
        <div
          @mouseenter.stop="() => (isHover = true)"
          @mouseleave.self="() => (isHover = false)"
        >
          <n-image class="image" :src="homeImg" preview-disabled />
        </div>
        <Transition name="fade">
          <div v-show="isHover">
            <n-image :src="Img2" width="100%" :height="50" preview-disabled />
            <n-image :src="Img4" width="100%" :height="70" preview-disabled />
          </div>
        </Transition>
      </div>
      <h1 class="title animate__animated animate__rubberBand animate__infinite">
        Funny Tools
      </h1>
      <div class="desc-text mt--20">
        Ready to dive into a world of laughter and joy with me?
      </div>
      <div class="mt-30">
        <StartBtn @click="() => router.push({ name: 'index' })"
          >Let's Go!</StartBtn
        >
      </div>
    </div>
    <div class="wave"></div>
  </div>
</template>
<script setup lang="ts">
import homeImg from "@/assets/home.png";
import Img1 from "@/assets/imgs/img1.png";
import Img2 from "@/assets/imgs/img2.png";
import Img3 from "@/assets/imgs/img3.png";
import Img4 from "@/assets/imgs/img4.png";
import StartBtn from "./StartBtn.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isHover = ref(false);
</script>
<style scoped lang="scss">
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.container-wrap {
  min-height: 100vh;
  width: 100%;
  position: relative;
  // background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #000;
  color: #fff;
}
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-bottom: 120px;
  .image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    transform: all 0.5s ease;
    &:hover {
      transform: scale(2);
      box-shadow: 0px 16px 48px 16px rgba(0, 0, 0, 0.08),
        0px 12px 32px rgba(0, 0, 0, 0.12), 0px 8px 16px -8px rgba(0, 0, 0, 0.16);
      animation: rotate 2s linear infinite;
      cursor: pointer;
    }
  }
  .title {
    font-family: "Platform";
    font-size: 40px;
    // background-image: linear-gradient(130deg, #ffb9b9, #ff91ee);
    // background-clip: text;
    // color: transparent;
  }
  .desc-text {
    font-family: cursive;
    font-size: 20px;
  }
}
/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.wave {
  height: 44%;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background-image: url("@/assets/wave.svg");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
