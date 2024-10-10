<template>
  <VContainer title="IP地址自动计算">
    <div class="box-wrap">
      <el-form label-width="auto" :model="editForm">
        <el-form-item label="子网掩码转换">
          <div class="w-100% flex gap-6">
            输入IP
            <el-input
              v-for="(_, i) in convertState.ip"
              :key="i"
              :ref="(e: any) => (numInputRefs[i] = e)"
              v-model="convertState.ip[i]"
              :controls="false"
              class="w-60!"
              @input="handleInput(i)"
            />
            子网掩码
            <el-input-number
              v-model="convertState.mask"
              :min="0"
              :max="32"
              :controls="false"
              class="w-60!"
            />
            <div class="tag-btn hvr-pulse-shrink" @click="handleCalculate">计算</div>
            <div class="tag-btn hvr-pulse-shrink" @click="handleClear">清除</div>
          </div>
        </el-form-item>
        <el-form-item label="IP起始地址" prop="ipStart">
          <el-input
            v-model.trim="editForm.ipStart"
            placeholder="请输入IP起始地址"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="IP结束地址" prop="ipEnd">
          <el-input
            v-model.trim="editForm.ipEnd"
            placeholder="请输入IP结束地址"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </VContainer>
</template>
<script setup lang="ts">
import VContainer from "@/components/v-container/Container.vue";
import type { InputInstance } from "element-plus";
import _ from "lodash";
import { ElMessage } from "element-plus";

const numInputRefs = reactive<Record<number, InputInstance>>({});
const editForm = ref({
  ipStart: "",
  ipEnd: "",
});

// 子网掩码转换
const convertState = reactive({
  ip: ["", "", "", ""],
  mask: null as number | null,
});

const handleInput = (i: number) => {
  const val = convertState.ip[i];
  // 只允许数字
  if (!val.match(/[0-9.]/)) {
    convertState.ip[i] = val.replace(/[^0-9.]/g, "");
  }
  if (Number(val) < 0) return (convertState.ip[i] = "0");
  if (Number(val) > 255) return (convertState.ip[i] = "255");

  if (val.includes(".")) {
    if (i < convertState.ip.length - 1) {
      // 前三个.跳转
      convertState.ip[i] = val.slice(0, -1);
      _.get(numInputRefs, i + 1).focus();
    } else {
      convertState.ip[i] = val.slice(0, -1);
    }
  }
};

// 将 IP 地址字符串转换为整数
function ipToInt(ip: string) {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
}

// 将整数转换为 IP 地址字符串
function intToIp(intIp: number) {
  return `${intIp >>> 24}.${(intIp >> 16) & 255}.${(intIp >> 8) & 255}.${
    intIp & 255
  }`;
}
// 计算ip地址范围
function calculateIpRange(ip: string, maskBits: number) {
  // 将 IP 地址转换为整数
  const ipInt = ipToInt(ip);

  // 计算掩码
  const mask = -1 << (32 - maskBits);

  // ip起始地址: 掩码数31，只有网络地址和广播地址; 否则不包含网络地址
  const startIpInt = maskBits < 31 ? (ipInt & mask) + 1 : ipInt & mask;
  // ip结束地址
  let endIpInt = null;
  if (maskBits < 32) {
    // 掩码31位包含广播地址,小于31不包含广播地址
    endIpInt =
      maskBits === 31
        ? (ipInt & mask) + 2 ** (32 - maskBits) - 1
        : (ipInt & mask) + 2 ** (32 - maskBits) - 2;
  }

  // 将整数转换为 IP 地址字符串
  const startIpAddress = intToIp(startIpInt);
  const endIpAddress = endIpInt !== null ? intToIp(endIpInt) : null;
  return [startIpAddress, endIpAddress];
}
const handleCalculate = () => {
  if (
    _.some(convertState.ip, (item: any) => _.isEmpty(item)) ||
    !convertState.mask
  ) {
    return ElMessage.warning("ip和掩码位不能为空！");
  }
  const ip = convertState.ip.join(".");
  const [startIpAddress, endIpAddress] = calculateIpRange(
    ip,
    convertState.mask
  );
  editForm.value.ipStart = startIpAddress as string;
  editForm.value.ipEnd = endIpAddress as string;
};
// 清空IP和子网掩码
const handleClear = () => {
  convertState.ip = ["", "", "", ""];
  convertState.mask = null;
  editForm.value.ipStart = "";
  editForm.value.ipEnd = "";
};
</script>
<style scoped></style>
