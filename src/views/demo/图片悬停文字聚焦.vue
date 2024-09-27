<template>
  <div class="img-wrap">
    <img
      src="https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU"
    />
    <div class="box">
      <div>some</div>
      <div>text</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.img-wrap {
  //   background-color: #000;
  color: #fff;
  display: inline-block;
  margin: 16px;
  max-width: 320px;
  overflow: hidden;
  position: relative;
  text-align: center;
  width: 100%;
  img {
    // 将图片的垂直对齐方式设置为顶部对齐。
    vertical-align: top;
    max-width: 100%;
    // 隐藏图片背面的不可见部分，可以提高渲染性能，防止浏览器渲染背面的像素。
    backface-visibility: hidden;
  }
  // 文字box
  .box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    font-weight: 600;
    opacity: 0;
    z-index: 2;
    transition-delay: 0.1s;
    font-size: 24px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  // 伪元素实现两层边框效果半透明黑色背景层
  &::before,
  &::after {
    background-color: rgba(0, 0, 0, 0.5);
    border-top: 32px solid rgba(0, 0, 0, 0.5);
    border-bottom: 32px solid rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    transition: all 0.3s ease;
    z-index: 1;
    opacity: 0;
    // 沿Y轴（垂直方向）放大2倍
    transform: scaleY(2);
  }
  &:hover::before,
  &:hover::after {
    // 悬停时恢复伪元素的正常比例，使它看起来是从放大的状态逐渐收缩到正常大小
    // 让用户感觉到伪元素从图片的上下两端收缩出现。
    transform: scale(1);
    opacity: 1;
  }
  &:hover {
    img {
      opacity: 0.7;
    }
  }
  &:hover .box {
    opacity: 1;
  }
}
// 图片和文字盒子上的所有元素都有过渡效果
.img-wrap * {
  box-sizing: border-box;
  transition: all 0.45s ease;
}
</style>
