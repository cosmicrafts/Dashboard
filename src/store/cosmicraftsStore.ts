import { defineStore } from 'pinia';
import { fetchPlayerData } from '@/services/CosmicraftsService';
import type { Principal } from '@dfinity/principal';

export const useCosmicraftsStore = defineStore('cosmicrafts', {
  state: () => ({
    playerData: null as any,
  }),
  actions: {
    async fetchPlayerData(canisterId: string, account: Principal) {
      this.playerData = await fetchPlayerData(canisterId, account);
    },
  },
});
