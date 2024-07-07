import { defineStore } from 'pinia';
import { fetchUserDetails } from '@/services/UserService';
import type { Principal } from '@dfinity/principal';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    userDetails: null as any,
  }),
  actions: {
    async fetchUserDetails(canisterId: string, account: Principal) {
      this.userDetails = await fetchUserDetails(canisterId, account);
    },
  },
});
