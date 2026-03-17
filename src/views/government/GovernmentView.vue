<template>
  <div class="gov-page">
    <header class="gov-header">
      <div class="gov-header-left">
        <span class="gov-logo">🏛️</span>
        <div>
          <div class="gov-title">花卉产业信贷监管平台</div>
          <div class="gov-sub">区块链存证 · 实时监控 · 数据不可篡改</div>
        </div>
      </div>
      <div class="gov-header-center">
        <div class="live-dot"></div><span>实时数据接入中</span>
        <span class="gov-time">{{ currentTime }}</span>
      </div>
      <div class="gov-header-right">
        <span class="nav-link" style="color:rgba(255,255,255,0.6)" @click="$router.push('/')">← 返回首页</span>
      </div>
    </header>

    <div class="gov-body">
      <div class="gov-top">
        <div class="gov-stat-card" v-for="s in govStats" :key="s.label">
          <div class="gsc-icon">{{ s.icon }}</div>
          <div class="gsc-value">{{ s.value }}</div>
          <div class="gsc-label">{{ s.label }}</div>
        </div>
      </div>

      <div class="gov-mid">
        <div class="gov-panel chain-panel">
          <div class="panel-title">⛓️ 区块链存证记录</div>
          <div class="chain-list">
            <div v-for="r in blockchainStore.records.slice(0,8)" :key="r.hash" class="chain-item">
              <div class="ci-left">
                <span class="ci-type" :class="typeClass(r.type)">{{ r.typeLabel }}</span>
                <span class="ci-block mono">#{{ r.blockNumber }}</span>
              </div>
              <div class="ci-mid">
                <div class="ci-summary">{{ r.summary }}</div>
                <div class="ci-hash mono">{{ r.hash.slice(0,24) }}...</div>
              </div>
              <div class="ci-right">{{ r.timestamp }}</div>
            </div>
          </div>
        </div>

        <div class="gov-panel region-panel">
          <div class="panel-title">🗺️ 区域风险热力分布</div>
          <div class="region-list">
            <div v-for="r in blockchainStore.regionalData" :key="r.name" class="region-item">
              <div class="ri-header">
                <span class="ri-name">{{ r.name }}</span>
                <span class="ri-level" :class="'risk-lv-' + r.riskLevel">{{ riskLevelLabel(r.riskLevel) }}</span>
              </div>
              <div class="ri-bar">
                <div class="ri-fill" :style="{ width: (r.value / 20 * 100) + '%', background: riskLevelColor(r.riskLevel) }"></div>
              </div>
              <div class="ri-meta"><span>{{ r.value }} 笔</span><span>{{ r.amount }} 万元</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="gov-bottom">
        <div class="gov-panel flow-panel">
          <div class="panel-title">💰 资金流向监控</div>
          <div class="flow-chain">
            <div v-for="(node, i) in flowNodes" :key="node.name" class="flow-node">
              <div class="fn-icon">{{ node.icon }}</div>
              <div class="fn-name">{{ node.name }}</div>
              <div class="fn-amount">{{ node.amount }}</div>
              <div v-if="i < flowNodes.length-1" class="fn-arrow">
                <div class="fn-arrow-line"></div>
                <div class="fn-arrow-label">{{ node.flowLabel }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="gov-panel summary-panel">
          <div class="panel-title">📊 平台运营概况</div>
          <div class="summary-grid">
            <div v-for="item in summaryItems" :key="item.label" class="summary-item">
              <div class="si-value">{{ item.value }}</div>
              <div class="si-label">{{ item.label }}</div>
              <div class="si-trend" :class="item.trend > 0 ? 'up' : 'down'">
                {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useBlockchainStore } from '../../stores/blockchainStore'
import { useLoanStore } from '../../stores/loanStore'

const blockchainStore = useBlockchainStore()
const loanStore = useLoanStore()

const currentTime = ref('')
let timer: ReturnType<typeof setInterval>
onMounted(() => {
  const update = () => { currentTime.value = new Date().toLocaleString('zh-CN') }
  update()
  timer = setInterval(update, 1000)
})
onUnmounted(() => clearInterval(timer))

const govStats = computed(() => [
  { icon: '⛓️', value: blockchainStore.totalRecords, label: '链上存证总数' },
  { icon: '💰', value: blockchainStore.totalDisbursed + ' 万', label: '累计放款金额' },
  { icon: '👨‍🌾', value: loanStore.disbursedApplications.length + ' 户', label: '受益花农数' },
  { icon: '#️⃣', value: blockchainStore.latestBlockNumber, label: '最新区块高度' },
  { icon: '🏢', value: '3 家', label: '接入企业数' },
  { icon: '🏦', value: '2 家', label: '合作银行数' },
])

const flowNodes = [
  { icon: '🏦', name: '银行授信', amount: '1000万', flowLabel: '额度拆分' },
  { icon: '🏢', name: '龙头企业', amount: '500万已发布', flowLabel: '信用背书' },
  { icon: '🤝', name: '平台撮合', amount: '已匹配420万', flowLabel: '贷款发放' },
  { icon: '🌹', name: '小花农', amount: '368户受益', flowLabel: '' },
]

const summaryItems = [
  { value: '0.3%', label: '不良贷款率', trend: -12 },
  { value: '98.2%', label: '按时还款率', trend: 2.1 },
  { value: '3.2天', label: '平均放款时效', trend: -18 },
  { value: '92分', label: '平均AI评分', trend: 3.5 },
  { value: '100%', label: '链上存证率', trend: 0.1 },
  { value: '4.28%', label: '平均贷款利率', trend: -0.5 },
]

function riskLevelLabel(lv: number) {
  return ['', '低风险', '较低风险', '中等风险', '较高风险', '高风险'][lv] || '未知'
}
function riskLevelColor(lv: number) {
  return ['', '#2d6a4f', '#52b788', '#d4a017', '#e07b39', '#c0392b'][lv] || '#718096'
}
function typeClass(type: string) {
  const m: Record<string,string> = { credit_publish: 'ct-green', loan_submit: 'ct-blue', risk_score: 'ct-purple', credit_match: 'ct-orange', bank_approve: 'ct-red', disburse: 'ct-gold' }
  return m[type] || ''
}
</script>

<style scoped>
.gov-page { min-height: 100vh; background: #0d1117; color: #e6edf3; display: flex; flex-direction: column; }
.gov-header { background: #161b22; border-bottom: 1px solid #30363d; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.gov-header-left { display: flex; align-items: center; gap: 14px; }
.gov-logo { font-size: 28px; }
.gov-title { font-size: 18px; font-weight: 700; color: #e6edf3; }
.gov-sub { font-size: 11px; color: #8b949e; }
.gov-header-center { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #8b949e; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #3fb950; animation: pulse 1.5s ease-in-out infinite; }
.gov-time { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #58a6ff; }
.gov-body { flex: 1; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.gov-top { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.gov-stat-card { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px; text-align: center; }
.gsc-icon { font-size: 24px; margin-bottom: 8px; }
.gsc-value { font-size: 22px; font-weight: 700; color: #58a6ff; font-family: 'JetBrains Mono', monospace; }
.gsc-label { font-size: 11px; color: #8b949e; margin-top: 4px; }
.gov-mid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
.gov-bottom { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
.gov-panel { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px; }
.panel-title { font-size: 14px; font-weight: 700; color: #e6edf3; margin-bottom: 14px; }
.chain-list { display: flex; flex-direction: column; gap: 8px; }
.chain-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; background: #0d1117; border-radius: 8px; border: 1px solid #21262d; }
.ci-left { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; flex-shrink: 0; width: 90px; }
.ci-type { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
.ct-green { background: #0d4a1e; color: #3fb950; }
.ct-blue { background: #0c2d6b; color: #58a6ff; }
.ct-purple { background: #2d1b4e; color: #a371f7; }
.ct-orange { background: #4a2800; color: #f0883e; }
.ct-red { background: #4a0d0d; color: #f85149; }
.ct-gold { background: #4a3800; color: #e3b341; }
.ci-block { font-size: 11px; color: #8b949e; }
.ci-mid { flex: 1; }
.ci-summary { font-size: 13px; color: #c9d1d9; margin-bottom: 2px; }
.ci-hash { font-size: 11px; color: #8b949e; }
.ci-right { font-size: 11px; color: #8b949e; flex-shrink: 0; white-space: nowrap; }
.region-list { display: flex; flex-direction: column; gap: 10px; }
.region-item { }
.ri-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.ri-name { font-size: 13px; color: #c9d1d9; font-weight: 600; }
.ri-level { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
.risk-lv-1 { background: #0d4a1e; color: #3fb950; }
.risk-lv-2 { background: #1a3a1a; color: #52b788; }
.risk-lv-3 { background: #4a3800; color: #e3b341; }
.risk-lv-4 { background: #4a2200; color: #f0883e; }
.risk-lv-5 { background: #4a0d0d; color: #f85149; }
.ri-bar { height: 6px; background: #21262d; border-radius: 3px; overflow: hidden; margin-bottom: 3px; }
.ri-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
.ri-meta { display: flex; justify-content: space-between; font-size: 11px; color: #8b949e; }
.flow-chain { display: flex; align-items: center; padding: 16px 0; overflow-x: auto; }
.flow-node { display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative; }
.fn-icon { font-size: 32px; }
.fn-name { font-size: 13px; font-weight: 700; color: #e6edf3; white-space: nowrap; }
.fn-amount { font-size: 12px; color: #58a6ff; font-family: 'JetBrains Mono', monospace; }
.fn-arrow { display: flex; flex-direction: column; align-items: center; padding: 0 24px; }
.fn-arrow-line { width: 80px; height: 2px; background: linear-gradient(90deg, #3fb950, #58a6ff); margin-bottom: 4px; }
.fn-arrow-label { font-size: 11px; color: #8b949e; white-space: nowrap; }
.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.summary-item { background: #0d1117; border: 1px solid #21262d; border-radius: 8px; padding: 12px; }
.si-value { font-size: 20px; font-weight: 700; color: #58a6ff; font-family: 'JetBrains Mono', monospace; }
.si-label { font-size: 11px; color: #8b949e; margin: 2px 0; }
.si-trend.up { font-size: 11px; color: #3fb950; }
.si-trend.down { font-size: 11px; color: #f85149; }
</style>
