<template>
  <div class="auto-wrap index-wrap">
    <!-- 返回按钮 -->
    <div class="flex justify-between items-center">
      <EpBack
        class="hvr-sweep-to-top back-btn"
        @click="router.push({ name: 'home' })"
      />
      <a
        href="https://github.com/illusionno/funny-tools"
        target="_blank"
        rel="noopener noreferrer"
        style="
          text-decoration: none;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <img
          class="w-44"
          src="../../assets/imgs/github.png"
          alt="GitHub"
          style="cursor: pointer"
        />
        <span class="ml-4">代码仓库</span>
      </a>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrap">
      <!-- 工具展示区域 -->
      <div>
        <!-- 工具网格 -->
        <div v-for="item in allLists" :key="item.type">
          <div class="tools-title">{{ item.type }}</div>
          <div class="tools-grid mb-30">
            <div
              v-for="(subItem, i) in item.lists"
              :key="subItem.path || i"
              class="tool-card-wrapper"
              @click="subItem.path && router.push({ name: subItem.path })"
            >
              <div class="tool-card" :class="{ disabled: !subItem.path }">
                <div class="card-inner">
                  <!-- 图片容器 -->
                  <div class="image-wrapper">
                    <el-image
                      v-if="subItem.img"
                      :src="subItem.img"
                      :alt="subItem.title"
                      fit="cover"
                      class="tool-image"
                    />
                    <div v-else class="tool-image"></div>
                    <div class="image-overlay">
                      <el-icon class="overlay-icon"><ArrowUp /></el-icon>
                    </div>
                  </div>

                  <!-- 卡片内容 -->
                  <div class="card-content">
                    <h3 class="tool-title">{{ subItem.title }}</h3>
                    <div class="tool-status">
                      <el-tag
                        v-if="subItem.path"
                        type="success"
                        effect="light"
                        size="small"
                        round
                      >
                        可使用
                      </el-tag>
                      <el-tag
                        v-else
                        type="info"
                        effect="light"
                        size="small"
                        round
                      >
                        开发中
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧信息面板 -->
      <div class="info-panel">
        <div class="panel-card">
          <div class="panel-header">
            <el-icon class="panel-icon"><InfoFilled /></el-icon>
            <h3>使用说明</h3>
          </div>
          <div class="panel-content">
            <div class="tip-item">
              <span class="tip-icon">💡</span>
              <span>点击卡片即可使用工具</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🚀</span>
              <span>更多工具正在开发中</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">❤️</span>
              <span>欢迎提出建议和反馈</span>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="panel-card stats-card">
          <div class="panel-header">
            <el-icon class="panel-icon"><DataAnalysis /></el-icon>
            <h3>工具统计</h3>
          </div>
          <div class="stats-content">
            <div class="stat-item">
              <div class="stat-number">{{ availableToolsCount }}</div>
              <div class="stat-label">可用工具</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalToolsCount }}</div>
              <div class="stat-label">总计工具</div>
            </div>
          </div>
        </div>

        <!-- 每日一句 -->
        <div class="panel-card daily-card">
          <div class="panel-header">
            <el-icon class="panel-icon"><Calendar /></el-icon>
            <h3>每日一句</h3>
            <el-icon class="cursor-pointer" @click="getDailyText"
              ><Refresh
            /></el-icon>
          </div>
          <div class="daily-content p-12">
            <p class="daily-text">{{ dailyText }}</p>
          </div>
        </div>

        <!-- 每日心情 -->
        <div class="panel-card">
          <div class="panel-header">
            <h3>
              今日心情 {{ selectedMood ? "·" + selectedMood?.label : "" }}
            </h3>
          </div>
          <div class="panel-content">
            <div class="mood-grid">
              <div
                v-for="mood in moodOptions"
                :key="mood.id"
                class="mood-item"
                :class="{ selected: selectedMood?.id === mood.id }"
                @click="selectMood(mood)"
              >
                <div class="mood-icon-wrapper">
                  <span class="mood-emoji">{{ mood.emoji }}</span>
                  <span class="mood-label">{{ mood.label }}</span>
                </div>
              </div>
            </div>
            <div v-if="selectedMood" class="mt-16">
              <el-alert
                :title="selectedMood.message"
                type="info"
                effect="light"
                :closable="false"
                show-icon
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EpBack from "~icons/ep/back";
import {
  ArrowUp,
  InfoFilled,
  DataAnalysis,
  Refresh,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import * as Img from "./export";
import { ElMessage } from "element-plus";
const router = useRouter();
const dailyText = ref("");
const allLists = [
  {
    type: "Three.js案例 ｡◕‿◕｡",
    lists: [
      {
        title: "添加阴影",
        img: Img.shadow,
        path: "three-shadow",
      },
      {
        title: "纹理贴图",
        img: Img.texture,
        path: "three-texture",
      },
      {
        title: "天空盒",
        img: Img.skybox,
        path: "three-skybox",
      },
      {
        title: "PBR基于物理材质的渲染",
        img: Img.prb,
        path: "three-pbr",
      },
      {
        title: "雾化",
        img: Img.frog,
        path: "three-fog",
      },
      {
        title: "粒子系统",
        img: Img.particle,
        path: "three-particle",
      },
      {
        title: "半球光",
        img: Img.himisphere,
        path: "three-hemisphere-light",
      },
      {
        title: "水波纹与天空",
        img: Img.water,
        path: "three-water",
      },
    ],
  },
  {
    type: "一些实用的 (´･ω･`)",
    lists: [
      {
        title: "图片转像素画",
        img: Img.pixel,
        path: "pixel-art",
      },
      {
        title: "颜色识别",
        img: Img.color,
        path: "color-identify",
      },
      {
        title: "IP地址计算",
        img: Img.ip,
        path: "ip-compute",
      },
      {
        title: "HTML元素查看",
        img: Img.html,
        path: "dom-display",
      },
      {
        title: "文本处理器",
        img: Img.text,
        path: "", // 开发中
      },
      {
        title: "二维码生成",
        img: Img.qrcode,
        path: "", // 开发中
      },
      {
        title: "Linux常见命令查询",
        img: Img.linux,
        path: "linux-command",
      },
    ],
  },
  {
    type: "一些好玩的 ๑乛◡乛๑",
    lists: [
      {
        title: "人生小格",
        img: Img.life,
        path: "life-grid",
      },
      {
        title: "每日运势分析",
        img: Img.fortune,
        path: "daily-fortune",
      },
    ],
  },
];
// 心情相关
const selectedMood = ref();
const moodOptions = [
  {
    id: 1,
    emoji: "😊",
    label: "开心",
    message: "今天心情不错呢！保持这份美好～",
    color: "#67C23A",
  },
  {
    id: 2,
    emoji: "😔",
    label: "不开心",
    message: "没关系，难过的情绪也需要被接纳，明天会更好的！",
    color: "#E6A23C",
  },
  {
    id: 3,
    emoji: "😐",
    label: "一般般",
    message: "平静的日子也有它的美好，慢慢来就好～",
    color: "#909399",
  },
  {
    id: 4,
    emoji: "😴",
    label: "有点累",
    message: "辛苦了！记得好好休息，劳逸结合很重要哦！",
    color: "#F56C6C",
  },
  {
    id: 5,
    emoji: "🤔",
    label: "思考中",
    message: "思考是成长的开始，愿你找到心中的答案！",
    color: "#409EFF",
  },
  {
    id: 6,
    emoji: "🎉",
    label: "兴奋",
    message: "哇！看起来有什么好事发生了呢～",
    color: "#722ED1",
  },
];

// 选择心情
const selectMood = (mood: any) => {
  selectedMood.value = mood;
  ElMessage({
    message: `记录成功！${mood.message}`,
    type: "success",
    duration: 3000,
  });

  // 保存到本地存储
  localStorage.setItem(
    "daily-mood",
    JSON.stringify({
      mood: mood,
      date: new Date().toDateString(),
    })
  );
};
const dailyTexts = [
  "生活就像海洋，只有意志坚强的人才能达到彼岸。",
  "你想成为幸福的人吗？但愿你首先学会吃得起苦。",
  "最困难的时候，就是距离成功不远了。",
  "星光不问赶路人，时光不负有心人。",
  "愿你历经千帆，归来仍是少年。",
  "山有峰顶，海有彼岸，漫漫长途，终有回转。",
  "愿你的生活常温暖，日子总是温柔又闪光。",
];
const getDailyText = () => {
  const randomIndex = Math.floor(Math.random() * dailyTexts.length);
  dailyText.value = dailyTexts[randomIndex];
};
onMounted(() => {
  getDailyText();
});
// 计算可用工具数量
const availableToolsCount = computed(() => {
  return allLists.reduce((count, category) => {
    return count + category.lists.filter((tool) => tool.path).length;
  }, 0);
});

// 计算总工具数量
const totalToolsCount = computed(() => {
  return allLists.reduce((count, category) => count + category.lists.length, 0);
});
</script>

<style scoped lang="scss">
.index-wrap {
  min-height: 100vh;
  background: linear-gradient(135deg, #8da0f3 0%, #764ba2 100%);

  // position: relative;
  padding: 20px;
  overflow-x: hidden;
  @media (max-width: 768px) {
    padding: 15px;
  }

  // 添加背景装饰
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
}

.content-wrap {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  margin-top: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 250px;
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 60px;
  }
}

// 页面头部
.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
    font-family: "黑体", "华文中宋", "方正姚体", "华文新魏", "楷体", "仿宋",
      sans-serif;
    .title-icon,
    .title-decoration {
      display: inline-block;
      animation: bounce 2s ease-in-out infinite;
    }

    .title-decoration {
      animation-delay: 1s;
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .page-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.tools-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  background: none;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 16px;
  margin-bottom: 16px;
}

// 工具网格
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  justify-items: center;
  margin-top: 12px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

// 工具卡片
.tool-card-wrapper {
  width: 100%;
  max-width: 300px;
}

.tool-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  position: relative;

  &:hover:not(.disabled) {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

    .image-overlay {
      opacity: 1;
    }

    .tool-image {
      transform: scale(1.1);
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.7;

    &:hover {
      transform: none;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  }

  .card-inner {
    position: relative;
  }
}

// 图片区域
.image-wrapper {
  position: relative;
  height: 160px;
  overflow: hidden;

  .tool-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(102, 126, 234, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    .overlay-icon {
      font-size: 24px;
      color: white;
    }
  }
}

// 卡片内容
.card-content {
  padding: 20px;
  text-align: center;

  .tool-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #333;
    font-family: "MaoKenWangXingYuan", sans-serif;
  }

  .tool-status {
    display: flex;
    justify-content: center;
  }
}

// 信息面板
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 100px;
  height: fit-content;

  @media (max-width: 768px) {
    position: static;
    margin-top: 20px;
  }
}

.panel-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;

    .panel-icon {
      font-size: 20px;
      color: #667eea;
    }

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }
  }

  .panel-content {
    .tip-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 0.9rem;
      color: #666;

      .tip-icon {
        font-size: 16px;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 统计卡片
.stats-card {
  .stats-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;

    .stat-item {
      text-align: center;
      padding: 15px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;

      .stat-number {
        font-size: 1.8rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 5px;
      }

      .stat-label {
        font-size: 0.8rem;
        color: #666;
        font-weight: 500;
      }
    }
  }
}

// 动画优化
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-card {
  animation: slideInUp 0.6s ease-out forwards;
}

// 为每个卡片添加延迟动画
.tool-card-wrapper:nth-child(1) .tool-card {
  animation-delay: 0.1s;
}
.tool-card-wrapper:nth-child(2) .tool-card {
  animation-delay: 0.2s;
}
.tool-card-wrapper:nth-child(3) .tool-card {
  animation-delay: 0.3s;
}
.tool-card-wrapper:nth-child(4) .tool-card {
  animation-delay: 0.4s;
}
.tool-card-wrapper:nth-child(5) .tool-card {
  animation-delay: 0.5s;
}
.tool-card-wrapper:nth-child(6) .tool-card {
  animation-delay: 0.6s;
}
.tool-card-wrapper:nth-child(7) .tool-card {
  animation-delay: 0.7s;
}
.tool-card-wrapper:nth-child(8) .tool-card {
  animation-delay: 0.8s;
}

// Element Plus 组件样式覆盖
:deep(.el-button) {
  font-family: "MaoKenWangXingYuan", sans-serif;
}

:deep(.el-tag) {
  border: none;
  font-weight: 500;
}
.mood-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 12px;
  cursor: pointer;
  .mood-item {
    &:hover {
      .mood-icon-wrapper {
        background-color: #d8dffb;
      }
    }
  }
  .selected {
    background-color: #d8dffb;
  }
  .mood-icon-wrapper {
    display: grid;
    place-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    gap: 6px;
    .mood-emoji {
      font-size: 34px;
    }
    .mood-label {
      font-size: 12px;
      color: #666;
    }
  }
}
.daily-text {
  font-family: "楷体";
  font-size: 20px;
}
</style>
