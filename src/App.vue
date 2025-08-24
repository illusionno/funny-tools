<script setup>
</script>

<template>
 <router-view></router-view>
</template>

<style>
/* 全局基础配置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  overflow-x: hidden;
}

#app {
  font-family: 'Arial, sans-serif';
  max-width: 100%;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

/* 全局动画 */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* 响应式排版 */
@media (max-width: 768px) {
  .portfolio-title {
    flex-direction: column;
    text-align: center;
  }

  .title-text h1 {
    font-size: 32px;
  }

  .hand-icon {
    font-size: 40px;
    margin-top: 10px;
  }

  .footer {
    flex-direction: column;
    text-align: center;
  }

  .design-period {
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .title-text h1 {
    font-size: 28px;
  }
  
  .hand-icon {
    font-size: 30px;
  }
  
  body {
    font-size: 14px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

/* 通用Flex工具类 */
.flex {
  display: flex;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.flex-wrap {
  flex-wrap: wrap;
}

/* 通用间距工具类 */
.gap-10 { gap: 10px; }
.gap-20 { gap: 20px; }
.gap-30 { gap: 30px; }

.mt-10 { margin-top: 10px; }
.mt-20 { margin-top: 20px; }
.mt-30 { margin-top: 30px; }

.mb-10 { margin-bottom: 10px; }
.mb-20 { margin-bottom: 20px; }

.p-10 { padding: 10px; }
.p-20 { padding: 20px; }

@media (max-width: 768px) {
  .gap-20 { gap: 15px; }
  .gap-30 { gap: 20px; }
  
  .mt-30 { margin-top: 25px; }
  .p-20 { padding: 15px; }
}

@media (max-width: 480px) {
  .gap-20 { gap: 10px; }
  .gap-30 { gap: 15px; }
  
  .mt-30 { margin-top: 20px; }
  .p-20 { padding: 10px; }
}
</style>