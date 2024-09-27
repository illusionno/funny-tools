<template>
  <div class="auto-wrap">
    <EpBack
      class="hvr-sweep-to-top back-btn"
      @click="router.push({ name: 'index' })"
    />
    <div>
      <VTitleBar title="IP地址自动计算" />
      <div class="box-wrap">aa</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import VTitleBar from "@/components/v-title-bar/TitleBar.vue";

const router = useRouter();
</script>
<style scoped></style>
