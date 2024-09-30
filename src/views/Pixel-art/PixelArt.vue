<template>
  <VContainer title="图片转像素画">
    <div class="box-wrap flex flex-col gap-12">
      <div class="flex items-center justify-between">
        <VUpload @change="handleChanges" />
        <PhExportDuotone
          class="h-22 w-22 cursor-pointer"
          @click="exportImage(canvas, 'pixel-art')"
        />
      </div>
      <div class="flex items-center gap-12">
        像素大小
        <el-slider
          v-show="imgUrl"
          v-model="pixelSize"
          class="w-50%!"
          :min="2"
          :max="50"
        />
      </div>
      <div class="flex gap-12">
        <el-image
          v-show="imgUrl"
          :src="imgUrl"
          fit="cover"
          class="w-600 h-400"
        />
        <canvas ref="canvas"></canvas>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Demo from "@/assets/imgs/demo.jpg";
import PhExportDuotone from "~icons/ph/export-duotone";
import VUpload from "@/components/v-upload/uploadIndex.vue";
import VContainer from "@/components/v-container/Container.vue";
import { fileToBase64, convertUrlToFile, exportImage } from "@/utils/common";

const canvas = ref<HTMLCanvasElement | null>(null);
const imgUrl = ref(Demo);
const pixelSize = ref(10);
const rawFile = ref();

// 重新绘制
watch(pixelSize, () => {
  redrawCanvas();
});

const handleChanges = async (file: any) => {
  rawFile.value = file;
  loadImage(file);
  imgUrl.value = (await fileToBase64(file)) as string;
};

onMounted(async () => {
  rawFile.value = await convertUrlToFile(imgUrl.value, "demo.jpg");
  if (rawFile.value) {
    redrawCanvas();
  }
});
// 重新绘制画布
const redrawCanvas = () => {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    ctx?.clearRect(0, 0, canvas.value.width, canvas.value.height);
  }
  loadImage(rawFile.value);
};
const loadImage = (file: File) => {
  const reader = new FileReader();
  // 读取文件内容，加载完成后触发
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      if (!canvas.value) return;
      const ctx = canvas.value.getContext("2d") as CanvasRenderingContext2D;
      // canvas画布大小
      canvas.value.width = 600;
      canvas.value.height = 400;
      // 将图像绘制到指定的 canvas 上
      ctx?.drawImage(img, 0, 0, canvas.value.width, canvas.value.height);
      pixelate(ctx, canvas.value.width, canvas.value.height, pixelSize.value);
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};
// 图像像素化
const pixelate = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelSize: number
) => {
  // 从画布捕获图像数据
  const imageData = ctx.getImageData(0, 0, width, height);
  // 包含像素数据（RGBA 值）的数组
  const data = imageData.data;
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // 对于每个像素块，提取左上角像素的颜色。
      const red = data[(width * y + x) * 4];
      const green = data[(width * y + x) * 4 + 1];
      const blue = data[(width * y + x) * 4 + 2];
      // 使用该颜色填充像素块
      ctx.fillStyle = `rgb(${red},${green},${blue})`;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
};
</script>

<style scoped lang="scss">
:deep(.el-slider__bar) {
  background-image: linear-gradient(
    to right,
    #b5e6f8,
    #7cb2e8e6
  ); /* Chrome 10-25, Safari 5.1-6 */
}
:deep(.el-button) {
  background-color: #7cb2e8e6;
}
</style>
