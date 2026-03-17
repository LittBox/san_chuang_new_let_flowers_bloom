import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CreditSlot {
  id: string
  enterpriseName: string
  totalAmount: number
  availableAmount: number
  usedAmount: number
  interestRate: number
  maxLoanPerFarmer: number
  minLoanPerFarmer: number
  status: 'active' | 'paused' | 'exhausted'
  publishedAt: string
  guaranteeFeeRate: number
  applicantCount: number
}

export const useCreditStore = defineStore('credit', () => {
  const creditSlots = ref<CreditSlot[]>([
    {
      id: 'CS001',
      enterpriseName: '云南鲜花控股集团',
      totalAmount: 500,
      availableAmount: 320,
      usedAmount: 180,
      interestRate: 4.35,
      maxLoanPerFarmer: 30,
      minLoanPerFarmer: 2,
      status: 'active',
      publishedAt: '2024-03-01',
      guaranteeFeeRate: 0.8,
      applicantCount: 12,
    },
    {
      id: 'CS002',
      enterpriseName: '昆明国际花卉拍卖中心',
      totalAmount: 300,
      availableAmount: 210,
      usedAmount: 90,
      interestRate: 4.15,
      maxLoanPerFarmer: 20,
      minLoanPerFarmer: 1,
      status: 'active',
      publishedAt: '2024-03-05',
      guaranteeFeeRate: 0.6,
      applicantCount: 8,
    },
    {
      id: 'CS003',
      enterpriseName: '斗南花卉产业园',
      totalAmount: 200,
      availableAmount: 50,
      usedAmount: 150,
      interestRate: 4.55,
      maxLoanPerFarmer: 15,
      minLoanPerFarmer: 1,
      status: 'active',
      publishedAt: '2024-02-20',
      guaranteeFeeRate: 0.9,
      applicantCount: 18,
    },
  ])

  const newSlotForm = ref({
    totalAmount: 100,
    interestRate: 4.35,
    maxLoanPerFarmer: 20,
    minLoanPerFarmer: 2,
    guaranteeFeeRate: 0.8,
  })

  const totalPublished = computed(() => creditSlots.value.reduce((s, c) => s + c.totalAmount, 0))
  const totalAvailable = computed(() => creditSlots.value.reduce((s, c) => s + c.availableAmount, 0))
  const totalUsed = computed(() => creditSlots.value.reduce((s, c) => s + c.usedAmount, 0))

  function publishNewSlot() {
    const slot: CreditSlot = {
      id: 'CS' + String(creditSlots.value.length + 1).padStart(3, '0'),
      enterpriseName: '云南鲜花控股集团',
      totalAmount: newSlotForm.value.totalAmount,
      availableAmount: newSlotForm.value.totalAmount,
      usedAmount: 0,
      interestRate: newSlotForm.value.interestRate,
      maxLoanPerFarmer: newSlotForm.value.maxLoanPerFarmer,
      minLoanPerFarmer: newSlotForm.value.minLoanPerFarmer,
      status: 'active',
      publishedAt: new Date().toISOString().slice(0, 10),
      guaranteeFeeRate: newSlotForm.value.guaranteeFeeRate,
      applicantCount: 0,
    }
    creditSlots.value.unshift(slot)
  }

  function consumeCredit(slotId: string, amount: number) {
    const slot = creditSlots.value.find(s => s.id === slotId)
    if (slot && slot.availableAmount >= amount) {
      slot.availableAmount -= amount
      slot.usedAmount += amount
      slot.applicantCount += 1
      if (slot.availableAmount === 0) slot.status = 'exhausted'
    }
  }

  return { creditSlots, newSlotForm, totalPublished, totalAvailable, totalUsed, publishNewSlot, consumeCredit }
})
