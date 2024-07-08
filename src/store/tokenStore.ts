import { defineStore } from 'pinia';
import { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth';
import type { Token as ICRC1TokenService, _SERVICE as ICRC1Service } from '@/declarations/icrc1/icrc1.did';
import { idlFactory as icrc1IdlFactory } from '@/declarations/icrc1';
import type { ActorSubclass } from '@dfinity/agent';

export const useTokenStore = defineStore('token', {
  state: () => ({
    icrc1Tokens: {} as Record<string, bigint>,
    decimals: {} as Record<string, number>,
    fee: {} as Record<string, bigint>,
    metadata: {} as Record<string, Array<[string, any]>>,
    name: {} as Record<string, string>,
    symbol: {} as Record<string, string>,
  }),
  actions: {
    async fetchICRC1TokenInfo(canisterId: string) {
      try {
        const authStore = useAuthStore();
        const principalIdString = authStore.principalId;

        if (!principalIdString) throw new Error('Principal ID is not set');

        const account: Principal = Principal.fromText(principalIdString);
        const actor = await authStore.initializeAdditionalActor(canisterId, icrc1IdlFactory) as ActorSubclass<ICRC1Service>;

        const [balance, decimals, fee, metadata, name, symbol] = await Promise.all([
          actor.icrc1_balance_of({ owner: account, subaccount: [] }),
          actor.icrc1_decimals(),
          actor.icrc1_fee(),
          actor.icrc1_metadata(),
          actor.icrc1_name(),
          actor.icrc1_symbol()
        ]);

        this.icrc1Tokens[canisterId] = balance;
        this.decimals[canisterId] = decimals;
        this.fee[canisterId] = fee;
        this.metadata[canisterId] = metadata;
        this.name[canisterId] = name;
        this.symbol[canisterId] = symbol;

      } catch (error) {
        console.error('Error fetching ICRC1 token info:', error);
        throw error; // Ensure the error is propagated
      }
    },
    async transferICRC1Token(canisterId: string, to: string, amount: bigint) {
      try {
        const authStore = useAuthStore();
        const principalIdString = authStore.principalId;

        if (!principalIdString) throw new Error('Principal ID is not set');

        const from: Principal = Principal.fromText(principalIdString);
        const toAccount: Principal = Principal.fromText(to);
        const actor = await authStore.initializeAdditionalActor(canisterId, icrc1IdlFactory) as ActorSubclass<ICRC1Service>;

        const fee = this.fee[canisterId];

        const result = await actor.icrc1_transfer({
          to: { owner: toAccount, subaccount: [] },
          fee: [fee],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount,
        });

        if ('Ok' in result) {
          console.log('Transfer successful:', result.Ok);
          await this.fetchICRC1TokenInfo(canisterId); // Refresh balance after transfer
        } else {
          console.error('Transfer error:', result.Err);
        }
      } catch (error) {
        console.error('Error transferring ICRC1 token:', error);
      }
    },
  },
});
