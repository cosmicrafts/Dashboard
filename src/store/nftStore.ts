// src/store/nftStore.ts
import { defineStore } from 'pinia';
import { fetchICRC7Tokens } from '@/services/CommonTokenService';
import type { Principal } from '@dfinity/principal';

export const useNFTStore = defineStore('nft', {
  state: () => ({
    icrc7Tokens: [] as bigint[],
  }),
  actions: {
    async fetchNFTs(canisterId: string, account: Principal) {
      try {
        this.icrc7Tokens = await fetchICRC7Tokens(canisterId, account);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    },
  },
});
