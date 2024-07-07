import { defineStore } from 'pinia';
import { fetchICRC1Tokens, fetchICRC7Tokens } from '@/services/CommonTokenService';
import type { Principal } from '@dfinity/principal';

export const useTokenStore = defineStore('token', {
  state: () => ({
    icrc1Tokens: 0n as bigint,
    icrc7Tokens: [] as bigint[],
  }),
  actions: {
    async fetchICRC1Tokens(canisterId: string, account: Principal) {
      try {
        this.icrc1Tokens = await fetchICRC1Tokens(canisterId, account);
      } catch (error) {
        console.error('Error fetching ICRC1 tokens:', error);
      }
    },
    async fetchICRC7Tokens(canisterId: string, account: Principal) {
      try {
        this.icrc7Tokens = await fetchICRC7Tokens(canisterId, account);
      } catch (error) {
        console.error('Error fetching ICRC7 tokens:', error);
      }
    },
  },
});
