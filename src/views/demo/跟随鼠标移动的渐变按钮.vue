<template>
  <div class="p-24">
    <button class="btn-mouse" @mousemove="handleMouseMove" ref="btnRef">
      <span>Hover me</span>
    </button>
  </div>
</template>
<script setup lang="ts">
const btnRef = ref<HTMLElement | null>(null);
const handleMouseMove = (e: MouseEvent) => {
  if (btnRef.value) {
    // 获取按钮相对于视口的位置和尺寸
    let rect = btnRef.value.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    //   将鼠标的相对位置设置为按钮的 CSS 自定义属性
    btnRef.value!.style.setProperty("--x", x + "px");
    btnRef.value!.style.setProperty("--y", y + "px");
  }
};
</script>
<style scoped>
.btn-mouse {
  position: relative;
  background: #49a7ff;
  padding: 8px 16px;
  font-size: 18px;
  color: white;
  cursor: pointer;
  border: none;
  outline: none;
  /* 跟随鼠标移动的渐变圆形。超出部分隐藏*/
  overflow: hidden;
}

.btn-mouse span {
  position: relative;
}
/* 创建一个随鼠标移动的渐变圆形 */
.btn-mouse::before {
  /* 初始状态半径为0，不可见 */
  --size: 0;
  content: "";
  position: absolute;
  left: var(--x);
  top: var(--y);
  /* 使得渐变圆心位于鼠标位置 */
  width: var(--size);
  height: var(--size);
  /* 实现圆形渐变效果，颜色从粉色过渡到透明 */
  background: radial-gradient(circle closest-side, pink, transparent);
  transform: translate(-50%, -50%);
  transition: width 0.2s ease, height 0.2s ease;
}
/* 当按钮被悬浮时，半径扩大渐变圆，使其可见 */
.btn-mouse:hover::before {
  --size: 200px;
}
</style>
