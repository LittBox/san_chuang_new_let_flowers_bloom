<template>
  <div class="farmer-page">
    <div class="farmer-wrapper">
      <div class="farmer-intro">
        <div class="intro-badge">🌹 花农专属</div>
        <h1 class="intro-title">极速花农贷</h1>
        <p class="intro-desc">无需抵押，3分钟完成申请，AI智能风控，最快3天放款</p>
        <div class="intro-features">
          <div class="intro-feature" v-for="f in features" :key="f.title">
            <span class="intro-feature-icon">{{ f.icon }}</span>
            <div>
              <div class="intro-feature-title">{{ f.title }}</div>
              <div class="intro-feature-desc">{{ f.desc }}</div>
            </div>
          </div>
        </div>
        <div class="intro-back" @click="$router.push('/')">← 返回平台首页</div>
      </div>
      <div class="mobile-shell">
        <div class="mobile-notch"></div>
        <div class="mobile-statusbar"><span class="mono">9:41</span><span>🔋 📶</span></div>
        <div class="mobile-header">
          <span class="mobile-back" @click="step > 0 ? step-- : null">{{ step > 0 ? '←' : '' }}</span>
          <span class="mobile-title">极速花农贷</span>
          <span class="mobile-help">帮助</span>
        </div>
        <div class="mobile-body">
          <div v-if="step === 0" class="mobile-screen fade-in-up">
            <div class="welcome-emoji">🌸</div>
            <div class="welcome-title">极速花农贷</div>
            <div class="welcome-sub">无需抵押 · AI风控 · 最快3天放款</div>
            <div class="feature-cards">
              <div class="fcard" v-for="f in features" :key="f.title">
                <span>{{ f.icon }}</span><span>{{ f.title }}</span>
              </div>
            </div>
            <button class="mobile-btn" @click="step = 1">立即申请 →</button>
            <div class="mobile-tip">已有 <b>368</b> 位花农成功获贷</div>
          </div>
          <div v-else-if="step === 1" class="mobile-screen fade-in-up">
            <div class="step-bar">
              <div class="step-dot active"></div><div class="step-line"></div>
              <div class="step-dot"></div><div class="step-line"></div><div class="step-dot"></div>
            </div>
            <div class="step-title">第一步：基本信息</div>
            <div class="form-group">
              <label class="form-label">姓名</label>
              <input v-model="loanStore.farmerForm.farmerName" class="form-input" placeholder="请输入真实姓名" />
            </div>
            <div class="form-group">
              <label class="form-label">手机号码</label>
              <input v-model="loanStore.farmerForm.farmerPhone" class="form-input" placeholder="请输入手机号" />
            </div>
            <div class="form-group">
              <label class="form-label">种植区域</label>
              <select v-model="loanStore.farmerForm.region" class="form-select">
                <option>云南省昆明市晋宁区</option>
                <option>云南省玉溪市通海县</option>
                <option>云南省红河州开远市</option>
                <option>云南省昆明市呈贡区</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">主要花卉品种</label>
              <select v-model="loanStore.farmerForm.flowerType" class="form-select">
                <option>玫瑰</option><option>康乃馨</option><option>百合</option><option>满天星</option>
              </select>
            </div>
            <button class="mobile-btn" @click="step = 2">下一步</button>
          </div>
          <div v-else-if="step === 2" class="mobile-screen fade-in-up">
            <div class="step-bar">
              <div class="step-dot active"></div><div class="step-line active"></div>
              <div class="step-dot active"></div><div class="step-line"></div><div class="step-dot"></div>
            </div>
            <div class="step-title">第二步：贷款信息</div>
            <div class="form-group">
              <label class="form-label">种植面积（亩）</label>
              <input v-model.number="loanStore.farmerForm.plantArea" type="number" class="form-input" min="0.5" />
            </div>
            <div class="form-group">
              <label class="form-label">申请金额 <b style="color:var(--primary)">{{ loanStore.farmerForm.requestAmount }} 万元</b></label>
              <input v-model.number="loanStore.farmerForm.requestAmount" type="range" min="1" max="30" step="0.5" class="slider" />
              <div class="slider-labels"><span>1万</span><span>30万</span></div>
            </div>
            <div class="form-group">
              <label class="form-label">贷款用途</label>
              <select v-model="loanStore.farmerForm.purpose" class="form-select">
                <option>购买农资肥料</option><option>购买种球及有机肥</option>
                <option>扩建温室大棚</option><option>流动资金周转</option>
              </select>
            </div>
            <div class="ai-notice">
              <div class="ai-notice-title">🤖 AI将自动采集以下数据</div>
              <div class="ai-tags">
                <span v-for="d in dataSources" :key="d" class="ai-tag">{{ d }}</span>
              </div>
            </div>
            <div class="mobile-btn-row">
              <button class="mobile-btn-ghost" @click="step = 1">上一步</button>
              <button class="mobile-btn" @click="handleSubmit">提交申请</button>
            </div>
          </div>
          <div v-else-if="step === 3" class="mobile-screen fade-in-up">
            <div class="processing-wrap">
              <div class="proc-spinner">⚙️</div>
              <div class="processing-title">AI风控评估中...</div>
              <div class="processing-steps">
                <div v-for="(ps, i) in processingSteps" :key="i" class="proc-step"
                  :class="{ done: i < currentProcStep, active: i === currentProcStep }">
                  <span class="proc-dot">{{ i < currentProcStep ? '✓' : i === currentProcStep ? '◉' : '○' }}</span>
                  <span>{{ ps }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="step === 4" class="mobile-screen fade-in-up">
            <div class="result-icon">🎉</div>
            <div class="result-title">预审通过！</div>
            <div class="result-sub">您的申请已完成AI风控并完成信用撮合</div>
            <div class="result-card">
              <div class="result-row"><span>申请金额</span><span class="result-val">{{ loanStore.farmerForm.requestAmount }} 万元</span></div>
              <div class="result-row"><span>风险评级</span><span class="result-val" style="color:var(--primary)">{{ currentApp?.riskLabel }}</span></div>
              <div class="result-row"><span>风控评分</span><span class="result-val">{{ currentApp?.riskScore }} 分</span></div>
              <div class="result-row"><span>匹配企业</span><span class="result-val">{{ currentApp?.matchedEnterprise }}</span></div>
              <div class="result-row"><span>担保费用</span><span class="result-val">{{ currentApp?.guaranteeFee }} 万元</span></div>
            </div>
            <div class="result-timeline">
              <span class="rtl-done">✓ 申请提交</span><span class="rtl-arrow">→</span>
              <span class="rtl-done">✓ AI风控</span><span class="rtl-arrow">→</span>
              <span class="rtl-done">✓ 信用撮合</span><span class="rtl-arrow">→</span>
              <span class="rtl-pending">⏳ 银行审批</span>
            </div>
            <button class="mobile-btn" @click="step = 0">完成，返回</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLoanStore } from '../../stores/loanStore'
import { useCreditStore } from '../../stores/creditStore'
import { useBlockchainStore } from '../../stores/blockchainStore'

const step = ref(0)
const loanStore = useLoanStore()
const creditStore = useCreditStore()
const blockchainStore = useBlockchainStore()
const currentApp = ref<any>(null)
const currentProcStep = ref(0)

const features = [
  { icon: '⚡', title: '3分钟完成申请', desc: '全程线上，无需跑网点' },
  { icon: '🤖', title: 'AI智能风控', desc: '多维数据融合，精准评估' },
  { icon: '🏢', title: '企业信用背书', desc: '龙头企业担保，银行快批' },
  { icon: '🔒', title: '区块链存证', desc: '全程透明，不可篡改' },
]
const dataSources = ['气象数据', '土壤物联网', '拍卖市场交易', '农资采购凭证', '卫星面积核验']
const processingSteps = ['接收申请数据...', '气象风险数据分析...', '土壤物联网数据核验...', '拍卖市场历史比对...', 'AI综合评分计算...', '信用撮合匹配中...']

async function handleSubmit() {
  step.value = 3
  currentProcStep.value = 0
  const app = loanStore.submitApplication()
  currentApp.value = app
  for (let i = 0; i < processingSteps.length; i++) {
    await delay(600)
    currentProcStep.value = i + 1
  }
  const evaluated = await loanStore.runRiskEvaluation(app.id)
  if (evaluated && evaluated.status === 'risk_passed') {
    const slot = creditStore.creditSlots.find(s => s.status === 'active' && s.availableAmount >= app.requestAmount)
    if (slot) {
      await loanStore.matchCredit(app.id, slot.id, slot.enterpriseName, slot.guaranteeFeeRate)
      creditStore.consumeCredit(slot.id, app.requestAmount)
      blockchainStore.addRecord({ timestamp: new Date().toLocaleString('zh-CN'), type: 'loan_submit', typeLabel: '贷款申请', actor: app.farmerName, summary: `${app.farmerName} 提交${app.flowerType}种植贷款申请 ${app.requestAmount}万元`, amount: app.requestAmount, relatedId: app.id })
      blockchainStore.addRecord({ timestamp: new Date().toLocaleString('zh-CN'), type: 'risk_score', typeLabel: 'AI风控评分', actor: 'AI数据血缘引擎', summary: `${app.farmerName} 风控评分${evaluated.riskScore}分，评级：${evaluated.riskLabel}`, relatedId: app.id })
      currentApp.value = loanStore.applications.find(a => a.id === app.id)
    }
  }
  step.value = 4
}

function delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }
</script>

<style scoped>
.farmer-page { min-height: 100vh; background: linear-gradient(135deg, #f0faf5 0%, #fffbeb 100%); display: flex; align-items: center; justify-content: center; padding: 40px; }
.farmer-wrapper { display: flex; align-items: flex-start; gap: 64px; max-width: 1000px; width: 100%; }

@media (max-width: 768px) {
  .farmer-page {
    padding: 16px;
    align-items: stretch;
  }
  .farmer-wrapper {
    flex-direction: column;
    gap: 0;
  }
}
.farmer-intro { flex: 1; padding-top: 40px; }

@media (max-width: 768px) {
  .farmer-intro {
    padding-top: 0;
    display: none;
  }
}
.intro-badge { display: inline-block; padding: 4px 14px; background: var(--primary); color: #fff; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
.intro-title { font-size: 36px; font-weight: 700; color: var(--primary-dark); margin-bottom: 12px; }
.intro-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 32px; }
.intro-features { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
.intro-feature { display: flex; align-items: flex-start; gap: 14px; }
.intro-feature-icon { font-size: 24px; flex-shrink: 0; }
.intro-feature-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.intro-feature-desc { font-size: 13px; color: var(--text-muted); }
.intro-back { font-size: 13px; color: var(--primary); cursor: pointer; font-weight: 600; }
.mobile-shell { width: 360px; flex-shrink: 0; background: #1a1a2e; border-radius: 40px; padding: 16px 8px 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }

@media (max-width: 768px) {
  .mobile-shell {
    width: 100%;
    border-radius: 12px;
    padding: 0;
    background: #fff;
    box-shadow: none;
  }
}
.mobile-notch { width: 100px; height: 24px; background: #1a1a2e; border-radius: 0 0 16px 16px; margin: 0 auto 4px; }
.mobile-statusbar { display: flex; justify-content: space-between; padding: 0 20px 8px; color: #fff; font-size: 12px; }
.mobile-header { background: var(--primary-dark); color: #fff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
.mobile-back { font-size: 18px; cursor: pointer; width: 24px; }
.mobile-title { font-size: 15px; font-weight: 700; }
.mobile-help { font-size: 13px; color: rgba(255,255,255,0.7); }
.mobile-body { background: #fff; min-height: 500px; border-radius: 0 0 28px 28px; overflow-y: auto; }

@media (max-width: 768px) {
  .mobile-notch,
  .mobile-statusbar {
    display: none;
  }
  .mobile-header {
    padding: 10px 14px;
    min-height: 40px;
  }
  .mobile-back {
    font-size: 16px;
  }
  .mobile-title {
    font-size: 14px;
  }
  .mobile-help {
    font-size: 12px;
  }
  .mobile-body {
    min-height: auto;
    border-radius: 0 0 12px 12px;
    overflow-y: visible;
  }
}
.mobile-screen { padding: 20px; }
.welcome-emoji { font-size: 52px; text-align: center; padding-top: 16px; }
.welcome-title { font-size: 20px; font-weight: 700; text-align: center; color: var(--text-primary); margin: 8px 0 4px; }
.welcome-sub { font-size: 12px; text-align: center; color: var(--text-muted); margin-bottom: 20px; }
.feature-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
.fcard { background: var(--bg-secondary); border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.mobile-btn { width: 100%; padding: 14px; background: var(--primary); color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; font-family: inherit; margin-top: 8px; }
.mobile-btn:active { background: var(--primary-dark); }
.mobile-tip { text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 10px; }
.mobile-btn-row { display: flex; gap: 10px; margin-top: 8px; }
.mobile-btn-ghost { flex: 1; padding: 12px; background: var(--bg-secondary); color: var(--text-secondary); border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.mobile-btn-row .mobile-btn { flex: 2; }
.step-bar { display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 16px; padding-top: 4px; }
.step-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); }
.step-dot.active { background: var(--primary); }
.step-line { flex: 1; height: 2px; background: var(--border); max-width: 40px; }
.step-line.active { background: var(--primary); }
.step-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
.slider { width: 100%; accent-color: var(--primary); }
.slider-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.ai-notice { background: #eff6ff; border-radius: 8px; padding: 12px; margin-top: 8px; }
.ai-notice-title { font-size: 12px; font-weight: 600; color: #1e40af; margin-bottom: 8px; }
.ai-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.ai-tag { background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500; }
.processing-wrap { text-align: center; padding: 24px 0; }
.proc-spinner { font-size: 40px; animation: spin 2s linear infinite; display: inline-block; }
.processing-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin: 12px 0 20px; }
.processing-steps { text-align: left; display: flex; flex-direction: column; gap: 10px; }
.proc-step { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-muted); transition: color 0.3s; }
.proc-step.done { color: var(--primary); font-weight: 600; }
.proc-step.active { color: var(--accent); font-weight: 600; animation: pulse 1s ease-in-out infinite; }
.proc-dot { font-size: 14px; width: 20px; text-align: center; }
.result-icon { font-size: 48px; text-align: center; padding-top: 8px; }
.result-title { font-size: 20px; font-weight: 700; text-align: center; color: var(--primary-dark); margin: 8px 0 4px; }
.result-sub { font-size: 12px; text-align: center; color: var(--text-muted); margin-bottom: 16px; }
.result-card { background: var(--bg-secondary); border-radius: 10px; padding: 12px; margin-bottom: 14px; }
.result-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-light); font-size: 13px; color: var(--text-secondary); }
.result-row:last-child { border-bottom: none; }
.result-val { font-weight: 700; color: var(--text-primary); }
.result-timeline { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-bottom: 16px; font-size: 11px; }
.rtl-done { color: var(--primary); font-weight: 600; }
.rtl-pending { color: var(--accent); font-weight: 600; }
.rtl-arrow { color: var(--border); }
</style>
