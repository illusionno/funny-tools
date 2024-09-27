<template>
  <div>
    <el-upload
      class="upload-demo"
      accept=".jpeg,.jpg,.png"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChanges"
    >
      <template #trigger>
        <slot name="btn">
          <el-button type="primary">
            <IconParkOutlineUploadPicture class="mr-3" />
            点击上传图片
          </el-button>
        </slot>
      </template>
    </el-upload>
  </div>
</template>
<script setup lang="ts">
import IconParkOutlineUploadPicture from "~icons/icon-park-outline/upload-picture";
const emit = defineEmits(["change"]);
const handleChanges = (file: any) => {
  emit("change", file.raw);
};
</script>
<style scoped lang="scss">
:deep(.el-button) {
  background-color: #aea9e0;
  border:none;
}
</style>
