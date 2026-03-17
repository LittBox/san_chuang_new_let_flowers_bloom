import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/home/HomeView.vue'),
    },
    {
      path: '/enterprise',
      name: 'Enterprise',
      component: () => import('../views/enterprise/EnterpriseView.vue'),
    },
    {
      path: '/farmer',
      name: 'Farmer',
      component: () => import('../views/farmer/FarmerView.vue'),
    },
    {
      path: '/risk',
      name: 'Risk',
      component: () => import('../views/risk/RiskView.vue'),
    },
    {
      path: '/bank',
      name: 'Bank',
      component: () => import('../views/bank/BankView.vue'),
    },
    {
      path: '/government',
      name: 'Government',
      component: () => import('../views/government/GovernmentView.vue'),
    },
  ],
})

export default router
