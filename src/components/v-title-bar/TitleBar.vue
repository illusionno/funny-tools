<!-- 不同tool页面中的标题 -->
<template>
  <h2 class="flex justify-center items-center mb-24 threeD">
    <span class="hvr-float-shadow">{{ props.title }} </span>
  </h2>
</template>
<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
<style scoped></style>
