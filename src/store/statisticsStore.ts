import { defineStore } from 'pinia';
import { fetchPlayerStats } from '@/services/StatisticsService';
import type { Principal } from '@dfinity/principal';

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    playerStats: null as any,
  }),
  actions: {
    async fetchPlayerStats(canisterId: string, account: Principal) {
      this.playerStats = await fetchPlayerStats(canisterId, account);
    },
  },
});
