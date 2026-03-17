<template>
  <div class="page-container">
    <header class="page-header">
      <div class="page-header-logo">
        <span>🏢</span>
        <span>企业端管理后台 — 云南鲜花控股集团</span>
      </div>
      <div class="page-header-nav">
        <span class="nav-link" @click="$router.push('/')">← 返回首页</span>
        <span class="tag tag-success">授信正常</span>
      </div>
    </header>

    <div class="ent-layout">
      <!-- Left: Stats + Form -->
      <div class="ent-left">
        <!-- Credit Overview -->
        <div class="card fade-in-up">
          <div class="section-title">授信总览</div>
          <div class="credit-overview">
            <div class="credit-ring">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f0ede4" stroke-width="12"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#2d6a4f" stroke-width="12"
                  stroke-dasharray="314"
                  :stroke-dashoffset="314 * (1 - creditStore.totalUsed / creditStore.totalPublished)"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                  style="transition: stroke-dashoffset 1s ease"
                />
                <text x="60" y="55" text-anchor="middle" font-size="18" font-weight="700" fill="#1b4332" font-family="JetBrains Mono">{{ Math.round(creditStore.totalUsed / creditStore.totalPublished * 100) }}%</text>
                <text x="60" y="73" text-anchor="middle" font-size="10" fill="#718096">额度使用率</text>
              </svg>
            </div>
            <div class="credit-stats">
              <div class="stat-card">
                <div class="stat-label">已发布总额度</div>
                <div class="stat-value">{{ creditStore.totalPublished }}<span class="stat-unit"> 万元</span></div>
              </div>
              <div class="stat-card">
                <div class="stat-label">剩余可用额度</div>
                <div class="stat-value" style="color: var(--primary)">{{ creditStore.totalAvailable }}<span class="stat-unit"> 万元</span></div>
              </div>
              <div class="stat-card">
                <div class="stat-label">已匹配使用</div>
                <div class="stat-value" style="color: var(--accent)">{{ creditStore.totalUsed }}<span class="stat-unit"> 万元</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Publish Form -->
        <div class="card fade-in-up" style="animation-delay:0.1s">
          <div class="section-title">发布新额度挂牌</div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">拆分额度（万元）</label>
              <input v-model.number="creditStore.newSlotForm.totalAmount" type="number" class="form-input" min="10" max="500" />
            </div>
            <div class="form-group">
              <label class="form-label">担保费率（%/年）</label>
              <input v-model.number="creditStore.newSlotForm.guaranteeFeeRate" type="number" class="form-input" step="0.1" min="0.1" max="3" />
            </div>
            <div class="form-group">
              <label class="form-label">单笔最高（万元）</label>
              <input v-model.number="creditStore.newSlotForm.maxLoanPerFarmer" type="number" class="form-input" min="1" />
            </div>
            <div class="form-group">
              <label class="form-label">单笔最低（万元）</label>
              <input v-model.number="creditStore.newSlotForm.minLoanPerFarmer" type="number" class="form-input" min="1" />
            </div>
            <div class="form-group">
              <label class="form-label">参考利率（%）</label>
              <input v-model.number="creditStore.newSlotForm.interestRate" type="number" class="form-input" step="0.01" min="1" />
            </div>
          </div>
          <button class="btn btn-primary btn-lg" style="width:100%;margin-top:8px" @click="handlePublish">
            🚀 确认发布挂牌
          </button>
          <div v-if="publishSuccess" class="success-msg">
            ✅ 额度挂牌成功！已上链存证，等待花农申请匹配。
          </div>
        </div>
      </div>

      <!-- Right: Slot List -->
      <div class="ent-right">
        <div class="card fade-in-up" style="animation-delay:0.15s">
          <div class="section-title">当前挂牌列表</div>
          <div class="slot-list">
            <div v-for="slot in creditStore.creditSlots" :key="slot.id" class="slot-item">
              <div class="slot-header">
                <div class="slot-company">{{ slot.enterpriseName }}</div>
                <span class="tag" :class="slot.status === 'active' ? 'tag-success' : 'tag-warning'">
                  {{ slot.status === 'active' ? '挂牌中' : slot.status === 'paused' ? '暂停' : '已用尽' }}
                </span>
              </div>
              <div class="slot-body">
                <div class="slot-amount-row">
                  <span class="slot-total">总额度 <b>{{ slot.totalAmount }}万</b></span>
                  <span class="slot-divider">|</span>
                  <span class="slot-avail" style="color:var(--primary)">可用 <b>{{ slot.availableAmount }}万</b></span>
                  <span class="slot-divider">|</span>
                  <span class="slot-used" style="color:var(--accent)">已用 <b>{{ slot.usedAmount }}万</b></span>
                </div>
                <div class="progress-bar" style="margin:10px 0">
                  <div class="progress-fill" :style="{ width: (slot.usedAmount / slot.totalAmount * 100) + '%' }"></div>
                </div>
                <div class="slot-meta">
                  <span>利率 <b>{{ slot.interestRate }}%</b></span>
                  <span>担保费 <b>{{ slot.guaranteeFeeRate }}%</b></span>
                  <span>单笔 <b>{{ slot.minLoanPerFarmer }}-{{ slot.maxLoanPerFarmer }}万</b></span>
                  <span>申请人数 <b>{{ slot.applicantCount }}户</b></span>
                </div>
                <div class="slot-date">发布日期：{{ slot.publishedAt }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCreditStore } from '../../stores/creditStore'
import { useBlockchainStore } from '../../stores/blockchainStore'

const creditStore = useCreditStore()
const blockchainStore = useBlockchainStore()
const publishSuccess = ref(false)

function handlePublish() {
  creditStore.publishNewSlot()
  blockchainStore.addRecord({
    timestamp: new Date().toLocaleString('zh-CN'),
    type: 'credit_publish',
    typeLabel: '额度发布',
    actor: '云南鲜花控股集团',
    summary: `云南鲜花控股集团 发布闲置授信额度 ${creditStore.newSlotForm.totalAmount}万元`,
    amount: creditStore.newSlotForm.totalAmount,
    relatedId: 'CS-NEW',
  })
  publishSuccess.value = true
  setTimeout(() => { publishSuccess.value = false }, 3000)
}
</script>

<style scoped>
.ent-layout { display: grid; grid-template-columns: 420px 1fr; gap: 24px; padding: 24px 32px; max-width: 1400px; margin: 0 auto; }
.ent-left { display: flex; flex-direction: column; gap: 24px; }
.ent-right { display: flex; flex-direction: column; gap: 24px; }

@media (max-width: 768px) {
  .ent-layout {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px 12px;
  }
}

.credit-overview { display: flex; align-items: center; gap: 24px; }
.credit-ring { flex-shrink: 0; }
.credit-stats { flex: 1; display: flex; flex-direction: column; gap: 12px; }

@media (max-width: 768px) {
  .credit-overview {
    flex-direction: column;
    gap: 16px;
  }
  .credit-ring svg {
    width: 100px !important;
    height: 100px !important;
  }
  .credit-stats {
    width: 100%;
  }
}

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.success-msg { margin-top: 12px; padding: 12px 16px; background: #d1fae5; border-radius: var(--radius-sm); color: #065f46; font-size: 14px; font-weight: 500; }

@media (max-width: 768px) {
  .success-msg {
    font-size: 12px;
    padding: 10px 12px;
  }
}

.slot-list { display: flex; flex-direction: column; gap: 16px; }
.slot-item { border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 16px 20px; transition: box-shadow var(--transition); }
.slot-item:hover { box-shadow: var(--shadow-md); border-color: var(--primary-light); }
.slot-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.slot-company { font-size: 15px; font-weight: 700; color: var(--text-primary); word-break: break-word; overflow-wrap: break-word; flex: 1; min-width: 0; }
.slot-amount-row { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--text-secondary); }
.slot-divider { color: var(--border); flex-shrink: 0; }
.slot-meta { display: flex; gap: 16px; font-size: 12px; color: var(--text-secondary); margin-top: 6px; }
.slot-date { font-size: 11px; color: var(--text-muted); margin-top: 6px; font-family: 'JetBrains Mono', monospace; word-break: break-word; overflow-wrap: break-word; }

@media (max-width: 768px) {
  .slot-item {
    padding: 12px 14px;
  }
  .slot-header {
    margin-bottom: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .slot-company {
    font-size: 13px;
    width: 100%;
    max-width: 100%;
  }
  .slot-amount-row {
    flex-wrap: wrap;
    gap: 8px;
    font-size: 12px;
    width: 100%;
    max-width: 100%;
  }
  .slot-divider {
    display: none;
  }
  .slot-amount-row span {
    display: block;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .slot-meta {
    flex-wrap: wrap;
    gap: 10px 16px;
    font-size: 11px;
    margin-top: 6px;
    width: 100%;
    max-width: 100%;
  }
  .slot-meta span {
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .slot-date {
    width: 100%;
    word-break: break-all;
  }
}
</style>
