<template>
  <div class="home-page">
    <header class="home-header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-icon">🌸</span>
          <div>
            <div class="logo-title">'贷'动花开</div>
            <div class="logo-sub">花卉产业农业信贷科技平台</div>
          </div>
        </div>
        <div class="header-badges">
          <span class="badge">区块链存证</span>
          <span class="badge">AI风控引擎</span>
          <span class="badge">数据血缘溯源</span>
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="hero-content">
        <div class="hero-tag">农业信贷科技 · 普惠金融</div>
        <h1 class="hero-title">让每一朵花，都能<span class="highlight">开得起来</span></h1>
        <p class="hero-desc">通过"数据血缘溯源"与"区块链存证"技术，打通龙头企业闲置授信与小花农融资需求，实现信贷资源的精准配置与风险透明化管理。</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-value">1000<span>万+</span></div>
            <div class="hero-stat-label">累计放款金额</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">368<span>户</span></div>
            <div class="hero-stat-label">受益花农</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">3-5<span>天</span></div>
            <div class="hero-stat-label">极速放款</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">0.3<span>%</span></div>
            <div class="hero-stat-label">不良贷款率</div>
          </div>
        </div>
      </div>
      <div class="hero-flow">
        <div class="flow-title">业务流转示意</div>
        <div class="flow-chain">
          <div v-for="(step, i) in flowSteps" :key="i" class="flow-node" :style="{ animationDelay: i * 0.15 + 's' }">
            <div class="flow-node-icon" :style="{ background: step.color }">{{ step.icon }}</div>
            <div class="flow-node-name">{{ step.name }}</div>
            <div v-if="i < flowSteps.length - 1" class="flow-arrow">↓</div>
          </div>
        </div>
      </div>
    </section>

    <section class="portals">
      <div class="portals-title">
        <h2>四方协同门户</h2>
        <p>点击进入对应角色的操作界面，体验完整业务流程</p>
      </div>
      <div class="portals-grid">
        <div
          v-for="(portal, idx) in portals"
          :key="portal.route"
          class="portal-card"
          :class="portal.cls"
          :style="{ animationDelay: idx * 0.08 + 's' }"
          @click="$router.push(portal.route)"
        >
          <div class="portal-icon">{{ portal.icon }}</div>
          <div class="portal-role">{{ portal.role }}</div>
          <div class="portal-name">{{ portal.name }}</div>
          <div class="portal-desc">{{ portal.desc }}</div>
          <div class="portal-footer">
            <span class="portal-tag">{{ portal.tag }}</span>
            <span class="portal-enter">进入 →</span>
          </div>
        </div>
      </div>
    </section>

    <section class="process">
      <div class="process-inner">
        <div class="process-title"><h2>六步业务闭环</h2></div>
        <div class="process-timeline">
          <div v-for="(step, i) in processSteps" :key="i" class="process-step">
            <div class="process-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="process-icon">{{ step.icon }}</div>
            <div class="process-step-title">{{ step.title }}</div>
            <div class="process-step-desc">{{ step.desc }}</div>
            <div v-if="i < processSteps.length - 1" class="process-arrow">→</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <span>🌸 '贷'动花开 · 花卉产业农业信贷科技平台</span>
      <span>比赛路演 Demo · 四方协同 · 区块链存证</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
const flowSteps = [
  { icon: '🏢', name: '企业发布', color: '#d1fae5' },
  { icon: '🌹', name: '花农申请', color: '#fef3c7' },
  { icon: '🤖', name: 'AI风控', color: '#dbeafe' },
  { icon: '🤝', name: '信用撮合', color: '#ede9fe' },
  { icon: '🏦', name: '银行放款', color: '#fee2e2' },
]

const portals = [
  { route: '/enterprise', icon: '🏢', role: '龙头企业', name: '企业端管理后台', desc: '发布闲置授信额度，管理担保挂牌，监控授信使用情况', tag: '额度拆分发布', cls: 'pe' },
  { route: '/farmer', icon: '🌹', role: '小花农', name: '花农贷款申请', desc: '移动端极速申请，上传种植凭证，3分钟完成提交', tag: 'H5移动端', cls: 'pf' },
  { route: '/risk', icon: '🤖', role: '平台风控', name: 'AI风控中台', desc: '数据血缘识别引擎，多维数据融合分析，实时风险评分', tag: 'AI评分引擎', cls: 'pr' },
  { route: '/bank', icon: '🏦', role: '合作银行', name: '银行审批端', desc: '接收精准风险画像，查看企业担保背书，一键快速放款', tag: '3-5天放款', cls: 'pb' },
  { route: '/government', icon: '🏛️', role: '政府监管', name: '政府监管大屏', desc: '区块链不可篡改账本，全区域信贷流向监控，风险热力图', tag: '区块链存证', cls: 'pg' },
]

const processSteps = [
  { icon: '🏢', title: '企业发布额度', desc: '龙头企业将闲置银行授信拆分挂牌，设定单笔上限与担保费率' },
  { icon: '🌹', title: '花农极速申请', desc: '小花农通过H5端提交种植面积、农资凭证，发起贷款申请' },
  { icon: '🤖', title: 'AI智能风控', desc: 'AI引擎抓取气象、土壤、拍卖交易数据，生成0-5级风险评分' },
  { icon: '🤝', title: '信用背书撮合', desc: '低风险申请与企业额度自动匹配，花农支付担保费获得背书' },
  { icon: '🏦', title: '银行快速放款', desc: '银行收到AI风险画像+企业担保，3-5天完成放款' },
  { icon: '🏛️', title: '政府链上监管', desc: '所有核心节点通过智能合约自动上链，政府实时查看账本' },
]
</script>

<style scoped>
.home-page { min-height: 100vh; background: var(--bg); }

.home-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 0 48px;
  position: sticky; top: 0; z-index: 100;
  box-shadow: var(--shadow-sm);
}
.header-inner {
  max-width: 1200px; margin: 0 auto;
  height: 72px; display: flex; align-items: center; justify-content: space-between;
}

@media (max-width: 768px) {
  .home-header {
    padding: 0 12px;
    overflow: hidden;
  }
  .header-inner {
    height: auto;
    min-height: 56px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    justify-content: flex-start;
    padding: 12px 0;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }
  .header-inner > * {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
}
.logo { display: flex; align-items: center; gap: 14px; }
.logo-icon { font-size: 32px; }
.logo-title { font-size: 20px; font-weight: 700; color: var(--primary-dark); }
.logo-sub { font-size: 12px; color: var(--text-muted); }
.header-badges { display: flex; gap: 8px; }
.badge { padding: 4px 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 20px; font-size: 12px; color: var(--text-secondary); font-weight: 500; }

@media (max-width: 768px) {
  .logo {
    gap: 10px;
  }
  .logo-icon {
    font-size: 28px;
    flex-shrink: 0;
  }
  .logo-title {
    font-size: 16px;
  }
  .logo-sub {
    font-size: 11px;
    line-height: 1.3;
  }
  .header-badges {
    gap: 6px 8px;
    flex-wrap: wrap;
    width: 100%;
    display: flex;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
  }
  .badge {
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    flex: 0 0 auto;
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.hero {
  background: linear-gradient(135deg, #f0faf5 0%, #fffbeb 60%, #f0f9ff 100%);
  padding: 64px 48px;
  display: flex; gap: 64px; align-items: flex-start;
  max-width: 1200px; margin: 0 auto;
}
@media (max-width: 768px) {
  .hero {
    padding: 28px 16px;
    flex-direction: column;
    gap: 28px;
    align-items: stretch;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }
}
.hero-content { flex: 1; }
@media (max-width: 768px) {
  .hero-content {
    flex: 1 0 auto;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }
}
.hero-tag { display: inline-block; padding: 4px 14px; background: var(--primary); color: #fff; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; letter-spacing: 1px; }

@media (max-width: 768px) {
  .hero-tag {
    display: inline-block;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
    line-height: 1.2;
    white-space: nowrap;
  }
}
.hero-title { font-size: 40px; font-weight: 700; color: var(--text-primary); line-height: 1.2; margin-bottom: 16px; }
@media (max-width: 768px) {
  .hero-title {
    font-size: 26px;
    line-height: 1.4;
    margin-bottom: 14px;
    letter-spacing: -0.3px;
    word-break: break-word;
    overflow-wrap: break-word;
    word-wrap: break-word;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
}
.highlight { color: var(--primary); }
.hero-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 32px; max-width: 480px; }

@media (max-width: 768px) {
  .hero-desc {
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 24px;
    max-width: 100%;
    width: 100%;
    min-width: 0;
    word-break: break-word;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
}
.hero-stats { display: flex; align-items: center; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow-sm); }
.hero-stat { flex: 1; padding: 20px 24px; text-align: center; }
@media (max-width: 768px) {
  .hero-stats {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    gap: 10px;
    background: var(--bg-card);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    box-sizing: border-box;
  }
  .hero-stat {
    flex: 0 0 calc(50% - 5px);
    padding: 10px;
    text-align: center;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }
  .hero-stat-divider {
    display: none !important;
  }
}
.hero-stat-value { font-size: 28px; font-weight: 700; color: var(--primary); font-family: 'JetBrains Mono', monospace; }
.hero-stat-value span { font-size: 14px; color: var(--text-muted); font-family: inherit; font-weight: 400; }
.hero-stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.hero-stat-divider { width: 1px; height: 48px; background: var(--border); flex-shrink: 0; }

@media (max-width: 768px) {
  .hero-stat-value {
    font-size: 16px;
    line-height: 1.2;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .hero-stat-value span {
    font-size: 11px;
  }
  .hero-stat-label {
    font-size: 10px;
    margin-top: 2px;
    word-break: break-word;
    overflow-wrap: break-word;
    overflow: hidden;
  }
}

.hero-flow { width: 160px; flex-shrink: 0; }
.flow-title { font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 16px; text-align: center; letter-spacing: 1px; }
.flow-chain { display: flex; flex-direction: column; align-items: center; gap: 0; }
.flow-node { display: flex; flex-direction: column; align-items: center; gap: 4px; animation: fadeInUp 0.4s ease both; }
.flow-node-icon { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 2px solid rgba(255,255,255,0.9); box-shadow: var(--shadow-sm); }
.flow-node-name { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
.flow-arrow { font-size: 16px; color: var(--border); margin: 2px 0; }

@media (max-width: 768px) {
  .hero-flow {
    width: 100%;
    flex-shrink: 1;
    max-width: 100%;
    overflow: hidden;
  }
  .flow-title {
    font-size: 11px;
    margin-bottom: 12px;
    letter-spacing: 0;
  }
  .flow-chain {
    flex-direction: row;
    gap: 6px;
    overflow-x: auto;
    width: 100%;
    max-width: 100%;
    padding: 0;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }
  .flow-node {
    gap: 2px;
    flex-shrink: 0;
  }
  .flow-node-icon {
    width: 38px;
    height: 38px;
    font-size: 16px;
  }
  .flow-node-name {
    font-size: 9px;
    text-align: center;
    max-width: 34px;
    word-break: break-word;
    line-height: 1.2;
  }
  .flow-arrow {
    display: none;
  }
}

.portals { max-width: 1200px; margin: 0 auto; padding: 56px 48px; }
.portals-title { text-align: center; margin-bottom: 40px; }
.portals-title h2 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.portals-title p { color: var(--text-muted); font-size: 15px; }
.portals-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }

@media (max-width: 768px) {
  .portals {
    padding: 28px 16px;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }
  .portals-title {
    margin-bottom: 20px;
  }
  .portals-title h2 {
    font-size: 18px;
    margin-bottom: 6px;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .portals-title p {
    font-size: 12px;
    line-height: 1.5;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .portals-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    width: 100%;
    max-width: 100%;
  }
}

.portal-card {
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 20px 20px;
  cursor: pointer;
  transition: all var(--transition);
  display: flex; flex-direction: column; gap: 8px;
  animation: fadeInUp 0.4s ease both;
}
.portal-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
.pe:hover { border-color: var(--primary); }
.pf:hover { border-color: var(--accent); }
.pr:hover { border-color: #3b82f6; }
.pb:hover { border-color: #ef4444; }
.pg:hover { border-color: #8b5cf6; }
.portal-icon { font-size: 36px; margin-bottom: 4px; }
.portal-role { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; }
.portal-name { font-size: 15px; font-weight: 700; color: var(--text-primary); word-break: break-word; overflow-wrap: break-word; }
.portal-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.6; flex: 1; word-break: break-word; overflow-wrap: break-word; }
.portal-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
.portal-tag { font-size: 11px; padding: 3px 8px; background: var(--bg-secondary); border-radius: 10px; color: var(--text-muted); font-weight: 500; }
.portal-enter { font-size: 13px; color: var(--primary); font-weight: 700; }

@media (max-width: 768px) {
  .portal-card {
    padding: 18px 14px 14px;
    gap: 6px;
    border-radius: var(--radius-md);
  }
  .portal-icon {
    font-size: 30px;
    margin-bottom: 2px;
  }
  .portal-role {
    font-size: 8px;
    letter-spacing: 1px;
  }
  .portal-name {
    font-size: 13px;
    line-height: 1.3;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .portal-desc {
    font-size: 11px;
    line-height: 1.5;
    margin: 2px 0;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .portal-footer {
    margin-top: 6px;
    gap: 6px;
    justify-content: space-between;
  }
  .portal-tag {
    font-size: 9px;
    padding: 2px 5px;
    flex-shrink: 0;
  }
  .portal-enter {
    font-size: 11px;
    flex-shrink: 0;
  }
}

.process { background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg) 100%); padding: 56px 0; width: 100%; max-width: 100%; overflow: hidden; }
.process-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; width: 100%; overflow: hidden; }
.process-title { text-align: center; margin-bottom: 40px; word-break: break-word; overflow-wrap: break-word; }
.process-title h2 { font-size: 28px; font-weight: 700; color: var(--text-primary); word-break: break-word; overflow-wrap: break-word; }
.process-timeline { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0; position: relative; align-items: start; }
.process-step { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 0 8px; position: relative; text-align: center; }
.process-num { font-size: 11px; font-weight: 700; color: var(--primary); font-family: 'JetBrains Mono', monospace; background: #d1fae5; padding: 2px 8px; border-radius: 10px; }
.process-icon { font-size: 32px; }
.process-step-title { font-size: 14px; font-weight: 700; color: var(--text-primary); word-break: break-word; overflow-wrap: break-word; }
.process-step-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; word-break: break-word; overflow-wrap: break-word; }
.process-arrow { position: absolute; right: -16px; top: 36px; font-size: 20px; color: var(--border); font-weight: 700; }

@media (max-width: 768px) {
  .process {
    padding: 28px 0;
  }
  .process-inner {
    padding: 0 16px;
  }
  .process-title {
    margin-bottom: 20px;
  }
  .process-title h2 {
    font-size: 18px;
  }
  .process-timeline {
    grid-template-columns: 1fr;
    gap: 12px;
    position: static;
  }
  .process-step {
    gap: 8px;
    padding: 12px;
    background: var(--bg-card);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }
  .process-num {
    font-size: 9px;
    padding: 2px 6px;
  }
  .process-icon {
    font-size: 26px;
  }
  .process-step-title {
    font-size: 12px;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .process-step-desc {
    font-size: 10px;
    line-height: 1.4;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .process-arrow {
    display: none;
  }
}

.home-footer { background: var(--primary-dark); color: rgba(255,255,255,0.7); padding: 24px 48px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }

@media (max-width: 768px) {
  .home-footer {
    flex-direction: column;
    gap: 6px;
    padding: 14px 12px;
    text-align: center;
    font-size: 10px;
    line-height: 1.5;
  }
}
</style>
