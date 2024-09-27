<template>
  <div class="p-30">
    <el-upload
      class="mb-12"
      accept=".jpeg,.jpg,.png"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChanges"
    >
      <template #trigger>
        <el-button type="primary"> 点击替换图片 </el-button>
      </template>
    </el-upload>
    <div class="item-wrap mb-12">
      像素大小
      <el-slider
        v-show="imgUrl"
        v-model="pixelSize"
        style="width: 50%"
        :min="2"
        :max="50"
      />
    </div>
    <div class="item-wrap">
      <el-image v-show="imgUrl" :src="imgUrl" fit="cover" class="w-600 h-400" />
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
// 像素大小
const pixelSize = ref(10);
const rawFile = ref();
const canvas = ref<HTMLCanvasElement | null>(null);
const imgUrl = ref(
  "https://ts1.cn.mm.bing.net/th/id/R-C.e9e7a51477505f71fd2c2fe5fec52b9b?rik=xV6rWM2vq9wKAA&riu=http%3a%2f%2fwww.deskcar.com%2fdesktop%2ffengjing%2f2014330120325%2f4.jpg&ehk=51IkWePiwFEPiX1GYM7kmYeSWt%2b%2bjz9xUWECm5HN7Qo%3d&risl=&pid=ImgRaw&r=0"
);

// 重新绘制
watch(pixelSize, () => {
  redrawCanvas();
});
// 路径url转成file文件格式
async function convertUrlToFile(imageUrl: string, fileName: string) {
  try {
    // 发起GET请求获取资源，设置responseType为blob
    const response = await fetch(imageUrl, { method: "GET", mode: "cors" });
    // 检查请求是否成功
    if (!response.ok) {
      throw new Error("图片加载失败！");
    }
    // 获取Blob数据
    const blob = await response.blob();
    // 创建File对象
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error("图片url转换Blob失败!", error);
    return null;
  }
}
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
      ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height);
      // 对canvas内容进行像素化处理
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
// File转base64
function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
const handleChanges = async (file: any) => {
  rawFile.value = file.raw;
  loadImage(file.raw);
  imgUrl.value = (await fileToBase64(file.raw)) as string;
};
</script>
<style scoped>
.item-wrap {
  display: flex;
  gap: 12px;
}
</style>
