<template>
  <VContainer title="房贷/个税计算器">
  <div class="mortgage-calculator">
    <el-card class="input-card">
      <template #header>
        <div class="card-header">
          <span>🏠 房贷计算器</span>
        </div>
      </template>

      <!-- 输入表单 -->
      <el-form :model="form" label-width="120px" label-position="left">
        <el-form-item label="贷款总额">
          <el-input-number
            v-model="form.principal"
            :min="1"
            :max="10000"
            :step="10"
            :precision="2"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px">万元</span>
        </el-form-item>

        <el-form-item label="贷款年限">
          <el-input-number
            v-model="form.years"
            :min="1"
            :max="30"
            :step="1"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px">年</span>
        </el-form-item>

        <el-form-item label="年利率">
          <el-input-number
            v-model="form.annualRate"
            :min="0.01"
            :max="20"
            :step="0.01"
            :precision="2"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px">%</span>
          <el-button type="text" @click="setLPR">LPR基准利率</el-button>
        </el-form-item>

        <el-form-item label="还款方式">
          <el-radio-group v-model="form.repaymentType">
            <el-radio label="equal-principal">等额本金</el-radio>
            <el-radio label="equal-installment">等额本息</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="calculate">开始计算</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 计算结果 -->
    <el-card v-if="result" class="result-card">
      <template #header>
        <span>📊 还款概览</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic
            title="首月还款"
            :value="result.firstPayment"
            :precision="2"
          >
            <template #suffix>元</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="总利息"
            :value="result.totalInterest"
            :precision="2"
            :value-style="{ color: '#f56c6c' }"
          >
            <template #suffix>元</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="还款总额"
            :value="result.totalPayment"
            :precision="2"
          >
            <template #suffix>元</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="利息占比"
            :value="(result.totalInterest / result.totalPayment) * 100"
            :precision="2"
          >
            <template #suffix>%</template>
          </el-statistic>
        </el-col>
      </el-row>

      <!-- 对比提示 -->
      <el-alert
        v-if="comparison"
        :title="comparison.title"
        type="info"
        :closable="false"
        style="margin-top: 20px"
      >
        <p>{{ comparison.description }}</p>
      </el-alert>
    </el-card>

    <!-- ECharts 图表 -->
    <el-card v-if="result" class="chart-card">
      <template #header>
        <el-radio-group v-model="chartType" size="small">
          <el-radio-button label="trend">还款趋势图</el-radio-button>
          <el-radio-button label="structure">本息结构图</el-radio-button>
          <el-radio-button label="累计">累计图</el-radio-button>
        </el-radio-group>
      </template>
      <div ref="chartRef" style="width: 100%; height: 400px"></div>
    </el-card>

    <!-- 还款明细表 -->
    <el-card v-if="result && showDetail" class="detail-card">
      <template #header>
        <div class="card-header">
          <span>📋 还款明细表</span>
          <el-switch v-model="showDetail" inactive-text="隐藏明细" />
        </div>
      </template>

      <el-table :data="displaySchedule" stripe max-height="500" border>
        <el-table-column prop="period" label="期数" width="80" align="center" />
        <el-table-column
          prop="payment"
          label="月供(元)"
          width="120"
          align="right"
        >
          <template #default="{ row }">
            {{ row.payment.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="principal"
          label="本金(元)"
          width="120"
          align="right"
        >
          <template #default="{ row }">
            {{ row.principal.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="interest"
          label="利息(元)"
          width="120"
          align="right"
        >
          <template #default="{ row }">
            {{ row.interest.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="remaining" label="剩余本金(元)" align="right">
          <template #default="{ row }">
            {{ row.remaining.toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 10px; text-align: center">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="result.schedule.length"
          layout="prev, pager, next, total"
          small
        />
      </div>
    </el-card>

    <!-- 知识点讲解 -->
    <el-card class="knowledge-card">
      <template #header>💡 核心知识点</template>
      <el-collapse>
        <el-collapse-item title="1️⃣ 等额本息计算公式" name="1">
          <p>
            <strong
              >每月还款额 = [本金 × 月利率 × (1+月利率)^还款月数] ÷
              [(1+月利率)^还款月数 - 1]</strong
            >
          </p>
          <p>特点：每月还款金额固定，前期利息多，后期本金多。</p>
          <pre><code>月利率 = 年利率 / 12
每月应还利息 = 剩余本金 × 月利率
每月应还本金 = 每月还款额 - 每月应还利息</code></pre>
        </el-collapse-item>

        <el-collapse-item title="2️⃣ 等额本金计算公式" name="2">
          <p><strong>每月本金 = 贷款总额 ÷ 还款月数</strong></p>
          <p><strong>每月利息 = 剩余本金 × 月利率</strong></p>
          <p>特点：每月本金固定，利息递减，总利息较少，适合提前还款。</p>
        </el-collapse-item>

        <el-collapse-item title="3️⃣ JavaScript 精度问题" name="3">
          <p>JavaScript 浮点数运算存在精度问题：</p>
          <code>0.1 + 0.2 = 0.30000000000000004</code>
          <p>
            <strong>解决方案：</strong>先转整数运算，再除回小数，或使用
            toFixed() 四舍五入。
          </p>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import VContainer from "@/components/v-container/Container.vue";


interface MortgageForm {
  principal: number; // 贷款总额（万元）
  years: number; // 贷款年限
  annualRate: number; // 年利率（%）
  repaymentType: "equal-principal" | "equal-installment";
}

interface PaymentSchedule {
  period: number; // 期数
  payment: number; // 月供
  principal: number; // 本金
  interest: number; // 利息
  remaining: number; // 剩余本金
}

interface CalculationResult {
  firstPayment: number; // 首月还款
  totalInterest: number; // 总利息
  totalPayment: number; // 还款总额
  schedule: PaymentSchedule[]; // 还款计划
}

// ==================== 状态定义 ====================
const form = ref<MortgageForm>({
  principal: 100,
  years: 30,
  annualRate: 4.1,
  repaymentType: "equal-installment",
});

const result = ref<CalculationResult | null>(null);
const chartRef = ref<HTMLDivElement>();
const chartInstance = ref<echarts.ECharts>();
const chartType = ref<"trend" | "structure" | "累计">("trend");
const showDetail = ref(true);
const currentPage = ref(1);
const pageSize = ref(12);

// ==================== 核心计算函数 ====================

/**
 * 等额本息计算
 * 核心公式：月供 = [本金 × 月利率 × (1+月利率)^n] / [(1+月利率)^n - 1]
 */
const calculateEqualInstallment = (): CalculationResult => {
  const P = form.value.principal * 10000; // 转为元
  const n = form.value.years * 12; // 总月数
  const r = form.value.annualRate / 100 / 12; // 月利率

  // 核心公式实现
  const monthlyPayment =
    (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const schedule: PaymentSchedule[] = [];
  let remainingPrincipal = P;
  let totalInterest = 0;

  for (let i = 1; i <= n; i++) {
    // 当月利息 = 剩余本金 × 月利率
    const interest = remainingPrincipal * r;
    // 当月本金 = 月供 - 当月利息
    const principal = monthlyPayment - interest;

    remainingPrincipal -= principal;
    totalInterest += interest;

    schedule.push({
      period: i,
      payment: monthlyPayment,
      principal: principal,
      interest: interest,
      remaining: Math.max(0, remainingPrincipal), // 防止负数（精度问题）
    });
  }

  return {
    firstPayment: monthlyPayment,
    totalInterest: totalInterest,
    totalPayment: P + totalInterest,
    schedule,
  };
};

/**
 * 等额本金计算
 * 每月本金固定 = 总本金 / 总月数
 * 每月利息递减 = 剩余本金 × 月利率
 */
const calculateEqualPrincipal = (): CalculationResult => {
  const P = form.value.principal * 10000;
  const n = form.value.years * 12;
  const r = form.value.annualRate / 100 / 12;

  // 每月固定本金
  const monthlyPrincipal = P / n;

  const schedule: PaymentSchedule[] = [];
  let remainingPrincipal = P;
  let totalInterest = 0;

  for (let i = 1; i <= n; i++) {
    // 当月利息 = 剩余本金 × 月利率
    const interest = remainingPrincipal * r;
    // 当月还款 = 固定本金 + 当月利息
    const payment = monthlyPrincipal + interest;

    remainingPrincipal -= monthlyPrincipal;
    totalInterest += interest;

    schedule.push({
      period: i,
      payment: payment,
      principal: monthlyPrincipal,
      interest: interest,
      remaining: Math.max(0, remainingPrincipal),
    });
  }

  return {
    firstPayment: schedule[0].payment,
    totalInterest: totalInterest,
    totalPayment: P + totalInterest,
    schedule,
  };
};

// ==================== 主计算函数 ====================
const calculate = () => {
  if (form.value.repaymentType === "equal-installment") {
    result.value = calculateEqualInstallment();
  } else {
    result.value = calculateEqualPrincipal();
  }

  nextTick(() => {
    renderChart();
  });
};

// ==================== 图表渲染 ====================
const renderChart = () => {
  if (!chartRef.value || !result.value) return;

  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartRef.value);
  }

  let option: EChartsOption = {};

  if (chartType.value === "trend") {
    // 还款趋势图
    option = {
      title: { text: "月供变化趋势" },
      tooltip: { trigger: "axis" },
      legend: { data: ["月供", "本金", "利息"] },
      xAxis: {
        type: "category",
        data: result.value.schedule.map((s) => s.period),
      },
      yAxis: { type: "value", name: "金额(元)" },
      series: [
        {
          name: "月供",
          type: "line",
          data: result.value.schedule.map((s) => s.payment.toFixed(2)),
          smooth: true,
        },
        {
          name: "本金",
          type: "line",
          data: result.value.schedule.map((s) => s.principal.toFixed(2)),
          smooth: true,
        },
        {
          name: "利息",
          type: "line",
          data: result.value.schedule.map((s) => s.interest.toFixed(2)),
          smooth: true,
        },
      ],
    };
  } else if (chartType.value === "structure") {
    // 本息结构堆叠图
    option = {
      title: { text: "本息结构图" },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { data: ["本金", "利息"] },
      xAxis: {
        type: "category",
        data: result.value.schedule.map((s) => s.period),
      },
      yAxis: { type: "value", name: "金额(元)" },
      series: [
        {
          name: "本金",
          type: "bar",
          stack: "total",
          data: result.value.schedule.map((s) => s.principal.toFixed(2)),
          itemStyle: { color: "#5470c6" },
        },
        {
          name: "利息",
          type: "bar",
          stack: "total",
          data: result.value.schedule.map((s) => s.interest.toFixed(2)),
          itemStyle: { color: "#ee6666" },
        },
      ],
    };
  } else {
    // 累计还款图
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;
    const cumulativeData = result.value.schedule.map((s) => {
      cumulativePrincipal += s.principal;
      cumulativeInterest += s.interest;
      return {
        period: s.period,
        principal: cumulativePrincipal,
        interest: cumulativeInterest,
        total: cumulativePrincipal + cumulativeInterest,
      };
    });

    option = {
      title: { text: "累计还款趋势" },
      tooltip: { trigger: "axis" },
      legend: { data: ["累计本金", "累计利息", "累计总额"] },
      xAxis: { type: "category", data: cumulativeData.map((d) => d.period) },
      yAxis: { type: "value", name: "金额(元)" },
      series: [
        {
          name: "累计本金",
          type: "line",
          data: cumulativeData.map((d) => d.principal.toFixed(2)),
          smooth: true,
          areaStyle: { opacity: 0.3 },
        },
        {
          name: "累计利息",
          type: "line",
          data: cumulativeData.map((d) => d.interest.toFixed(2)),
          smooth: true,
          areaStyle: { opacity: 0.3 },
        },
        {
          name: "累计总额",
          type: "line",
          data: cumulativeData.map((d) => d.total.toFixed(2)),
          smooth: true,
        },
      ],
    };
  }

  chartInstance.value.setOption(option);
};

// ==================== 辅助功能 ====================
const setLPR = () => {
  form.value.annualRate = 4.1; // 2024年LPR基准利率（示例）
};

const reset = () => {
  form.value = {
    principal: 100,
    years: 30,
    annualRate: 4.1,
    repaymentType: "equal-installment",
  };
  result.value = null;
};

// ==================== 对比信息 ====================
const comparison = computed(() => {
  if (!result.value) return null;

  if (form.value.repaymentType === "equal-installment") {
    return {
      title: "等额本息：每月还款固定",
      description:
        "优点：还款压力均衡，便于规划。缺点：总利息较多，适合长期持有。",
    };
  } else {
    return {
      title: "等额本金：前期压力大，后期轻松",
      description:
        "优点：总利息少，适合提前还款。缺点：前期月供高，需要较强还款能力。",
    };
  }
});

// ==================== 分页显示 ====================
const displaySchedule = computed(() => {
  if (!result.value) return [];
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.value.schedule.slice(start, end);
});

// ==================== 监听图表类型变化 ====================
watch(chartType, () => {
  renderChart();
});

// ==================== 生命周期 ====================
onMounted(() => {
  calculate(); // 初始计算
  window.addEventListener("resize", () => {
    chartInstance.value?.resize();
  });
});
</script>

<style scoped>
.mortgage-calculator {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
}

.input-card,
.result-card,
.chart-card,
.detail-card,
.knowledge-card {
  margin-bottom: 20px;
}

.result-card :deep(.el-row) {
  padding: 10px 0;
}

pre {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

code {
  font-family: "Consolas", "Monaco", monospace;
  color: #e83e8c;
}
</style>
