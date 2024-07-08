// src/store/nftStore.ts
import { defineStore } from 'pinia';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth';
import type { _SERVICE as ICRC7Service } from '@/declarations/icrc7/icrc7.did';
import { idlFactory as icrc7IdlFactory } from '@/declarations/icrc7';
import type { ActorSubclass } from '@dfinity/agent';

export const useNFTStore = defineStore('nft', {
  state: () => ({
    icrc7Tokens: {} as Record<string, bigint[]>,
    metadata: {} as Record<string, Record<string, Record<string, any>>>,
    collectionMetadata: {} as Record<string, Record<string, any>>,
  }),
  actions: {
    async fetchICRC7Tokens(canisterId: string) {
      try {
        const authStore = useAuthStore();
        const principalIdString = authStore.principalId;

        const account: Principal = Principal.fromText(principalIdString);
        const actor = await authStore.initializeAdditionalActor(canisterId, icrc7IdlFactory) as ActorSubclass<ICRC7Service>;

        const result = await actor.icrc7_tokens_of({ owner: account, subaccount: [] });
        if ('Ok' in result) {
          this.icrc7Tokens[canisterId] = result.Ok;

          for (const tokenId of result.Ok) {
            await this.fetchICRC7TokenMetadata(canisterId, tokenId);
          }
        } else {
          throw new Error('Error fetching ICRC7 tokens');
        }
      } catch (error) {
        console.error('Error fetching ICRC7 tokens:', error);
      }
    },

    async fetchICRC7TokenMetadata(canisterId: string, tokenId: bigint) {
      try {
        const authStore = useAuthStore();
        const actor = await authStore.initializeAdditionalActor(canisterId, icrc7IdlFactory) as ActorSubclass<ICRC7Service>;
        const result = await actor.icrc7_metadata(tokenId);
        if ('Ok' in result) {
          if (!this.metadata[canisterId]) {
            this.metadata[canisterId] = {};
          }
          this.metadata[canisterId][tokenId.toString()] = result.Ok;
        } else {
          throw new Error('Error fetching ICRC7 token metadata');
        }
      } catch (error) {
        console.error('Error fetching ICRC7 token metadata:', error);
      }
    },

    async fetchICRC7CollectionMetadata(canisterId: string) {
      try {
        const authStore = useAuthStore();
        const actor = await authStore.initializeAdditionalActor(canisterId, icrc7IdlFactory) as ActorSubclass<ICRC7Service>;
        const collectionMetadata = await actor.icrc7_collection_metadata();
        this.collectionMetadata[canisterId] = collectionMetadata;
      } catch (error) {
        console.error('Error fetching ICRC7 collection metadata:', error);
      }
    },

    async transferICRC7Token(canisterId: string, to: string, tokenIds: bigint[], memo: string) {
      try {
        const authStore = useAuthStore();
        const principalIdString = authStore.principalId;

        const from: Principal = Principal.fromText(principalIdString);
        const toAccount: Principal = Principal.fromText(to);
        const actor = await authStore.initializeAdditionalActor(canisterId, icrc7IdlFactory) as ActorSubclass<ICRC7Service>;

        const result = await actor.icrc7_transfer({
          to: { owner: toAccount, subaccount: [] },
          spender_subaccount: [],
          from: [{ owner: from, subaccount: [] }],
          memo: memo ? [new TextEncoder().encode(memo)] : [],
          is_atomic: [],
          token_ids: tokenIds,
          created_at_time: [],
        });

        if ('Ok' in result) {
          console.log('Transfer successful:', result.Ok);
          await this.fetchICRC7Tokens(canisterId);
        } else {
          console.error('Transfer error:', result.Err);
        }
      } catch (error) {
        console.error('Error transferring ICRC7 token:', error);
      }
    },
  },
});
