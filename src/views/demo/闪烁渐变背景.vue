<template>
<div class="p-100">
  <div class="card"></div>
  <!-- <div class="box"></div> -->
</div>
</template>
<script setup lang="ts"></script>
<style scoped>
/* 自定义属性 */
/* 使用了@property规则，其中 syntax: "<color>" 指定了这些属性应该存储颜色值。 */
/* 这些属性不会继承 (inherits: false) 并且有初始值 (initial-value)。 */
@property --card-bg {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0bae8;
}

@property --shine-1 {
  syntax: "<color>";
  inherits: false;
  initial-value: #ffbbc0;
}

@property --shine-2 {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0aecb;
}

.card {
  margin: 12px;
  border-radius: 24px;
  width: 400px;
  height: 300px;
  padding: 2rem;
  /* 使用了两个 radial-gradient （径向渐变）来定义背景颜色 */
  background: radial-gradient(
      300px circle at 55% 60% in oklab,
      var(--shine-2),
      transparent 100% 100%
    ),
    radial-gradient(
      farthest-side circle at 75% 30% in oklab,
      var(--shine-1) 0%,
      var(--card-bg) 100%
    );

  /* 将两种渐变进行颜色混合 */
  background-blend-mode: color-burn;

  /* 为卡片的背景色设置了两个不同的动画效果 */
  /* alternate:两个动画都是线性且无限循环的，并在每次动画结束时反向播放 */
  animation: animate-color-1 8s infinite linear alternate,
    4s animate-color-2 1s infinite linear alternate;
}

@keyframes animate-color-1 {
  from {
    --shine-1: initial;
  }
  to {
    --shine-1: orange;
  }
}

@keyframes animate-color-2 {
  from {
    --shine-2: initial;
  }
  to {
    --shine-2: hotpink;
  }
}

/* 定义自定义属性 --box-size 作为长度类型 */
@property --box-size {
  syntax: "<length>";
  inherits: false;
  initial-value: 100px;
}

/* 定义自定义属性 --box-rotation 作为数字类型 */
@property --box-rotation {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}

/* 定义动画效果 */
@keyframes resize-box {
  from {
    --box-size: 100px;
  }
  to {
    --box-size: 200px;
  }
}

@keyframes rotate-box {
  from {
    --box-rotation: 0;
  }
  to {
    --box-rotation: 360;
  }
}

/* 应用自定义属性及动画 */
.box {
  width: var(--box-size);
  height: var(--box-size);
  background-color: lightcoral;
  transform: rotate(var(--box-rotation) deg);
  animation: resize-box 5s infinite alternate, rotate-box 10s infinite linear;
  border-radius: 1rem;
  margin: 20px;
}
</style>
