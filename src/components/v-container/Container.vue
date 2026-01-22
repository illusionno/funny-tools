<template>
  <div class="auto-wrap" ref="containerRef">
    <div class="flex items-center justify-between">
      <EpBack
        class="hvr-sweep-to-top back-btn-purple"
        @click="router.push({ name: 'index' })"
      />
       
      <div class="flex gap-12">
        <el-tooltip :content="isFullscreen ? '退出全屏' : '进入全屏'">
      <div
        class="wrap-border zoom-in"
        @click="toggleFullscreen"
       
      >
        <el-icon><FullScreen /></el-icon>
      </div>
      </el-tooltip>
      <div class="wrap-border zoom-in" v-if="blogLink" @click="handleOpenBlog">
        🔗Blog详解
      </div>
      </div>
    </div>
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
import { useRoute } from "vue-router";
import { FullScreen } from "@element-plus/icons-vue";
const route = useRoute();
const containerRef = ref();
const router = useRouter();
const props = defineProps<{
  title: string;
}>();
const isFullscreen = ref(false);
const blogLink = route.query.blogLink as string | undefined;

const handleOpenBlog = () => {
  if (blogLink) {
    window.open(blogLink, "_blank");
  }
};
function toggleFullscreen() {
  const el = containerRef.value;
  if (!isFullscreen.value) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    } else if ((el as any).msRequestFullscreen) {
      (el as any).msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
}
function fullscreenListener() {
  isFullscreen.value = !!document.fullscreenElement;
}
onMounted(() => {
  document.addEventListener("fullscreenchange", fullscreenListener);
});
onUnmounted(() => {
  document.removeEventListener("fullscreenchange", fullscreenListener);
});
</script>
<style scoped></style>
