<template>
  <div class="auto-wrap" ref="containerRef">
    <EpBack
      class="hvr-pulse back-btn"
      @click="router.push({ name: 'index' })"
    />
    <div>
      <VTitleBar :title="props.title" />
      <slot> </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import VTitleBar from "@/components/v-title-bar/TitleBar.vue";
import { ref } from "vue";

const containerRef = ref();
const router = useRouter();
const props = defineProps<{
  title: string;
}>();
defineExpose({
  containerRef,
});
</script>
<style scoped></style>
