<template>
  <div class="auto-wrap" ref="exportContent">
    <EpBack
      class="hvr-pulse back-btn"
      @click="router.push({ name: 'index' })"
    />
    <div>
      <VTitleBar title="人生小格" />
      <div class="flex flex-col gap-12">
        <div class="box-wrap flex flex gap-16 justify-between">
          <el-date-picker
            v-model="dateVal"
            type="date"
            placeholder="请选择出生日期"
          />
          <PhExportDuotone
            v-show="dateData"
            class="h-22 w-22 cursor-pointer"
            @click="exportToImage"
          />
        </div>
        <div v-if="dateData" class="box-wrap flex flex-col gap-12">
          <div>
            <div class="tag">已经过去了</div>
            <div class="list">
              <div class="text-center">
                <span class="num">
                  {{ dateData.past.year }}
                </span>
                年
              </div>
              <div class="text-center">
                <span class="num">
                  {{ dateData.past.hour }}
                </span>
                时
              </div>
              <div class="text-center">
                <span class="num">
                  {{ dateData.past.month }}
                </span>
                月
              </div>

              <div class="text-center">
                <span class="num">
                  {{ dateData.past.minute }}
                </span>
                分
              </div>
              <div class="text-center">
                <span class="num">
                  {{ dateData.past.day }}
                </span>
                天
              </div>
              <div class="text-center">
                <span class="num">
                  {{ dateData.past.second }}
                </span>
                秒
              </div>
            </div>
          </div>
        </div>
        <div v-if="dateData" class="box-wrap flex flex-col gap-12">
          <div>
            <div class="tag">剩下的时间</div>
            <div class="list">
              <div class="text-center">
                <span class="num">
                  {{ dateData.have.year }}
                </span>
                年
              </div>
              <div class="text-center">
                <span class="num">
                  {{ dateData.have.hour }}
                </span>
                时
              </div>
              <div class="text-center">
                <span class="num">
                  {{ dateData.have.month }}
                </span>
                月
              </div>

              <div class="text-center">
                <span class="num">
                  {{ dateData.have.minute }}
                </span>
                分
              </div>
              <div class="text-center">
                <span class="num">
                  {{ dateData.have.day }}
                </span>
                天
              </div>
              <div class="text-center">
                <span class="num">
                  {{ dateData.have.second }}
                </span>
                秒
              </div>
            </div>
          </div>
        </div>
        <!-- 小格 -->
        <div v-if="results" class="box-wrap">
          <div class="">
            <div
              v-for="(item, index) in results.blockArr"
              :key="index"
              class="block-dot mr-3"
              :class="[
                item.type,
                { retired: index === 323 && index >= results.length.past },
                { flash: index === results.length.past - 1 },
              ]"
            ></div>
          </div>
        </div>
        <!-- 说明 -->
        <div class="box-wrap flex flex-col gap-12">
          <div class="flex flex-col gap-12">
            <div>参考了小程序<b> lifecount </b>而制作的网页版本</div>
            <div class="color-#aaa">假设我们的寿命是80岁,分为400个方块。</div>
            <el-divider class="mt-4! mb-4!" />
            <div class="flex gap-3">
              <div class="block-dot past"></div>
              你已经走过的生命
            </div>
            <div class="flex gap-3">
              <div class="block-dot sleep"></div>
              如果你平均每天休息 8 小时，这是你余下生命里睡眠占用的时间
            </div>
            <div class="flex gap-3">
              <div class="block-dot work"></div>
              如果你 65 岁退休，退休前平均每天工作 8
              小时，这是你余下生命里工作占用的时间
            </div>
            <div class="flex gap-3">
              <div class="block-dot retired"></div>
              65 岁，你退休了
            </div>
            <div class="flex gap-3">
              <div class="block-dot child"></div>
              如果你 28 岁生孩子，孩子18岁出门上大学，这 18 年里你平均每天能花 5
              个小时陪伴孩子，这里是你余下生命里所用去的时间
            </div>
            <div class="flex gap-3">
              <div class="block-dot parents"></div>
              如果你每个月能看望父母一天，在他们 80
              岁前，这是你的余生里还能陪伴他们的时光
            </div>
            <div class="flex gap-3">
              <div class="block-dot surplus"></div>
              除了以上之外，你剩下的所有日子
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import PhExportDuotone from "~icons/ph/export-duotone";
import VTitleBar from "@/components/v-title-bar/TitleBar.vue";

const router = useRouter();
const dateVal = ref("");
const dateData = ref();
const updateDate = ref();
const exportContent = ref(null);
watch(
  () => dateVal.value,
  (val) => {
    if (!val) {
      clearInterval(updateDate.value);
      dateData.value = null;
      return;
    }
    setDateData();
    updateDate.value = setInterval(setDateData, 1000);
  }
);
const setDateData = () => {
  const date = dayjs(dateVal.value);
  const thisDay = dayjs();
  const deathDate = date.add(80, "year"); // 80岁的时候
  dateData.value = {
    past: {
      year: thisDay.diff(date, "year", true).toFixed(1),
      month: thisDay.diff(date, "month", true).toFixed(1),
      day: thisDay.diff(date, "day", true).toFixed(1),
      hour: thisDay.diff(date, "hour", true).toFixed(1),
      minute: thisDay.diff(date, "minute", true).toFixed(1),
      second: thisDay.diff(date, "second", true).toFixed(1),
    },
    have: {
      year: deathDate.diff(thisDay, "year", true).toFixed(1),
      month: deathDate.diff(thisDay, "month", true).toFixed(1),
      day: deathDate.diff(thisDay, "day", true).toFixed(1),
      hour: deathDate.diff(thisDay, "hour", true).toFixed(1),
      minute: deathDate.diff(thisDay, "minute", true).toFixed(1),
      second: deathDate.diff(thisDay, "second", true).toFixed(1),
    },
  };
};
const results = computed(() => {
  if (!dateVal.value) return false;
  const blockArr = [] as any[];
  const date = dayjs(dateVal.value);
  const thisDay = dayjs();

  const oneBlockHour = 24 * 72; // 一个方块代表的小时
  const haveChildren = 28; // 生孩子的年龄

  const pastDate = thisDay.diff(date, "day"); // 已经过去的时间(天)

  const deathDate = date.add(80, "year"); // 80岁的时候
  const fromDeathDate = deathDate.diff(thisDay, "day"); // 距离80岁还能活的时间(天)

  const retiredDate = date.add(65, "year"); // 65岁退休的时候
  const fromRetiredDate = retiredDate.diff(thisDay, "day"); // 距离65岁还能活的时间(天)

  const childrenDate = date.add(18 + haveChildren, "year"); // 如果28岁生孩子，孩子18岁的时候
  const fromChildrenDate = childrenDate.diff(thisDay, "day"); // 距离孩子18岁还能活的时间(天)

  const parentsDate = date.add(80 - haveChildren, "year"); // 距离父母死亡
  const fromParentsDate = parentsDate.diff(thisDay, "day"); // 距离父母死亡还能活的时间(天)

  const past = ~~(pastDate / 72); // 已经过去的方块

  const sleep = ~~((8 * fromDeathDate) / oneBlockHour); // 碎觉所需的方块
  const work =
    fromRetiredDate <= 0 ? 0 : ~~((8 * fromRetiredDate) / oneBlockHour); // 工作所需的方块
  const child =
    fromChildrenDate <= 0 ? 0 : ~~((5 * fromChildrenDate) / oneBlockHour); // 陪伴孩子
  const parents =
    fromParentsDate <= 0 ? 0 : ~~(((fromParentsDate / 31) * 24) / oneBlockHour); // 陪伴父母
  let surplus = 400 - (sleep + past + work + child + parents);
  if (surplus <= 0) surplus = 0;

  const data = {
    past,
    sleep,
    work,
    child,
    parents,
    surplus,
  } as any;
  Object.keys(data).forEach((e) => {
    for (let i = 0; i < data[e]; i++) {
      blockArr.push({
        type: e,
      });
    }
  });
  return {
    blockArr,
    length: data,
  };
});
const exportToImage = async () => {
  if (exportContent.value) {
    try {
      // 使用 html2canvas 渲染指定的 DOM 元素
      // const canvas = await html2canvas(exportContent.value as HTMLElement);
      const canvas = await html2canvas(exportContent.value as HTMLElement, {
        // backgroundColor: null, // 保留背景透明度
        useCORS: true, // 启用跨域资源支持
      });

      // 将画布转换为图片数据 URL
      const imageData = canvas.toDataURL("image/png");

      // 创建一个下载链接
      const link = document.createElement("a");
      link.href = imageData;
      link.download = "exported-image.png";

      // 触发下载
      link.click();
    } catch (error) {
      console.error("导出图片失败:", error);
    }
  }
};
</script>
<style scoped lang="scss">
@keyframes flash {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  .num {
    font-size: 30px;
    font-weight: 600;
    color: #585656;
    text-shadow: 3px 3px 2px #ecbcbc; /*设置文字阴影*/
  }
}

.block-dot {
  width: 20px;
  height: 20px;
  display: inline-block;
}
.past {
  background-color: #98c3b9;
}
.sleep {
  background-color: #c1e8f9;
}
.work {
  background-color: #ab9f93;
}
.child {
  background-color: #e3a6ab;
}
.parents {
  background-color: #7ea1b7;
}
.surplus {
  background-color: #e2e2e2;
}
.retired {
  background-color: #f8c039;
}
// 当天时间
.flash {
  animation: flash ease 2s infinite;
  background-color: #4bc77f;
}
</style>
