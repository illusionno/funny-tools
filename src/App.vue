<script setup>
</script>

<template>
 <router-view></router-view>
</template>

<style scoped>
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
  /* Global styles if necessary */
  #app {
    font-family: 'Arial, sans-serif';
  }
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

</style>
