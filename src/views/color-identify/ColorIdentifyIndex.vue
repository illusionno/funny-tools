<template>
  <div class="auto-wrap">
    <EpBack
      class="hvr-sweep-to-top back-btn"
      @click="router.push({ name: 'index' })"
    />
    <VTitleBar title="颜色识别" />
    <div class="box-wrap flex flex-col gap-12">
      {{ colors }}
      <el-input
        v-model="colorVal"
        placeholder="输入颜色代码:#ffffff"
        class="w-100%!"
        clearable
        @change="handleColorVal"
      />
      <Slider class="w-100%!" v-model="colors" />
      <el-slider
        v-model="alpha"
        :step="0.1"
        :min="0"
        :max="1"
        @change="updateAlpha"
      />
      <VUpload @change="handleChanges" />
      <div class="flex justify-between gap-12">
        <div class="w-50%">
          <el-image
            v-show="imgUrl"
            :src="imgUrl"
            fit="cover"
            class="w-100% h-300"
          />
        </div>
        <div class="w-50% flex flex-col gap-24">
          <div>
            <div class="tag mb-6">主色</div>
            <div
              class="palette-color"
              :style="{ 'background-color': imgColor.color }"
            >
              <!-- {{ imgColor.color }} -->
            </div>
          </div>
          <div>
            <div class="tag mb-6">调色盘</div>
            <div class="flex gap-12 ">
              <div
                v-for="(color, index) in imgColor.palette"
                :key="index"
                :style="{ 'background-color': color }"
                class="palette-color"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { Slider } from "@ckpack/vue-color";
import TinyColor from "tinycolor2";
import { ElNotification } from "element-plus";
import VUpload from "@/components/v-upload/uploadIndex.vue";
import VTitleBar from "@/components/v-title-bar/TitleBar.vue";

import Demo from "@/assets/imgs/demo.jpg";
import ColorThief from "colorthief";
import { fileToBase64, convertUrlToFile } from "@/utils/common";

const router = useRouter();
const colorVal = ref("");
const colors = ref("#00ADB5");
// 透明度
const alpha = ref(1);
const rawFile = ref();
const imgUrl = ref(Demo);
const imgColor = ref({
  color: "",
  palette: [] as string[],
});

const handleColorVal = (val: any) => {
  const color = TinyColor(val);
  if (!color.isValid()) {
    ElNotification({
      title: "Error",
      message: "请输入正确的颜色值！",
      type: "error",
    });
    return;
  }

  colors.value = color.toHex8String();
};

const updateAlpha = () => {
  const color = TinyColor(colors.value);
  color.setAlpha(alpha.value);
  colors.value = color.toHex8String();
};
onMounted(() => {
  const img = new Image();
  img.src = imgUrl.value;
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(img, 6);
    imgColor.value.color = `rgb(${palette[0].join(",")})`;
    imgColor.value.palette = palette.map((color) => `rgb(${color.join(",")})`);
  };
});
// file上传
const handleChanges = async (file: any) => {
  rawFile.value = file;
  imgUrl.value = (await fileToBase64(file)) as string;
  const img = new Image();
  img.src = imgUrl.value;
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(img, 6);
    imgColor.value.color = `rgb(${palette[0].join(",")})`;
    imgColor.value.palette = palette.map((color) => `rgb(${color.join(",")})`);
  };
};
</script>
<style scoped lang="scss">
:deep(.el-slider__bar) {
  background-image: linear-gradient(
    to right,
    #d9d8f8,
    #9d9ceb
  ); /* Chrome 10-25, Safari 5.1-6 */
}

  .palette-color {
    width: 80px;
    height: 50px;
  }

</style>
