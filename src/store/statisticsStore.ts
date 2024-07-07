// src/store/statisticsStore.ts
import { defineStore } from 'pinia';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth';

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    playerStats: null as any,
    averageStats: null as any,
    overallStats: null as any,
  }),
  actions: {
    async fetchPlayerStats() {
      const authStore = useAuthStore();
      const statistics = authStore.statistics;
      const principalIdString = authStore.principalId;
      if (!statistics) {
        throw new Error("Statistics service is not initialized");
      }
      if (!principalIdString) {
        throw new Error("Principal ID is not set");
      }

      // Convert principalIdString to Principal type
      const principalId = Principal.fromText(principalIdString);

      try {
        console.log('Fetching player stats for principal ID:', principalId.toText());
        const [playerStats, averageStats, overallStats] = await Promise.all([
          statistics.getPlayerStats(principalId),
          statistics.getPlayerAverageStats(principalId),
          statistics.getOverallStats(),
        ]);

        this.playerStats = playerStats[0] || {};
        this.averageStats = averageStats[0] || {};
        this.overallStats = overallStats;

        console.log('Player Stats:', this.playerStats);
        console.log('Average Stats:', this.averageStats);
        console.log('Overall Stats:', this.overallStats);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    },
  },
});
