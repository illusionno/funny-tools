<template>
  <div :style="{ marginLeft: `${indent}px` }" class="cursor-pointer">
    <!-- 元素节点-->
    <span v-if="node.type === 'tag'" @click.stop="toggleExpand(node)" class="flex items-center">
      <!-- 折叠/展开icon -->
      <span v-if="node.children?.length">
        <el-icon
          :class="{
            'transform rotate-90 ': isExpanded,
          }"
          ><CaretRight
        /></el-icon>
      </span>
      <!-- 标签名和属性 -->
      <span>
        <span class="color-#f33f3f">{{ `<${node.name}` }}</span>
        <template v-if="!_.isEmpty(node.attribs)">
          <span v-for="(v, k) in node.attribs" :key="k">
            <span class="ml-6 color-#b84f15">{{ k }}="</span>
            <span class="color-#3977d9">{{ v }}</span>
            <span class="color-#b84f15">"</span>
          </span>
        </template>
        <span class="color-#ef2b2a" v-show="_.isEmpty(node.children)">/</span>
        <span class="color-#ef2b2a">&gt;</span>
        <el-tag
          effect="plain"
          v-show="!isExpanded && !_.isEmpty(node.children)"
          size="small"
          round
          class="ml-4! h-12!">
          <span class="tag-dot">...</span></el-tag
        >
      </span>
    </span>
    <!-- 文本节点 -->
    <span v-if="node.type === 'text'">
      <span>{{ node.data }}</span>
    </span>
    <!-- 注释节点 -->
    <span v-if="node.type === 'comment'" class="font-italic color-#a7a7a7d9">
      {{ `<!-- ${node.data} -->` }}
    </span>
    <!-- 递归渲染子节点 -->
    <div v-show="isExpanded && !_.isEmpty((node as Element).children)" class="child-nodes">
      <TreeNode
        v-for="(child, i) in ((node as Element).children as DOMNode[]) "
        :key="i"
        :node="child"
        :path="`${path}-${i}`"
        :expandedNodes="expandedNodes"
        @toggleExpand="handleToggleExpand"
        :indent="indent" />
    </div>
    <!--闭合标签 -->
    <span v-if="node.type === 'tag' && !_.isEmpty(node.children)" class="color-#ef2b2a">
      &nbsp;&nbsp; &lt;/{{ node.name }}&gt;
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CaretRight } from '@element-plus/icons-vue';
import _ from 'lodash'
import type { DOMNode, Element } from 'html-dom-parser';

const props = defineProps<{
  node: DOMNode;
  path: string;
  expandedNodes: Set<string>;
  indent: number;
}>();

const emit = defineEmits(['toggleExpand']);

const isExpanded = computed(() => props.expandedNodes.has(props.path));

const toggleExpand = (node: Element) => {
  if (_.isEmpty(node.children)) return;
  emit('toggleExpand', props.path);
};

const handleToggleExpand = (path: string) => {
  emit('toggleExpand', path);
};
</script>

<style scoped>
.child-nodes {
  color: #303133;
  position: relative;
}

.child-nodes::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  border-left: 1px solid #dfdddd;
}
.tag-dot {
  position: relative;
  bottom: 4px;
  font-size: 16px;
  font-weight: 600;
}
</style>
