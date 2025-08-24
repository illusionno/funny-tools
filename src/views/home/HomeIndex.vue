<template>
  <div class="container-wrap">
    <div class="box">
      <div class="images-container">
        <!-- 左侧图片组 -->
        <Transition name="slide-left">
          <div v-show="isHover" class="side-images left-images">
            <n-image :src="Img1" class="side-img img-top" preview-disabled />
            <n-image :src="Img3" class="side-img img-bottom" preview-disabled />
          </div>
        </Transition>

        <!-- 主图片 -->
        <div
          class="main-image-container"
          @mouseenter.stop="() => (isHover = true)"
          @mouseleave.self="() => (isHover = false)"
        >
          <n-image class="image" :src="homeImg" preview-disabled />
        </div>

        <!-- 右侧图片组 -->
        <Transition name="slide-right">
          <div v-show="isHover" class="side-images right-images">
            <n-image :src="Img2" class="side-img img-top" preview-disabled />
            <n-image :src="Img4" class="side-img img-bottom" preview-disabled />
          </div>
        </Transition>
      </div>

      <h1 class="title animate__animated animate__rubberBand animate__infinite">
        Funny Tools
      </h1>
      <div class="desc-text mt--20">✨发现有趣实用的小工具，让生活更美好~</div>
      <div class="mt-30">
        <StartBtn @click="() => router.push({ name: 'index' })"
           @mouseenter.stop="() => (isHover = true)"
          @mouseleave.self="() => (isHover = false)"
          > 开始探索</StartBtn
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.container-wrap {
  min-height: 100vh;
  width: 100%;
  position: relative;
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
  gap: 30px;
  padding-bottom: 0px;
  margin-top: 22px;
  .images-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 60px;
    width: 100%;
    max-width: 800px;
    position: relative;

    @media (max-width: 768px) {
      gap: 30px;
      max-width: 90%;
    }
  }

  .main-image-container {
    position: relative;
    z-index: 10;

    .image {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      transition: all 0.5s ease;
      filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));

      &:hover {
        transform: scale(1.1);
        box-shadow: 0px 16px 48px 16px rgba(255, 255, 255, 0.1),
          0px 12px 32px rgba(255, 255, 255, 0.15),
          0px 8px 16px -8px rgba(255, 255, 255, 0.2);
        animation: rotate 2s linear infinite;
        cursor: pointer;
        filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
      }

      @media (max-width: 768px) {
        width: 150px;
        height: 150px;
      }
    }
  }

  .side-images {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    position: relative;

    .side-img {
      border-radius: 12px;
      transition: all 0.3s ease;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));

      &.img-top {
        width: 80px;
        height: 60px;
        animation: float 3s ease-in-out infinite;
      }

      &.img-bottom {
        width: 80px;
        height: 80px;
        animation: float 3s ease-in-out infinite 1.5s;
      }

      &:hover {
        transform: scale(1.1);
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));
      }

      @media (max-width: 768px) {
        &.img-top {
          width: 60px;
          height: 45px;
        }

        &.img-bottom {
          width: 60px;
          height: 60px;
        }
      }
    }
  }

  .left-images {
    .side-img {
      &.img-top {
        transform: rotate(-10deg);
      }
      &.img-bottom {
        transform: rotate(8deg);
      }
    }
  }

  .right-images {
    .side-img {
      &.img-top {
        transform: rotate(10deg);
      }
      &.img-bottom {
        transform: rotate(-8deg);
      }
    }
  }

  .title {
    font-family: "Platform";
    font-size: 42px;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff6b6b 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
        animation: gradientShift 3s ease-in-out infinite;
    @media (max-width: 768px) {
      font-size: 32px;
    }
  }

  .desc-text {
    font-size: 18px;
    text-align: center;
    color:#a0a6b1;
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
}
// 渐变色动画
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
/* 左侧滑入动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.6s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 右侧滑入动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.6s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
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

/* 响应式布局调整 */
@media (max-width: 480px) {
  .box {
    .images-container {
      gap: 20px;

      .side-images {
        gap: 15px;

        .side-img {
          &.img-top {
            width: 45px;
            height: 35px;
          }

          &.img-bottom {
            width: 45px;
            height: 45px;
          }
        }
      }
    }
  }
}
</style>