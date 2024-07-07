import { defineStore } from 'pinia';
import { Actor, HttpAgent, type ActorSubclass } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import nacl from 'tweetnacl';
import { encode as base64Encode } from 'base64-arraybuffer';
import MetaMaskService from '@/services/MetaMaskService';
import PhantomService from '@/services/PhantomService';
import { idlFactory as tournamentsIdlFactory } from '@/declarations/tournaments';
import { idlFactory as cosmicraftsIdlFactory } from '@/declarations/cosmicrafts';
import { idlFactory as nftIdlFactory } from '@/declarations/icrc7';
import { idlFactory as playerIdlFactory } from '@/declarations/player';
import { idlFactory as statisticsIdlFactory } from '@/declarations/statistics';
import { idlFactory as tokenIdlFactory } from '@/declarations/icrc1';
import type { _SERVICE as TournamentsService } from '@/declarations/tournaments/tournaments.did';
import type { _SERVICE as CosmicraftsService } from '@/declarations/cosmicrafts/cosmicrafts.did';
import type { _SERVICE as NFTService } from '@/declarations/icrc7/icrc7.did';
import type { _SERVICE as PlayerService } from '@/declarations/player/player.did';
import type { _SERVICE as StatisticsService } from '@/declarations/statistics/statistics.did';
import type { _SERVICE as TokenService } from '@/declarations/icrc1/icrc1.did';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { publicKey: string; privateKey: string } | null,
    isAuthenticated: false,
    googleSub: '' as string,
    principalId: '' as string,
    tournaments: null as ActorSubclass<TournamentsService> | null,
    cosmicrafts: null as ActorSubclass<CosmicraftsService> | null,
    nft: null as ActorSubclass<NFTService> | null,
    player: null as ActorSubclass<PlayerService> | null,
    statistics: null as ActorSubclass<StatisticsService> | null,
    token: null as ActorSubclass<TokenService> | null,
  }),
  actions: {
    async loginWithGoogle(response: any) {
      const decodedIdToken = response.credential.split('.')[1];
      const payload = JSON.parse(atob(decodedIdToken));
      this.googleSub = payload.sub;
      await this.generateKeysFromSub(this.googleSub);
    },
    async loginWithMetaMask() {
      const uniqueMessage = 'Sign this message to log in with your Ethereum wallet';
      const signature = await MetaMaskService.signMessage(uniqueMessage);
      if (signature) {
        await this.generateKeysFromSignature(signature);
      }
    },
    async loginWithPhantom() {
      const message = 'Sign this message to log in with your Phantom Wallet';
      const signature = await PhantomService.signAndSend(message);
      if (signature) {
        await this.generateKeysFromSignature(signature);
      }
    },
    async generateKeysFromSignature(signature: string) {
      const encoder = new TextEncoder();
      const encodedSignature = encoder.encode(signature);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSignature);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      this.createIdentity(publicKeyBase64, privateKeyBase64);
      this.isAuthenticated = true;
    },
    async generateKeysFromSub(sub: string) {
      const encoder = new TextEncoder();
      const encodedSub = encoder.encode(sub);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedSub);
      const seed = new Uint8Array(hashBuffer.slice(0, 32));
      const keyPair = nacl.sign.keyPair.fromSeed(seed);
      const publicKeyBase64 = base64Encode(keyPair.publicKey);
      const privateKeyBase64 = base64Encode(keyPair.secretKey);
      this.createIdentity(publicKeyBase64, privateKeyBase64);
      this.isAuthenticated = true;
    },
    createIdentity(publicKey: string, privateKey: string) {
      const identity = Ed25519KeyIdentity.fromKeyPair(
        base64ToUint8Array(publicKey),
        base64ToUint8Array(privateKey)
      );
      const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

      if (import.meta.env.MODE !== 'production') {
        agent.fetchRootKey(); // Only for local development
      }

      this.principalId = identity.getPrincipal().toText();
      this.user = { publicKey, privateKey };

      const canisterIds = {
        tournaments: import.meta.env.VITE_CANISTER_ID_TOURNAMENTS,
        cosmicrafts: import.meta.env.VITE_CANISTER_ID_COSMICRAFTS,
        nft: import.meta.env.VITE_CANISTER_ID_ICRC7,
        player: import.meta.env.VITE_CANISTER_ID_PLAYER,
        statistics: import.meta.env.VITE_CANISTER_ID_STATISTICS,
        token: import.meta.env.VITE_CANISTER_ID_ICRC1,
      };

      this.initializeActors(agent, canisterIds);
    },
    initializeActors(agent: HttpAgent, canisterIds: Record<string, string>) {
      const idlFactories: Record<string, any> = {
        tournaments: tournamentsIdlFactory,
        cosmicrafts: cosmicraftsIdlFactory,
        nft: nftIdlFactory,
        player: playerIdlFactory,
        statistics: statisticsIdlFactory,
        token: tokenIdlFactory,
      };

      for (const [key, idlFactory] of Object.entries(idlFactories)) {
        (this as any)[key] = Actor.createActor(idlFactory, { agent, canisterId: canisterIds[key] }) as ActorSubclass<any>;
      }
    }
  },
});

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
