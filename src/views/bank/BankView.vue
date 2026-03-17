<template>
  <div class="page-container">
    <header class="page-header">
      <div class="page-header-logo"><span>🏦</span><span>银行审批端 — 云南省农村信用合作社</span></div>
      <div class="page-header-nav">
        <span class="nav-link" @click="$router.push('/')">← 返回首页</span>
        <span class="tag tag-warning">待审 {{ loanStore.pendingApplications.length }} 件</span>
      </div>
    </header>
    <div class="bank-inner">
      <div class="bank-stats">
        <div class="stat-card"><div class="stat-label">待审批</div><div class="stat-value">{{ loanStore.pendingApplications.length }}<span class="stat-unit"> 件</span></div></div>
        <div class="stat-card"><div class="stat-label">已放款</div><div class="stat-value" style="color:var(--primary)">{{ loanStore.disbursedApplications.length }}<span class="stat-unit"> 件</span></div></div>
        <div class="stat-card"><div class="stat-label">放款总额</div><div class="stat-value" style="color:var(--accent)">{{ totalDisbursed }}<span class="stat-unit"> 万元</span></div></div>
        <div class="stat-card"><div class="stat-label">平均审批时效</div><div class="stat-value">3.2<span class="stat-unit"> 天</span></div></div>
      </div>

      <div class="card fade-in-up">
        <div class="section-title">待审批队列</div>
        <div v-if="loanStore.pendingApplications.length === 0" class="empty-state">
          <div style="font-size:36px">✅</div><div>暂无待审批申请</div>
        </div>
        <table v-else class="table">
          <thead><tr>
            <th>申请人</th><th>花卉品种</th><th>申请金额</th>
            <th>AI评分</th><th>风险等级</th><th>担保企业</th><th>担保费</th><th>操作</th>
          </tr></thead>
          <tbody>
            <tr v-for="app in loanStore.pendingApplications" :key="app.id">
              <td><b>{{ app.farmerName }}</b><br><span class="cell-sub">{{ app.region }}</span></td>
              <td>{{ app.flowerType }}</td>
              <td><b style="color:var(--accent)">{{ app.requestAmount }} 万</b></td>
              <td>
                <div class="score-cell">
                  <span class="score-n" :style="{color:scoreColor(app.riskScore)}">{{ app.riskScore }}</span>
                  <div class="mini-bar"><div class="mini-fill" :style="{width:app.riskScore+'%',background:scoreColor(app.riskScore)}"></div></div>
                </div>
              </td>
              <td><span class="tag tag-success">{{ app.riskLabel }}</span></td>
              <td><span class="cell-sub">{{ app.matchedEnterprise }}</span></td>
              <td>{{ app.guaranteeFee }} 万</td>
              <td>
                <button class="btn btn-primary btn-sm" :disabled="approving === app.id" @click="handleApprove(app)">
                  {{ approving === app.id ? '放款中...' : '✓ 审批放款' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card fade-in-up" style="animation-delay:0.1s">
        <div class="section-title">已放款记录</div>
        <table class="table">
          <thead><tr><th>申请人</th><th>金额</th><th>利率</th><th>放款时间</th><th>链上哈希</th></tr></thead>
          <tbody>
            <tr v-for="app in loanStore.disbursedApplications" :key="app.id">
              <td><b>{{ app.farmerName }}</b></td>
              <td><b style="color:var(--primary)">{{ app.approvedAmount }}万</b></td>
              <td>{{ app.interestRate }}%</td>
              <td class="cell-sub">{{ app.disbursedAt }}</td>
              <td><span class="mono hash">{{ app.blockchainHash?.slice(0,20) }}...</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLoanStore } from '../../stores/loanStore'
import { useBlockchainStore } from '../../stores/blockchainStore'
import type { LoanApplication } from '../../stores/loanStore'

const loanStore = useLoanStore()
const blockchainStore = useBlockchainStore()
const approving = ref<string | null>(null)

const totalDisbursed = computed(() =>
  loanStore.disbursedApplications.reduce((s, a) => s + a.approvedAmount, 0)
)

function scoreColor(n: number) {
  return n >= 85 ? '#2d6a4f' : n >= 70 ? '#d4a017' : '#c0392b'
}

async function handleApprove(app: LoanApplication) {
  approving.value = app.id
  await loanStore.bankApprove(app.id, app.interestRate || 4.35)
  blockchainStore.addRecord({
    timestamp: new Date().toLocaleString('zh-CN'),
    type: 'disburse',
    typeLabel: '银行放款',
    actor: '云南省农村信用合作社',
    summary: `${app.farmerName} ${app.flowerType}种植贷款 ${app.requestAmount}万元 已放款`,
    amount: app.requestAmount,
    relatedId: app.id,
  })
  approving.value = null
}
</script>

<style scoped>
.bank-inner { padding: 24px 32px; max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
.bank-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

@media (max-width: 768px) {
  .bank-inner {
    padding: 16px 12px;
    gap: 16px;
  }
  .bank-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; gap: 12px; color: var(--text-muted); }
.score-cell { display: flex; flex-direction: column; gap: 4px; }
.score-n { font-size: 16px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.mini-bar { height: 4px; background: var(--bg-secondary); border-radius: 2px; overflow: hidden; width: 60px; }
.mini-fill { height: 100%; border-radius: 2px; }
.cell-sub { font-size: 11px; color: var(--text-muted); }
.hash { font-size: 11px; color: var(--text-muted); }

@media (max-width: 768px) {
  .empty-state {
    padding: 30px 16px;
  }
  .score-cell {
    gap: 2px;
  }
  .score-n {
    font-size: 14px;
  }
  .mini-bar {
    width: 50px;
  }
  .cell-sub {
    font-size: 10px;
  }
  .hash {
    font-size: 10px;
    word-break: break-all;
  }
}
</style>
