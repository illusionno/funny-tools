<script setup lang="ts">
import VContainer from "@/components/v-container/Container.vue";
import { ref } from 'vue';

const menuList = ref<string[]>(['汉堡', '米饭', '面条', '沙拉']);
const newMenu = ref('');
const spinning = ref(false);
const selectedIndex = ref<number|null>(null);
const rotateDeg = ref(0);

function addMenu() {
  const val = newMenu.value.trim();
  if (val && !menuList.value.includes(val)) {
    menuList.value.push(val);
    newMenu.value = '';
  }
}

function removeMenu(idx: number) {
  menuList.value.splice(idx, 1);
  if (selectedIndex.value === idx) selectedIndex.value = null;
}

function startSpin() {
  if (menuList.value.length === 0 || spinning.value) return;
  spinning.value = true;
  const idx = Math.floor(Math.random() * menuList.value.length);
  selectedIndex.value = idx;
  const perDeg = 360 / menuList.value.length;
  const targetDeg = 360 * 5 + (270 - idx * perDeg - perDeg / 2);
  rotateDeg.value = targetDeg;
  setTimeout(() => {
    spinning.value = false;
  }, 2000);
}

function getSectorPath(idx: number, total: number) {
  const cx = 160, cy = 160, r = 140;
  const angle = 360 / total;
  const start = (angle * idx - 90) * Math.PI / 180;
  const end = (angle * (idx + 1) - 90) * Math.PI / 180;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`;
}

function getTextPos(idx: number, total: number) {
  const cx = 160, cy = 160, r = 95;
  const angle = 360 / total;
  const mid = angle * (idx + 0.5) - 90;
  const rad = mid * Math.PI / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function getColor(idx: number) {
  const colors = ["#f4f4f5", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#ff6b6b", "#38b2ac"];
  return colors[idx % colors.length];
}
</script>

<template>
  <VContainer title="今天吃什么？">
  
  <div class=" box-wrap">
    <div class="menu-input">
      <input v-model="newMenu" placeholder="添加菜单项" @keyup.enter="addMenu" />
      <button @click="addMenu" :disabled="!newMenu.trim()">添加</button>
    </div>
    <div class="menu-list">
      <span v-for="(item, idx) in menuList" :key="item" class="menu-item">
        <span class="item-text">{{ item }}</span>
        <button class="del-btn" @click="removeMenu(idx)" title="删除">×</button>
      </span>
    </div>
    <div class="wheel-area">
      <div class="wheel-box">
        <svg
          :style="{ transform: `rotate(${rotateDeg}deg)`, transition: 'transform 2s cubic-bezier(.17,.67,.83,.67)' }"
          class="wheel-svg"
          width="320" height="320" viewBox="0 0 320 320"
        >
          <g>
            <template v-for="(item, i) in menuList" :key="item">
              <path
                :d="getSectorPath(i, menuList.length)"
                :fill="getColor(i)"
                :stroke="selectedIndex === i ? '#ff6b6b' : '#fff'"
                stroke-width="3"
              />
              <text
                :x="getTextPos(i, menuList.length).x"
                :y="getTextPos(i, menuList.length).y"
                text-anchor="middle"
                alignment-baseline="middle"
                :fill="selectedIndex === i ? '#ff6b6b' : '#333'"
                font-size="18"
                font-family="inherit"
                transform="rotate(0)"
              >{{ item }}</text>
            </template>
          </g>
        </svg>
        <div class="wheel-pointer">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon points="20,0 35,40 5,40" fill="#ff6b6b" />
          </svg>
        </div>
      </div>
      <button class="start-btn" :disabled="spinning || menuList.length === 0" @click="startSpin">
        {{ spinning ? '旋转中...' : '开始' }}
      </button>
    </div>
    <div v-if="selectedIndex !== null && !spinning" class="result-tip">
      选中：<b>{{ menuList[selectedIndex] }}</b>
    </div>
  </div>
  </VContainer>
</template>

<style scoped>
.menu-input {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  justify-content: center;
}
.menu-input input {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #f4f4f5;
  font-size: 16px;
  outline: none;
  box-shadow: 0 1px 4px rgba(102,126,234,0.08);
}
.menu-input button {
  padding: 8px 20px;
  border-radius: 8px;
  background: linear-gradient(90deg, #6366f1 0%, #38b2ac 100%);
  color: #fff;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 1px 4px rgba(102,126,234,0.08);
}
.menu-input button:disabled {
  background: #e0e7ff;
  color: #a0aec0;
  cursor: not-allowed;
}
.menu-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
  justify-content: center;
}
.menu-item {
  display: flex;
  align-items: center;
  background: #fff;
  color: #6366f1;
  padding: 6px 18px 6px 14px;
  border-radius: 20px;
  font-size: 16px;
  box-shadow: 0 1px 4px rgba(102,126,234,0.08);
  position: relative;
  transition: box-shadow 0.2s;
}
.menu-item:hover {
  box-shadow: 0 2px 8px rgba(102,126,234,0.15);
}
.item-text {
  margin-right: 6px;
}
.del-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 18px;
  cursor: pointer;
  margin-left: 2px;
  padding: 0 4px;
  border-radius: 50%;
  transition: background 0.2s;
}
.del-btn:hover {
  background: #ffe4e6;
}
.wheel-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}
.wheel-box {
  position: relative;
  width: 320px;
  height: 320px;
  margin-bottom: 18px;
}
.wheel-svg {
  border-radius: 50%;
  box-shadow: 0 4px 24px 0 rgba(102,126,234,0.12);
  background: #fff;
}
.wheel-pointer {
  position: absolute;
  left: 50%;
  top: -18px;
  transform: translateX(-50%);
  z-index: 2;
}
.start-btn {
  padding: 10px 36px;
  border-radius: 24px;
  background: linear-gradient(90deg, #6366f1 0%, #38b2ac 100%);
  color: #fff;
  font-size: 20px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102,126,234,0.15);
  transition: background 0.2s, transform 0.2s;
}
.start-btn:active {
  transform: scale(0.96);
}
.start-btn:disabled {
  background: #e0e7ff;
  color: #a0aec0;
  cursor: not-allowed;
}
.result-tip {
  font-size: 22px;
  color: #ff6b6b;
  margin-top: 10px;
}
</style>