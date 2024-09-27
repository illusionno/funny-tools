<template>
<div class="p-20">
    <DefineTemplate v-slot="{ title, content }">
    <!--定义可复用内容 -->
    <h3>{{ title }}</h3>
    <div class="block">{{ content }}</div>
  </DefineTemplate>
  <ReuseTemplate title="标题1" content="复用内容1" />
  <span> ----------------------------</span>
  <ReuseTemplate title="标题2" content="复用内容2" />
</div>
</template>
<script setup lang="ts">
import { createReusableTemplate } from "@vueuse/core";

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
</script>
<style scoped>
.block {
  width: 150px;
  height: 150px;
  background-color: aliceblue;
  display: grid;
  place-items: center;
  font-size: 18px;
}
</style>
