import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type LoanStatus =
  | 'draft'
  | 'submitted'
  | 'risk_evaluating'
  | 'risk_passed'
  | 'risk_failed'
  | 'matching'
  | 'matched'
  | 'bank_reviewing'
  | 'approved'
  | 'rejected'
  | 'disbursed'

export interface LoanApplication {
  id: string
  farmerName: string
  farmerPhone: string
  region: string
  flowerType: string
  plantArea: number
  requestAmount: number
  purpose: string
  status: LoanStatus
  riskScore: number
  riskLevel: 0 | 1 | 2 | 3 | 4 | 5
  riskLabel: string
  matchedCreditSlotId: string | null
  matchedEnterprise: string | null
  guaranteeFee: number
  approvedAmount: number
  interestRate: number
  submittedAt: string
  disbursedAt: string | null
  blockchainHash: string | null
  aiDataSources: string[]
}

const mockApplications: LoanApplication[] = [
  {
    id: 'LA20240301001',
    farmerName: '李建国',
    farmerPhone: '138****8801',
    region: '云南省昆明市晋宁区',
    flowerType: '玫瑰',
    plantArea: 8.5,
    requestAmount: 15,
    purpose: '购买农资肥料及大棚薄膜',
    status: 'disbursed',
    riskScore: 87,
    riskLevel: 1,
    riskLabel: '低风险',
    matchedCreditSlotId: 'CS001',
    matchedEnterprise: '云南鲜花控股集团',
    guaranteeFee: 0.12,
    approvedAmount: 15,
    interestRate: 4.35,
    submittedAt: '2024-03-01 09:12:34',
    disbursedAt: '2024-03-05 14:30:00',
    blockchainHash: '0x3a7f9c2e1b4d6f8a0e2c4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6',
    aiDataSources: ['气象数据', '土壤物联网', '拍卖市场交易记录', '农资采购凭证'],
  },
  {
    id: 'LA20240302002',
    farmerName: '王秀芳',
    farmerPhone: '159****2233',
    region: '云南省玉溪市通海县',
    flowerType: '康乃馨',
    plantArea: 5.2,
    requestAmount: 8,
    purpose: '扩建温室大棚',
    status: 'bank_reviewing',
    riskScore: 79,
    riskLevel: 2,
    riskLabel: '较低风险',
    matchedCreditSlotId: 'CS002',
    matchedEnterprise: '昆明国际花卉拍卖中心',
    guaranteeFee: 0.048,
    approvedAmount: 8,
    interestRate: 4.15,
    submittedAt: '2024-03-02 14:25:10',
    disbursedAt: null,
    blockchainHash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    aiDataSources: ['气象数据', '拍卖市场交易记录', '种植面积卫星核验'],
  },
  {
    id: 'LA20240303003',
    farmerName: '张德明',
    farmerPhone: '177****5544',
    region: '云南省红河州开远市',
    flowerType: '百合',
    plantArea: 12.0,
    requestAmount: 22,
    purpose: '购买种球及有机肥',
    status: 'matched',
    riskScore: 82,
    riskLevel: 1,
    riskLabel: '低风险',
    matchedCreditSlotId: 'CS001',
    matchedEnterprise: '云南鲜花控股集团',
    guaranteeFee: 0.176,
    approvedAmount: 22,
    interestRate: 4.35,
    submittedAt: '2024-03-03 08:45:22',
    disbursedAt: null,
    blockchainHash: null,
    aiDataSources: ['气象数据', '土壤物联网', '拍卖市场交易记录'],
  },
]

export const useLoanStore = defineStore('loan', () => {
  const applications = ref<LoanApplication[]>(mockApplications)
  const currentApplication = ref<LoanApplication | null>(null)
  const isEvaluating = ref(false)

  const farmerForm = ref({
    farmerName: '',
    farmerPhone: '',
    region: '云南省昆明市晋宁区',
    flowerType: '玫瑰',
    plantArea: 5,
    requestAmount: 10,
    purpose: '购买农资肥料',
  })

  const pendingApplications = computed(() =>
    applications.value.filter(a => a.status === 'bank_reviewing' || a.status === 'matched')
  )

  const disbursedApplications = computed(() =>
    applications.value.filter(a => a.status === 'disbursed')
  )

  const allChainedApplications = computed(() =>
    applications.value.filter(a => a.blockchainHash !== null)
  )

  function submitApplication() {
    const app: LoanApplication = {
      id: 'LA' + Date.now(),
      ...farmerForm.value,
      status: 'submitted',
      riskScore: 0,
      riskLevel: 0,
      riskLabel: '待评估',
      matchedCreditSlotId: null,
      matchedEnterprise: null,
      guaranteeFee: 0,
      approvedAmount: 0,
      interestRate: 0,
      submittedAt: new Date().toLocaleString('zh-CN'),
      disbursedAt: null,
      blockchainHash: null,
      aiDataSources: ['气象数据', '土壤物联网', '拍卖市场交易记录', '农资采购凭证'],
    }
    applications.value.unshift(app)
    currentApplication.value = app
    return app
  }

  async function runRiskEvaluation(appId: string) {
    isEvaluating.value = true
    const app = applications.value.find(a => a.id === appId)
    if (!app) return
    app.status = 'risk_evaluating'
    await delay(3000)
    const score = Math.floor(Math.random() * 25) + 70
    app.riskScore = score
    if (score >= 75) {
      app.riskLevel = score >= 85 ? 1 : 2
      app.riskLabel = score >= 85 ? '低风险' : '较低风险'
      app.status = 'risk_passed'
    } else {
      app.riskLevel = 3
      app.riskLabel = '中等风险'
      app.status = 'risk_failed'
    }
    isEvaluating.value = false
    return app
  }

  async function matchCredit(appId: string, slotId: string, enterprise: string, feeRate: number) {
    const app = applications.value.find(a => a.id === appId)
    if (!app) return
    app.status = 'matching'
    await delay(1500)
    app.matchedCreditSlotId = slotId
    app.matchedEnterprise = enterprise
    app.guaranteeFee = parseFloat((app.requestAmount * feeRate / 100).toFixed(3))
    app.status = 'matched'
  }

  async function bankApprove(appId: string, interestRate: number) {
    const app = applications.value.find(a => a.id === appId)
    if (!app) return
    app.status = 'bank_reviewing'
    await delay(1000)
    app.approvedAmount = app.requestAmount
    app.interestRate = interestRate
    app.status = 'approved'
    await delay(500)
    app.status = 'disbursed'
    app.disbursedAt = new Date().toLocaleString('zh-CN')
    app.blockchainHash = '0x' + Array.from({ length: 64 }, () =>
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('')
  }

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  return {
    applications,
    currentApplication,
    isEvaluating,
    farmerForm,
    pendingApplications,
    disbursedApplications,
    allChainedApplications,
    submitApplication,
    runRiskEvaluation,
    matchCredit,
    bankApprove,
  }
})
