<template>
  <TreeNode
    v-for="(node, index) in domStructure"
    :key="index"
    :node="node"
    :indent="16"
    :path="generatePath(index)"
    :expandedNodes="expandedNodes"
    @toggleExpand="toggleExpand"
  />
</template>
<script setup lang="ts">
import TreeNode from "./TreeNode.vue";
// https://github.com/remarkablemark/html-dom-parser
import parse from "html-dom-parser";
import type { DOMNode } from "html-dom-parser";

const props = defineProps<{
  html: string;
}>();
// 存储 DOM 结构
const domStructure = ref<DOMNode[]>([]);

// 展开/折叠状态
const expandedNodes = ref<Set<string>>(new Set());
// 生成唯一路径
function generatePath(index: number, parentPath = ""): string {
  return parentPath ? `${parentPath}-${index}` : `${index}`;
}

// 76
// 切换节点展开/折叠状态
function toggleExpand(path: string) {
  if (expandedNodes.value.has(path)) {
    expandedNodes.value.delete(path);
  } else {
    expandedNodes.value.add(path);
  }
}
// 默认展开子节点数大于2的节点
function expandAllNodes(nodes: DOMNode[], parentPath = "") {
  nodes.forEach((node, index) => {
    if (node.type === "tag" && node.children?.length > 2) {
      const path = generatePath(index, parentPath);
      expandedNodes.value.add(path);
      // 递归处理子节点
      expandAllNodes(node.children as DOMNode[], path);
    }
  });
}

onMounted(() => {
  // 解析 HTML 字符串
  domStructure.value = parse(props.html);
  expandAllNodes(domStructure.value);
});
</script>
<style scoped></style>
