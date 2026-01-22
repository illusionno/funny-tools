<template>
  <VContainer title="中文转拼音/简繁体转换">
    <div class="box-wrap flex-col gap-12">
     
        <el-input
          v-model="input"
          type="textarea"
          rows="4"
          placeholder="请输入中文"
        />

        <el-radio-group v-model="mode" class="my-24">
          <el-radio-button label="pinyin-tone">
            拼音（带声调）
          </el-radio-button>
          <el-radio-button label="pinyin-plain">
            拼音（无声调）
          </el-radio-button>
          <el-radio-button label="traditional"> 转繁体 </el-radio-button>
        </el-radio-group>

        <el-input
          :model-value="output"
          type="textarea"
          rows="4"
          readonly
          placeholder="输出结果"
        />

    </div>
  </VContainer>
</template>

<script setup lang="ts">
import VContainer from "@/components/v-container/Container.vue";
import { ref, computed } from "vue";
import { pinyin } from "pinyin-pro";
import * as OpenCC from "opencc-js";

/**
 * ===============================
 * 1. 状态
 * ===============================
 */
const input = ref("");
const mode = ref<"pinyin-tone" | "pinyin-plain" | "traditional">("pinyin-tone");

/**
 * ===============================
 * 2. OpenCC 初始化
 * ===============================
 * s2t: Simplified → Traditional
 *
 * ⚠️ 这里的 cc 内部就是 Trie
 * - 支持最长匹配
 * - 不是逐字转换
 */

const cn2tw = OpenCC.Converter({ from: "cn", to: "tw" });
const tw2cn = OpenCC.Converter({ from: "tw", to: "cn" });

/**
 * ===============================
 * 4. 输出计算
 * ===============================
 */
const output = computed(() => {
  if (!input.value.trim()) return "";

  switch (mode.value) {
    case "pinyin-tone":
      return pinyin(input.value, {
        toneType: "symbol", // ā á ǎ à
        type: "array",
      }).join(" ");

    case "pinyin-plain":
      return pinyin(input.value, {
        toneType: "none",
        type: "array",
      }).join(" ");

    case "traditional":
      return cn2tw(input.value);
    default:
      return "";
  }
});
</script>

