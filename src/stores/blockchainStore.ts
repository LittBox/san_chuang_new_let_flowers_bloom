import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface BlockchainRecord {
  hash: string
  blockNumber: number
  timestamp: string
  type: 'credit_publish' | 'loan_submit' | 'risk_score' | 'credit_match' | 'bank_approve' | 'disburse'
  typeLabel: string
  actor: string
  summary: string
  amount?: number
  relatedId: string
}

const initRecords: BlockchainRecord[] = [
  {
    hash: '0x3a7f9c2e1b4d6f8a0e2c4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6',
    blockNumber: 18420501,
    timestamp: '2024-03-05 14:30:22',
    type: 'disburse',
    typeLabel: '银行放款',
    actor: '云南省农村信用合作社',
    summary: '李建国 玫瑰种植贷款 15万元 已放款',
    amount: 15,
    relatedId: 'LA20240301001',
  },
  {
    hash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    blockNumber: 18420488,
    timestamp: '2024-03-04 10:15:33',
    type: 'bank_approve',
    typeLabel: '银行审批',
    actor: '云南省农村信用合作社',
    summary: '李建国 贷款申请通过审批，利率4.35%',
    amount: 15,
    relatedId: 'LA20240301001',
  },
  {
    hash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8',
    blockNumber: 18420432,
    timestamp: '2024-03-03 16:44:10',
    type: 'credit_match',
    typeLabel: '信用撮合',
    actor: '贷动花开平台',
    summary: '李建国 与 云南鲜花控股集团 完成信用背书撮合',
    amount: 15,
    relatedId: 'LA20240301001',
  },
  {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    blockNumber: 18420401,
    timestamp: '2024-03-02 11:22:45',
    type: 'risk_score',
    typeLabel: 'AI风控评分',
    actor: 'AI数据血缘引擎',
    summary: '李建国 风控评分87分，评级：低风险（1级）',
    relatedId: 'LA20240301001',
  },
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    blockNumber: 18420388,
    timestamp: '2024-03-01 09:12:50',
    type: 'loan_submit',
    typeLabel: '贷款申请',
    actor: '李建国',
    summary: '李建国 提交玫瑰种植贷款申请 15万元',
    amount: 15,
    relatedId: 'LA20240301001',
  },
  {
    hash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fe',
    blockNumber: 18420301,
    timestamp: '2024-03-01 08:00:00',
    type: 'credit_publish',
    typeLabel: '额度发布',
    actor: '云南鲜花控股集团',
    summary: '云南鲜花控股集团 发布闲置授信额度 500万元',
    amount: 500,
    relatedId: 'CS001',
  },
]

export const useBlockchainStore = defineStore('blockchain', () => {
  const records = ref<BlockchainRecord[]>(initRecords)
  const latestBlockNumber = computed(() => Math.max(...records.value.map(r => r.blockNumber)))
  const totalRecords = computed(() => records.value.length)
  const totalDisbursed = computed(() =>
    records.value.filter(r => r.type === 'disburse').reduce((s, r) => s + (r.amount || 0), 0)
  )

  function addRecord(record: Omit<BlockchainRecord, 'hash' | 'blockNumber'>) {
    const newRecord: BlockchainRecord = {
      ...record,
      hash: '0x' + Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join(''),
      blockNumber: latestBlockNumber.value + Math.floor(Math.random() * 20) + 5,
    }
    records.value.unshift(newRecord)
    return newRecord.hash
  }

  // Regional risk data for heatmap
  const regionalData = ref([
    { name: '晋宁区', value: 12, riskLevel: 1, amount: 180 },
    { name: '通海县', value: 8, riskLevel: 2, amount: 90 },
    { name: '开远市', value: 6, riskLevel: 1, amount: 132 },
    { name: '呈贡区', value: 15, riskLevel: 2, amount: 210 },
    { name: '嵩明县', value: 4, riskLevel: 1, amount: 60 },
    { name: '宜良县', value: 9, riskLevel: 3, amount: 85 },
    { name: '石林县', value: 3, riskLevel: 1, amount: 45 },
    { name: '弥勒市', value: 11, riskLevel: 2, amount: 155 },
  ])

  return { records, latestBlockNumber, totalRecords, totalDisbursed, regionalData, addRecord }
})
