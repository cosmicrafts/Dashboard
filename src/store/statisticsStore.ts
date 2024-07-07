import { defineStore } from 'pinia';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth';
import type { GameID } from '@/declarations/statistics/statistics.did';

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    playerStats: null as any,
    averageStats: null as any,
    overallStats: null as any,
    allOnValidation: [] as Array<[bigint, any]>,
    myAverageStats: null as any,
    myStats: null as any,
    basicStats: null as any,
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
        const [playerStats, averageStats, overallStats, allOnValidation, myAverageStats, myStats] = await Promise.all([
          statistics.getPlayerStats(principalId),
          statistics.getPlayerAverageStats(principalId),
          statistics.getOverallStats(),
          statistics.getAllOnValidation(),
          statistics.getMyAverageStats(),
          statistics.getMyStats(),
        ]);

        this.playerStats = playerStats[0] || {};
        this.averageStats = averageStats[0] || {};
        this.overallStats = overallStats;
        this.allOnValidation = allOnValidation;
        this.myAverageStats = myAverageStats[0] || {};
        this.myStats = myStats[0] || {};

        console.log('Player Stats:', this.playerStats);
        console.log('Average Stats:', this.averageStats);
        console.log('Overall Stats:', this.overallStats);
        console.log('All On Validation:', this.allOnValidation);
        console.log('My Average Stats:', this.myAverageStats);
        console.log('My Stats:', this.myStats);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    },
    async fetchBasicStats(gameId: GameID) {
      const authStore = useAuthStore();
      const statistics = authStore.statistics;
      if (!statistics) {
        throw new Error("Statistics service is not initialized");
      }
      try {
        this.basicStats = await statistics.getBasicStats(gameId);
        console.log('Basic Stats:', this.basicStats);
      } catch (error) {
        console.error('Error fetching basic stats:', error);
      }
    },
  },
});
