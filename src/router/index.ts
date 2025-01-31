// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TournamentView from '../views/TournamentView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import TokenView from '../views/TokenView.vue';
import NFTView from '../views/NFTView.vue';
import UserView from '../views/UserView.vue';
import StatisticsView from '../views/StatisticsView.vue';
import TournamentSection from '../components/TournamentSection.vue';
import { useAuthStore } from '../store/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/tournament/:id',
    name: 'Tournament',
    component: TournamentView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/tokens',
    name: 'Tokens',
    component: TokenView,
    meta: { requiresAuth: true },
  },
  {
    path: '/nfts',
    name: 'NFTs',
    component: NFTView,
    meta: { requiresAuth: true },
  },
  {
    path: '/user',
    name: 'User',
    component: UserView,
    meta: { requiresAuth: true },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/tournament-section',
    name: 'TournamentSection',
    component: TournamentSection,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
