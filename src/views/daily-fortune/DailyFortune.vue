<template>
  <VContainer title="每日运势分析 ✨">
    <div class="fortune-container">
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-card">
          <div class="card-header">
            <el-icon class="header-icon"><Calendar /></el-icon>
            <h3>告诉我你的生日 🎂</h3>
          </div>
          <div class="date-input">
            <el-date-picker
              v-model="birthDate"
              type="date"
              placeholder="选择你的出生日期"
              size="large"P
              :disabled-date="disabledDate"
              format="YYYY年MM月DD日"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </div>
          <el-button
            type="primary"
            size="large"
            @click="getFortune"
            :loading="loading"
            :disabled="!birthDate"
            class="fortune-btn"
          >
            <el-icon><MagicStick /></el-icon>
            {{ loading ? "正在为你算运势..." : "获取今日运势" }}
          </el-button>
        </div>
      </div>

      <!-- 运势展示区域 -->
      <div v-if="showFortune" class="fortune-display">
        <!-- 星座运势 -->
        <div class="fortune-card constellation-card">
          <div class="card-header">
            <div class="constellation-icon">{{ constellationInfo.icon }}</div>
            <h3>{{ constellationInfo.name }}座运势</h3>
          </div>
          <div class="fortune-content">
            <div class="fortune-item">
              <span class="label">💝 综合运势：</span>
              <el-rate
                v-model="constellationInfo.overall"
                disabled
                show-score
              />
            </div>
            <div class="fortune-item">
              <span class="label">💕 爱情运势：</span>
              <el-rate v-model="constellationInfo.love" disabled show-score />
            </div>
            <div class="fortune-item">
              <span class="label">💰 财运指数：</span>
              <el-rate v-model="constellationInfo.money" disabled show-score />
            </div>
            <div class="fortune-item">
              <span class="label">🏥 健康运势：</span>
              <el-rate v-model="constellationInfo.health" disabled show-score />
            </div>
            <div class="fortune-text">
              <p>{{ constellationInfo.description }}</p>
            </div>
            <div class="lucky-info">
              <el-tag type="success" effect="light"
                >🍀 幸运数字: {{ constellationInfo.luckyNumber }}</el-tag
              >
              <el-tag type="warning" effect="light"
                >🌈 幸运颜色: {{ constellationInfo.luckyColor }}</el-tag
              >
            </div>
          </div>
        </div>

        <!-- 今日黄历 -->
        <div class="fortune-card calendar-card">
          <div class="card-header">
            <el-icon class="header-icon"><Notebook /></el-icon>
            <h3>今日黄历 📅</h3>
          </div>
          <div class="calendar-content">
            <div class="date-info">
              <div class="lunar-date">{{ todayInfo.lunarDate }}</div>
              <div class="solar-date">{{ todayInfo.solarDate }}</div>
            </div>
            <div class="yi-ji-section">
              <div class="yi-section">
                <h4>✅ 宜</h4>
                <div class="tags-wrap">
                  <el-tag
                    v-for="item in todayInfo.yi"
                    :key="item"
                    type="success"
                    effect="light"
                  >
                    {{ item }}
                  </el-tag>
                </div>
              </div>
              <div class="ji-section">
                <h4>❌ 忌</h4>
                <div class="tags-wrap">
                  <el-tag
                    v-for="item in todayInfo.ji"
                    :key="item"
                    type="danger"
                    effect="light"
                  >
                    {{ item }}
                  </el-tag>
                </div>
              </div>
            </div>
            <div class="daily-tip">
              <el-alert
                :title="todayInfo.tip"
                type="info"
                effect="light"
                show-icon
                :closable="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import VContainer from "@/components/v-container/Container.vue";
import { Calendar, MagicStick, Notebook } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";

// 响应式数据
const birthDate = ref("");
const loading = ref(false);
const showFortune = ref(false);

// 星座信息
const constellationInfo = reactive({
  name: "",
  icon: "",
  overall: 0,
  love: 0,
  money: 0,
  health: 0,
  description: "",
  luckyNumber: "",
  luckyColor: "",
});

// 今日信息
const todayInfo = reactive({
  solarDate: "",
  lunarDate: "",
  yi: [] as string[],
  ji: [] as string[],
  tip: "",
});

// 星座数据
const constellations = [
  { name: "白羊", icon: "♈", start: "03-21", end: "04-19" },
  { name: "金牛", icon: "♉", start: "04-20", end: "05-20" },
  { name: "双子", icon: "♊", start: "05-21", end: "06-21" },
  { name: "巨蟹", icon: "♋", start: "06-22", end: "07-22" },
  { name: "狮子", icon: "♌", start: "07-23", end: "08-22" },
  { name: "处女", icon: "♍", start: "08-23", end: "09-22" },
  { name: "天秤", icon: "♎", start: "09-23", end: "10-23" },
  { name: "天蝎", icon: "♏", start: "10-24", end: "11-22" },
  { name: "射手", icon: "♐", start: "11-23", end: "12-21" },
  { name: "摩羯", icon: "♑", start: "12-22", end: "01-19" },
  { name: "水瓶", icon: "♒", start: "01-20", end: "02-18" },
  { name: "双鱼", icon: "♓", start: "02-19", end: "03-20" },
];

// 运势描述模板
const fortuneTemplates = [
  "今天是充满能量的一天，适合主动出击，把握机会！",
  "心情愉悦，人际关系和谐，是社交的好时机。",
  "财运不错，可以考虑一些小额投资或理财。",
  "健康运势良好，适合进行运动锻炼。",
  "工作效率很高，创意思维活跃，适合创新项目。",
  "感情运势稳定，单身者有机会遇到心仪对象。",
  "学习运势佳，适合充电学习新技能。",
];

// 黄历数据
const yiOptions = [
  "出行",
  "会友",
  "投资",
  "学习",
  "运动",
  "购物",
  "约会",
  "工作",
  "休息",
  "聚餐",
];
const jiOptions = [
  "争吵",
  "熬夜",
  "暴饮暴食",
  "冲动消费",
  "抱怨",
  "拖延",
  "负面思考",
  "过度劳累",
];

// 禁用未来日期
const disabledDate = (date: Date) => {
  return date > new Date();
};

// 计算星座
const getConstellation = (date: string) => {
  const month = parseInt(date.substring(5, 7));
  const day = parseInt(date.substring(8, 10));
  const dateStr =
    String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");

  return (
    constellations.find((constellation) => {
      const start = constellation.start;
      const end = constellation.end;

      if (start <= end) {
        return dateStr >= start && dateStr <= end;
      } else {
        return dateStr >= start || dateStr <= end;
      }
    }) || constellations[0]
  );
};

// 生成随机运势
const generateFortune = () => {
  return {
    overall: Math.floor(Math.random() * 2) + 4, // 4-5星
    love: Math.floor(Math.random() * 3) + 3, // 3-5星
    money: Math.floor(Math.random() * 3) + 3, // 3-5星
    health: Math.floor(Math.random() * 2) + 4, // 4-5星
    luckyNumber: Math.floor(Math.random() * 99) + 1,
    luckyColor: ["红色", "蓝色", "绿色", "紫色", "橙色", "粉色", "黄色"][
      Math.floor(Math.random() * 7)
    ],
    description:
      fortuneTemplates[Math.floor(Math.random() * fortuneTemplates.length)],
  };
};

// 生成今日黄历
const generateTodayInfo = () => {
  const today = dayjs();
  const yi = yiOptions.sort(() => Math.random() - 0.5).slice(0, 4);
  const ji = jiOptions.sort(() => Math.random() - 0.5).slice(0, 3);

  return {
    solarDate: today.format("YYYY年MM月DD日 dddd"),
    lunarDate: `农历${today.format("MM月DD日")}`,
    yi,
    ji,
    tip: "保持积极心态，好运自然来！💪",
  };
};

// 获取运势
const getFortune = async () => {
  if (!birthDate.value) {
    ElMessage.warning("请先选择你的出生日期哦～");
    return;
  }

  loading.value = true;

  // 模拟加载
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 计算星座
  const constellation = getConstellation(birthDate.value);
  const fortune = generateFortune();

  // 更新星座信息
  Object.assign(constellationInfo, {
    name: constellation.name,
    icon: constellation.icon,
    ...fortune,
  });

  // 更新今日信息
  Object.assign(todayInfo, generateTodayInfo());

  loading.value = false;
  showFortune.value = true;

  ElMessage.success("运势分析完成！✨");
};
</script>

<style scoped>
.fortune-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.input-section {
  margin-bottom: 30px;
}

.input-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  color: white;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.header-icon {
  font-size: 24px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.date-input {
  margin: 20px 0;
}

.fortune-btn {
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 15px;
  transition: all 0.3s ease;
}

.fortune-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
}

.fortune-display {
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.fortune-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.fortune-card:hover {
  transform: translateY(-5px);
}

.constellation-card {
  background: linear-gradient(135deg, #cefffe 0%, #92d5ff 100%);
}

.calendar-card {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.constellation-icon {
  font-size: 32px;
  margin-right: 10px;
}

.fortune-content {
  margin-top: 20px;
}

.fortune-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.label {
  font-weight: 600;
  min-width: 100px;
  font-size: 14px;
}

.fortune-text {
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.lucky-info {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.calendar-content {
  margin-top: 20px;
}

.date-info {
  text-align: center;
  margin-bottom: 20px;
}

.lunar-date {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.solar-date {
  font-size: 14px;
  color: #666;
}

.yi-ji-section {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}

.yi-section h4,
.ji-section h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
}

.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.daily-tip {
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fortune-container {
    padding: 15px;
  }

  .fortune-display {
    grid-template-columns: 1fr;
  }

  .input-card {
    padding: 20px;
  }

  .fortune-card {
    padding: 20px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fortune-display {
  animation: fadeInUp 0.6s ease-out;
}

/* 自定义组件样式覆盖 */
:deep(.el-rate__icon) {
  margin-right: 3px;
}

:deep(.el-date-editor.el-input) {
  border-radius: 25px;
}

:deep(.el-alert) {
  border-radius: 12px;
}
</style>