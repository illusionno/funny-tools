<!-- 不同tool页面中的标题 -->
<template>
  <div class="title-container">
    <h2 class="modern-title">
      <span class="title-text">{{ props.title }}</span>
      <div class="title-accent"></div>
    </h2>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<style scoped lang="scss">
.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 48px;
  padding: 0 20px;
}

.modern-title {
  position: relative;
  text-align: center;
  margin: 0;
  
  .title-text {
    display: inline-block;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.2;
    
    /* 现代渐变文字效果 */
    background: linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 50%,
      #f093fb 100%
    );
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    /* 微妙的阴影增加深度 */
    filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.15));
    
    /* 平滑过渡动画 */
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    

      transform: translateY(-2px) scale(1.02);
      background-position: 100% 0%;
      filter: drop-shadow(0 4px 16px rgba(102, 126, 234, 0.25));
  
  }
  
  .title-accent {
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
    border-radius: 2px;
    transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      background: #667eea;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }
  
  /* 悬停时显示装饰线 */
  .title-accent {
    width: 60px;
    
    &::before {
      opacity: 1;
    }
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .title-container {
    margin-bottom: 32px;
    padding: 0 16px;
  }
  
  .modern-title {
    .title-text {
      font-size: clamp(24px, 5vw, 32px);
      letter-spacing: -0.01em;
    }
    
    .title-accent {
      bottom: -10px;
      height: 2px;
    }
    
    &:hover .title-accent {
      width: 40px;
    }
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .modern-title .title-text {
    background: linear-gradient(
      135deg,
      #a8c8ff 0%,
      #d4a4ff 50%,
      #ffb3d9 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 8px rgba(168, 200, 255, 0.15));
    
    &:hover {
      filter: drop-shadow(0 4px 16px rgba(168, 200, 255, 0.25));
    }
  }
}

/* 减弱动画模式适配 */
@media (prefers-reduced-motion: reduce) {
  .modern-title .title-text,
  .modern-title .title-accent {
    transition: none;
  }
  
  .modern-title .title-text:hover {
    transform: none;
  }
}
</style>
