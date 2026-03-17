<template>
  <div class="page-container">
    <header class="page-header">
      <div class="page-header-logo"><span>🤖</span><span>AI数据血缘风控中台</span></div>
      <div class="page-header-nav">
        <span class="nav-link" @click="$router.push('/')">← 返回首页</span>
        <span class="tag tag-info">AI引擎运行中</span>
      </div>
    </header>
    <div class="risk-layout">
      <div class="risk-left">
        <div class="card fade-in-up">
          <div class="section-title">贷款申请列表</div>
          <div class="app-list">
            <div v-for="app in loanStore.applications" :key="app.id"
              class="app-item" :class="{ selected: selectedApp?.id === app.id }"
              @click="selectApp(app)">
              <div class="app-item-header">
                <span class="app-name">{{ app.farmerName }}</span>
                <span class="tag" :class="statusTag(app.status)">{{ statusLabel(app.status) }}</span>
              </div>
              <div class="app-item-info">
                <span>{{ app.flowerType }} · {{ app.plantArea }}亩</span>
                <span>申请 <b>{{ app.requestAmount }}万</b></span>
              </div>
              <div v-if="app.riskScore > 0" class="app-score-row">
                <div class="mini-bar"><div class="mini-fill" :style="{ width: app.riskScore + '%', background: scoreColor(app.riskScore) }"></div></div>
                <span class="mini-val">{{ app.riskScore }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="risk-main">
        <div v-if="!selectedApp" class="empty-state">
          <div style="font-size:48px;opacity:0.3">🤖</div>
          <div style="color:var(--text-muted)">点击左侧申请查看AI风控详情</div>
        </div>
        <div v-else class="risk-detail fade-in-up">
          <div class="card">
            <div class="rdetail-head">
              <div>
                <div class="rdetail-name">{{ selectedApp.farmerName }} · {{ selectedApp.flowerType }}种植贷款</div>
                <div class="rdetail-region">{{ selectedApp.region }} · 申请金额 {{ selectedApp.requestAmount }} 万元</div>
              </div>
              <div v-if="selectedApp.riskScore > 0" class="score-badge">
                <div class="score-num" :style="{color: scoreColor(selectedApp.riskScore)}">{{ selectedApp.riskScore }}</div>
                <div class="score-label">综合评分</div>
                <div class="score-level" :style="{background: scoreColor(selectedApp.riskScore)+'22', color: scoreColor(selectedApp.riskScore)}">{{ selectedApp.riskLabel }}</div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="section-title">数据血缘溯源图谱</div>
            <div class="lineage">
              <div class="lineage-sources">
                <div v-for="s in dataSources" :key="s.name" class="lsrc">
                  <span>{{ s.icon }}</span><span class="lsrc-name">{{ s.name }}</span><span class="lsrc-ok">✓</span>
                </div>
              </div>
              <div class="lineage-mid">
                <div v-for="i in 5" :key="i" class="l-arrow">→</div>
              </div>
              <div class="lineage-engine"><div>🧠</div><div>AI引擎</div><div class="le-sub">数据血缘识别</div></div>
              <div class="l-arrow" style="font-size:24px">→</div>
              <div class="lineage-result">
                <div class="lr-score" :style="{color: scoreColor(selectedApp.riskScore||80)}">{{ selectedApp.riskScore || '?' }}</div>
                <div>风险评分</div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="section-title">多维度风险分析</div>
            <div class="dims-grid">
              <div v-for="dim in riskDims" :key="dim.name" class="dim-card">
                <div class="dim-head"><span>{{ dim.icon }}</span><span>{{ dim.name }}</span><span class="dim-score">{{ dim.score }}</span></div>
                <div class="progress-bar"><div class="progress-fill" :style="{width: dim.score+'%'}"></div></div>
                <div class="dim-desc">{{ dim.desc }}</div>
              </div>
            </div>
          </div>
          <div v-if="['submitted','risk_evaluating'].includes(selectedApp.status)" class="card">
            <button class="btn btn-primary btn-lg" style="width:100%" :disabled="isEvaluating" @click="runEval">
              <span v-if="!isEvaluating">🚀 启动AI风控评估</span>
              <span v-else class="animate-pulse">⚙️ 评估中，请稍候...</span>
            </button>
          </div>
          <div v-else-if="['risk_passed','matched','bank_reviewing','disbursed'].includes(selectedApp.status)" class="passed-banner">
            ✅ 风控评估已完成 · 评分 {{ selectedApp.riskScore }} · {{ selectedApp.riskLabel }} · 已进入信用撮合流程
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLoanStore } from '../../stores/loanStore'
import type { LoanApplication } from '../../stores/loanStore'

const loanStore = useLoanStore()
const selectedApp = ref<LoanApplication | null>(null)
const isEvaluating = computed(() => loanStore.isEvaluating)

const dataSources = [
  { icon: '🌤️', name: '气象数据' },
  { icon: '🌱', name: '土壤物联网' },
  { icon: '🏪', name: '拍卖市场' },
  { icon: '🛒', name: '农资采购' },
  { icon: '🛰️', name: '卫星核验' },
]
const riskDims = [
  { icon: '🌤️', name: '气象风险', score: 88, desc: '近12个月气象指数良好，无极端天气记录' },
  { icon: '🌱', name: '种植能力', score: 82, desc: '土壤pH值适宜，种植面积经卫星核验' },
  { icon: '📈', name: '市场信用', score: 91, desc: '拍卖市场交易记录稳定，回款率98.2%' },
  { icon: '💰', name: '还款意愿', score: 85, desc: '历史贷款记录良好，无逾期' },
]

function selectApp(app: LoanApplication) { selectedApp.value = app }
function statusTag(s: string) {
  const m: Record<string,string> = { submitted:'tag-warning', risk_evaluating:'tag-info', risk_passed:'tag-success', matched:'tag-success', bank_reviewing:'tag-info', disbursed:'tag-success', risk_failed:'tag-danger' }
  return m[s] || 'tag-muted'
}
function statusLabel(s: string) {
  const m: Record<string,string> = { submitted:'待评估', risk_evaluating:'评估中', risk_passed:'已通过', matched:'已撮合', bank_reviewing:'银行审核', disbursed:'已放款', risk_failed:'未通过', draft:'草稿' }
  return m[s] || s
}
function scoreColor(n: number) {
  return n >= 85 ? '#2d6a4f' : n >= 70 ? '#d4a017' : '#c0392b'
}
async function runEval() {
  if (!selectedApp.value) return
  await loanStore.runRiskEvaluation(selectedApp.value.id)
  selectedApp.value = loanStore.applications.find(a => a.id === selectedApp.value!.id) || null
}
</script>

<style scoped>
.risk-layout { display: grid; grid-template-columns: 300px 1fr; gap: 24px; padding: 24px 32px; max-width: 1400px; margin: 0 auto; }

@media (max-width: 768px) {
  .risk-layout {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px 12px;
  }
}
.app-list { display: flex; flex-direction: column; gap: 8px; }
.app-item { border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; cursor: pointer; transition: all var(--transition); }
.app-item:hover { border-color: var(--primary-light); }
.app-item.selected { border-color: var(--primary); background: #f0faf5; }
.app-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.app-name { font-size: 14px; font-weight: 700; }
.app-item-info { font-size: 12px; color: var(--text-muted); display: flex; justify-content: space-between; }
.app-score-row { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.mini-bar { flex: 1; height: 4px; background: var(--bg-secondary); border-radius: 2px; overflow: hidden; }
.mini-fill { height: 100%; border-radius: 2px; transition: width 0.8s ease; }
.mini-val { font-size: 11px; font-weight: 700; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }

@media (max-width: 768px) {
  .app-list {
    max-height: 200px;
    overflow-y: auto;
  }
  .app-item {
    padding: 10px 10px;
  }
  .app-name {
    font-size: 13px;
  }
  .app-item-info {
    font-size: 11px;
  }
}
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 360px; gap: 12px; }
.risk-detail { display: flex; flex-direction: column; gap: 20px; }
.rdetail-head { display: flex; justify-content: space-between; align-items: center; }
.rdetail-name { font-size: 18px; font-weight: 700; }
.rdetail-region { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
.score-badge { text-align: center; }
.score-num { font-size: 48px; font-weight: 700; font-family: 'JetBrains Mono', monospace; line-height: 1; }
.score-label { font-size: 12px; color: var(--text-muted); margin: 4px 0; }
.score-level { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; }

@media (max-width: 768px) {
  .empty-state {
    height: 200px;
  }
  .rdetail-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .rdetail-name {
    font-size: 15px;
  }
  .rdetail-region {
    font-size: 12px;
  }
  .score-badge {
    text-align: left;
    padding: 0;
  }
  .score-num {
    font-size: 32px;
  }
}
.lineage { display: flex; align-items: center; gap: 12px; padding: 12px 0; overflow-x: auto; }

@media (max-width: 768px) {
  .lineage {
    flex-wrap: wrap;
    gap: 8px;
    overflow-x: visible;
  }
}
.lineage-sources { display: flex; flex-direction: column; gap: 6px; }
.lsrc { background: var(--bg-secondary); border-radius: 8px; padding: 8px 10px; display: flex; align-items: center; gap: 6px; min-width: 110px; }
.lsrc-name { font-size: 12px; font-weight: 600; flex: 1; }
.lsrc-ok { color: var(--primary); font-weight: 700; }
.lineage-mid { display: flex; flex-direction: column; gap: 6px; }
.l-arrow { font-size: 16px; color: var(--primary); font-weight: 700; line-height: 2.2; }
.lineage-engine { background: var(--primary); color: #fff; border-radius: 12px; padding: 16px 18px; text-align: center; font-size: 13px; font-weight: 700; }
.le-sub { font-size: 11px; opacity: 0.8; margin-top: 2px; }
.lineage-result { background: var(--bg-secondary); border-radius: 12px; padding: 14px 18px; text-align: center; font-size: 13px; }
.lr-score { font-size: 32px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.dims-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

@media (max-width: 768px) {
  .dims-grid {
    grid-template-columns: 1fr;
  }
}
.dim-card { background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 14px; }
.dim-head { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.dim-score { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--primary); }
.dim-desc { font-size: 11px; color: var(--text-muted); margin-top: 6px; line-height: 1.5; }
.passed-banner { background: #d1fae5; border-radius: var(--radius-sm); padding: 14px 18px; color: #065f46; font-weight: 600; font-size: 14px; }
</style>
